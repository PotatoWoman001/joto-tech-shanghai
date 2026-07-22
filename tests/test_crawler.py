from __future__ import annotations

import io
import json
from pathlib import Path

from PIL import Image
import pytest

from joto_archive.config import CrawlConfig, load_config
from joto_archive.crawler import ArchiveCrawler
from joto_archive.fetch import CaptchaDetectedError
from joto_archive.models import (
    DiscoveredUrl,
    FetchResult,
    PageStatus,
    RenderedPage,
)
from joto_archive.rules import classify_url
from joto_archive.storage import RunStorage
from joto_archive.validate import validate_run
from joto_archive.validate import validate_run


def _config(tmp_path: Path) -> CrawlConfig:
    source = Path(__file__).parents[1] / "config" / "jototech.json"
    return load_config(source).model_copy(update={"output_dir": tmp_path})


def _png() -> bytes:
    output = io.BytesIO()
    Image.new("RGB", (8, 8), "blue").save(output, format="PNG")
    return output.getvalue()


def _result(
    requested: str,
    body: bytes,
    *,
    final: str | None = None,
    status: int = 200,
    content_type: str = "text/html; charset=utf-8",
    chain: list[str] | None = None,
) -> FetchResult:
    return FetchResult(
        requested_url=requested,
        final_url=final or requested,
        status_code=status,
        content_type=content_type,
        body=body,
        attempts=1,
        redirect_chain=chain or [requested, final or requested],
    )


class FakeFetcher:
    def __init__(self, responses: dict[str, FetchResult | Exception]) -> None:
        self.responses = responses
        self.calls: list[str] = []

    def get(self, url: str) -> FetchResult:
        self.calls.append(url)
        response = self.responses[url]
        if isinstance(response, Exception):
            raise response
        return response


class FakeRenderer:
    def __init__(self, root: Path, pages: dict[str, str]) -> None:
        self.root = root
        self.pages = pages
        self.calls: list[tuple[str, str]] = []

    def capture(self, url: str, page_id: str) -> RenderedPage:
        self.calls.append((url, page_id))
        desktop = self.root / f"{page_id}.desktop.png"
        mobile = self.root / f"{page_id}.mobile.png"
        desktop.parent.mkdir(parents=True, exist_ok=True)
        desktop.write_bytes(_png())
        mobile.write_bytes(_png())
        html = self.pages[url]
        return RenderedPage(
            url=url,
            html=html,
            mobile_html=html,
            desktop_screenshot=desktop,
            mobile_screenshot=mobile,
            resource_urls=[],
            blocked_requests=["POST https://www.jototech.cn/form [non-read-method:POST]"],
            redirect_chain=[url],
        )


def _manifest(run_dir: Path, name: str) -> object:
    return json.loads((run_dir / "manifests" / f"{name}.json").read_text(encoding="utf-8"))


