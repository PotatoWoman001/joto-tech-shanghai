from pathlib import Path
import gzip

import pytest

from joto_archive.config import load_config
from joto_archive.discovery import (
    discover_links,
    homepage_seed,
    merge_discovered_urls,
    normalize_discovered_url,
    parse_robots_sitemaps,
    parse_sitemap,
    parse_sitemap_document,
    parse_sitemap_documents,
    unnavigated_sitemap_urls,
)
from joto_archive.models import DiscoveredUrl, PageStatus


CONFIG = load_config(Path("config/jototech.json"))


def test_sitemap_preserves_ai_exclusion_and_archives_history() -> None:
    items = parse_sitemap(Path("tests/fixtures/sitemap.xml").read_bytes(), CONFIG)
    statuses = {item.url: item.status for item in items}
    assert statuses["https://www.jototech.cn/"] is PageStatus.ACTIVE
    assert statuses["https://www.jototech.cn/msp"] is PageStatus.ARCHIVED
    assert statuses["https://www.jototech.cn/dify"] is PageStatus.EXCLUDED_AI


def test_navigation_paths_resources_and_external_links_are_classified() -> None:
    html = Path("tests/fixtures/navigation.html").read_text(encoding="utf-8")
    items = discover_links(html, CONFIG.base_url, CONFIG)
    by_url = {item.url: item for item in items}
    cisco = by_url["https://www.jototech.cn/?page_id=11105"]
    assert cisco.status is PageStatus.ACTIVE
    assert cisco.navigation_path == ["Solutions", "Cisco Networking"]
    assert by_url["https://www.jototech.cn/?page_id=15197"].status is PageStatus.EXCLUDED_AI
    assert by_url["https://www.jototech.cn/files/manual.pdf"].status is PageStatus.RESOURCE
    assert by_url["https://partner.example/file.pdf"].status is PageStatus.EXTERNAL
    assert all(item.url != CONFIG.base_url or item.navigation_path == ["Home"] for item in items)


def test_normalization_merges_bare_www_and_stabilizes_query_identity() -> None:
    url = (
        "http://JOTOTECH.cn:80//products/../news///"
        "?UTM_Source=mail&PAGE_ID=11105&Z=Upper&p=7&fbclid=ignored#section"
    )
    assert normalize_discovered_url(url, CONFIG.base_url) == (
        "https://www.jototech.cn/news?p=7&page_id=11105&z=Upper"
    )
    assert normalize_discovered_url(
        "https://WWW.JOTOTECH.CN:443/?P=42", CONFIG.base_url
    ) == "https://www.jototech.cn/?p=42"


def test_normalization_only_removes_port_default_for_resulting_scheme() -> None:
    assert normalize_discovered_url(
        "https://partner.example:80/file", CONFIG.base_url
    ) == "https://partner.example:80/file"
    assert normalize_discovered_url(
        "http://partner.example:80/file", CONFIG.base_url
    ) == "http://partner.example/file"


def test_sitemap_document_distinguishes_urlset_and_index() -> None:
    index = b"""<?xml version='1.0'?>
    <sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
      <sitemap><loc>http://jototech.cn:80/pages.xml.gz#fragment</loc></sitemap>
      <sitemap><loc>https://www.jototech.cn/posts.xml</loc></sitemap>
    </sitemapindex>"""
    result = parse_sitemap_document(index, CONFIG)
    assert result.kind == "sitemapindex"
    assert result.page_urls == []
    assert result.child_sitemaps == [
        "https://www.jototech.cn/pages.xml.gz",
        "https://www.jototech.cn/posts.xml",
    ]


