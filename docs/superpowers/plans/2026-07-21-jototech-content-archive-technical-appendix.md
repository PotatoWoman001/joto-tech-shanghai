# JOTOTECH Content Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable, read-only crawler that archives every publicly discoverable non-AI/Dify JOTOTECH page into verified JSON, Markdown, HTML, screenshots, assets, manifests, and reports.

**Architecture:** A single-process Python crawler discovers URLs from the Sitemap, navigation, and same-domain links; filters AI/Dify URLs before page retrieval; renders allowed pages with Playwright; extracts ordered semantic blocks; downloads the highest publicly available asset variants; and writes a CMS-independent content archive. Independent validators reconcile URLs, page outputs, content counts, resources, and failures so that no item disappears silently.

**Tech Stack:** Python 3.12+, `httpx`, `beautifulsoup4`, `lxml`, `pydantic`, `Pillow`, `markdownify`, Playwright Chromium, `pytest`, and `respx`.

## Global Constraints

- The original website is read-only: never submit forms, mutate content, authenticate, change DNS, or call private/admin APIs.
- Exclude JOTO AI, JOTO.AI, and Dify pages before retrieving page bodies, HTML, screenshots, or page-specific assets.
- Record excluded URLs and the matching rule in `manifests/exclusions.csv`.
- Archive all other publicly discoverable pages before editorial filtering.
- Mark Sitemap-only, historical, test-like, and non-navigation pages as `archived`; do not add them to new navigation.
- Preserve source text and source language exactly; report conflicts and suspected errors without silently correcting them.
- Store JSON, Markdown, original HTML, desktop screenshots, mobile screenshots, assets, CSV manifests, and verification reports.
- Prefer the highest publicly accessible image resolution, keep the original bytes, do not upscale, and do not apply lossy recompression.
- Keep one binary copy per SHA-256 digest while preserving every page-to-asset reference.
- Do not copy the old Agify configuration or old iPhorm submission behavior; record their public definitions only.
- Use a single crawl worker with at least 750 ms between origin requests and bounded retries to avoid burdening the original site.
- SEO, the new CMS/database, the new domain/IP, new Agify credentials, and the new frontend remain out of scope.
- Design specification: `docs/superpowers/specs/2026-07-21-jototech-content-migration-design.md`.

---

## Planned File Structure

```text
pyproject.toml                              # Runtime and test dependencies; CLI entry point
config/jototech.json                       # Crawl roots, exclusion rules, pacing, viewports
src/joto_archive/__init__.py               # Package version
src/joto_archive/config.py                 # Typed configuration loading
src/joto_archive/models.py                 # Shared page, block, asset, and crawl models
src/joto_archive/rules.py                  # URL normalization, classification, AI/Dify exclusion
src/joto_archive/discovery.py              # Sitemap, navigation, same-site, and external-link discovery
src/joto_archive/fetch.py                  # Bounded HTTP fetching and Playwright rendering
src/joto_archive/extract.py                # Ordered semantic block and form-definition extraction
src/joto_archive/assets.py                 # Asset candidates, CDN origin recovery, download, hashing
src/joto_archive/storage.py                # JSON, Markdown, HTML, screenshot, and CSV persistence
src/joto_archive/validate.py               # URL, content, file, and asset reconciliation
src/joto_archive/reports.py                # Human-readable crawl, completeness, and image reports
src/joto_archive/crawler.py                # End-to-end orchestration and crawl-state checkpointing
src/joto_archive/cli.py                    # `crawl`, `validate`, and `report` commands
tests/fixtures/                            # Deterministic HTML, Sitemap, image, and document fixtures
tests/test_config.py                       # Configuration validation
tests/test_rules.py                        # URL and exclusion behavior
tests/test_discovery.py                    # Sitemap/navigation/link discovery
tests/test_fetch.py                        # Retry and response handling
tests/test_extract.py                      # Blocks, forms, counts, and unknown-block preservation
tests/test_assets.py                       # Original-image selection, hashing, and deduplication
tests/test_storage.py                      # Stable paths and output formats
tests/test_validate.py                     # Completeness and failure reconciliation
tests/test_crawler.py                      # End-to-end crawl with mocked origin
README.md                                  # Installation, safe operation, outputs, and review workflow
```

### Task 1: Package foundation, configuration, and shared models

**Files:**
- Create: `pyproject.toml`
- Create: `config/jototech.json`
- Create: `src/joto_archive/__init__.py`
- Create: `src/joto_archive/config.py`
- Create: `src/joto_archive/models.py`
- Create: `tests/test_config.py`

**Interfaces:**
- Produces: `load_config(path: Path) -> CrawlConfig`
- Produces: `PageStatus`, `Block`, `PageRecord`, `AssetRecord`, `DiscoveredUrl`, `FetchResult`, and `RenderedPage`

- [ ] **Step 1: Initialize version control for the empty workspace**

Run:

```bash
git init
git branch -M main
```

Expected: Git reports an initialized repository and `git branch --show-current` prints `main`.

- [ ] **Step 2: Write the failing configuration test**

Create `tests/test_config.py`:

```python
from pathlib import Path

from joto_archive.config import load_config


def test_load_config_has_safe_defaults() -> None:
    config = load_config(Path("config/jototech.json"))
    assert config.base_url == "https://www.jototech.cn/"
    assert config.request_delay_seconds >= 0.75
    assert config.max_workers == 1
    assert "15197" in config.excluded_page_ids
    assert set(config.excluded_terms) >= {"joto-ai", "jotoai", "dify"}
    assert set(config.excluded_title_terms) >= {"joto ai", "joto.ai", "dify"}
    assert config.desktop_viewport == (1440, 1000)
    assert config.mobile_viewport == (390, 844)
```

- [ ] **Step 3: Run the test and verify the package is missing**

Run:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[test]'
.venv/bin/pytest tests/test_config.py -v
```

Expected: FAIL during installation or collection because the package files do not exist yet.

- [ ] **Step 4: Add package metadata and exact dependencies**

Create `pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=75"]
build-backend = "setuptools.build_meta"

[project]
name = "joto-content-archive"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "beautifulsoup4>=4.13,<5",
  "httpx>=0.28,<1",
  "lxml>=5.3,<7",
  "markdownify>=1.1,<2",
  "pillow>=11,<13",
  "playwright>=1.52,<2",
  "pydantic>=2.11,<3"
]

[project.optional-dependencies]
test = ["pytest>=8.3,<10", "respx>=0.22,<1"]

[project.scripts]
joto-archive = "joto_archive.cli:main"

[tool.setuptools.packages.find]
where = ["src"]

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-q"
```

Create `src/joto_archive/__init__.py`:

```python
__version__ = "0.1.0"
```

- [ ] **Step 5: Add typed configuration**

Create `config/jototech.json`:

```json
{
  "base_url": "https://www.jototech.cn/",
  "sitemap_url": "https://www.jototech.cn/sitemap.xml",
  "output_dir": "content-archive",
  "request_delay_seconds": 0.75,
  "request_timeout_seconds": 30.0,
  "max_retries": 3,
  "max_workers": 1,
  "excluded_terms": ["joto-ai", "jotoai", "joto.ai", "dify"],
  "excluded_title_terms": ["joto ai", "joto.ai", "dify"],
  "excluded_page_ids": ["15197"],
  "desktop_viewport": [1440, 1000],
  "mobile_viewport": [390, 844],
  "user_agent": "JOTOTECH-Content-Archive/1.0 (+read-only authorized migration)"
}
```

Create `src/joto_archive/config.py`:

```python
import json
from pathlib import Path

from pydantic import BaseModel, Field, field_validator


class CrawlConfig(BaseModel):
    base_url: str
    sitemap_url: str
    output_dir: Path
    request_delay_seconds: float = Field(ge=0.75)
    request_timeout_seconds: float = Field(gt=0)
    max_retries: int = Field(ge=1, le=5)
    max_workers: int = Field(default=1, ge=1, le=1)
    excluded_terms: tuple[str, ...]
    excluded_title_terms: tuple[str, ...]
    excluded_page_ids: tuple[str, ...]
    desktop_viewport: tuple[int, int]
    mobile_viewport: tuple[int, int]
    user_agent: str

    @field_validator("base_url", "sitemap_url")
    @classmethod
    def require_https(cls, value: str) -> str:
        if not value.startswith("https://"):
            raise ValueError("crawl URLs must use HTTPS")
        return value


def load_config(path: Path) -> CrawlConfig:
    return CrawlConfig.model_validate(json.loads(path.read_text(encoding="utf-8")))
```

- [ ] **Step 6: Add shared models used by every later task**

Create `src/joto_archive/models.py`:

```python
from enum import StrEnum
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class PageStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DUPLICATE = "duplicate"
    EXCLUDED_AI = "excluded-ai"
    EXTERNAL = "external"
    RESOURCE = "resource"
    UNREACHABLE = "unreachable"
    ERROR = "error"


class DiscoveredUrl(BaseModel):
    url: str
    source: str
    discovered_from: str | None = None
    navigation_path: list[str] = Field(default_factory=list)
    status: PageStatus
    exclusion_rule: str | None = None


class Block(BaseModel):
    type: str
    order: int
    data: dict[str, Any]
    source_html: str | None = None


class FormField(BaseModel):
    name: str
    label: str
    field_type: str
    required: bool
    order: int


class AssetRecord(BaseModel):
    asset_id: str
    source_urls: list[str]
    final_url: str
    relative_path: Path
    original_filename: str
    suggested_filename: str
    mime_type: str
    byte_size: int
    sha256: str
    width: int | None = None
    height: int | None = None
    alt: str = ""
    title: str = ""
    caption: str = ""
    usage_notes: list[str] = Field(default_factory=list)
    referenced_by: list[str] = Field(default_factory=list)
    is_external: bool = False
    download_status: str = "downloaded"
    quality_note: str = "highest-publicly-available"


class PageRecord(BaseModel):
    id: str
    source_url: str
    source_aliases: list[str] = Field(default_factory=list)
    source_page_id: str | None = None
    title: str
    language: str
    status: PageStatus
    navigation_path: list[str] = Field(default_factory=list)
    breadcrumbs: list[str] = Field(default_factory=list)
    content_type: str
    blocks: list[Block]
    assets: list[str] = Field(default_factory=list)
    internal_links: list[str] = Field(default_factory=list)
    external_links: list[str] = Field(default_factory=list)
    download_links: list[str] = Field(default_factory=list)
    form_fields: list[FormField] = Field(default_factory=list)
    captured_at: str
    content_hash: str
    issues: list[str] = Field(default_factory=list)


class FetchResult(BaseModel):
    requested_url: str
    final_url: str
    status_code: int
    content_type: str
    body: bytes
    attempts: int


class RenderedPage(BaseModel):
    url: str
    html: str
    desktop_screenshot: Path
    mobile_screenshot: Path
    console_errors: list[str] = Field(default_factory=list)
```

- [ ] **Step 7: Install and run the test**

Run:

```bash
.venv/bin/python -m pip install -e '.[test]'
.venv/bin/pytest tests/test_config.py -v
```

Expected: PASS.

- [ ] **Step 8: Commit the foundation**

```bash
git add pyproject.toml config src/joto_archive tests/test_config.py
git commit -m "build: scaffold content archive tool"
```

### Task 2: URL normalization, exclusion, and page classification

**Files:**
- Create: `src/joto_archive/rules.py`
- Create: `tests/test_rules.py`

**Interfaces:**
- Consumes: `CrawlConfig`, `DiscoveredUrl`, `PageStatus`
- Produces: `normalize_url(url: str, base_url: str) -> str`
- Produces: `classify_url(url: str, source: str, config: CrawlConfig) -> DiscoveredUrl`

- [ ] **Step 1: Write exclusion and normalization tests**

Create `tests/test_rules.py`:

```python
from pathlib import Path

