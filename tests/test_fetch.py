import json
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest
import respx

from joto_archive.config import load_config
from joto_archive.fetch import (
    BrowserRenderer,
    CaptchaDetectedError,
    HttpFetcher,
    ResponseTooLargeError,
    WafDetectedError,
)


CONFIG = load_config(Path("config/jototech.json"))
URL = "https://www.jototech.cn/msp"


@respx.mock
def test_fetcher_disables_environment_proxies_and_throttles_every_request() -> None:
    retrying = respx.get(URL).mock(
        side_effect=[
            httpx.Response(503, headers={"Retry-After": "2"}),
            httpx.Response(
                200,
                content=b"<html>ok</html>",
                headers={"content-type": "text/html"},
            ),
        ]
    )
    other = respx.get("https://www.jototech.cn/company").mock(
        return_value=httpx.Response(200, content=b"company")
    )
    delays: list[float] = []

    with HttpFetcher(CONFIG, sleep=delays.append) as fetcher:
        assert fetcher.client._trust_env is False
        result = fetcher.get(URL)
        fetcher.get("https://www.jototech.cn/company")

    assert result.status_code == 200
    assert result.body == b"<html>ok</html>"
    assert result.attempts == 2
    assert retrying.call_count == 2
    assert other.call_count == 1
    assert delays == [2.0, CONFIG.request_delay_seconds]
    assert all(call.request.method == "GET" for call in retrying.calls)


@pytest.mark.parametrize("status_code", [408, 425, 429, 500, 502, 503, 504, 599])
@respx.mock
def test_fetch_retries_only_retryable_http_statuses(status_code: int) -> None:
    route = respx.get(URL).mock(
        side_effect=[httpx.Response(status_code), httpx.Response(200, content=b"ok")]
    )

    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        result = fetcher.get(URL)

    assert result.status_code == 200
    assert result.attempts == 2
    assert route.call_count == 2


@respx.mock
def test_fetch_does_not_retry_a_regular_client_error() -> None:
    route = respx.get(URL).mock(return_value=httpx.Response(404, content=b"missing"))

    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        result = fetcher.get(URL)

    assert result.status_code == 404
    assert result.attempts == 1
    assert route.call_count == 1


@respx.mock
def test_fetch_retries_transport_errors() -> None:
    request = httpx.Request("GET", URL)
    route = respx.get(URL).mock(
        side_effect=[httpx.ReadTimeout("slow", request=request), httpx.Response(200, content=b"ok")]
    )

    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        result = fetcher.get(URL)

    assert result.status_code == 200
    assert result.attempts == 2
    assert route.call_count == 2


@pytest.mark.parametrize(
    ("headers", "body"),
    [
        ({"content-length": "6"}, b"123456"),
        ({}, b"123456"),
    ],
)
@respx.mock
def test_fetch_rejects_responses_over_the_byte_limit(
    headers: dict[str, str], body: bytes
) -> None:
    respx.get(URL).mock(return_value=httpx.Response(200, headers=headers, content=body))

    with HttpFetcher(CONFIG, sleep=lambda _: None, max_response_bytes=5) as fetcher:
        with pytest.raises(ResponseTooLargeError, match="5 bytes"):
            fetcher.get(URL)


@pytest.mark.parametrize(
    ("status", "headers", "body", "error_type"),
    [
        (200, {}, b"<title>CAPTCHA</title> Verify you are human", CaptchaDetectedError),
        (200, {}, "Shieldon Firewall 请解决 CAPTCHA 验证".encode(), CaptchaDetectedError),
        (403, {}, b"Request blocked by Web Application Firewall", WafDetectedError),
        (403, {"cf-mitigated": "challenge"}, b"challenge", WafDetectedError),
    ],
)
@respx.mock
def test_fetch_detects_captcha_and_waf_pages(
    status: int,
    headers: dict[str, str],
    body: bytes,
    error_type: type[Exception],
) -> None:
    route = respx.get(URL).mock(
        return_value=httpx.Response(status, headers=headers, content=body)
    )

    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        with pytest.raises(error_type):
            fetcher.get(URL)

    assert route.call_count == 1


@respx.mock
def test_fetch_records_the_redirect_chain() -> None:
    respx.get(URL).mock(return_value=httpx.Response(302, headers={"location": "/company"}))
    respx.get("https://www.jototech.cn/company").mock(
        return_value=httpx.Response(200, content=b"ok")
    )

    delays: list[float] = []
    with HttpFetcher(CONFIG, sleep=delays.append) as fetcher:
        result = fetcher.get(URL)

    assert result.redirect_chain == [URL, "https://www.jototech.cn/company"]
    assert result.truncated is False
    assert delays == [CONFIG.request_delay_seconds]


@respx.mock
def test_fetch_does_not_treat_a_normal_recaptcha_integration_as_a_challenge() -> None:
    body = b'<html><script src="https://google.com/recaptcha/api.js"></script>Contact us</html>'
    respx.get(URL).mock(return_value=httpx.Response(200, content=body))

    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        result = fetcher.get(URL)

    assert result.body == body


class FakeRequest:
    def __init__(self, method: str, url: str, redirected_from: "FakeRequest | None" = None):
        self.method = method
        self.url = url
        self.redirected_from = redirected_from


class FakeRoute:
    def __init__(self, request: FakeRequest):
        self.request = request
        self.action: str | None = None

    def abort(self, *_: object) -> None:
        self.action = "abort"

    def continue_(self) -> None:
        self.action = "continue"