def test_full_offline_crawl_closes_manifests_archives_assets_and_marks_duplicate(
    tmp_path: Path,
) -> None:
    config = _config(tmp_path)
    home = "https://www.jototech.cn/"
    history = "https://www.jototech.cn/history"
    image = "https://www.jototech.cn/uploads/photo.png"
    shared_main = f"""
      <main id="content">
        <h1>Infrastructure</h1><p>Preserved source copy.</p>
        <img src="{image}" alt="Clear original">
        <a href="https://www.jototech.cn/dify">Removed AI button</a>
      </main>
      <nav><a href="/history">History</a><a href="https://partner.example/about">Partner</a>
      <a href="/dify">AI</a></nav>
      <a href="tel:+86-100">+86 200</a>
    """
    home_html = f'<html lang="en"><head><title>Home</title><link rel="canonical" href="{home}"></head><body>{shared_main}</body></html>'
    history_html = f'<html lang="en"><head><title>History</title></head><body>{shared_main}</body></html>'
    fetcher = FakeFetcher(
        {
            home: _result(home, home_html.encode()),
            history: _result(history, history_html.encode()),
            image: _result(image, _png(), content_type="image/png"),
        }
    )
    renderer = FakeRenderer(tmp_path / "fake-render", {home: home_html, history: history_html})
    storage = RunStorage(tmp_path / "archive", "offline")
    crawler = ArchiveCrawler(config, storage, fetcher, renderer)

    outcome = crawler.run(
        [
            classify_url(home, "sitemap", config),
            classify_url(history, "sitemap", config),
        ]
    )

    assert len(outcome.pages) == 2
    duplicates = [page for page in outcome.pages if page.status is PageStatus.DUPLICATE]
    assert len(duplicates) == 1
    assert duplicates[0].duplicate_of in {page.id for page in outcome.pages}
    assert all("dify" not in page.model_dump_json().lower() for page in outcome.pages)
    assert all("Removed AI button" not in page.model_dump_json() for page in outcome.pages)
    assert all(page.assets for page in outcome.pages)
    assert fetcher.calls.count(image) == 1  # AssetStore response cache deduplicates the binary.
    assert "https://partner.example/about" not in fetcher.calls
    assert "https://www.jototech.cn/dify" not in fetcher.calls

    urls = _manifest(storage.run_dir, "urls")
    statuses = {row["url"]: row["status"] for row in urls}
    assert statuses[home] == "active"
    assert statuses[history] == "duplicate"
    assert statuses["https://partner.example/about"] == "external"
    assert statuses["https://www.jototech.cn/dify"] == "excluded-ai"
    assert _manifest(storage.run_dir, "assets")
    assert len(_manifest(storage.run_dir, "asset-references")) == 2
    assert _manifest(storage.run_dir, "content-issues")
    assert _manifest(storage.run_dir, "blocked-requests")

    for name in (
        "urls",
        "pages",
        "assets",
        "asset-references",
        "asset-candidates",
        "asset-errors",
        "crawl-errors",
        "baselines",
        "internal-links",
        "external-links",
        "download-links",
        "blocked-requests",
        "content-issues",
    ):
        assert (storage.run_dir / "manifests" / f"{name}.json").is_file()
        assert (storage.run_dir / "manifests" / f"{name}.csv").is_file()
    for page in outcome.pages:
        assert (storage.run_dir / "rendered" / f"{page.id}.desktop.html").stat().st_size
        assert (storage.run_dir / "rendered" / f"{page.id}.mobile.html").stat().st_size
        assert (storage.run_dir / "screenshots" / "desktop" / f"{page.id}.png").stat().st_size
        assert (storage.run_dir / "screenshots" / "mobile" / f"{page.id}.png").stat().st_size
    assert not (tmp_path / "archive" / "latest.json").exists()
    assert not (storage.run_dir / "run.json").exists()
    validation = validate_run(storage.run_dir, config.excluded_title_terms)
    assert validation.valid, validation.findings
    assert validate_run(storage.run_dir, config.excluded_terms).valid


@pytest.mark.parametrize(
    ("requested", "final", "chain", "head"),
    [
        (
            "https://www.jototech.cn/opaque",
            "https://www.jototech.cn/dify",
            ["https://www.jototech.cn/opaque", "https://www.jototech.cn/dify"],
            "",
        ),
        (
            "https://www.jototech.cn/opaque",
            "https://www.jototech.cn/opaque",
            ["https://www.jototech.cn/opaque"],
            '<link rel="canonical" href="/joto-ai-solution-2-2-2-2">',
        ),
        (
            "https://www.jototech.cn/opaque",
            "https://www.jototech.cn/opaque",
            ["https://www.jototech.cn/opaque"],
            '<meta property="og:url" content="https://www.jototech.cn/dify-2">',
        ),
    ],
)
def test_ai_found_in_final_redirect_canonical_or_og_url_is_isolated_before_render(
    tmp_path: Path,
    requested: str,
    final: str,
    chain: list[str],
    head: str,
) -> None:
    config = _config(tmp_path)
    html = f"<html><head><title>Opaque</title>{head}</head><body><main>evidence</main></body></html>"
    fetcher = FakeFetcher({requested: _result(requested, html.encode(), final=final, chain=chain)})
    renderer = FakeRenderer(tmp_path / "render", {})
    storage = RunStorage(tmp_path / "archive", "ai-policy")
    incorrectly_active = DiscoveredUrl(
        url=requested, source="test", status=PageStatus.ACTIVE
    )

    outcome = ArchiveCrawler(config, storage, fetcher, renderer).run([incorrectly_active])

    assert renderer.calls == []
    assert outcome.pages == []
    row = outcome.urls[0]
    assert row["status"] == "excluded-ai"
    assert row["evidence_path"].startswith("raw/isolated/excluded-ai/")
    assert (storage.run_dir / row["evidence_path"]).read_text() == html
    assert not list((storage.run_dir / "pages").glob("*.json"))
    assert _manifest(storage.run_dir, "assets") == []


def test_initial_non_page_statuses_never_render_and_resource_is_archived(
    tmp_path: Path,
) -> None:
    config = _config(tmp_path)
    review = "https://www.jototech.cn/?page_id=15192"
    external = "https://example.test/page"
    excluded = "https://www.jototech.cn/dify"
    resource = "https://www.jototech.cn/files/guide.pdf"
    fetcher = FakeFetcher(
        {resource: _result(resource, b"%PDF-1.7\n%%EOF\n", content_type="application/pdf")}
    )
    renderer = FakeRenderer(tmp_path / "render", {})
    storage = RunStorage(tmp_path / "archive", "terminals")

    outcome = ArchiveCrawler(config, storage, fetcher, renderer).run(
        [
            classify_url(review, "sitemap", config),
            classify_url(external, "sitemap", config),
            classify_url(excluded, "sitemap", config),
            classify_url(resource, "sitemap", config),
        ]
    )

    assert renderer.calls == []
    assert fetcher.calls == [resource]
    assert outcome.pages == []
    resource_row = next(row for row in outcome.urls if row["url"] == resource)
    assert resource_row["status"] == "resource"
    assert resource_row["asset_ids"]