from joto_archive.config import load_config
from joto_archive.models import PageStatus
from joto_archive.rules import classify_url, normalize_url


CONFIG = load_config(Path("config/jototech.json"))


def test_normalize_url_removes_tracking_and_fragment() -> None:
    value = normalize_url(
        "http://www.jototech.cn/solutions/cisco-networking/?utm_source=x#hero",
        CONFIG.base_url,
    )
    assert value == "https://www.jototech.cn/solutions/cisco-networking"


def test_excludes_known_ai_page_id_before_fetch() -> None:
    item = classify_url("https://www.jototech.cn/?page_id=15197", "sitemap", CONFIG)
    assert item.status is PageStatus.EXCLUDED_AI
    assert item.exclusion_rule == "page_id:15197"


def test_excludes_dify_slug_before_fetch() -> None:
    item = classify_url("https://www.jototech.cn/dify-golden-partner", "sitemap", CONFIG)
    assert item.status is PageStatus.EXCLUDED_AI
    assert item.exclusion_rule == "term:dify"


def test_sitemap_only_normal_page_is_archived() -> None:
    item = classify_url("https://www.jototech.cn/msp", "sitemap", CONFIG)
    assert item.status is PageStatus.ARCHIVED


def test_navigation_page_is_active() -> None:
    item = classify_url("https://www.jototech.cn/?page_id=11105", "navigation", CONFIG)
    assert item.status is PageStatus.ACTIVE


def test_home_is_active_even_when_discovered_from_sitemap() -> None:
    item = classify_url("https://www.jototech.cn/", "sitemap", CONFIG)
    assert item.status is PageStatus.ACTIVE


def test_same_site_document_is_a_resource_not_a_page() -> None:
    item = classify_url("https://www.jototech.cn/files/manual.pdf", "page-link", CONFIG)
    assert item.status is PageStatus.RESOURCE
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_rules.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.rules`.

- [ ] **Step 3: Implement deterministic rules**

Create `src/joto_archive/rules.py`:

```python
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from joto_archive.config import CrawlConfig
from joto_archive.models import DiscoveredUrl, PageStatus


DROP_QUERY_PREFIXES = ("utm_",)
DROP_QUERY_KEYS = {"fbclid", "gclid"}
RESOURCE_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


def normalize_url(url: str, base_url: str) -> str:
    absolute = urljoin(base_url, url)
    parts = urlsplit(absolute)
    scheme = "https" if parts.hostname == urlsplit(base_url).hostname else parts.scheme
    query_items = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key not in DROP_QUERY_KEYS and not key.startswith(DROP_QUERY_PREFIXES)
    ]
    path = parts.path or "/"
    if path != "/":
        path = path.rstrip("/")
    return urlunsplit((scheme, parts.netloc.lower(), path, urlencode(query_items), ""))


def _exclusion_rule(url: str, config: CrawlConfig) -> str | None:
    normalized = normalize_url(url, config.base_url).lower()
    parts = urlsplit(normalized)
    query = dict(parse_qsl(parts.query))
    if query.get("page_id") in config.excluded_page_ids:
        return f"page_id:{query['page_id']}"
    searchable = f"{parts.path}?{parts.query}".replace(".", "")
    for term in config.excluded_terms:
        if term.replace(".", "") in searchable:
            return f"term:{term}"
    return None


def classify_url(url: str, source: str, config: CrawlConfig) -> DiscoveredUrl:
    normalized = normalize_url(url, config.base_url)
    rule = _exclusion_rule(normalized, config)
    if rule:
        status = PageStatus.EXCLUDED_AI
    elif urlsplit(normalized).hostname != urlsplit(config.base_url).hostname:
        status = PageStatus.EXTERNAL
    elif any(urlsplit(normalized).path.lower().endswith(extension) for extension in RESOURCE_EXTENSIONS):
        status = PageStatus.RESOURCE
    elif normalized == normalize_url(config.base_url, config.base_url) or source == "navigation":
        status = PageStatus.ACTIVE
    else:
        status = PageStatus.ARCHIVED
    return DiscoveredUrl(
        url=normalized,
        source=source,
        status=status,
        exclusion_rule=rule,
    )
```

- [ ] **Step 4: Run rules tests**

Run: `.venv/bin/pytest tests/test_rules.py -v`

Expected: 7 passed.

- [ ] **Step 5: Commit URL rules**

```bash
git add src/joto_archive/rules.py tests/test_rules.py
git commit -m "feat: classify and exclude AI URLs before fetch"
```

### Task 3: Sitemap, navigation, and link discovery

**Files:**
- Create: `src/joto_archive/discovery.py`
- Create: `tests/fixtures/sitemap.xml`
- Create: `tests/fixtures/navigation.html`
- Create: `tests/test_discovery.py`

**Interfaces:**
- Consumes: `classify_url`, `CrawlConfig`
- Produces: `parse_sitemap(xml: bytes, config: CrawlConfig) -> list[DiscoveredUrl]`
- Produces: `discover_links(html: str, page_url: str, config: CrawlConfig) -> list[DiscoveredUrl]`

- [ ] **Step 1: Add deterministic discovery fixtures**

Create `tests/fixtures/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.jototech.cn/</loc></url>
  <url><loc>https://www.jototech.cn/msp</loc></url>
  <url><loc>https://www.jototech.cn/dify</loc></url>
</urlset>
```

Create `tests/fixtures/navigation.html`:

```html
<!doctype html>
<html lang="en">
<body>
  <nav id="navigation">
    <a href="/">Home</a>
    <a href="/?page_id=11105">Cisco Networking</a>
    <a href="/?page_id=15197">JOTO AI Solution</a>
  </nav>
  <main>
    <a href="/msp">MSP</a>
    <a href="https://partner.example/file.pdf">Partner PDF</a>
  </main>
</body>
</html>
```

- [ ] **Step 2: Write failing discovery tests**

Create `tests/test_discovery.py`:

```python
from pathlib import Path

from joto_archive.config import load_config
from joto_archive.discovery import discover_links, parse_sitemap
from joto_archive.models import PageStatus


CONFIG = load_config(Path("config/jototech.json"))


def test_sitemap_preserves_ai_exclusion_and_archives_history() -> None:
    items = parse_sitemap(Path("tests/fixtures/sitemap.xml").read_bytes(), CONFIG)
    statuses = {item.url: item.status for item in items}
    assert statuses["https://www.jototech.cn/msp"] is PageStatus.ARCHIVED
    assert statuses["https://www.jototech.cn/dify"] is PageStatus.EXCLUDED_AI


def test_navigation_overrides_active_status_and_records_external() -> None:
    html = Path("tests/fixtures/navigation.html").read_text(encoding="utf-8")
    items = discover_links(html, CONFIG.base_url, CONFIG)
    statuses = {item.url: item.status for item in items}
    assert statuses["https://www.jototech.cn/?page_id=11105"] is PageStatus.ACTIVE
    assert statuses["https://www.jototech.cn/?page_id=15197"] is PageStatus.EXCLUDED_AI
    assert statuses["https://partner.example/file.pdf"] is PageStatus.EXTERNAL
```

- [ ] **Step 3: Run tests and verify failure**

Run: `.venv/bin/pytest tests/test_discovery.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.discovery`.

- [ ] **Step 4: Implement discovery without retrieving excluded pages**

Create `src/joto_archive/discovery.py`:

```python
from bs4 import BeautifulSoup
from lxml import etree

from joto_archive.config import CrawlConfig
from joto_archive.models import DiscoveredUrl
from joto_archive.rules import classify_url


def parse_sitemap(xml: bytes, config: CrawlConfig) -> list[DiscoveredUrl]:
    root = etree.fromstring(xml)
    values = root.xpath("//*[local-name()='loc']/text()")
    return [classify_url(value.strip(), "sitemap", config) for value in values]


def discover_links(html: str, page_url: str, config: CrawlConfig) -> list[DiscoveredUrl]:
    soup = BeautifulSoup(html, "lxml")
    found: dict[str, DiscoveredUrl] = {}
    for anchor in soup.select("a[href]"):
        source = "navigation" if anchor.find_parent("nav") or anchor.find_parent(id="navigation") else "page-link"
        item = classify_url(anchor.get("href", ""), source, config)
        item.discovered_from = page_url
        previous = found.get(item.url)
        if previous is None or source == "navigation":
            found[item.url] = item
    return list(found.values())
```

- [ ] **Step 5: Run discovery tests**

Run: `.venv/bin/pytest tests/test_discovery.py -v`

Expected: 2 passed.

- [ ] **Step 6: Commit discovery**

```bash
git add src/joto_archive/discovery.py tests/fixtures tests/test_discovery.py
git commit -m "feat: discover sitemap navigation and linked pages"
```

### Task 4: Safe HTTP fetcher and Playwright evidence capture

**Files:**
- Create: `src/joto_archive/fetch.py`
- Create: `tests/test_fetch.py`

**Interfaces:**
- Consumes: `CrawlConfig`, `FetchResult`, `RenderedPage`
- Produces: `HttpFetcher.get(url: str) -> FetchResult`
- Produces: `BrowserRenderer.capture(url: str, page_id: str) -> RenderedPage`

- [ ] **Step 1: Write retry and no-POST tests**

Create `tests/test_fetch.py`:

```python
from pathlib import Path

import httpx
import respx

from joto_archive.config import load_config
from joto_archive.fetch import HttpFetcher


CONFIG = load_config(Path("config/jototech.json"))


@respx.mock
def test_fetch_retries_server_error_then_returns_bytes() -> None:
    route = respx.get("https://www.jototech.cn/msp").mock(
        side_effect=[
            httpx.Response(503),
            httpx.Response(200, content=b"<html>ok</html>", headers={"content-type": "text/html"}),
        ]
    )
    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        result = fetcher.get("https://www.jototech.cn/msp")
    assert result.status_code == 200
    assert result.body == b"<html>ok</html>"
    assert result.attempts == 2
    assert route.call_count == 2
    assert all(call.request.method == "GET" for call in route.calls)
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_fetch.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.fetch`.

- [ ] **Step 3: Implement bounded read-only fetching**

Create `src/joto_archive/fetch.py`:

```python
import time
from collections.abc import Callable
from pathlib import Path

import httpx
from playwright.sync_api import Browser, Playwright, sync_playwright

from joto_archive.config import CrawlConfig
from joto_archive.models import FetchResult, RenderedPage


class HttpFetcher:
    def __init__(self, config: CrawlConfig, sleep: Callable[[float], None] = time.sleep):
        self.config = config
        self.sleep = sleep
        self.client = httpx.Client(
            timeout=config.request_timeout_seconds,
            follow_redirects=True,
            headers={"User-Agent": config.user_agent},
        )

    def __enter__(self) -> "HttpFetcher":
        return self

    def __exit__(self, *_: object) -> None:
        self.client.close()

    def get(self, url: str) -> FetchResult:
        last: httpx.Response | None = None
        for attempt in range(1, self.config.max_retries + 1):
            if attempt > 1:
                self.sleep(self.config.request_delay_seconds * attempt)
            response = self.client.get(url)
            last = response
            if response.status_code < 500:
                return FetchResult(
                    requested_url=url,
                    final_url=str(response.url),
                    status_code=response.status_code,
                    content_type=response.headers.get("content-type", "application/octet-stream"),
                    body=response.content,
                    attempts=attempt,
                )
        assert last is not None
        return FetchResult(
            requested_url=url,
            final_url=str(last.url),
            status_code=last.status_code,
            content_type=last.headers.get("content-type", "application/octet-stream"),
            body=last.content,
            attempts=self.config.max_retries,
        )


