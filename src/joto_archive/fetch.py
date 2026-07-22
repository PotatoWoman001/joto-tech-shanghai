"""Bounded, read-only HTTP fetching and browser evidence capture."""

from __future__ import annotations

import json
import re
import time
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import unquote, urlsplit

import httpx
from playwright.sync_api import Browser, Page, Playwright, Route, sync_playwright

from joto_archive.config import CrawlConfig
from joto_archive.models import FetchResult, RenderedPage


DEFAULT_MAX_RESPONSE_BYTES = 64 * 1024 * 1024
MAX_RETRY_AFTER_SECONDS = 120.0
RETRYABLE_STATUS_CODES = frozenset({408, 425, 429, *range(500, 600)})


class FetchError(RuntimeError):
    """Base class for a fetch that cannot safely produce an archive result."""


class ResponseTooLargeError(FetchError):
    """Raised before a response can exceed the configured in-memory byte limit."""


class SecurityChallengeError(FetchError):
    """Base class for an anti-automation interstitial or access block."""


class CaptchaDetectedError(SecurityChallengeError):
    """Raised when the response appears to be a CAPTCHA challenge."""


class WafDetectedError(SecurityChallengeError):
    """Raised when the response appears to be blocked by a WAF."""


class HttpFetcher:
    """Fetch public resources using GET, one bounded request at a time."""

    def __init__(
        self,
        config: CrawlConfig,
        sleep: Callable[[float], None] = time.sleep,
        *,
        max_response_bytes: int = DEFAULT_MAX_RESPONSE_BYTES,
    ) -> None:
        if max_response_bytes < 1:
            raise ValueError("max_response_bytes must be positive")
        self.config = config
        self.sleep = sleep
        self.max_response_bytes = max_response_bytes
        self._has_requested = False
        self._pending_retry_after = 0.0
        self.client = httpx.Client(
            timeout=config.request_timeout_seconds,
            follow_redirects=True,
            headers={"User-Agent": config.user_agent},
            trust_env=False,
            event_hooks={"request": [self._on_request]},
        )

    def __enter__(self) -> HttpFetcher:
        return self

    def __exit__(self, *_: object) -> None:
        self.client.close()

    def get(self, url: str) -> FetchResult:
        """GET *url* with global pacing and bounded retries.

        A retry is attempted for transport errors and HTTP 408, 425, 429, and
        5xx responses. CAPTCHA and WAF responses fail immediately so a crawl
        cannot repeatedly pressure an origin that is asking it to stop.
        """

        last_response: httpx.Response | None = None
        last_body = b""
        last_error: httpx.RequestError | None = None
        for attempt in range(1, self.config.max_retries + 1):
            try:
                with self.client.stream("GET", url) as response:
                    body = self._read_bounded(response, url)
            except httpx.RequestError as error:
                last_error = error
                if attempt == self.config.max_retries:
                    raise
                continue

            last_response = response
            last_body = body
            self._raise_for_security_challenge(response, body, url)

            if response.status_code not in RETRYABLE_STATUS_CODES:
                return self._result(url, response, body, attempt)
            if attempt < self.config.max_retries:
                self._pending_retry_after = self._retry_after_seconds(response)

        if last_response is not None:
            return self._result(
                url,
                last_response,
                last_body,
                self.config.max_retries,
            )
        if last_error is not None:  # defensive: normal transport failures raise above
            raise last_error
        raise FetchError(f"no HTTP attempt was made for {url}")

    def _on_request(self, _: httpx.Request) -> None:
        """Pace every wire request, including redirects issued by httpx."""

        retry_after_seconds = self._pending_retry_after
        self._pending_retry_after = 0.0
        self._pace_request(retry_after_seconds)

    def _pace_request(self, retry_after_seconds: float) -> None:
        if self._has_requested:
            self.sleep(max(self.config.request_delay_seconds, retry_after_seconds))
        self._has_requested = True

    def _read_bounded(self, response: httpx.Response, url: str) -> bytes:
        declared_size = response.headers.get("content-length")
        if declared_size:
            try:
                if int(declared_size) > self.max_response_bytes:
                    raise ResponseTooLargeError(
                        f"response from {url} exceeds limit of "
                        f"{self.max_response_bytes} bytes (Content-Length={declared_size})"
                    )
            except ValueError:
                pass

        chunks: list[bytes] = []
        total = 0
        for chunk in response.iter_bytes(chunk_size=64 * 1024):
            total += len(chunk)
            if total > self.max_response_bytes:
                raise ResponseTooLargeError(
                    f"response from {url} exceeds limit of "
                    f"{self.max_response_bytes} bytes while streaming"
                )
            chunks.append(chunk)
        return b"".join(chunks)

    @staticmethod
    def _raise_for_security_challenge(
        response: httpx.Response, body: bytes, url: str
    ) -> None:
        headers = {key.lower(): value.lower() for key, value in response.headers.items()}
        sample = body[:256_000].decode("utf-8", errors="ignore").lower()

        strong_captcha_markers = (
            "verify you are human",
            "human verification",
            "complete the security check",
            "请解决 captcha 验证",
            "请输入验证码",
        )
        shieldon_captcha = "shieldon" in sample and "captcha" in sample
        captcha_title = re.search(r"<title[^>]*>[^<]*captcha", sample) is not None
        challenge_status = response.status_code in {403, 406, 429, 503}
        challenge_widget = challenge_status and any(
            marker in sample for marker in ("captcha", "recaptcha", "hcaptcha")
        )
        if (
            captcha_title
            or shieldon_captcha
            or challenge_widget
            or any(marker in sample for marker in strong_captcha_markers)
        ):
            raise CaptchaDetectedError(f"CAPTCHA challenge detected at {url}")

        waf_header = (
            headers.get("cf-mitigated") == "challenge"
            or "cloudflare" in headers.get("server", "")
            and response.status_code in {403, 429, 503}
        )
        waf_body_markers = (
            "web application firewall",
            "request blocked",
            "access denied",
            "attention required! | cloudflare",
            "the requested url was rejected",
        )
        cloudflare_interstitial = (
            "<title>just a moment" in sample and "challenge-platform" in sample
        )
        if waf_header or cloudflare_interstitial or (
            response.status_code in {403, 406, 429, 503}
            and any(marker in sample for marker in waf_body_markers)
        ):
            raise WafDetectedError(f"WAF block or challenge detected at {url}")

    @staticmethod
    def _retry_after_seconds(response: httpx.Response) -> float:
        value = response.headers.get("retry-after", "").strip()
        if not value:
            return 0.0
        try:
            seconds = max(0.0, float(value))
        except ValueError:
            try:
                retry_at = parsedate_to_datetime(value)
                if retry_at.tzinfo is None:
                    retry_at = retry_at.replace(tzinfo=timezone.utc)
                seconds = max(
                    0.0,
                    (retry_at - datetime.now(timezone.utc)).total_seconds(),
                )
            except (TypeError, ValueError, OverflowError):
                return 0.0
        return min(seconds, MAX_RETRY_AFTER_SECONDS)

    @staticmethod
    def _redirect_chain(response: httpx.Response, requested_url: str) -> list[str]:
        urls = [str(item.url) for item in response.history]
        urls.append(str(response.url))
        if not urls or urls[0] != requested_url:
            urls.insert(0, requested_url)
        return list(dict.fromkeys(urls))

    def _result(
        self,
        requested_url: str,
        response: httpx.Response,
        body: bytes,
        attempts: int,
    ) -> FetchResult:
        return FetchResult(
            requested_url=requested_url,
            final_url=str(response.url),
            status_code=response.status_code,
            content_type=response.headers.get(
                "content-type", "application/octet-stream"
            ),
            body=body,
            attempts=attempts,
            redirect_chain=self._redirect_chain(response, requested_url),
            truncated=False,
        )


