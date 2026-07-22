"""Sitemap, navigation, and page-link discovery."""

from bs4 import BeautifulSoup, Tag
from lxml import etree

from joto_archive.config import CrawlConfig
from joto_archive.models import DiscoveredUrl, PageStatus
from joto_archive.rules import classify_url


def parse_sitemap(xml: bytes, config: CrawlConfig) -> list[DiscoveredUrl]:
    """Parse every public URL from a Sitemap document."""

    parser = etree.XMLParser(resolve_entities=False, no_network=True, recover=False)
    root = etree.fromstring(xml, parser=parser)
    values = root.xpath("//*[local-name()='loc']/text()")
    return [classify_url(value.strip(), "sitemap", config) for value in values]


def _navigation_path(anchor: Tag) -> list[str]:
    path: list[str] = []
    for list_item in reversed(anchor.find_parents("li")):
        direct_anchor = list_item.find("a", recursive=False)
        if direct_anchor:
            label = direct_anchor.get_text(" ", strip=True)
            if label and label not in path:
                path.append(label)
    own_label = anchor.get_text(" ", strip=True)
    if own_label and own_label not in path:
        path.append(own_label)
    return path


def _is_navigable_href(href: str) -> bool:
    stripped = href.strip().lower()
    return bool(stripped) and stripped != "#" and not stripped.startswith("javascript:")


def discover_links(html: str, page_url: str, config: CrawlConfig) -> list[DiscoveredUrl]:
    """Discover navigation links first, then all remaining public links."""

    soup = BeautifulSoup(html, "lxml")
    found: dict[str, DiscoveredUrl] = {}
    navigation_hrefs: set[str] = set()
    for navigation in soup.select("nav, #navigation"):
        for anchor in navigation.select("a[href]"):
            href = anchor.get("href", "")
            if not _is_navigable_href(href):
                continue
            item = classify_url(href, "navigation", config)
            item.discovered_from = page_url
            item.navigation_path = _navigation_path(anchor)
            found[item.url] = item
            navigation_hrefs.add(item.url)
    for anchor in soup.select("a[href]"):
        href = anchor.get("href", "")
        if not _is_navigable_href(href):
            continue
        item = classify_url(href, "page-link", config)
        if item.url in navigation_hrefs:
            continue
        item.discovered_from = page_url
        previous = found.get(item.url)
        if previous is None or (
            previous.status is PageStatus.ARCHIVED and item.status is PageStatus.ACTIVE
        ):
            found[item.url] = item
    return list(found.values())