class BrowserRenderer:
    def __init__(self, config: CrawlConfig, output_dir: Path):
        self.config = config
        self.output_dir = output_dir
        self.playwright: Playwright | None = None
        self.browser: Browser | None = None

    def __enter__(self) -> "BrowserRenderer":
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)
        return self

    def __exit__(self, *_: object) -> None:
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()

    def _capture_viewport(self, url: str, path: Path, viewport: tuple[int, int]) -> tuple[str, list[str]]:
        assert self.browser is not None
        page = self.browser.new_page(viewport={"width": viewport[0], "height": viewport[1]})
        errors: list[str] = []
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto(url, wait_until="networkidle", timeout=int(self.config.request_timeout_seconds * 1000))
        page.screenshot(path=str(path), full_page=True)
        html = page.content()
        page.close()
        return html, errors

    def capture(self, url: str, page_id: str) -> RenderedPage:
        desktop = self.output_dir / "screenshots" / "desktop" / f"{page_id}.png"
        mobile = self.output_dir / "screenshots" / "mobile" / f"{page_id}.png"
        desktop.parent.mkdir(parents=True, exist_ok=True)
        mobile.parent.mkdir(parents=True, exist_ok=True)
        html, desktop_errors = self._capture_viewport(url, desktop, self.config.desktop_viewport)
        _, mobile_errors = self._capture_viewport(url, mobile, self.config.mobile_viewport)
        return RenderedPage(
            url=url,
            html=html,
            desktop_screenshot=desktop,
            mobile_screenshot=mobile,
            console_errors=desktop_errors + mobile_errors,
        )
```

- [ ] **Step 4: Run fetch tests**

Run: `.venv/bin/pytest tests/test_fetch.py -v`

Expected: 1 passed.

- [ ] **Step 5: Install Chromium and run a read-only smoke capture**

Run:

```bash
.venv/bin/playwright install chromium
.venv/bin/python -c "from pathlib import Path; from joto_archive.config import load_config; from joto_archive.fetch import BrowserRenderer; c=load_config(Path('config/jototech.json')); o=Path('/tmp/joto-browser-smoke'); r=BrowserRenderer(c,o); r.__enter__(); p=r.capture('https://www.jototech.cn/?page_id=11105','smoke'); r.__exit__(); print(p.desktop_screenshot.exists(),p.mobile_screenshot.exists())"
```

Expected: `True True`; no form submission and no output inside `content-archive/`.

- [ ] **Step 6: Commit fetch and rendering**

```bash
git add src/joto_archive/fetch.py tests/test_fetch.py
git commit -m "feat: add bounded fetch and browser evidence capture"
```

### Task 5: Ordered semantic extraction and Markdown conversion

**Files:**
- Create: `src/joto_archive/extract.py`
- Create: `tests/fixtures/article.html`
- Create: `tests/test_extract.py`

**Interfaces:**
- Consumes: rendered HTML, source URL, `PageStatus`
- Produces: `extract_page(html: str, source_url: str, status: PageStatus) -> PageRecord`
- Produces: `page_to_markdown(page: PageRecord) -> str`

- [ ] **Step 1: Add a fixture containing all required content shapes**

Create `tests/fixtures/article.html`:

```html
<!doctype html>
<html lang="en-US">
<head><title>Historical Article</title></head>
<body class="page page-id-9001">
<header><nav><a href="/">Home</a></nav></header>
<main id="content">
  <h1>Historical Article</h1>
  <p>Original paragraph.</p>
  <h2>Details</h2>
  <ul><li>First</li><li>Second</li></ul>
  <figure><img src="/uploads/photo-300x200.jpg" alt="Device" title="Device title"><figcaption>Device caption</figcaption></figure>
  <table><tr><th>Model</th><th>Value</th></tr><tr><td>A</td><td>1</td></tr></table>
  <form><label>Name<input name="name" required></label><button>Submit</button></form>
  <div data-custom-widget="legacy">Preserve this unknown widget</div>
</main>
<footer>Footer content must not enter article blocks.</footer>
</body>
</html>
```

- [ ] **Step 2: Write failing extraction tests**

Create `tests/test_extract.py`:

```python
from pathlib import Path

from joto_archive.extract import extract_page, page_to_markdown
from joto_archive.models import PageStatus


HTML = Path("tests/fixtures/article.html").read_text(encoding="utf-8")


def test_extracts_ordered_blocks_and_preserves_unknown_html() -> None:
    page = extract_page(HTML, "https://www.jototech.cn/article", PageStatus.ARCHIVED)
    assert page.title == "Historical Article"
    assert page.language == "en-US"
    assert [block.type for block in page.blocks] == [
        "heading", "paragraph", "heading", "list", "image", "table", "formDefinition", "unknown"
    ]
    assert page.blocks[-1].source_html == '<div data-custom-widget="legacy">Preserve this unknown widget</div>'
    assert page.form_fields[0].name == "name"
    assert page.form_fields[0].required is True
    assert "Footer content" not in page_to_markdown(page)


def test_markdown_keeps_original_content_order() -> None:
    page = extract_page(HTML, "https://www.jototech.cn/article", PageStatus.ARCHIVED)
    markdown = page_to_markdown(page)
    assert markdown.index("# Historical Article") < markdown.index("Original paragraph")
    assert markdown.index("Original paragraph") < markdown.index("## Details")
    assert "- First" in markdown
    assert "![Device]" in markdown
```

- [ ] **Step 3: Run tests and verify failure**

Run: `.venv/bin/pytest tests/test_extract.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.extract`.

- [ ] **Step 4: Implement explicit semantic extraction**

Create `src/joto_archive/extract.py`:

```python
import hashlib
import re
from datetime import UTC, datetime
from urllib.parse import parse_qs, urljoin, urlsplit

from bs4 import BeautifulSoup, Tag

from joto_archive.models import Block, FormField, PageRecord, PageStatus


DIRECT_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "table", "figure", "form"}


def _page_id(source_url: str, soup: BeautifulSoup) -> tuple[str, str | None]:
    body_classes = " ".join(soup.body.get("class", [])) if soup.body else ""
    match = re.search(r"page-id-(\d+)", body_classes)
    query_id = parse_qs(urlsplit(source_url).query).get("page_id", [None])[0]
    source_id = match.group(1) if match else query_id
    stable = source_id or hashlib.sha256(source_url.encode()).hexdigest()[:12]
    return f"page-{stable}", source_id


def _form_fields(form: Tag) -> list[FormField]:
    fields: list[FormField] = []
    for order, element in enumerate(form.select("input[name], textarea[name], select[name]")):
        if element.get("type") == "hidden":
            continue
        label = element.find_parent("label")
        label_text = label.get_text(" ", strip=True) if label else element.get("placeholder", "")
        fields.append(FormField(
            name=element.get("name", ""),
            label=label_text,
            field_type=element.name if element.name != "input" else element.get("type", "text"),
            required=element.has_attr("required") or "required" in element.get("class", []),
            order=order,
        ))
    return fields


def _block(tag: Tag, order: int, source_url: str) -> tuple[Block, list[FormField]]:
    if tag.name and tag.name.startswith("h") and tag.name[1:].isdigit():
        return Block(type="heading", order=order, data={"level": int(tag.name[1:]), "text": tag.get_text(" ", strip=True)}), []
    if tag.name == "p":
        return Block(type="paragraph", order=order, data={"text": tag.get_text(" ", strip=True), "html": tag.decode_contents()}), []
    if tag.name in {"ul", "ol"}:
        return Block(type="list", order=order, data={"style": "ordered" if tag.name == "ol" else "unordered", "items": [li.get_text(" ", strip=True) for li in tag.find_all("li", recursive=False)]}), []
    if tag.name == "figure":
        image = tag.find("img")
        caption = tag.find("figcaption")
        return Block(type="image", order=order, data={"url": urljoin(source_url, image.get("src", "")) if image else "", "alt": image.get("alt", "") if image else "", "title": image.get("title", "") if image else "", "caption": caption.get_text(" ", strip=True) if caption else ""}), []
    if tag.name == "table":
        rows = [[cell.get_text(" ", strip=True) for cell in row.find_all(["th", "td"])] for row in tag.find_all("tr")]
        return Block(type="table", order=order, data={"rows": rows}), []
    if tag.name == "form":
        fields = _form_fields(tag)
        button = tag.find(["button", "input"], attrs={"type": "submit"})
        return Block(type="formDefinition", order=order, data={"fields": [field.model_dump() for field in fields], "buttonText": button.get_text(" ", strip=True) if button and button.name == "button" else (button.get("value", "") if button else "")}), fields
    return Block(type="unknown", order=order, data={"text": tag.get_text(" ", strip=True)}, source_html=str(tag)), []


def extract_page(html: str, source_url: str, status: PageStatus) -> PageRecord:
    soup = BeautifulSoup(html, "lxml")
    root = soup.select_one("#content") or soup.select_one("main") or soup.body
    if root is None:
        raise ValueError("page has no content root")
    candidates = [tag for tag in root.find_all(recursive=False) if isinstance(tag, Tag)]
    flattened: list[Tag] = []
    for candidate in candidates:
        if candidate.name in DIRECT_TAGS or candidate.has_attr("data-custom-widget"):
            flattened.append(candidate)
        else:
            flattened.extend(tag for tag in candidate.find_all(DIRECT_TAGS, recursive=True) if not tag.find_parent(DIRECT_TAGS))
    blocks: list[Block] = []
    fields: list[FormField] = []
    for order, candidate in enumerate(flattened):
        block, block_fields = _block(candidate, order, source_url)
        if block.data.get("text") or block.type in {"image", "list", "table", "formDefinition"}:
            blocks.append(block)
            fields.extend(block_fields)
    page_id, source_page_id = _page_id(source_url, soup)
    title = (soup.title.get_text(strip=True) if soup.title else "") or next((block.data["text"] for block in blocks if block.type == "heading"), "Untitled")
    canonical = "\n".join(block.model_dump_json() for block in blocks)
    return PageRecord(
        id=page_id,
        source_url=source_url,
        source_page_id=source_page_id,
        title=title,
        language=soup.html.get("lang", "und") if soup.html else "und",
        status=status,
        content_type="article" if status is PageStatus.ARCHIVED else "page",
        blocks=blocks,
        form_fields=fields,
        captured_at=datetime.now(UTC).isoformat(),
        content_hash=hashlib.sha256(canonical.encode()).hexdigest(),
    )


def page_to_markdown(page: PageRecord) -> str:
    output: list[str] = []
    for block in page.blocks:
        if block.type == "heading":
            output.append(f"{'#' * block.data['level']} {block.data['text']}")
        elif block.type == "paragraph":
            output.append(block.data["text"])
        elif block.type == "list":
            prefix = "1." if block.data["style"] == "ordered" else "-"
            output.append("\n".join(f"{prefix} {item}" for item in block.data["items"]))
        elif block.type == "image":
            output.append(f"![{block.data['alt']}]({block.data['url']})")
            if block.data["caption"]:
                output.append(f"*{block.data['caption']}*")
        elif block.type == "table":
            rows = block.data["rows"]
            if rows:
                output.append("| " + " | ".join(rows[0]) + " |")
                output.append("| " + " | ".join("---" for _ in rows[0]) + " |")
                output.extend("| " + " | ".join(row) + " |" for row in rows[1:])
        elif block.type in {"formDefinition", "unknown"}:
            output.append(f"[Structured block: {block.type}, order {block.order}]")
    return "\n\n".join(output).strip() + "\n"