@dataclass(frozen=True)
class _ViewportCapture:
    html: str
    console_errors: list[str]
    resource_urls: list[str]
    blocked_requests: list[str]
    redirect_chain: list[str]


class BrowserRenderer:
    """Capture rendered evidence while preventing browser-side mutations."""

    _SCROLL_SCRIPT = """
        async ({steps, pauseMs}) => {
          const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          for (let index = 1; index <= steps; index += 1) {
            const height = Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            );
            const target = Math.min(height, Math.ceil((height * index) / steps));
            window.scrollTo(0, target);
            await sleep(pauseMs);
          }
          window.scrollTo(0, 0);
        }
    """

    def __init__(
        self,
        config: CrawlConfig,
        output_dir: Path,
        *,
        post_load_wait_ms: int = 750,
        scroll_steps: int = 12,
        scroll_pause_ms: int = 150,
        storage_state: Path | None = None,
    ) -> None:
        if not 0 <= post_load_wait_ms <= 1_500:
            raise ValueError("post_load_wait_ms must be between 0 and 1500")
        if not 1 <= scroll_steps <= 20:
            raise ValueError("scroll_steps must be between 1 and 20")
        if not 0 <= scroll_pause_ms <= 250:
            raise ValueError("scroll_pause_ms must be between 0 and 250")
        self.config = config
        self.output_dir = output_dir
        self.post_load_wait_ms = post_load_wait_ms
        self.scroll_steps = scroll_steps
        self.scroll_pause_ms = scroll_pause_ms
        self.storage_state = storage_state
        self.playwright: Playwright | None = None
        self.browser: Browser | None = None

    def __enter__(self) -> BrowserRenderer:
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            headless=True,
            args=["--no-proxy-server"],
        )
        return self

    def __exit__(self, *_: object) -> None:
        if self.browser is not None:
            self.browser.close()
        if self.playwright is not None:
            self.playwright.stop()

    @staticmethod
    def should_block_request(method: str, url: str) -> bool:
        return BrowserRenderer._block_reason(method, url) is not None

    @staticmethod
    def _block_reason(method: str, url: str) -> str | None:
        normalized_method = method.upper()
        if normalized_method not in {"GET", "HEAD"}:
            return f"non-read-method:{normalized_method}"

        parsed = urlsplit(url)
        host = (parsed.hostname or "").lower()
        path = unquote(parsed.path).lower()
        query = unquote(parsed.query).lower()
        searchable = f"{host}{path}?{query}"

        if "agify" in searchable:
            return "agify"
        if re.search(
            r"(?:^|/)(?:wp-admin|wp-login\.php|admin|administrator)(?:/|$)", path
        ) or "admin-ajax" in path:
            return "admin"
        if (
            re.search(r"(?:^|[/_.-])(?:contact-?form|forms?|iphorm|submit)(?:[/_.-]|$)", path)
            or re.search(r"(?:^|[&])(?:action|task)=[^&]*(?:form|iphorm|submit)", query)
        ):
            return "form"
        return None

    @staticmethod
    def _safe_page_id(page_id: str) -> str:
        safe = re.sub(r"[^A-Za-z0-9._-]+", "_", page_id).strip("._")
        if not safe:
            raise ValueError("page_id must contain at least one safe character")
        return safe

    @staticmethod
    def _browser_redirect_chain(response: object, requested_url: str, final_url: str) -> list[str]:
        chain: list[str] = []
        request = getattr(response, "request", None)
        while request is not None:
            request_url = getattr(request, "url", None)
            if isinstance(request_url, str):
                chain.append(request_url)
            request = getattr(request, "redirected_from", None)
        chain.reverse()
        if not chain or chain[0] != requested_url:
            chain.insert(0, requested_url)
        if final_url and (not chain or chain[-1] != final_url):
            chain.append(final_url)
        return list(dict.fromkeys(chain))

    def _capture_viewport(
        self,
        url: str,
        screenshot_path: Path,
        viewport: tuple[int, int],
    ) -> _ViewportCapture:
        if self.browser is None:
            raise RuntimeError("BrowserRenderer must be entered before capture")
        context = self.browser.new_context(
            viewport={"width": viewport[0], "height": viewport[1]},
            user_agent=self.config.user_agent,
            storage_state=str(self.storage_state) if self.storage_state else None,
        )
        page: Page = context.new_page()
        console_errors: list[str] = []
        blocked_requests: list[str] = []

        def record_console(message: object) -> None:
            if getattr(message, "type", None) == "error":
                console_errors.append(str(getattr(message, "text", message)))

        def route_request(route: Route) -> None:
            request = route.request
            reason = self._block_reason(request.method, request.url)
            if reason is not None:
                blocked_requests.append(
                    f"{request.method.upper()} {request.url} [{reason}]"
                )
                route.abort("blockedbyclient")
                return
            route.continue_()

        page.on("console", record_console)
        page.route("**/*", route_request)
        try:
            response = page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=int(self.config.request_timeout_seconds * 1000),
            )
            page.wait_for_timeout(self.post_load_wait_ms)
            page.evaluate(
                self._SCROLL_SCRIPT,
                {"steps": self.scroll_steps, "pauseMs": self.scroll_pause_ms},
            )
            page.wait_for_timeout(min(250, self.post_load_wait_ms))
            resources = page.evaluate(
                "() => performance.getEntriesByType('resource').map((entry) => entry.name)"
            )
            resource_urls = [item for item in resources if isinstance(item, str)]
            screenshot_path.parent.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(screenshot_path), full_page=True)
            html = page.content()
            HttpFetcher._raise_for_security_challenge(
                httpx.Response(200, content=html.encode("utf-8", errors="ignore")),
                html.encode("utf-8", errors="ignore"),
                page.url,
            )
            redirect_chain = self._browser_redirect_chain(response, url, page.url)
            return _ViewportCapture(
                html=html,
                console_errors=console_errors,
                resource_urls=list(dict.fromkeys(resource_urls)),
                blocked_requests=list(dict.fromkeys(blocked_requests)),
                redirect_chain=redirect_chain,
            )
        finally:
            page.close()
            context.close()

    @staticmethod
    def _write_json(path: Path, values: list[str]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(values, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    def capture(self, url: str, page_id: str) -> RenderedPage:
        safe_id = self._safe_page_id(page_id)
        desktop_screenshot = (
            self.output_dir / "screenshots" / "desktop" / f"{safe_id}.png"
        )
        mobile_screenshot = (
            self.output_dir / "screenshots" / "mobile" / f"{safe_id}.png"
        )
        desktop = self._capture_viewport(
            url, desktop_screenshot, self.config.desktop_viewport
        )
        mobile = self._capture_viewport(
            url, mobile_screenshot, self.config.mobile_viewport
        )

        html_paths = {
            "desktop": self.output_dir / "html" / "desktop" / f"{safe_id}.html",
            "mobile": self.output_dir / "html" / "mobile" / f"{safe_id}.html",
        }
        for path in html_paths.values():
            path.parent.mkdir(parents=True, exist_ok=True)
        html_paths["desktop"].write_text(desktop.html, encoding="utf-8")
        html_paths["mobile"].write_text(mobile.html, encoding="utf-8")

        for viewport_name, evidence in (("desktop", desktop), ("mobile", mobile)):
            base = self.output_dir / "evidence" / viewport_name
            self._write_json(
                base / f"{safe_id}.resources.json", evidence.resource_urls
            )
            self._write_json(
                base / f"{safe_id}.blocked-requests.json",
                evidence.blocked_requests,
            )

        return RenderedPage(
            url=url,
            html=desktop.html,
            mobile_html=mobile.html,
            desktop_screenshot=desktop_screenshot,
            mobile_screenshot=mobile_screenshot,
            console_errors=list(
                dict.fromkeys(desktop.console_errors + mobile.console_errors)
            ),
            resource_urls=list(
                dict.fromkeys(desktop.resource_urls + mobile.resource_urls)
            ),
            blocked_requests=desktop.blocked_requests + mobile.blocked_requests,
            redirect_chain=list(
                dict.fromkeys(desktop.redirect_chain + mobile.redirect_chain)
            ),
        )
