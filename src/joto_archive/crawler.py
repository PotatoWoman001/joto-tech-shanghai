"""Fail-closed orchestration for one immutable, read-only archive run.

The crawler intentionally owns policy rather than transport details.  HTTP,
browser rendering, extraction, asset storage, and run storage are injected so
the complete state machine can be tested without touching the network.
"""

from __future__ import annotations

import hashlib
import json
from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any, Protocol
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup, Tag, UnicodeDammit
from pydantic import BaseModel

from .assets import AssetCandidate, AssetStore, asset_candidates
from .config import CrawlConfig
from .discovery import discover_links
from .extract import extract_page, page_to_markdown
from .fetch import SecurityChallengeError
from .issues import detect_content_issues
from .models import (
    AssetRecord,
    CrawlError,
    DiscoveredUrl,
    FetchResult,
    PageRecord,
    PageStatus,
    RenderedPage,
)
from .rules import classify_url, normalize_url, title_exclusion_rule
from .storage import RunStorage


class Fetcher(Protocol):
    def get(self, url: str) -> FetchResult: ...


class Renderer(Protocol):
    def capture(self, url: str, page_id: str) -> RenderedPage: ...


class AssetArchiver(Protocol):
    by_hash: dict[str, AssetRecord]
    references: list[Any]
    failures: list[dict[str, Any]]
    candidate_evidence: list[dict[str, Any]]

    def archive(self, candidates: list[AssetCandidate], page_id: str) -> list[AssetRecord]: ...


Extractor = Callable[[str, str, PageStatus, str | None], PageRecord]


@dataclass
class CrawlOutcome:
    """The unfinalized result of a crawl.

    ``latest.json`` is deliberately not published here.  The CLI must validate
    ``run_dir`` and call :meth:`RunStorage.finalize` only after validation.
    """

    run_dir: Path
    pages: list[PageRecord]
    urls: list[dict[str, Any]]
    crawl_errors: list[CrawlError]
    security_stopped: bool = False
    manifest_paths: dict[str, tuple[Path, Path]] = field(default_factory=dict)


_TERMINAL_WITHOUT_PAGE = {
    PageStatus.EXCLUDED_AI,
    PageStatus.REVIEW,
    PageStatus.EXTERNAL,
    PageStatus.RESOURCE,
}
_PAGE_PRIORITY = {
    PageStatus.ACTIVE: 0,
    PageStatus.ARCHIVED: 1,
    PageStatus.RESOURCE: 2,
    PageStatus.REVIEW: 3,
    PageStatus.EXTERNAL: 4,
    PageStatus.EXCLUDED_AI: 5,
    PageStatus.DUPLICATE: 6,
    PageStatus.UNREACHABLE: 7,
    PageStatus.ERROR: 8,
}
_IMAGE_SUFFIXES = {
    ".apng",
    ".avif",
    ".bmp",
    ".gif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".tif",
    ".tiff",
    ".webp",
}


def _as_dict(value: object) -> dict[str, Any]:
    if isinstance(value, BaseModel):
        return value.model_dump(mode="json")
    if isinstance(value, Mapping):
        return dict(value)
    raise TypeError(f"manifest row must be a mapping or BaseModel, got {type(value)!r}")


def _csv_value(value: object) -> object:
    if isinstance(value, Path):
        return value.as_posix()
    if isinstance(value, (list, tuple, dict, set)):
        return json.dumps(value, ensure_ascii=False, sort_keys=True, default=str)
    return value


def _safe_rows(values: Iterable[object]) -> list[dict[str, Any]]:
    return [
        {key: _csv_value(item) for key, item in _as_dict(value).items()}
        for value in values
    ]


def _manifest_fields(rows: list[dict[str, Any]], defaults: Iterable[str]) -> list[str]:
    fields = list(defaults)
    for row in rows:
        for key in row:
            if key not in fields:
                fields.append(key)
    return fields