```

- [ ] **Step 5: Run extraction tests**

Run: `.venv/bin/pytest tests/test_extract.py -v`

Expected: 2 passed.

- [ ] **Step 6: Commit semantic extraction**

```bash
git add src/joto_archive/extract.py tests/fixtures/article.html tests/test_extract.py
git commit -m "feat: extract ordered CMS-independent page blocks"
```

### Task 6: Highest-quality asset resolution, download, and deduplication

**Files:**
- Create: `src/joto_archive/assets.py`
- Create: `tests/fixtures/pixel.png`
- Create: `tests/test_assets.py`

**Interfaces:**
- Consumes: source HTML, `HttpFetcher`, output path
- Produces: `asset_candidates(html: str, page_url: str) -> list[AssetCandidate]`
- Produces: `AssetStore.archive(candidates: list[AssetCandidate], page_id: str) -> list[AssetRecord]`

- [ ] **Step 1: Create a real image fixture**

Run:

```bash
.venv/bin/python -c "from pathlib import Path; from PIL import Image; p=Path('tests/fixtures/pixel.png'); p.parent.mkdir(parents=True,exist_ok=True); Image.new('RGB',(1200,800),'blue').save(p)"
```

Expected: `tests/fixtures/pixel.png` is a decodable 1200×800 PNG.

- [ ] **Step 2: Write failing original-resolution and dedupe tests**

Create `tests/test_assets.py`:

```python
from pathlib import Path

import httpx
import respx

from joto_archive.assets import AssetStore, asset_candidates
from joto_archive.config import load_config
from joto_archive.fetch import HttpFetcher


CONFIG = load_config(Path("config/jototech.json"))
IMAGE = Path("tests/fixtures/pixel.png").read_bytes()


def test_candidates_prefer_srcset_and_unsuffixed_original() -> None:
    html = '<img src="/uploads/photo-300x200.jpg" srcset="/uploads/photo-1024x683.jpg 1024w, /uploads/photo.jpg 1600w" alt="Device">'
    candidates = asset_candidates(html, "https://www.jototech.cn/page")
    urls = candidates[0].urls
    assert urls[0] == "https://www.jototech.cn/uploads/photo.jpg"
    assert "https://www.jototech.cn/uploads/photo-1024x683.jpg" in urls


@respx.mock
def test_store_hashes_image_and_reuses_binary_for_second_page(tmp_path: Path) -> None:
    url = "https://www.jototech.cn/uploads/photo.png"
    respx.get(url).mock(return_value=httpx.Response(200, content=IMAGE, headers={"content-type": "image/png"}))
    candidates = asset_candidates(f'<img src="{url}" alt="Device">', "https://www.jototech.cn/page")
    with HttpFetcher(CONFIG, sleep=lambda _: None) as fetcher:
        store = AssetStore(tmp_path, fetcher)
        first = store.archive(candidates, "page-1")[0]
        second = store.archive(candidates, "page-2")[0]
    assert first.sha256 == second.sha256
    assert first.relative_path == second.relative_path
    assert first.width == 1200 and first.height == 800
    assert set(second.referenced_by) == {"page-1", "page-2"}
```

- [ ] **Step 3: Run tests and verify failure**

Run: `.venv/bin/pytest tests/test_assets.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.assets`.

- [ ] **Step 4: Implement candidate ranking and binary deduplication**

Create `src/joto_archive/assets.py`:

```python
import hashlib
import io
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup
from PIL import Image
from pydantic import BaseModel

from joto_archive.fetch import HttpFetcher
from joto_archive.models import AssetRecord


SIZE_SUFFIX = re.compile(r"-(\d+)x(\d+)(?=\.[a-zA-Z0-9]+$)")


class AssetCandidate(BaseModel):
    urls: list[str]
    alt: str = ""
    title: str = ""
    caption: str = ""
    usage: str = "content-image"
    source_position: str = ""


def _original_variant(url: str) -> str:
    parts = urlsplit(url)
    path = SIZE_SUFFIX.sub("", parts.path)
    return parts._replace(path=path).geturl()


def asset_candidates(html: str, page_url: str) -> list[AssetCandidate]:
    soup = BeautifulSoup(html, "lxml")
    output: list[AssetCandidate] = []
    for image_index, image in enumerate(soup.select("img")):
        ranked: list[tuple[int, str]] = []
        for item in image.get("srcset", "").split(","):
            pieces = item.strip().split()
            if pieces:
                width = int(pieces[1][:-1]) if len(pieces) > 1 and pieces[1].endswith("w") else 0
                ranked.append((width, urljoin(page_url, pieces[0])))
        for attr in ("data-original", "data-src", "src"):
            if image.get(attr):
                ranked.append((0, urljoin(page_url, image[attr])))
        expanded = [(width + (10_000_000 if _original_variant(url) == url else 0), url) for width, url in ranked]
        expanded.extend((20_000_000, _original_variant(url)) for _, url in ranked if _original_variant(url) != url)
        urls = list(dict.fromkeys(url for _, url in sorted(expanded, reverse=True)))
        if urls:
            figure = image.find_parent("figure")
            caption = figure.find("figcaption").get_text(" ", strip=True) if figure and figure.find("figcaption") else ""
            output.append(AssetCandidate(urls=urls, alt=image.get("alt", ""), title=image.get("title", ""), caption=caption))
    return output


class AssetStore:
    def __init__(self, output_dir: Path, fetcher: HttpFetcher):
        self.output_dir = output_dir
        self.fetcher = fetcher
        self.by_hash: dict[str, AssetRecord] = {}
        self.failures: list[dict[str, str]] = []

    def archive(self, candidates: list[AssetCandidate], page_id: str) -> list[AssetRecord]:
        records: list[AssetRecord] = []
        for candidate in candidates:
            chosen = None
            for url in candidate.urls:
                result = self.fetcher.get(url)
                if result.status_code == 200 and result.body:
                    chosen = result
                    break
            if chosen is None:
                self.failures.append({"page_id": page_id, "source_position": candidate.source_position, "candidate_urls": " | ".join(candidate.urls), "error": "no candidate returned HTTP 200 with a non-empty body"})
                continue
            digest = hashlib.sha256(chosen.body).hexdigest()
            existing = self.by_hash.get(digest)
            if existing:
                if page_id not in existing.referenced_by:
                    existing.referenced_by.append(page_id)
                usage_note = f"{candidate.usage}:{candidate.source_position}"
                if usage_note not in existing.usage_notes:
                    existing.usage_notes.append(usage_note)
                records.append(existing)
                continue
            suffix = Path(urlsplit(chosen.final_url).path).suffix.lower() or ".bin"
            relative = Path("assets/images" if chosen.content_type.startswith("image/") else "assets/documents") / f"{digest}{suffix}"
            target = self.output_dir / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(chosen.body)
            width = height = None
            if chosen.content_type.startswith("image/"):
                with Image.open(io.BytesIO(chosen.body)) as image:
                    width, height = image.size
                    image.verify()
            record = AssetRecord(
                asset_id=f"asset-{digest[:16]}",
                source_urls=candidate.urls,
                final_url=chosen.final_url,
                relative_path=relative,
                original_filename=Path(urlsplit(chosen.final_url).path).name,
                suggested_filename=relative.name,
                mime_type=chosen.content_type.split(";", 1)[0],
                byte_size=len(chosen.body),
                sha256=digest,
                width=width,
                height=height,
                alt=candidate.alt,
                title=candidate.title,
                caption=candidate.caption,
                usage_notes=[f"{candidate.usage}:{candidate.source_position}"],
                referenced_by=[page_id],
                is_external=urlsplit(chosen.final_url).hostname != "www.jototech.cn",
            )
            self.by_hash[digest] = record
            records.append(record)
        return records
```

- [ ] **Step 5: Run asset tests**

Run: `.venv/bin/pytest tests/test_assets.py -v`

Expected: 2 passed.

- [ ] **Step 6: Commit asset handling**

```bash
git add src/joto_archive/assets.py tests/fixtures/pixel.png tests/test_assets.py
git commit -m "feat: archive highest-quality deduplicated assets"
```

### Task 7: Stable storage and manifests

**Files:**
- Create: `src/joto_archive/storage.py`
- Create: `tests/test_storage.py`

**Interfaces:**
- Consumes: `PageRecord`, `AssetRecord`, raw HTML, screenshots, discovered URLs
- Produces: `ArchiveWriter.write_page(page: PageRecord, html: str) -> None`
- Produces: `ArchiveWriter.write_urls(urls: list[DiscoveredUrl]) -> None`
- Produces: `ArchiveWriter.write_assets(assets: list[AssetRecord]) -> None`

- [ ] **Step 1: Write failing archive-output tests**

Create `tests/test_storage.py`:

```python
from datetime import UTC, datetime
from pathlib import Path

from joto_archive.models import Block, DiscoveredUrl, PageRecord, PageStatus
from joto_archive.storage import ArchiveWriter


def sample_page() -> PageRecord:
    return PageRecord(
        id="page-9001",
        source_url="https://www.jototech.cn/article",
        title="Article",
        language="en",
        status=PageStatus.ARCHIVED,
        content_type="article",
        blocks=[Block(type="paragraph", order=0, data={"text": "Body", "html": "Body"})],
        captured_at=datetime.now(UTC).isoformat(),
        content_hash="a" * 64,
    )


def test_writer_creates_json_markdown_html_and_exclusion_manifest(tmp_path: Path) -> None:
    writer = ArchiveWriter(tmp_path)
    writer.write_page(sample_page(), "<html><main>Body</main></html>")
    writer.write_urls([
        DiscoveredUrl(url="https://www.jototech.cn/article", source="sitemap", status=PageStatus.ARCHIVED),
        DiscoveredUrl(url="https://www.jototech.cn/dify", source="sitemap", status=PageStatus.EXCLUDED_AI, exclusion_rule="term:dify"),
    ])
    assert (tmp_path / "pages/page-9001.json").exists()
    assert (tmp_path / "pages/page-9001.md").read_text().startswith("Body")
    assert (tmp_path / "pages/page-9001.html").exists()
    assert "https://www.jototech.cn/dify" in (tmp_path / "manifests/exclusions.csv").read_text()
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_storage.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.storage`.

- [ ] **Step 3: Implement atomic page writes and CSV manifests**

Create `src/joto_archive/storage.py`:

```python
import csv
import json
import json
from pathlib import Path

from joto_archive.extract import page_to_markdown
from joto_archive.models import AssetRecord, DiscoveredUrl, PageRecord, PageStatus


