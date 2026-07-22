from __future__ import annotations

import gzip
from pathlib import Path

import pytest

import joto_archive.inventory as inventory_module
from joto_archive.config import load_config
from joto_archive.fetch import CaptchaDetectedError
from joto_archive.inventory import (
    InventoryLimitError,
    SitemapFetchError,
    SitemapHttpError,
    SitemapParseError,
    fetch_public_inventory,
)
from joto_archive.models import FetchResult, PageStatus


CONFIG = load_config(Path("config/jototech.json"))


def _response(
    url: str,
    body: bytes,
    *,
    status_code: int = 200,
    content_type: str = "application/xml",
) -> FetchResult:
    return FetchResult(
        requested_url=url,
        final_url=url,
        status_code=status_code,
        content_type=content_type,
        body=body,
        attempts=1,
    )


class FakeFetcher:
    def __init__(self, responses: dict[str, FetchResult | BaseException]) -> None:
        self.responses = responses
        self.calls: list[str] = []

    def get(self, url: str) -> FetchResult:
        self.calls.append(url)
        response = self.responses.get(url, KeyError(url))
        if isinstance(response, BaseException):
            raise response
        return response


def test_fetch_inventory_recurses_gzip_merges_sources_and_seeds_homepage() -> None:
    pages_url = "https://www.jototech.cn/pages.xml.gz"
    posts_url = "https://www.jototech.cn/posts.xml"
    root = b"""<sitemapindex>
      <sitemap><loc>/pages.xml.gz</loc></sitemap>
      <sitemap><loc>/posts.xml</loc></sitemap>
    </sitemapindex>"""
    pages = gzip.compress(
        b"""<urlset><url><loc>https://www.jototech.cn/</loc></url>
        <url><loc>https://www.jototech.cn/about</loc></url></urlset>"""
    )
    posts = b"""<urlset><url><loc>https://www.jototech.cn/dify</loc></url></urlset>"""
    fetcher = FakeFetcher(
        {
            CONFIG.sitemap_url: _response(CONFIG.sitemap_url, root),
            pages_url: _response(pages_url, pages, content_type="application/gzip"),
            posts_url: _response(posts_url, posts),
        }
    )

    result = fetch_public_inventory(CONFIG, fetcher)

    assert result.sitemap_urls == [CONFIG.sitemap_url, pages_url, posts_url]
    assert fetcher.calls == result.sitemap_urls
    by_url = {item.url: item for item in result.items}
    assert set(by_url) == {
        CONFIG.base_url,
        "https://www.jototech.cn/about",
        "https://www.jototech.cn/dify",
    }
    assert set(by_url[CONFIG.base_url].source.split("|")) == {
        "homepage-seed",
        "sitemap",
    }
    assert by_url["https://www.jototech.cn/dify"].status is PageStatus.EXCLUDED_AI
    assert by_url["https://www.jototech.cn/about"].discovered_from == pages_url


def test_sitemap_cycle_is_fetched_once_and_empty_inventory_still_has_homepage() -> None:
    child_url = "https://www.jototech.cn/child.xml"
    root = b"<sitemapindex><sitemap><loc>/child.xml</loc></sitemap></sitemapindex>"
    child = (
        f"<sitemapindex><sitemap><loc>{CONFIG.sitemap_url}</loc></sitemap></sitemapindex>"
    ).encode()
    fetcher = FakeFetcher(
        {
            CONFIG.sitemap_url: _response(CONFIG.sitemap_url, root),
            child_url: _response(child_url, child),
        }
    )

    result = fetch_public_inventory(CONFIG, fetcher)

    assert result.sitemap_urls == [CONFIG.sitemap_url, child_url]
    assert [item.url for item in result.items] == [CONFIG.base_url]
    assert result.items[0].source == "homepage-seed"


@pytest.mark.parametrize("status_code", [199, 301, 404, 500])
def test_non_success_sitemap_response_fails_closed(status_code: int) -> None:
    fetcher = FakeFetcher(
        {
            CONFIG.sitemap_url: _response(
                CONFIG.sitemap_url,
                b"<urlset/>",
                status_code=status_code,
            )
        }
    )

    with pytest.raises(SitemapHttpError, match=str(status_code)):
        fetch_public_inventory(CONFIG, fetcher)


@pytest.mark.parametrize(
    ("body", "content_type"),
    [
        (b"<html><body>not a sitemap</body></html>", "text/html"),
        (b"plain text", "text/plain"),
        (b"<urlset>", "application/xml"),
    ],
)
def test_non_xml_or_invalid_sitemap_fails_closed(
    body: bytes, content_type: str
) -> None:
    fetcher = FakeFetcher(
        {
            CONFIG.sitemap_url: _response(
                CONFIG.sitemap_url,
                body,
                content_type=content_type,
            )
        }
    )

    with pytest.raises(SitemapParseError):
        fetch_public_inventory(CONFIG, fetcher)


def test_valid_xml_with_generic_content_type_is_securely_parsed() -> None:
    body = b"<urlset><url><loc>https://www.jototech.cn/about</loc></url></urlset>"
    fetcher = FakeFetcher(
        {CONFIG.sitemap_url: _response(CONFIG.sitemap_url, body, content_type="text/plain")}
    )
    result = fetch_public_inventory(CONFIG, fetcher)
    assert {item.url for item in result.items} == {
        "https://www.jototech.cn/",
        "https://www.jototech.cn/about",
    }


def test_missing_child_is_a_dedicated_fetch_error() -> None:
    child_url = "https://www.jototech.cn/missing.xml"
    root = b"<sitemapindex><sitemap><loc>/missing.xml</loc></sitemap></sitemapindex>"
    fetcher = FakeFetcher(
        {CONFIG.sitemap_url: _response(CONFIG.sitemap_url, root)}
    )

    with pytest.raises(SitemapFetchError, match=child_url) as raised:
        fetch_public_inventory(CONFIG, fetcher)

    assert isinstance(raised.value.__cause__, KeyError)


def test_security_challenge_is_not_wrapped() -> None:
    challenge = CaptchaDetectedError("manual verification required")
    fetcher = FakeFetcher({CONFIG.sitemap_url: challenge})

    with pytest.raises(CaptchaDetectedError) as raised:
        fetch_public_inventory(CONFIG, fetcher)

    assert raised.value is challenge


def test_sitemap_document_limit_stops_before_fetching_extra_document(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(inventory_module, "MAX_SITEMAP_DOCUMENTS", 2)
    one = "https://www.jototech.cn/one.xml"
    two = "https://www.jototech.cn/two.xml"
    root = (
        f"<sitemapindex><sitemap><loc>{one}</loc></sitemap>"
        f"<sitemap><loc>{two}</loc></sitemap></sitemapindex>"
    ).encode()
    fetcher = FakeFetcher({CONFIG.sitemap_url: _response(CONFIG.sitemap_url, root)})

    with pytest.raises(InventoryLimitError, match="sitemap document"):
        fetch_public_inventory(CONFIG, fetcher)

    assert fetcher.calls == [CONFIG.sitemap_url]


def test_page_limit_includes_homepage_seed(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(inventory_module, "MAX_INVENTORY_PAGES", 2)
    body = b"""<urlset>
      <url><loc>https://www.jototech.cn/a</loc></url>
      <url><loc>https://www.jototech.cn/b</loc></url>
    </urlset>"""
    fetcher = FakeFetcher(
        {CONFIG.sitemap_url: _response(CONFIG.sitemap_url, body)}
    )

    with pytest.raises(InventoryLimitError, match="page"):
        fetch_public_inventory(CONFIG, fetcher)