def _html_urls(html: str, page_url: str) -> list[str]:
    soup = BeautifulSoup(html, "lxml")
    values: list[str] = []
    for link in soup.select('link[rel~="canonical"][href]'):
        values.append(urljoin(page_url, str(link.get("href", ""))))
    for meta in soup.select('meta[property="og:url"], meta[name="og:url"]'):
        content = str(meta.get("content", "")).strip()
        if content:
            values.append(urljoin(page_url, content))
    return list(dict.fromkeys(value for value in values if value))


def _provisional_page_id(source_url: str, html: str) -> str:
    """Mirror the extractor's stable ID before the browser needs a filename."""

    soup = BeautifulSoup(html, "lxml")
    body_classes = " ".join(soup.body.get("class", [])) if soup.body else ""
    import re

    match = re.search(r"(?:page-id|postid)-(\d+)", body_classes)
    query = dict(
        part.split("=", 1) if "=" in part else (part, "")
        for part in urlsplit(source_url).query.split("&")
        if part
    )
    source_id = match.group(1) if match else query.get("page_id") or query.get("p")
    label = source_id or "url"
    digest = hashlib.sha256(source_url.encode()).hexdigest()[:10]
    return f"page-{label}-{digest}"


def _dom_text_baseline(html: str) -> tuple[int, int]:
    """Count independently observable semantic DOM units and forms."""

    soup = BeautifulSoup(html, "lxml")
    root = (
        soup.select_one("main#content")
        or soup.select_one("#content")
        or soup.select_one("main")
        or soup.select_one('[role="main"]')
        or soup.body
    )
    if root is None:
        return 0, 0
    selector = "h1,h2,h3,h4,h5,h6,p,ul,ol,table,blockquote,figure,form,video,iframe,button"
    nodes = list(root.select(selector))
    # A containing semantic element represents one DOM unit; nested units are
    # counted by the extractor, so omit the containing duplicate here.
    leaf_units = [
        node
        for node in nodes
        if not any(isinstance(child, Tag) and child.select_one(selector) for child in node.children)
    ]
    return len(leaf_units), len(root.select("form"))


def _data_urls(value: object) -> list[str]:
    found: list[str] = []
    if isinstance(value, str) and value.startswith(("http://", "https://")):
        found.append(value)
    elif isinstance(value, list):
        for item in value:
            found.extend(_data_urls(item))
    elif isinstance(value, dict):
        for item in value.values():
            found.extend(_data_urls(item))
    return found


_HASH_METADATA_KEYS = {
    "formIndex",
    "mobileOnly",
    "sourceHidden",
    "sourceHiddenReasons",
    "sourceLocator",
    "sourceLocators",
    "viewport",
}