class ArchiveWriter:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir

    def _atomic_text(self, path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(path.suffix + ".tmp")
        temporary.write_text(content, encoding="utf-8")
        temporary.replace(path)

    def write_page(self, page: PageRecord, html: str) -> None:
        root = self.output_dir / "pages"
        self._atomic_text(root / f"{page.id}.json", page.model_dump_json(indent=2))
        self._atomic_text(root / f"{page.id}.md", page_to_markdown(page))
        self._atomic_text(root / f"{page.id}.html", html)

    def _write_csv(self, path: Path, fieldnames: list[str], rows: list[dict[str, object]]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(path.suffix + ".tmp")
        with temporary.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        temporary.replace(path)

    def write_urls(self, urls: list[DiscoveredUrl]) -> None:
        fields = ["url", "source", "discovered_from", "status", "exclusion_rule"]
        rows = [{key: getattr(item, key) for key in fields} for item in urls]
        self._write_csv(self.output_dir / "manifests/urls.csv", fields, rows)
        exclusions = [row for row in rows if row["status"] == PageStatus.EXCLUDED_AI]
        self._write_csv(self.output_dir / "manifests/exclusions.csv", fields, exclusions)

    def write_assets(self, assets: list[AssetRecord]) -> None:
        fields = ["asset_id", "relative_path", "original_filename", "suggested_filename", "final_url", "mime_type", "byte_size", "sha256", "width", "height", "usage_notes", "referenced_by", "source_urls", "download_status", "quality_note"]
        rows = []
        for asset in assets:
            row = asset.model_dump()
            row["relative_path"] = str(asset.relative_path)
            row["referenced_by"] = json.dumps(asset.referenced_by, ensure_ascii=False)
            row["source_urls"] = json.dumps(asset.source_urls, ensure_ascii=False)
            row["usage_notes"] = json.dumps(asset.usage_notes, ensure_ascii=False)
            rows.append({key: row[key] for key in fields})
        self._write_csv(self.output_dir / "manifests/assets.csv", fields, rows)

    def write_asset_failures(self, failures: list[dict[str, str]]) -> None:
        self._write_csv(
            self.output_dir / "manifests/asset-errors.csv",
            ["page_id", "source_position", "candidate_urls", "error"],
            failures,
        )
```

- [ ] **Step 4: Run storage tests**

Run: `.venv/bin/pytest tests/test_storage.py -v`

Expected: 1 passed.

- [ ] **Step 5: Commit storage**

```bash
git add src/joto_archive/storage.py tests/test_storage.py
git commit -m "feat: write stable archive outputs and manifests"
```

### Task 8: End-to-end crawler orchestration

**Files:**
- Create: `src/joto_archive/crawler.py`
- Create: `tests/test_crawler.py`

**Interfaces:**
- Consumes: all previous modules
- Produces: `Crawler.run() -> CrawlSummary`
- Guarantees: excluded URLs never reach `HttpFetcher.get` or `BrowserRenderer.capture`

- [ ] **Step 1: Write an end-to-end exclusion safety test**

Create `tests/test_crawler.py`:

```python
from pathlib import Path
from unittest.mock import MagicMock

from joto_archive.config import load_config
from joto_archive.crawler import Crawler
from joto_archive.models import FetchResult, RenderedPage


def test_crawler_never_fetches_or_renders_excluded_page(tmp_path: Path) -> None:
    config = load_config(Path("config/jototech.json")).model_copy(update={"output_dir": tmp_path})
    sitemap = Path("tests/fixtures/sitemap.xml").read_bytes()
    navigation = Path("tests/fixtures/navigation.html").read_text(encoding="utf-8")
    article = Path("tests/fixtures/article.html").read_text(encoding="utf-8")
    fetcher = MagicMock()
    fetcher.get.side_effect = lambda url: FetchResult(
        requested_url=url,
        final_url=url,
        status_code=200,
        content_type="application/xml" if url.endswith("sitemap.xml") else "text/html",
        body=sitemap if url.endswith("sitemap.xml") else (navigation if url.endswith("/") else article).encode(),
        attempts=1,
    )
    renderer = MagicMock()
    renderer.capture.side_effect = lambda url, page_id: RenderedPage(
        url=url,
        html=navigation if url.endswith("/") else article,
        desktop_screenshot=tmp_path / f"{page_id}-desktop.png",
        mobile_screenshot=tmp_path / f"{page_id}-mobile.png",
    )
    crawler = Crawler(config, fetcher, renderer)
    summary = crawler.run(max_pages=3)
    called_urls = [call.args[0] for call in fetcher.get.call_args_list]
    rendered_urls = [call.args[0] for call in renderer.capture.call_args_list]
    assert not any("dify" in url or "15197" in url for url in called_urls + rendered_urls)
    assert summary.excluded >= 2
    assert (tmp_path / "manifests/exclusions.csv").exists()
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_crawler.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.crawler`.

- [ ] **Step 3: Implement the single-worker crawl queue**

Create `src/joto_archive/crawler.py`:

```python
import time
from collections import deque
from pathlib import Path

from pydantic import BaseModel

from joto_archive.assets import AssetStore, asset_candidates
from joto_archive.config import CrawlConfig
from joto_archive.discovery import discover_links, parse_sitemap
from joto_archive.extract import extract_page
from joto_archive.fetch import BrowserRenderer, HttpFetcher
from joto_archive.models import AssetRecord, DiscoveredUrl, PageStatus
from joto_archive.storage import ArchiveWriter


class CrawlSummary(BaseModel):
    discovered: int
    captured: int
    excluded: int
    failed: int
    assets: int


class Crawler:
    def __init__(self, config: CrawlConfig, fetcher: HttpFetcher, renderer: BrowserRenderer):
        self.config = config
        self.fetcher = fetcher
        self.renderer = renderer
        self.writer = ArchiveWriter(Path(config.output_dir))
        self.asset_store = AssetStore(Path(config.output_dir), fetcher)

    def run(self, max_pages: int | None = None) -> CrawlSummary:
        sitemap_result = self.fetcher.get(self.config.sitemap_url)
        discovered = {item.url: item for item in parse_sitemap(sitemap_result.body, self.config)}
        queue = deque(item.url for item in discovered.values() if item.status is not PageStatus.EXCLUDED_AI)
        seen: set[str] = set()
        captured = failed = 0
        all_assets: list[AssetRecord] = []
        while queue and (max_pages is None or captured + failed < max_pages):
            url = queue.popleft()
            if url in seen:
                continue
            seen.add(url)
            item = discovered[url]
            if item.status in {PageStatus.EXCLUDED_AI, PageStatus.EXTERNAL, PageStatus.RESOURCE}:
                continue
            try:
                provisional_id = f"capture-{abs(hash(url)):x}"
                rendered = self.renderer.capture(url, provisional_id)
                page = extract_page(rendered.html, url, item.status)
                links = discover_links(rendered.html, url, self.config)
                for link in links:
                    current = discovered.get(link.url)
                    if current is None or (current.status is PageStatus.ARCHIVED and link.status is PageStatus.ACTIVE):
                        discovered[link.url] = link
                    if link.status not in {PageStatus.EXCLUDED_AI, PageStatus.EXTERNAL, PageStatus.RESOURCE} and link.url not in seen:
                        queue.append(link.url)
                page.internal_links = [link.url for link in links if link.status not in {PageStatus.EXTERNAL, PageStatus.EXCLUDED_AI, PageStatus.RESOURCE}]
                page.external_links = [link.url for link in links if link.status is PageStatus.EXTERNAL]
                records = self.asset_store.archive(asset_candidates(rendered.html, url), page.id)
                page.assets = [record.asset_id for record in records]
                all_assets.extend(record for record in records if record not in all_assets)
                self.writer.write_page(page, rendered.html)
                captured += 1
            except Exception as error:
                item.status = PageStatus.ERROR
                item.exclusion_rule = f"capture-error:{type(error).__name__}:{error}"
                failed += 1
            time.sleep(self.config.request_delay_seconds)
        self.writer.write_urls(list(discovered.values()))
        self.writer.write_assets(list(self.asset_store.by_hash.values()))
        return CrawlSummary(
            discovered=len(discovered),
            captured=captured,
            excluded=sum(item.status is PageStatus.EXCLUDED_AI for item in discovered.values()),
            failed=failed,
            assets=len(self.asset_store.by_hash),
        )
```

- [ ] **Step 4: Run crawler tests**

Run: `.venv/bin/pytest tests/test_crawler.py -v`

Expected: 1 passed and neither excluded URL appears in mocked fetch/render calls.

- [ ] **Step 5: Commit orchestration**

```bash
git add src/joto_archive/crawler.py tests/test_crawler.py
git commit -m "feat: orchestrate read-only site capture"
```

### Task 9: Qifeiye coverage hardening and complete audit indexes

**Files:**
- Create: `src/joto_archive/issues.py`
- Create: `tests/fixtures/qifeiye-content.html`
- Create: `tests/test_coverage.py`
- Modify: `src/joto_archive/models.py`
- Modify: `src/joto_archive/discovery.py`
- Modify: `src/joto_archive/fetch.py`
- Modify: `src/joto_archive/extract.py`
- Modify: `src/joto_archive/assets.py`
- Modify: `src/joto_archive/storage.py`
- Modify: `src/joto_archive/crawler.py`

**Interfaces:**
- Produces: `decode_goodq_url(url: str) -> str | None`
- Produces: `detect_content_issues(html: str) -> list[str]`
- Extends: `asset_candidates(html, page_url, loaded_resource_urls=())`
- Extends: `RenderedPage.resource_urls`
- Produces: `ArchiveWriter.write_audit_indexes(pages, urls, assets, crawl_errors)`

- [ ] **Step 1: Add a Qifeiye-shaped fixture with otherwise easy-to-miss content**

Create `tests/fixtures/qifeiye-content.html`:

```html
<!doctype html>
<html lang="en-US">
<head><title>Qifeiye Page</title><style>.hero{background-image:url('/uploads/hero-1024x512.jpg')}</style></head>
<body class="page page-id-7001">
<nav id="navigation"><ul><li><a href="#">Solutions</a><ul><li><a href="/?page_id=11105">Cisco Networking</a></li></ul></li></ul></nav>
<main id="content">
  <div class="qfy-text"><div><span>Text stored only inside nested divs.</span></div></div>
  <img src="/uploads/device-300x200.jpg" alt="Device">
  <a class="vc_btn3" href="/?page_id=5434">Learn more</a>
  <form><div class="iphorm-element-required"><label>Email<input name="email" type="text"></label></div><button type="submit">Submit</button></form>
  <a href="https://partner.example/manual.pdf">Manual PDF</a>
  <a href="mailto:sales@jototechglobal.com">sales@jotoglobal.com</a>
</main>
</body>
</html>
```

- [ ] **Step 2: Write failing coverage tests**

Create `tests/test_coverage.py`:

```python
import base64
from pathlib import Path

from joto_archive.assets import asset_candidates, decode_goodq_url
from joto_archive.config import load_config
from joto_archive.discovery import discover_links
from joto_archive.extract import extract_page
from joto_archive.issues import detect_content_issues
from joto_archive.models import PageStatus
from joto_archive.rules import title_exclusion_rule


HTML = Path("tests/fixtures/qifeiye-content.html").read_text(encoding="utf-8")
CONFIG = load_config(Path("config/jototech.json"))


def test_extracts_div_text_standalone_image_button_and_required_wrapper() -> None:
    page = extract_page(HTML, "https://www.jototech.cn/page", PageStatus.ARCHIVED)
    types = [block.type for block in page.blocks]
    assert "richText" in types
    assert "image" in types
    assert "button" in types
    assert page.form_fields[0].required is True


def test_discovers_nested_navigation_path() -> None:
    links = discover_links(HTML, CONFIG.base_url, CONFIG)
    cisco = next(item for item in links if "11105" in item.url)
    assert cisco.navigation_path == ["Solutions", "Cisco Networking"]


def test_decodes_goodq_cdn_origin_and_collects_background_document_and_loaded_image() -> None:
    original = "https://www.jototech.cn/qfy-content/uploads/2021/02/photo.jpg"
    encoded = base64.b64encode(original.encode()).decode().replace("=", "_p_p100_p_3D")
    cdn = f"https://cdn-s.goodq.top/caches/cache-key/{encoded}.jpg"
    assert decode_goodq_url(cdn) == original
    candidates = asset_candidates(HTML, CONFIG.base_url, [cdn])
    flattened = [url for candidate in candidates for url in candidate.urls]
    assert "https://www.jototech.cn/uploads/hero.jpg" in flattened
    assert "https://partner.example/manual.pdf" in flattened
    assert original in flattened


def test_flags_visible_email_and_mailto_conflict_without_changing_source() -> None:
    issues = detect_content_issues(HTML)
    assert issues == ["email mismatch: visible=sales@jotoglobal.com href=sales@jototechglobal.com"]


def test_title_preflight_excludes_opaque_ai_url_without_matching_navigation_text() -> None:
    html = '<html><head><title>JOTO | Dify Golden Partner</title></head><body><nav>JOTO AI Solution</nav></body></html>'
    assert title_exclusion_rule(html, CONFIG) == "title:dify"
    assert title_exclusion_rule(HTML, CONFIG) is None
```

- [ ] **Step 3: Run coverage tests and verify the missing behaviors**

Run: `.venv/bin/pytest tests/test_coverage.py -v`

Expected: FAIL because the initial implementations do not decode GoodQ URLs, capture nested div text, retain loaded resource URLs, or generate content issues.

- [ ] **Step 4: Extend rendered-page evidence with loaded resource URLs**

Add this field to `RenderedPage` in `src/joto_archive/models.py`:

```python
    resource_urls: list[str] = Field(default_factory=list)
```

Replace `BrowserRenderer._capture_viewport` and update `capture` in `src/joto_archive/fetch.py` with:

```python
    def _capture_viewport(self, url: str, path: Path, viewport: tuple[int, int]) -> tuple[str, list[str], list[str]]:
        assert self.browser is not None
        page = self.browser.new_page(viewport={"width": viewport[0], "height": viewport[1]})
        errors: list[str] = []
        page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
        page.goto(url, wait_until="networkidle", timeout=int(self.config.request_timeout_seconds * 1000))
        resources = page.evaluate("Array.from(performance.getEntriesByType('resource'), entry => entry.name)")
        page.screenshot(path=str(path), full_page=True)
        html = page.content()
        page.close()
        return html, errors, list(dict.fromkeys(resources))

    def capture(self, url: str, page_id: str) -> RenderedPage:
        desktop = self.output_dir / "screenshots" / "desktop" / f"{page_id}.png"
        mobile = self.output_dir / "screenshots" / "mobile" / f"{page_id}.png"
        desktop.parent.mkdir(parents=True, exist_ok=True)
        mobile.parent.mkdir(parents=True, exist_ok=True)
        html, desktop_errors, desktop_resources = self._capture_viewport(url, desktop, self.config.desktop_viewport)
        _, mobile_errors, mobile_resources = self._capture_viewport(url, mobile, self.config.mobile_viewport)
        return RenderedPage(
            url=url,
            html=html,
            desktop_screenshot=desktop,
            mobile_screenshot=mobile,
            console_errors=desktop_errors + mobile_errors,
            resource_urls=list(dict.fromkeys(desktop_resources + mobile_resources)),
        )
```

- [ ] **Step 5: Enforce pacing between every public HTTP request**

In `HttpFetcher.__init__` add:

```python
        self._has_requested = False
```

At the beginning of every attempt inside `HttpFetcher.get`, before `self.client.get(url)`, use:

```python
            if self._has_requested:
                self.sleep(self.config.request_delay_seconds)
            self._has_requested = True
```

Replace `HttpFetcher.get` with:

```python
    def get(self, url: str) -> FetchResult:
        last_response: httpx.Response | None = None
        last_error: httpx.RequestError | None = None
        for attempt in range(1, self.config.max_retries + 1):
            if self._has_requested:
                self.sleep(self.config.request_delay_seconds)
            self._has_requested = True
            try:
                response = self.client.get(url)
            except httpx.RequestError as error:
                last_error = error
                continue
            last_response = response
            if response.status_code < 500:
                return FetchResult(
                    requested_url=url,
                    final_url=str(response.url),
                    status_code=response.status_code,
                    content_type=response.headers.get("content-type", "application/octet-stream"),
                    body=response.content,
                    attempts=attempt,
                )
        if last_response is not None:
            return FetchResult(
                requested_url=url,
                final_url=str(last_response.url),
                status_code=last_response.status_code,
                content_type=last_response.headers.get("content-type", "application/octet-stream"),
                body=last_response.content,
                attempts=self.config.max_retries,
            )
        assert last_error is not None
        raise last_error
```

In `tests/test_fetch.py`, replace the fetcher construction and add the final assertion:

```python
    delays: list[float] = []
    with HttpFetcher(CONFIG, sleep=delays.append) as fetcher:
        result = fetcher.get("https://www.jototech.cn/msp")
    assert any(delay >= 0.75 for delay in delays)
```

- [ ] **Step 6: Replace discovery with nested navigation-path extraction**

First add the title-only preflight classifier to `src/joto_archive/rules.py`:

```python
def title_exclusion_rule(html: str, config: CrawlConfig) -> str | None:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "lxml")
    candidates: list[str] = []
    if soup.title:
        candidates.append(soup.title.get_text(" ", strip=True))
    for meta in soup.select('meta[property="og:title"], meta[name="twitter:title"]'):
        candidates.append(meta.get("content", ""))
    title_text = " ".join(candidates).lower()
    for term in config.excluded_title_terms:
        if term.lower() in title_text:
            return f"title:{term}"
    return None
```

Replace `discover_links` in `src/joto_archive/discovery.py` with:

```python
def discover_links(html: str, page_url: str, config: CrawlConfig) -> list[DiscoveredUrl]:
    soup = BeautifulSoup(html, "lxml")
    found: dict[str, DiscoveredUrl] = {}
    navigation_anchors: set[int] = set()
    for navigation in soup.select("nav, #navigation"):
        for anchor in navigation.select("a[href]"):
            navigation_anchors.add(id(anchor))
            item = classify_url(anchor.get("href", ""), "navigation", config)
            item.discovered_from = page_url
            path: list[str] = []
            for item_node in reversed(anchor.find_parents("li")):
                direct_anchor = item_node.find("a", recursive=False)
                if direct_anchor:
                    label = direct_anchor.get_text(" ", strip=True)
                    if label and label not in path:
                        path.append(label)
            own_label = anchor.get_text(" ", strip=True)
            if own_label and own_label not in path:
                path.append(own_label)
            item.navigation_path = path
            found[item.url] = item
    for anchor in soup.select("a[href]"):
        if id(anchor) in navigation_anchors:
            continue
        item = classify_url(anchor.get("href", ""), "page-link", config)
        item.discovered_from = page_url
        found.setdefault(item.url, item)
    return list(found.values())
```

- [ ] **Step 7: Harden semantic extraction for Qifeiye markup**

In `src/joto_archive/extract.py`, replace `DIRECT_TAGS` and the candidate-flattening logic with:

```python
SEMANTIC_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "table", "figure", "img", "form", "blockquote", "button"}