class FakePage:
    REQUESTS = [
        ("GET", "https://www.jototech.cn/static/site.css"),
        ("HEAD", "https://www.jototech.cn/static/photo.jpg"),
        ("POST", "https://www.jototech.cn/api/track"),
        ("GET", "https://www.jototech.cn/wp-admin/admin-ajax.php?action=x"),
        ("GET", "https://www.jototech.cn/contact-form/submit"),
        ("GET", "https://cdn.agify.example/widget.js"),
    ]

    def __init__(self, viewport: dict[str, int]):
        self.viewport = viewport
        self.handlers: dict[str, object] = {}
        self.route_handler = None
        self.goto_options: dict[str, object] = {}
        self.waits: list[int] = []
        self.scroll_options: list[dict[str, int]] = []
        self.routes: list[FakeRoute] = []
        self.url = "https://www.jototech.cn/final"
        self.closed = False

    def on(self, event: str, handler: object) -> None:
        self.handlers[event] = handler

    def route(self, pattern: str, handler: object) -> None:
        assert pattern == "**/*"
        self.route_handler = handler

    def goto(self, url: str, **kwargs: object) -> object:
        self.goto_options = kwargs
        assert self.route_handler is not None
        for method, request_url in self.REQUESTS:
            route = FakeRoute(FakeRequest(method, request_url))
            self.route_handler(route)
            self.routes.append(route)
        origin = FakeRequest("GET", url)
        final = FakeRequest("GET", self.url, redirected_from=origin)
        return SimpleNamespace(request=final)

    def wait_for_timeout(self, milliseconds: int) -> None:
        self.waits.append(milliseconds)

    def evaluate(self, expression: str, argument: object = None) -> object:
        if "performance.getEntriesByType" in expression:
            return [
                "https://www.jototech.cn/static/site.css",
                "https://www.jototech.cn/static/photo.jpg",
            ]
        assert "scrollTo" in expression
        assert isinstance(argument, dict)
        self.scroll_options.append(argument)
        return None

    def screenshot(self, *, path: str, full_page: bool) -> None:
        assert full_page is True
        Path(path).write_bytes(b"png")

    def content(self) -> str:
        return f"<html><body>{self.viewport['width']}</body></html>"

    def close(self) -> None:
        self.closed = True


class FakeBrowser:
    def __init__(self):
        self.pages: list[FakePage] = []
        self.context_options: list[dict[str, object]] = []

    def new_context(self, **options: object) -> object:
        self.context_options.append(options)
        browser = self

        class FakeContext:
            def __init__(self) -> None:
                self.closed = False

            def new_page(self) -> FakePage:
                page = FakePage(options["viewport"])  # type: ignore[arg-type]
                browser.pages.append(page)
                return page

            def close(self) -> None:
                self.closed = True

        return FakeContext()


def test_renderer_is_read_only_and_saves_separate_viewport_evidence(tmp_path: Path) -> None:
    browser = FakeBrowser()
    renderer = BrowserRenderer(CONFIG, tmp_path)
    renderer.browser = browser  # type: ignore[assignment]

    result = renderer.capture("https://www.jototech.cn/start", "page-1")

    assert result.html == "<html><body>1440</body></html>"
    assert result.mobile_html == "<html><body>390</body></html>"
    assert result.redirect_chain == [
        "https://www.jototech.cn/start",
        "https://www.jototech.cn/final",
    ]
    assert result.resource_urls == [
        "https://www.jototech.cn/static/site.css",
        "https://www.jototech.cn/static/photo.jpg",
    ]
    assert len(result.blocked_requests) == 8
    assert any(item.startswith("POST ") for item in result.blocked_requests)
    assert any("wp-admin" in item for item in result.blocked_requests)
    assert any("contact-form" in item for item in result.blocked_requests)
    assert any("agify" in item for item in result.blocked_requests)

    assert (tmp_path / "html/desktop/page-1.html").read_text() == result.html
    assert (tmp_path / "html/mobile/page-1.html").read_text() == result.mobile_html
    assert json.loads((tmp_path / "evidence/desktop/page-1.resources.json").read_text())
    assert json.loads((tmp_path / "evidence/mobile/page-1.blocked-requests.json").read_text())
    assert result.desktop_screenshot.read_bytes() == b"png"
    assert result.mobile_screenshot.read_bytes() == b"png"

    for page in browser.pages:
        assert page.goto_options["wait_until"] == "domcontentloaded"
        assert int(page.goto_options["timeout"]) <= int(CONFIG.request_timeout_seconds * 1000)
        assert page.waits
        assert max(page.waits) <= 1_500
        assert page.scroll_options == [{"steps": 12, "pauseMs": 150}]
        assert [route.action for route in page.routes] == [
            "continue",
            "continue",
            "abort",
            "abort",
            "abort",
            "abort",
        ]
        assert page.closed is True
    assert all(options["user_agent"] == CONFIG.user_agent for options in browser.context_options)
    assert all(options["storage_state"] is None for options in browser.context_options)


@pytest.mark.parametrize(
    ("method", "url", "blocked"),
    [
        ("GET", "https://www.jototech.cn/page", False),
        ("HEAD", "https://www.jototech.cn/photo.jpg", False),
        ("OPTIONS", "https://www.jototech.cn/page", True),
        ("GET", "https://www.jototech.cn/wp-login.php", True),
        ("GET", "https://www.jototech.cn/?action=iphorm_submit", True),
        ("GET", "https://agify.io/client.js", True),
    ],
)
def test_renderer_request_policy(method: str, url: str, blocked: bool) -> None:
    assert BrowserRenderer.should_block_request(method, url) is blocked