def test_non_2xx_records_unresolved_error_and_never_renders(tmp_path: Path) -> None:
    config = _config(tmp_path)
    url = "https://www.jototech.cn/missing"
    fetcher = FakeFetcher({url: _result(url, b"<html>not found</html>", status=404)})
    renderer = FakeRenderer(tmp_path / "render", {})
    storage = RunStorage(tmp_path / "archive", "not-found")

    outcome = ArchiveCrawler(config, storage, fetcher, renderer).run(
        [DiscoveredUrl(url=url, source="test", status=PageStatus.ARCHIVED)]
    )

    assert outcome.urls[0]["status"] == "unreachable"
    assert outcome.crawl_errors[0].resolved is False
    assert outcome.crawl_errors[0].stage == "http-status"
    assert renderer.calls == []
    assert _manifest(storage.run_dir, "crawl-errors")[0]["message"] == "HTTP 404"


def test_security_challenge_stops_globally_but_writes_partial_manifests(
    tmp_path: Path,
) -> None:
    config = _config(tmp_path)
    first = "https://www.jototech.cn/"
    second = "https://www.jototech.cn/history"
    fetcher = FakeFetcher(
        {
            first: CaptchaDetectedError("CAPTCHA challenge detected"),
            second: _result(second, b"<html><main>must not run</main></html>"),
        }
    )
    renderer = FakeRenderer(tmp_path / "render", {})
    storage = RunStorage(tmp_path / "archive", "captcha")
    crawler = ArchiveCrawler(config, storage, fetcher, renderer)

    with pytest.raises(CaptchaDetectedError):
        crawler.run(
            [
                classify_url(first, "sitemap", config),
                classify_url(second, "sitemap", config),
            ]
        )

    assert fetcher.calls == [first]
    errors = _manifest(storage.run_dir, "crawl-errors")
    assert errors[-1]["stage"] == "security-challenge"
    assert errors[-1]["resolved"] is False
    assert (storage.run_dir / "manifests" / "urls.csv").is_file()
    assert not (tmp_path / "archive" / "latest.json").exists()


def test_ai_found_only_after_browser_render_is_isolated(tmp_path: Path) -> None:
    config = _config(tmp_path)
    url = "https://www.jototech.cn/dynamic"
    raw = "<html><head><title>Normal</title></head><body><main>Loading</main></body></html>"
    rendered = (
        '<html><head><title>Normal</title><link rel="canonical" href="/dify">'
        "</head><body><main>Dynamic</main></body></html>"
    )
    storage = RunStorage(tmp_path / "archive", "render-ai")
    outcome = ArchiveCrawler(
        config,
        storage,
        FakeFetcher({url: _result(url, raw.encode())}),
        FakeRenderer(tmp_path / "render", {url: rendered}),
    ).run([DiscoveredUrl(url=url, source="test", status=PageStatus.ARCHIVED)])
    assert outcome.pages == []
    assert outcome.urls[0]["status"] == "excluded-ai"
    assert not list((storage.run_dir / "pages").glob("*.json"))


def test_same_semantic_content_deduplicates_despite_different_dom_locators(tmp_path: Path) -> None:
    config = _config(tmp_path)
    first = "https://www.jototech.cn/first"
    second = "https://www.jototech.cn/second"
    first_html = "<html><head><title>A</title></head><body><main><section><p>Same copy.</p></section></main></body></html>"
    second_html = "<html><head><title>B</title></head><body><main><div><p>Same copy.</p></div></main></body></html>"
    storage = RunStorage(tmp_path / "archive", "semantic-duplicate")
    outcome = ArchiveCrawler(
        config,
        storage,
        FakeFetcher({first: _result(first, first_html.encode()), second: _result(second, second_html.encode())}),
        FakeRenderer(tmp_path / "render", {first: first_html, second: second_html}),
    ).run(
        [
            DiscoveredUrl(url=first, source="sitemap", status=PageStatus.ARCHIVED),
            DiscoveredUrl(url=second, source="sitemap", status=PageStatus.ARCHIVED),
        ]
    )
    assert sum(page.status is PageStatus.DUPLICATE for page in outcome.pages) == 1