def _content_nodes(root: Tag) -> list[Tag]:
    output: list[Tag] = []

    def visit(node: Tag) -> None:
        if node.name in SEMANTIC_TAGS:
            output.append(node)
            return
        if node.has_attr("data-custom-widget"):
            output.append(node)
            return
        if node.name == "a" and ("vc_btn3" in node.get("class", []) or node.get("role") == "button"):
            output.append(node)
            return
        children = [child for child in node.find_all(recursive=False) if isinstance(child, Tag)]
        block_children = [
            child
            for child in children
            if child.name in SEMANTIC_TAGS
            or child.name in {"div", "section", "article"}
            or child.find(list(SEMANTIC_TAGS))
        ]
        if node.name in {"div", "section", "article"} and node.get_text(" ", strip=True) and not block_children:
            output.append(node)
            return
        for child in block_children:
            visit(child)

    for child in root.find_all(recursive=False):
        if isinstance(child, Tag):
            visit(child)
    return output
```

Extend `_block` before its final `unknown` return:

```python
    if tag.name == "img":
        return Block(type="image", order=order, data={"url": urljoin(source_url, tag.get("src", "")), "alt": tag.get("alt", ""), "title": tag.get("title", ""), "caption": ""}), []
    if tag.name == "blockquote":
        return Block(type="quote", order=order, data={"text": tag.get_text(" ", strip=True)}), []
    if tag.name in {"a", "button"}:
        return Block(type="button", order=order, data={"text": tag.get_text(" ", strip=True), "url": urljoin(source_url, tag.get("href", ""))}), []
    if tag.name in {"div", "section", "article"} and not tag.has_attr("data-custom-widget"):
        return Block(type="richText", order=order, data={"text": tag.get_text(" ", strip=True), "html": tag.decode_contents()}), []
```

Replace the existing `candidates`/`flattened` construction in `extract_page` with:

```python
    flattened = _content_nodes(root)
```

Replace `_page_id` so that two public aliases of the same CMS page cannot overwrite each other's evidence files:

```python
def _page_id(source_url: str, soup: BeautifulSoup) -> tuple[str, str | None]:
    body_classes = " ".join(soup.body.get("class", [])) if soup.body else ""
    match = re.search(r"page-id-(\d+)", body_classes)
    query_id = parse_qs(urlsplit(source_url).query).get("page_id", [None])[0]
    source_id = match.group(1) if match else query_id
    source_label = source_id or "url"
    url_digest = hashlib.sha256(source_url.encode()).hexdigest()[:10]
    return f"page-{source_label}-{url_digest}", source_id
```

In `_form_fields`, replace the `required=` expression with:

```python
            required=element.has_attr("required") or any(
                "required" in " ".join(parent.get("class", []))
                for parent in element.find_parents(limit=4)
            ),
```

Extend `page_to_markdown` with:

```python
        elif block.type in {"richText", "quote"}:
            prefix = "> " if block.type == "quote" else ""
            output.append(prefix + block.data["text"])
        elif block.type == "button":
            output.append(f"[{block.data['text']}]({block.data['url']})")
```

- [ ] **Step 8: Add GoodQ decoding, CSS backgrounds, documents, and browser-loaded assets**

In `src/joto_archive/assets.py`, add imports `base64` and `binascii`, then add:

```python
DOWNLOAD_EXTENSIONS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".zip", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}
CSS_URL = re.compile(r"url\([\"']?([^\"')]+)")


def decode_goodq_url(url: str) -> str | None:
    parts = urlsplit(url)
    if not parts.hostname or not parts.hostname.endswith("goodq.top"):
        return None
    encoded_with_suffix = Path(parts.path).name
    encoded = encoded_with_suffix.rsplit(".", 1)[0].replace("_p_p100_p_3D", "=")
    try:
        decoded = base64.b64decode(encoded).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError):
        return None
    return decoded if decoded.startswith(("http://", "https://")) else None
```

Replace `asset_candidates` with:

```python
def asset_candidates(html: str, page_url: str, loaded_resource_urls: list[str] | None = None) -> list[AssetCandidate]:
    soup = BeautifulSoup(html, "lxml")
    output: list[AssetCandidate] = []

    def ranked_urls(values: list[tuple[int, str]]) -> list[str]:
        expanded: list[tuple[int, str]] = []
        for width, raw in values:
            absolute = urljoin(page_url, raw)
            decoded = decode_goodq_url(absolute)
            if decoded:
                expanded.append((30_000_000, decoded))
            original = _original_variant(absolute)
            expanded.append((20_000_000 if original != absolute else 10_000_000 + width, original))
            expanded.append((width, absolute))
        return list(dict.fromkeys(url for _, url in sorted(expanded, reverse=True)))

    for image in soup.select("img"):
        values: list[tuple[int, str]] = []
        for item in image.get("srcset", "").split(","):
            pieces = item.strip().split()
            if pieces:
                width = int(pieces[1][:-1]) if len(pieces) > 1 and pieces[1].endswith("w") else 0
                values.append((width, pieces[0]))
        values.extend((0, image[attr]) for attr in ("data-original", "data-src", "src") if image.get(attr))
        urls = ranked_urls(values)
        if urls:
            output.append(AssetCandidate(urls=urls, alt=image.get("alt", ""), title=image.get("title", ""), usage="content-image", source_position=f"img[{image_index}]"))
    style_text = "\n".join(tag.get_text() for tag in soup.select("style")) + "\n" + "\n".join(tag.get("style", "") for tag in soup.select("[style]"))
    for background_index, raw in enumerate(CSS_URL.findall(style_text)):
        output.append(AssetCandidate(urls=ranked_urls([(0, raw)]), usage="css-background", source_position=f"background[{background_index}]"))
    for anchor_index, anchor in enumerate(soup.select("a[href]")):
        href = urljoin(page_url, anchor.get("href", ""))
        if Path(urlsplit(href).path).suffix.lower() in DOWNLOAD_EXTENSIONS:
            output.append(AssetCandidate(urls=ranked_urls([(0, href)]), title=anchor.get_text(" ", strip=True), usage="download-link", source_position=f"a[{anchor_index}]"))
    for resource_index, resource in enumerate(loaded_resource_urls or []):
        decoded = decode_goodq_url(resource)
        candidate_url = decoded or resource
        if Path(urlsplit(candidate_url).path).suffix.lower() in DOWNLOAD_EXTENSIONS:
            output.append(AssetCandidate(urls=ranked_urls([(0, resource)]), usage="browser-loaded-resource", source_position=f"performance[{resource_index}]"))
    unique: dict[tuple[str, ...], AssetCandidate] = {}
    for candidate in output:
        unique.setdefault(tuple(candidate.urls), candidate)
    return list(unique.values())