def _semantic_content_hash(page: PageRecord) -> str:
    blocks = []
    for block in page.blocks:
        data = {
            key: value
            for key, value in block.data.items()
            if key not in _HASH_METADATA_KEYS
        }
        blocks.append({"type": block.type, "data": data})
    payload = json.dumps(blocks, ensure_ascii=False, sort_keys=True, default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _block_urls(page_url: str, block: object) -> list[str]:
    data = getattr(block, "data", {})
    found = _data_urls(data)
    source_html = getattr(block, "source_html", None)
    if source_html:
        soup = BeautifulSoup(source_html, "lxml")
        for tag in soup.select("[href], [src], [data-src], [data-original]"):
            for attribute in ("href", "src", "data-src", "data-original"):
                raw = str(tag.get(attribute, "")).strip()
                if raw:
                    found.append(urljoin(page_url, raw))
        for tag in soup.select("[srcset], [data-srcset]"):
            for attribute in ("srcset", "data-srcset"):
                for candidate in str(tag.get(attribute, "")).split(","):
                    raw = candidate.strip().split()[0] if candidate.strip() else ""
                    if raw:
                        found.append(urljoin(page_url, raw))
    return list(dict.fromkeys(found))


class ArchiveCrawler:
    """Orchestrate discovery through manifests without publishing the run."""

    def __init__(
        self,
        config: CrawlConfig,
        storage: RunStorage,
        fetcher: Fetcher,
        renderer: Renderer,
        *,
        asset_store: AssetArchiver | None = None,
        extractor: Extractor = extract_page,
        follow_discovered_links: bool = True,
    ) -> None:
        self.config = config
        self.storage = storage
        self.fetcher = fetcher
        self.renderer = renderer
        self.asset_store = asset_store or AssetStore(storage.run_dir, fetcher)
        self.extractor = extractor
        self.follow_discovered_links = follow_discovered_links

        self._url_rows: dict[str, dict[str, Any]] = {}
        self._items: dict[str, DiscoveredUrl] = {}
        self._processed: set[str] = set()
        self._pages: dict[str, PageRecord] = {}
        self._content_first: dict[str, str] = {}
        self._crawl_errors: list[CrawlError] = []
        self._baselines: dict[str, dict[str, Any]] = {}
        self._page_rows: dict[str, dict[str, Any]] = {}
        self._internal_links: list[dict[str, Any]] = []
        self._external_links: list[dict[str, Any]] = []
        self._download_links: list[dict[str, Any]] = []
        self._blocked_requests: list[dict[str, Any]] = []
        self._content_issues: list[dict[str, Any]] = []
        self._policy_asset_errors: list[dict[str, Any]] = []
        self._security_stopped = False

    def run(self, discovered: Iterable[DiscoveredUrl]) -> CrawlOutcome:
        for item in discovered:
            self._merge_discovered(item)

        try:
            while True:
                pending = [
                    item for key, item in self._items.items() if key not in self._processed
                ]
                if not pending:
                    break
                pending.sort(key=lambda item: (_PAGE_PRIORITY[item.status], item.url))
                item = pending[0]
                self._processed.add(item.url)
                self._process(item)
        except SecurityChallengeError as error:
            self._security_stopped = True
            self._record_error(
                getattr(error, "url", "") or "crawl",
                "security-challenge",
                str(error),
                retryable=False,
            )
            self._write_manifests()
            raise

        paths = self._write_manifests()
        return CrawlOutcome(
            run_dir=self.storage.run_dir,
            pages=list(self._pages.values()),
            urls=list(self._url_rows.values()),
            crawl_errors=self._crawl_errors,
            security_stopped=self._security_stopped,
            manifest_paths=paths,
        )

    def _merge_discovered(self, item: DiscoveredUrl) -> None:
        normalized = normalize_url(item.url, self.config.base_url)
        incoming = item.model_copy(update={"url": normalized})
        existing = self._items.get(normalized)
        if existing is None:
            self._items[normalized] = incoming
            self._url_rows[normalized] = {
                "url": normalized,
                "source": incoming.source,
                "discovered_from": incoming.discovered_from,
                "navigation_path": incoming.navigation_path,
                "status": incoming.status.value,
                "exclusion_rule": incoming.exclusion_rule,
                "final_url": "",
                "redirect_chain": [],
                "canonical_urls": [],
                "http_status": None,
                "page_id": None,
                "duplicate_of": None,
                "asset_ids": [],
                "evidence_path": None,
            }
            return

        sources = list(
            dict.fromkeys(
                source
                for value in (existing.source, incoming.source)
                for source in value.split("|")
                if source
            )
        )
        existing.source = "|".join(sources)
        row = self._url_rows[normalized]
        row["source"] = existing.source

        # Terminal safety classifications never get weakened.  A stronger
        # exclusion can still replace an earlier resource/external decision.
        terminal_priority = {
            PageStatus.EXTERNAL: 1,
            PageStatus.RESOURCE: 2,
            PageStatus.REVIEW: 3,
            PageStatus.EXCLUDED_AI: 4,
        }
        if existing.status in _TERMINAL_WITHOUT_PAGE:
            if terminal_priority.get(incoming.status, 0) > terminal_priority.get(existing.status, 0):
                existing.status = incoming.status
                existing.exclusion_rule = incoming.exclusion_rule
                row.update(status=incoming.status.value, exclusion_rule=incoming.exclusion_rule)
            return
        if incoming.status in _TERMINAL_WITHOUT_PAGE or (
            existing.status is PageStatus.ARCHIVED and incoming.status is PageStatus.ACTIVE
        ):
            existing.status = incoming.status
            existing.exclusion_rule = incoming.exclusion_rule
            if incoming.navigation_path:
                existing.navigation_path = incoming.navigation_path
            row.update(
                status=incoming.status.value,
                exclusion_rule=incoming.exclusion_rule,
                source=existing.source,
                navigation_path=existing.navigation_path,
            )
            page_id = row.get("page_id")
            page = self._pages.get(str(page_id)) if page_id else None
            if page is not None and page.status is PageStatus.ARCHIVED and incoming.status is PageStatus.ACTIVE:
                page.status = PageStatus.ACTIVE
                page.content_type = "page"
                page.navigation_path = incoming.navigation_path
                self._page_rows[page.id].update(
                    status=PageStatus.ACTIVE.value,
                    content_type="page",
                )
                self.storage.write_json(Path("pages") / f"{page.id}.json", page)

    def _process(self, item: DiscoveredUrl) -> None:
        row = self._url_rows[item.url]
        if item.status in {PageStatus.EXCLUDED_AI, PageStatus.REVIEW, PageStatus.EXTERNAL}:
            return
        if item.status is PageStatus.RESOURCE:
            self._archive_standalone_resource(item, row)
            return

        try:
            fetched = self.fetcher.get(item.url)
        except SecurityChallengeError:
            raise
        except Exception as error:
            row["status"] = PageStatus.ERROR.value
            self._record_error(item.url, "http", str(error), retryable=True)
            return

        raw_html = UnicodeDammit(fetched.body, is_html=True).unicode_markup or fetched.body.decode(
            "utf-8", errors="replace"
        )
        row.update(
            final_url=fetched.final_url,
            redirect_chain=fetched.redirect_chain,
            http_status=fetched.status_code,
        )
        if not 200 <= fetched.status_code < 300:
            row["status"] = (
                PageStatus.UNREACHABLE.value
                if 400 <= fetched.status_code < 500
                else PageStatus.ERROR.value
            )
            row["evidence_path"] = self._write_isolated_raw("http-errors", item.url, raw_html)
            self._record_error(
                item.url,
                "http-status",
                f"HTTP {fetched.status_code}",
                retryable=fetched.status_code >= 500 or fetched.status_code in {408, 425, 429},
            )
            return

        canonical_urls = _html_urls(raw_html, fetched.final_url)
        row["canonical_urls"] = canonical_urls
        terminal, rule = self._evidence_status(
            [item.url, *fetched.redirect_chain, fetched.final_url, *canonical_urls],
            raw_html,
        )
        if terminal is not None:
            row.update(status=terminal.value, exclusion_rule=rule)
            folder = terminal.value
            row["evidence_path"] = self._write_isolated_raw(folder, item.url, raw_html)
            return

        if "html" not in fetched.content_type.lower():
            row["status"] = PageStatus.RESOURCE.value
            self._archive_standalone_resource(item, row)
            return

        provisional_id = _provisional_page_id(fetched.final_url, raw_html)
        try:
            rendered = self.renderer.capture(fetched.final_url, provisional_id)
        except SecurityChallengeError:
            raise
        except Exception as error:
            row["status"] = PageStatus.ERROR.value
            row["evidence_path"] = self._write_isolated_raw("render-errors", item.url, raw_html)
            self._record_error(item.url, "render", str(error), retryable=True)
            return

        rendered_canonicals = _html_urls(rendered.html, fetched.final_url)
        all_browser_urls = [
            *rendered.redirect_chain,
            rendered.url,
            *rendered_canonicals,
        ]
        terminal, rule = self._evidence_status(all_browser_urls, rendered.html)
        if terminal is not None:
            row.update(
                status=terminal.value,
                exclusion_rule=rule,
                canonical_urls=list(dict.fromkeys(canonical_urls + rendered_canonicals)),
                redirect_chain=list(dict.fromkeys(fetched.redirect_chain + rendered.redirect_chain)),
            )
            row["evidence_path"] = self._write_isolated_raw(
                terminal.value, item.url, raw_html
            )
            self._write_isolated_raw(terminal.value, item.url + "#rendered", rendered.html)
            return

        effective_url = normalize_url(
            rendered.redirect_chain[-1] if rendered.redirect_chain else fetched.final_url,
            self.config.base_url,
        )
        page = self.extractor(rendered.html, effective_url, item.status, rendered.mobile_html)
        page.navigation_path = item.navigation_path
        page.source_aliases = list(
            dict.fromkeys(
                normalize_url(value, self.config.base_url)
                for value in [item.url, *fetched.redirect_chain, *rendered.redirect_chain]
                if value and normalize_url(value, self.config.base_url) != page.source_url
            )
        )
        objective_issues = detect_content_issues(rendered.html)
        page.issues = list(dict.fromkeys(page.issues + objective_issues))

        self._record_links(page)
        self._remove_excluded_cms_references(page)
        page.content_hash = _semantic_content_hash(page)

        first_page_id = self._content_first.get(page.content_hash)
        if first_page_id and first_page_id != page.id:
            page.status = PageStatus.DUPLICATE
            page.duplicate_of = first_page_id
            row["status"] = PageStatus.DUPLICATE.value
            row["duplicate_of"] = first_page_id
        else:
            self._content_first.setdefault(page.content_hash, page.id)
            row["status"] = page.status.value

        candidates = asset_candidates(rendered.html, effective_url, rendered.resource_urls)
        safe_candidates = self._filter_asset_candidates(candidates, page.id)
        page_assets = self.asset_store.archive(safe_candidates, page.id)
        page.assets = list(dict.fromkeys(asset.asset_id for asset in page_assets))

        dom_units, dom_forms = _dom_text_baseline(rendered.html)
        page_reference_count = sum(
            1 for reference in self.asset_store.references if getattr(reference, "page_id", None) == page.id
        )
        self._baselines[page.id] = {
            "page_id": page.id,
            "dom_text_blocks": dom_units,
            "extracted_text_blocks": len(page.blocks),
            "dom_form_count": dom_forms,
            "extracted_form_count": sum(1 for block in page.blocks if block.type == "formDefinition"),
            "network_asset_urls": len(safe_candidates),
            "archived_asset_urls": page_reference_count,
            "loaded_resource_urls": len(set(rendered.resource_urls)),
        }

        self._copy_screenshot(rendered.desktop_screenshot, page.id, "desktop")
        self._copy_screenshot(rendered.mobile_screenshot, page.id, "mobile")
        self.storage.write_page(
            page,
            markdown=page_to_markdown(page),
            raw_html=raw_html,
            rendered_html=rendered.html,
            mobile_html=rendered.mobile_html,
        )
        self._pages[page.id] = page
        row.update(page_id=page.id, asset_ids=page.assets)
        self._page_rows[page.id] = {
            "page_id": page.id,
            "source_url": page.source_url,
            "source_aliases": page.source_aliases,
            "title": page.title,
            "language": page.language,
            "status": page.status.value,
            "content_type": page.content_type,
            "block_count": len(page.blocks),
            "asset_count": len(page.assets),
            "form_count": sum(1 for block in page.blocks if block.type == "formDefinition"),
            "content_hash": page.content_hash,
            "duplicate_of": page.duplicate_of,
        }
        for issue in page.issues:
            self._content_issues.append(
                {"page_id": page.id, "source_url": page.source_url, "issue": issue}
            )
        for blocked in rendered.blocked_requests:
            self._blocked_requests.append(
                {"page_id": page.id, "source_url": page.source_url, "request": blocked}
            )

        if self.follow_discovered_links:
            for found in discover_links(rendered.html, effective_url, self.config):
                self._merge_discovered(found)

    def _evidence_status(self, urls: Iterable[str], html: str) -> tuple[PageStatus | None, str | None]:
        classified = [classify_url(url, "evidence", self.config) for url in urls if url]
        for status in (
            PageStatus.EXCLUDED_AI,
            PageStatus.REVIEW,
            PageStatus.EXTERNAL,
            PageStatus.RESOURCE,
        ):
            match = next((item for item in classified if item.status is status), None)
            if match is not None:
                return status, match.exclusion_rule or f"evidence:{status.value}"
        title_rule = title_exclusion_rule(html, self.config)
        if title_rule:
            return PageStatus.EXCLUDED_AI, title_rule
        return None, None

    def _archive_standalone_resource(
        self, item: DiscoveredUrl, row: dict[str, Any]
    ) -> None:
        suffix = PurePosixPath(urlsplit(item.url).path).suffix.lower()
        kind = "image" if suffix in _IMAGE_SUFFIXES else "document"
        candidate = AssetCandidate(
            urls=[item.url],
            usage="standalone-resource",
            source_position="url-manifest",
            kind=kind,
        )
        pseudo_page_id = f"resource-{hashlib.sha256(item.url.encode()).hexdigest()[:16]}"
        records = self.asset_store.archive([candidate], pseudo_page_id)
        row["asset_ids"] = [record.asset_id for record in records]

    def _filter_asset_candidates(
        self, candidates: list[AssetCandidate], page_id: str
    ) -> list[AssetCandidate]:
        safe: list[AssetCandidate] = []
        for candidate in candidates:
            blocked = [
                item
                for item in candidate.urls
                if classify_url(item, "asset", self.config).status is PageStatus.EXCLUDED_AI
            ]
            if not blocked:
                safe.append(candidate)
                continue
            self._policy_asset_errors.append(
                {
                    "page_id": page_id,
                    "source_position": candidate.source_position,
                    "usage": candidate.usage,
                    "candidate_urls": candidate.urls,
                    "reason": "excluded-ai-candidate",
                    "blocked_urls": blocked,
                    "resolved": True,
                }
            )
        return safe

    def _remove_excluded_cms_references(self, page: PageRecord) -> None:
        def safe(url: str) -> bool:
            return classify_url(url, "cms-reference", self.config).status is not PageStatus.EXCLUDED_AI

        page.internal_links = [url for url in page.internal_links if safe(url)]
        page.external_links = [url for url in page.external_links if safe(url)]
        page.download_links = [url for url in page.download_links if safe(url)]
        page.blocks = [
            block
            for block in page.blocks
            if all(safe(url) for url in _block_urls(page.source_url, block))
        ]
        for order, block in enumerate(page.blocks):
            block.order = order

    def _record_links(self, page: PageRecord) -> None:
        for target in page.internal_links:
            classification = classify_url(target, "page-link", self.config)
            self._internal_links.append(
                {
                    "page_id": page.id,
                    "source_url": page.source_url,
                    "target_url": classification.url,
                    "target_status": classification.status.value,
                }
            )
        for target in page.external_links:
            classification = classify_url(target, "page-link", self.config)
            self._external_links.append(
                {
                    "page_id": page.id,
                    "source_url": page.source_url,
                    "target_url": classification.url,
                    "target_status": classification.status.value,
                }
            )
        for target in page.download_links:
            classification = classify_url(target, "download", self.config)
            self._download_links.append(
                {
                    "page_id": page.id,
                    "source_url": page.source_url,
                    "target_url": classification.url,
                    "target_status": classification.status.value,
                }
            )

    def _record_error(
        self, url: str, stage: str, message: str, *, retryable: bool
    ) -> None:
        self._crawl_errors.append(
            CrawlError(url=url, stage=stage, message=message, retryable=retryable, resolved=False)
        )

    def _write_isolated_raw(self, folder: str, url: str, html: str) -> str:
        digest = hashlib.sha256(url.encode()).hexdigest()[:20]
        relative = Path("raw") / "isolated" / folder / f"{digest}.html"
        self.storage.write_text(relative, html)
        return relative.as_posix()

    def _copy_screenshot(self, source: Path, page_id: str, device: str) -> None:
        if not source.is_file():
            self._record_error(str(source), "screenshot", "renderer did not create screenshot", retryable=False)
            return
        self.storage.write_bytes(
            Path("screenshots") / device / f"{page_id}.png", source.read_bytes()
        )

    def _asset_error_rows(self) -> list[dict[str, Any]]:
        successful_positions = {
            (getattr(reference, "page_id", None), getattr(reference, "source_position", None))
            for reference in self.asset_store.references
            if getattr(reference, "status", "downloaded") == "downloaded"
        }
        rows: list[dict[str, Any]] = []
        for failure in self.asset_store.failures:
            row = dict(failure)
            key = (row.get("page_id"), row.get("source_position"))
            row["resolved"] = key in successful_positions and row.get("reason") != "no-verified-candidate"
            rows.append(row)
        rows.extend(self._policy_asset_errors)
        return rows

    def _write_pair(
        self,
        name: str,
        values: Iterable[object],
        default_fields: Iterable[str],
    ) -> tuple[Path, Path]:
        materialized = list(values)
        json_path = self.storage.write_json(Path("manifests") / f"{name}.json", materialized)
        csv_rows = _safe_rows(materialized)
        csv_path = self.storage.write_csv(
            Path("manifests") / f"{name}.csv",
            csv_rows,
            _manifest_fields(csv_rows, default_fields),
        )
        return json_path, csv_path

    def _write_manifests(self) -> dict[str, tuple[Path, Path]]:
        assets = list(self.asset_store.by_hash.values())
        manifests: dict[str, tuple[Path, Path]] = {}
        manifests["urls"] = self._write_pair(
            "urls",
            self._url_rows.values(),
            ("url", "status", "source", "page_id", "final_url"),
        )
        manifests["pages"] = self._write_pair(
            "pages", self._page_rows.values(), ("page_id", "source_url", "title", "status")
        )
        manifests["assets"] = self._write_pair(
            "assets", assets, ("asset_id", "final_url", "relative_path", "sha256")
        )
        manifests["asset-references"] = self._write_pair(
            "asset-references",
            self.asset_store.references,
            ("page_id", "asset_id", "source_position", "selected_url", "status"),
        )
        manifests["asset-candidates"] = self._write_pair(
            "asset-candidates",
            self.asset_store.candidate_evidence,
            ("page_id", "source_position", "url", "valid", "reason"),
        )
        manifests["asset-errors"] = self._write_pair(
            "asset-errors",
            self._asset_error_rows(),
            ("page_id", "source_position", "url", "reason", "resolved"),
        )
        manifests["crawl-errors"] = self._write_pair(
            "crawl-errors",
            self._crawl_errors,
            ("url", "stage", "message", "retryable", "resolved"),
        )
        baseline_values = list(self._baselines.values())
        manifests["baselines"] = self._write_pair(
            "baselines",
            baseline_values,
            ("page_id", "dom_text_blocks", "extracted_text_blocks", "network_asset_urls", "archived_asset_urls"),
        )
        # Validator consumes a page-id keyed JSON object.  CSV keeps the same
        # rows as the auditable human-facing table.
        self.storage.write_json("manifests/baselines.json", self._baselines)
        manifests["internal-links"] = self._write_pair(
            "internal-links", self._internal_links, ("page_id", "source_url", "target_url", "target_status")
        )
        manifests["external-links"] = self._write_pair(
            "external-links", self._external_links, ("page_id", "source_url", "target_url", "target_status")
        )
        manifests["download-links"] = self._write_pair(
            "download-links", self._download_links, ("page_id", "source_url", "target_url", "target_status")
        )
        manifests["blocked-requests"] = self._write_pair(
            "blocked-requests", self._blocked_requests, ("page_id", "source_url", "request")
        )
        manifests["content-issues"] = self._write_pair(
            "content-issues", self._content_issues, ("page_id", "source_url", "issue")
        )
        return manifests