def test_recursive_sitemap_documents_accept_gzip_and_merge_duplicates() -> None:
    root = b"""<sitemapindex xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
      <sitemap><loc>https://www.jototech.cn/pages.xml.gz</loc></sitemap>
      <sitemap><loc>https://www.jototech.cn/posts.xml</loc></sitemap>
    </sitemapindex>"""
    pages = gzip.compress(
        b"""<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
          <url><loc>http://jototech.cn:80/about/?utm_source=x</loc></url>
        </urlset>"""
    )
    posts = b"""<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>
      <url><loc>https://www.jototech.cn/about#top</loc></url>
      <url><loc>https://www.jototech.cn/?P=16556</loc></url>
    </urlset>"""
    items = parse_sitemap_documents(
        {
            CONFIG.sitemap_url: root,
            "https://www.jototech.cn/pages.xml.gz": pages,
            "https://www.jototech.cn/posts.xml": posts,
        },
        CONFIG,
    )
    assert [item.url for item in items] == [
        "https://www.jototech.cn/about",
        "https://www.jototech.cn/?p=16556",
    ]
    assert all(item.source == "sitemap" for item in items)
    assert all(item.discovered_from for item in items)


def test_recursive_sitemap_ignores_missing_child_without_fetching() -> None:
    index = b"""<sitemapindex><sitemap><loc>/missing.xml</loc></sitemap></sitemapindex>"""
    assert parse_sitemap_documents({CONFIG.sitemap_url: index}, CONFIG) == []


def test_robots_sitemap_lines_and_homepage_seed() -> None:
    robots = """
      User-agent: *
      Sitemap: /sitemap.xml
      sitemap: http://jototech.cn:80/news.xml.gz # mirror
      Sitemap: /sitemap.xml
    """
    assert parse_robots_sitemaps(robots.encode(), CONFIG.base_url) == [
        "https://www.jototech.cn/sitemap.xml",
        "https://www.jototech.cn/news.xml.gz",
    ]
    seed = homepage_seed(CONFIG)
    assert seed.url == CONFIG.base_url
    assert seed.source == "homepage-seed"
    assert seed.status is PageStatus.ACTIVE


def test_merge_retains_all_sources_and_navigation_path() -> None:
    sitemap = DiscoveredUrl(
        url="https://www.jototech.cn/about",
        source="sitemap",
        status=PageStatus.ARCHIVED,
    )
    navigation = DiscoveredUrl(
        url="https://www.jototech.cn/about",
        source="navigation",
        discovered_from=CONFIG.base_url,
        navigation_path=["About", "Company"],
        status=PageStatus.ACTIVE,
    )
    merged = merge_discovered_urls([sitemap, navigation])
    assert len(merged) == 1
    assert set(merged[0].source.split("|")) == {"sitemap", "navigation"}
    assert merged[0].navigation_path == ["About", "Company"]
    assert merged[0].status is PageStatus.ACTIVE


def test_unnavigated_pages_are_sitemap_minus_navigation() -> None:
    sitemap_items = [
        DiscoveredUrl(url="https://www.jototech.cn/a", source="sitemap", status=PageStatus.ARCHIVED),
        DiscoveredUrl(url="https://www.jototech.cn/b", source="sitemap", status=PageStatus.ARCHIVED),
    ]
    navigation_items = [
        DiscoveredUrl(url="https://www.jototech.cn/a", source="navigation", status=PageStatus.ACTIVE)
    ]
    assert [item.url for item in unnavigated_sitemap_urls(sitemap_items, navigation_items)] == [
        "https://www.jototech.cn/b"
    ]


def test_discover_links_merges_same_site_aliases_and_skips_non_http_schemes() -> None:
    html = """
      <nav><a href='http://jototech.cn:80/about/?utm_campaign=x'>About</a></nav>
      <a href='https://WWW.JOTOTECH.CN/about#team'>Repeated</a>
      <a href='mailto:info@jototech.cn'>Email</a>
      <a href='tel:123'>Phone</a>
    """
    items = discover_links(html, CONFIG.base_url, CONFIG)
    assert len(items) == 1
    assert items[0].url == "https://www.jototech.cn/about"
    assert items[0].navigation_path == ["About"]
    assert items[0].source == "navigation"


@pytest.mark.parametrize(
    "payload",
    [
        b"<!DOCTYPE urlset [<!ENTITY secret SYSTEM 'file:///etc/passwd'>]><urlset/>",
        b"<rss></rss>",
        b"<urlset>",
    ],
)
def test_sitemap_rejects_unsafe_or_unsupported_xml(payload: bytes) -> None:
    with pytest.raises(ValueError):
        parse_sitemap_document(payload, CONFIG)