```

- [ ] **Step 9: Add objective content-conflict detection**

Create `src/joto_archive/issues.py`:

```python
import re

from bs4 import BeautifulSoup


EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)


def detect_content_issues(html: str) -> list[str]:
    soup = BeautifulSoup(html, "lxml")
    issues: list[str] = []
    for anchor in soup.select('a[href^="mailto:"]'):
        href = anchor.get("href", "").removeprefix("mailto:").split("?", 1)[0].strip().lower()
        visible_match = EMAIL.search(anchor.get_text(" ", strip=True))
        if visible_match and visible_match.group(0).lower() != href:
            issues.append(f"email mismatch: visible={visible_match.group(0)} href={href}")
    for anchor in soup.select('a[href^="tel:"]'):
        href = re.sub(r"\D", "", anchor.get("href", ""))
        visible = re.sub(r"\D", "", anchor.get_text(" ", strip=True))
        if visible and href and visible != href:
            issues.append(f"phone mismatch: visible={visible} href={href}")
    return issues
```

Assign issues after extraction using the exact statement:

```python
                page.issues = detect_content_issues(rendered.html)
```

Spelling, grammar, outdated years, and ambiguous company details remain manual-review items and must not be automatically rewritten.

- [ ] **Step 10: Write all audit indexes and navigation data**

Add this method to `ArchiveWriter` in `src/joto_archive/storage.py`:

```python
    def write_audit_indexes(self, pages: list[PageRecord], crawl_errors: list[dict[str, str]]) -> None:
        internal = [{"source_url": page.source_url, "target_url": target} for page in pages for target in page.internal_links]
        external = [{"source_url": page.source_url, "target_url": target} for page in pages for target in page.external_links]
        issues = [{"source_url": page.source_url, "issue": issue} for page in pages for issue in page.issues]
        counts = [{
            "page_id": page.id,
            "source_url": page.source_url,
            "headings": sum(block.type == "heading" for block in page.blocks),
            "paragraphs": sum(block.type in {"paragraph", "richText"} for block in page.blocks),
            "lists": sum(block.type == "list" for block in page.blocks),
            "list_items": sum(len(block.data.get("items", [])) for block in page.blocks if block.type == "list"),
            "tables": sum(block.type == "table" for block in page.blocks),
            "images": sum(block.type in {"image", "gallery"} for block in page.blocks),
            "buttons": sum(block.type == "button" for block in page.blocks),
            "downloads": len(page.download_links),
            "forms": len(page.form_fields),
        } for page in pages]
        self._write_csv(self.output_dir / "manifests/internal-links.csv", ["source_url", "target_url"], internal)
        self._write_csv(self.output_dir / "manifests/external-links.csv", ["source_url", "target_url"], external)
        self._write_csv(self.output_dir / "manifests/content-issues.csv", ["source_url", "issue"], issues)
        self._write_csv(self.output_dir / "manifests/crawl-errors.csv", ["url", "error_type", "message"], crawl_errors)
        self._write_csv(self.output_dir / "manifests/content-counts.csv", ["page_id", "source_url", "headings", "paragraphs", "lists", "list_items", "tables", "images", "buttons", "downloads", "forms"], counts)
        navigation = [
            {"url": page.source_url, "path": page.navigation_path}
            for page in pages
            if page.status is PageStatus.ACTIVE and page.navigation_path
        ]
        self._atomic_text(self.output_dir / "navigation.json", json.dumps(navigation, ensure_ascii=False, indent=2))
        site = {"page_count": len(pages), "active_count": sum(page.status is PageStatus.ACTIVE for page in pages), "archived_count": sum(page.status is PageStatus.ARCHIVED for page in pages), "duplicate_count": sum(page.status is PageStatus.DUPLICATE for page in pages)}
        self._atomic_text(self.output_dir / "site-manifest.json", json.dumps(site, ensure_ascii=False, indent=2))
```

- [ ] **Step 11: Harden crawler evidence, duplicate handling, and screenshot names**

Replace the relevant import block in `src/joto_archive/crawler.py` with:

```python
import hashlib
from collections import deque
from pathlib import Path
from urllib.parse import urlsplit

from pydantic import BaseModel

from joto_archive.assets import AssetStore, asset_candidates
from joto_archive.config import CrawlConfig
from joto_archive.discovery import discover_links, parse_sitemap
from joto_archive.extract import extract_page
from joto_archive.fetch import BrowserRenderer, HttpFetcher
from joto_archive.issues import detect_content_issues
from joto_archive.models import AssetRecord, DiscoveredUrl, PageRecord, PageStatus
from joto_archive.rules import RESOURCE_EXTENSIONS, title_exclusion_rule
from joto_archive.storage import ArchiveWriter
```

Then replace `Crawler.run` with:

```python
    def run(self, max_pages: int | None = None) -> CrawlSummary:
        sitemap_result = self.fetcher.get(self.config.sitemap_url)
        discovered = {item.url: item for item in parse_sitemap(sitemap_result.body, self.config)}
        queue = deque(item.url for item in discovered.values() if item.status not in {PageStatus.EXCLUDED_AI, PageStatus.EXTERNAL, PageStatus.RESOURCE})
        seen: set[str] = set()
        pages: list[PageRecord] = []
        raw_html_by_page: dict[str, str] = {}
        by_content_hash: dict[str, PageRecord] = {}
        crawl_errors: list[dict[str, str]] = []
        captured = failed = 0
        while queue and (max_pages is None or captured + failed < max_pages):
            url = queue.popleft()
            if url in seen:
                continue
            seen.add(url)
            item = discovered[url]
            if item.status in {PageStatus.EXCLUDED_AI, PageStatus.EXTERNAL, PageStatus.RESOURCE}:
                continue
            try:
                fetched = self.fetcher.get(url)
                if fetched.status_code >= 400:
                    item.status = PageStatus.UNREACHABLE
                    raise RuntimeError(f"HTTP {fetched.status_code}")
                raw_html = fetched.body.decode("utf-8", errors="replace")
                title_rule = title_exclusion_rule(raw_html, self.config)
                if title_rule:
                    item.status = PageStatus.EXCLUDED_AI
                    item.exclusion_rule = title_rule
                    continue
                capture_id = f"capture-{hashlib.sha256(url.encode()).hexdigest()[:12]}"
                rendered = self.renderer.capture(url, capture_id)
                page = extract_page(rendered.html, url, item.status)
                page.navigation_path = item.navigation_path
                page.issues = detect_content_issues(rendered.html)
                for kind, source in (("desktop", rendered.desktop_screenshot), ("mobile", rendered.mobile_screenshot)):
                    target = Path(self.config.output_dir) / "screenshots" / kind / f"{page.id}.png"
                    target.parent.mkdir(parents=True, exist_ok=True)
                    if source.exists() and source != target:
                        source.replace(target)
                links = discover_links(rendered.html, url, self.config)
                for link in links:
                    current = discovered.get(link.url)
                    if current is None or (current.status is PageStatus.ARCHIVED and link.status is PageStatus.ACTIVE):
                        discovered[link.url] = link
                    if link.status not in {PageStatus.EXCLUDED_AI, PageStatus.EXTERNAL, PageStatus.RESOURCE} and link.url not in seen:
                        queue.append(link.url)
                page.internal_links = [link.url for link in links if link.status not in {PageStatus.EXTERNAL, PageStatus.EXCLUDED_AI, PageStatus.RESOURCE}]
                page.external_links = [link.url for link in links if link.status is PageStatus.EXTERNAL]
                page.download_links = [
                    link.url
                    for link in links
                    if link.status is PageStatus.RESOURCE
                    or (
                        link.status is PageStatus.EXTERNAL
                        and any(urlsplit(link.url).path.lower().endswith(extension) for extension in RESOURCE_EXTENSIONS)
                    )
                ]
                records = self.asset_store.archive(asset_candidates(rendered.html, url, rendered.resource_urls), page.id)
                page.assets = [record.asset_id for record in records]
                canonical = by_content_hash.get(page.content_hash)
                if canonical and canonical.source_url != page.source_url:
                    page.status = PageStatus.DUPLICATE
                    if page.source_url not in canonical.source_aliases:
                        canonical.source_aliases.append(page.source_url)
                else:
                    by_content_hash[page.content_hash] = page
                pages.append(page)
                raw_html_by_page[page.id] = raw_html
                captured += 1
            except Exception as error:
                if item.status is not PageStatus.UNREACHABLE:
                    item.status = PageStatus.ERROR
                crawl_errors.append({"url": url, "error_type": type(error).__name__, "message": str(error)})
                failed += 1
        for page in pages:
            self.writer.write_page(page, raw_html_by_page[page.id])
        self.writer.write_urls(list(discovered.values()))
        self.writer.write_assets(list(self.asset_store.by_hash.values()))
        self.writer.write_asset_failures(self.asset_store.failures)
        self.writer.write_audit_indexes(pages, crawl_errors)
        return CrawlSummary(
            discovered=len(discovered),
            captured=captured,
            excluded=sum(item.status is PageStatus.EXCLUDED_AI for item in discovered.values()),
            failed=failed,
            assets=len(self.asset_store.by_hash),
        )
```

- [ ] **Step 12: Run the complete coverage test set**

Run:

```bash
.venv/bin/pytest tests/test_fetch.py tests/test_discovery.py tests/test_extract.py tests/test_assets.py tests/test_storage.py tests/test_crawler.py tests/test_coverage.py -v
```

Expected: all tests pass, the Qifeiye-only text is present, GoodQ origin decoding returns the original upload URL, external documents and CSS backgrounds are candidates, every request is paced, and AI/Dify URLs are never fetched or rendered.

- [ ] **Step 13: Commit coverage hardening**

```bash
git add src/joto_archive tests/fixtures/qifeiye-content.html tests/test_coverage.py
git commit -m "feat: harden Qifeiye coverage and audit manifests"
```

### Task 10: Validation and human-readable reports

**Files:**
- Create: `src/joto_archive/validate.py`
- Create: `src/joto_archive/reports.py`
- Create: `tests/test_validate.py`

**Interfaces:**
- Consumes: completed `content-archive/`
- Produces: `validate_archive(output_dir: Path) -> ValidationResult`
- Produces: `write_reports(output_dir: Path, result: ValidationResult) -> None`

- [ ] **Step 1: Write failing completeness tests**

Create `tests/test_validate.py`:

```python
import csv
from pathlib import Path

from joto_archive.validate import validate_archive


def write_urls(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["url", "source", "discovered_from", "status", "exclusion_rule"])
        writer.writeheader()
        writer.writerows(rows)


def test_validation_reports_missing_page_outputs_and_accepts_exclusion(tmp_path: Path) -> None:
    write_urls(tmp_path / "manifests/urls.csv", [
        {"url": "https://www.jototech.cn/article", "source": "sitemap", "discovered_from": "", "status": "archived", "exclusion_rule": ""},
        {"url": "https://www.jototech.cn/dify", "source": "sitemap", "discovered_from": "", "status": "excluded-ai", "exclusion_rule": "term:dify"},
    ])
    result = validate_archive(tmp_path)
    assert result.total_urls == 2
    assert result.excluded_urls == 1
    assert "missing page output for https://www.jototech.cn/article" in result.errors


def test_validation_requires_all_page_companions(tmp_path: Path) -> None:
    write_urls(tmp_path / "manifests/urls.csv", [
        {"url": "https://www.jototech.cn/article", "source": "sitemap", "discovered_from": "", "status": "archived", "exclusion_rule": ""},
    ])
    pages = tmp_path / "pages"
    pages.mkdir()
    (pages / "page-1.json").write_text(json.dumps({"id": "page-1", "source_url": "https://www.jototech.cn/article", "blocks": [{"type": "paragraph"}]}), encoding="utf-8")
    result = validate_archive(tmp_path)
    assert "missing companion pages/page-1.md" in result.errors
    assert "missing companion pages/page-1.html" in result.errors
    assert "missing companion screenshots/desktop/page-1.png" in result.errors
    assert "missing companion screenshots/mobile/page-1.png" in result.errors
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_validate.py -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.validate`.

- [ ] **Step 3: Implement validation and reports**

Create `src/joto_archive/validate.py`:

```python
import csv
import hashlib
import json
from pathlib import Path

from pydantic import BaseModel


class ValidationResult(BaseModel):
    total_urls: int
    excluded_urls: int
    captured_pages: int
    verified_assets: int
    errors: list[str]
    warnings: list[str]


def validate_archive(output_dir: Path) -> ValidationResult:
    urls_path = output_dir / "manifests/urls.csv"
    with urls_path.open(encoding="utf-8-sig", newline="") as handle:
        urls = list(csv.DictReader(handle))
    page_jsons = list((output_dir / "pages").glob("*.json")) if (output_dir / "pages").exists() else []
    pages = [json.loads(path.read_text(encoding="utf-8")) for path in page_jsons]
    by_url = {page["source_url"]: page for page in pages}
    errors: list[str] = []
    warnings: list[str] = []
    for item in urls:
        if item["status"] in {"active", "archived", "duplicate"}:
            page = by_url.get(item["url"])
            if page is None:
                errors.append(f"missing page output for {item['url']}")
                continue
            page_id = page["id"]
            for relative in (
                Path("pages") / f"{page_id}.md",
                Path("pages") / f"{page_id}.html",
                Path("screenshots/desktop") / f"{page_id}.png",
                Path("screenshots/mobile") / f"{page_id}.png",
            ):
                if not (output_dir / relative).exists():
                    errors.append(f"missing companion {relative}")
            if not page.get("blocks"):
                warnings.append(f"page has no semantic blocks {item['url']}")
        if item["status"] == "excluded-ai" and item["url"] in by_url:
            errors.append(f"excluded URL has page output {item['url']}")
    required_indexes = (
        "manifests/exclusions.csv",
        "manifests/internal-links.csv",
        "manifests/external-links.csv",
        "manifests/content-issues.csv",
        "manifests/crawl-errors.csv",
        "manifests/content-counts.csv",
        "manifests/asset-errors.csv",
        "navigation.json",
        "site-manifest.json",
    )
    for relative in required_indexes:
        if not (output_dir / relative).exists():
            warnings.append(f"audit index missing {relative}")
    verified_assets = 0
    assets_path = output_dir / "manifests/assets.csv"
    if assets_path.exists():
        with assets_path.open(encoding="utf-8-sig", newline="") as handle:
            for asset in csv.DictReader(handle):
                path = output_dir / asset["relative_path"]
                if not path.exists():
                    errors.append(f"missing asset {asset['asset_id']}")
                    continue
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                if digest != asset["sha256"]:
                    errors.append(f"checksum mismatch {asset['asset_id']}")
                    continue
                verified_assets += 1
                if asset["mime_type"].startswith("image/") and (not asset["width"] or not asset["height"]):
                    warnings.append(f"image dimensions missing {asset['asset_id']}")
    return ValidationResult(
        total_urls=len(urls),
        excluded_urls=sum(item["status"] == "excluded-ai" for item in urls),
        captured_pages=len(pages),
        verified_assets=verified_assets,
        errors=errors,
        warnings=warnings,
    )
```

Create `src/joto_archive/reports.py`:

```python
from pathlib import Path

from joto_archive.validate import ValidationResult


def write_reports(output_dir: Path, result: ValidationResult) -> None:
    reports = output_dir / "reports"
    reports.mkdir(parents=True, exist_ok=True)
    completeness = [
        "# Content Archive Completeness Report",
        "",
        f"- Discovered URLs: {result.total_urls}",
        f"- Excluded AI/Dify URLs: {result.excluded_urls}",
        f"- Captured pages: {result.captured_pages}",
        f"- Verified assets: {result.verified_assets}",
        f"- Errors: {len(result.errors)}",
        f"- Warnings: {len(result.warnings)}",
        "",
        "## Errors",
        *(f"- {item}" for item in result.errors),
        "",
        "## Warnings",
        *(f"- {item}" for item in result.warnings),
    ]
    (reports / "completeness-report.md").write_text("\n".join(completeness) + "\n", encoding="utf-8")
    crawl_errors = output_dir / "manifests/crawl-errors.csv"
    crawl_lines = ["# Crawl Report", ""]
    if crawl_errors.exists():
        import csv
        with crawl_errors.open(encoding="utf-8-sig", newline="") as handle:
            rows = list(csv.DictReader(handle))
        crawl_lines.append(f"- Final crawl errors: {len(rows)}")
        crawl_lines.extend(f"- {row['url']}: {row['error_type']} — {row['message']}" for row in rows)
    else:
        crawl_lines.append("- Crawl error manifest is missing.")
    (reports / "crawl-report.md").write_text("\n".join(crawl_lines) + "\n", encoding="utf-8")
    assets = output_dir / "manifests/assets.csv"
    image_lines = ["# Image Quality Report", ""]
    if assets.exists():
        import csv
        with assets.open(encoding="utf-8-sig", newline="") as handle:
            images = [row for row in csv.DictReader(handle) if row["mime_type"].startswith("image/")]
        image_lines.append(f"- Archived images: {len(images)}")
        image_lines.extend(
            f"- {row['asset_id']}: {row['width']}×{row['height']} px; {row['quality_note']}; {row['final_url']}"
            for row in images
        )
    else:
        image_lines.append("- Asset manifest is missing.")
    (reports / "image-quality-report.md").write_text("\n".join(image_lines) + "\n", encoding="utf-8")
```

- [ ] **Step 4: Run validation tests**

Run: `.venv/bin/pytest tests/test_validate.py -v`

Expected: 2 passed.

- [ ] **Step 5: Commit validation**

```bash
git add src/joto_archive/validate.py src/joto_archive/reports.py tests/test_validate.py
git commit -m "feat: reconcile archive completeness and checksums"
```

### Task 11: CLI, operating documentation, and controlled production run

**Files:**
- Create: `src/joto_archive/cli.py`
- Create: `README.md`
- Modify: `tests/test_crawler.py`

**Interfaces:**
- Consumes: `config/jototech.json`
- Produces: `joto-archive crawl --config ...`, `joto-archive validate --config ...`, and `joto-archive report --config ...`

- [ ] **Step 1: Add a CLI smoke assertion to the crawler test**

Append to `tests/test_crawler.py`:

```python
def test_cli_parser_exposes_only_read_only_commands() -> None:
    from joto_archive.cli import build_parser

    parser = build_parser()
    assert parser.parse_args(["crawl"]).command == "crawl"
    assert parser.parse_args(["validate"]).command == "validate"
    assert parser.parse_args(["report"]).command == "report"
```

- [ ] **Step 2: Run the test and verify failure**

Run: `.venv/bin/pytest tests/test_crawler.py::test_cli_parser_exposes_only_read_only_commands -v`

Expected: FAIL with `ModuleNotFoundError: joto_archive.cli`.

- [ ] **Step 3: Implement the CLI**

Create `src/joto_archive/cli.py`:

```python
import argparse
from pathlib import Path

from joto_archive.config import load_config
from joto_archive.crawler import Crawler
from joto_archive.fetch import BrowserRenderer, HttpFetcher
from joto_archive.reports import write_reports
from joto_archive.validate import validate_archive


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="joto-archive")
    parser.add_argument("command", choices=["crawl", "validate", "report"])
    parser.add_argument("--config", type=Path, default=Path("config/jototech.json"))
    parser.add_argument("--max-pages", type=int)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    config = load_config(args.config)
    output = Path(config.output_dir)
    if args.command == "crawl":
        with HttpFetcher(config) as fetcher, BrowserRenderer(config, output) as renderer:
            summary = Crawler(config, fetcher, renderer).run(max_pages=args.max_pages)
        print(summary.model_dump_json(indent=2))
        return
    result = validate_archive(output)
    if args.command == "report":
        write_reports(output, result)
    print(result.model_dump_json(indent=2))
    if result.errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Document exact safe operating procedure**

Create `README.md`:

```markdown
# JOTOTECH Content Archive

Read-only public-content archiver for the authorized JOTOTECH migration project.

## Install

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -e '.[test]'
.venv/bin/playwright install chromium
```

## Test

```bash
.venv/bin/pytest -v
```

## Controlled crawl sequence

Run a three-page smoke crawl first:

```bash
.venv/bin/joto-archive crawl --config config/jototech.json --max-pages 3
.venv/bin/joto-archive validate --config config/jototech.json
.venv/bin/joto-archive report --config config/jototech.json
```

Inspect `content-archive/manifests/exclusions.csv` before the full run. It must include the known JOTO AI page ID and Dify slugs, and excluded URLs must not have page JSON, HTML, Markdown, or screenshots.

After the smoke archive is approved, run:

```bash
.venv/bin/joto-archive crawl --config config/jototech.json
.venv/bin/joto-archive validate --config config/jototech.json
.venv/bin/joto-archive report --config config/jototech.json
```

Do not submit forms or reuse the old Agify/iPhorm configuration. Review `content-archive/reports/completeness-report.md`, every CSV manifest, the desktop/mobile screenshots, and every item reported as unreachable or erroneous before accepting the archive.
```

- [ ] **Step 5: Run all unit tests**

Run: `.venv/bin/pytest -v`

Expected: all tests pass; no test makes an unmocked request except the separately documented Playwright smoke capture.

- [ ] **Step 6: Run the controlled three-page crawl**

Run:

```bash
.venv/bin/joto-archive crawl --config config/jototech.json --max-pages 3
.venv/bin/joto-archive validate --config config/jototech.json
.venv/bin/joto-archive report --config config/jototech.json
```

Expected:

- The CLI prints a crawl summary.
- `content-archive/manifests/urls.csv` exists.
- `content-archive/manifests/exclusions.csv` contains page ID `15197` and Dify URLs discovered in the Sitemap.
- There are no page files or screenshots for excluded URLs.
- The completeness report contains no missing-output errors for the three processed non-excluded pages.

- [ ] **Step 7: Review the smoke archive before full production capture**

Inspect:

```bash
sed -n '1,120p' content-archive/manifests/exclusions.csv
sed -n '1,200p' content-archive/reports/completeness-report.md
find content-archive/pages -maxdepth 1 -type f | sort
find content-archive/screenshots -type f | sort
```

Expected: exclusion rules are correct, each processed page has `.json`, `.md`, `.html`, desktop screenshot, and mobile screenshot, and no AI/Dify body was archived.

- [ ] **Step 8: Run the full production capture and validation**

Run:

```bash
.venv/bin/joto-archive crawl --config config/jototech.json
.venv/bin/joto-archive validate --config config/jototech.json
.venv/bin/joto-archive report --config config/jototech.json
```

Expected: every discovered URL has a final status; every allowed accessible page has all required outputs; every resource is downloaded or explicitly reported; validation exits with code 0 only when no completeness errors remain.

- [ ] **Step 9: Commit the CLI and documentation**

```bash
git add src/joto_archive/cli.py tests/test_crawler.py README.md
git commit -m "feat: deliver verified content archive workflow"
```

- [ ] **Step 10: Tag the accepted archive tooling release**

Run:

```bash
git tag -a content-archive-tool-v0.1.0 -m "JOTOTECH content archive tooling v0.1.0"
git status --short
```

Expected: the tag is created and `git status --short` is empty. The generated `content-archive/` should be committed separately only if the user confirms that potentially large binary artifacts belong in Git; otherwise deliver it outside Git with its manifests and SHA-256 checksums.
