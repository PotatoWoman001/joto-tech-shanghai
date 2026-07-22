"""Sitemap, robots, navigation, and page-link discovery.

This module deliberately accepts sitemap bytes supplied by the caller.  It never
opens a URL itself, which keeps discovery deterministic and makes recursive
sitemap traversal possible without hiding network access inside the parser.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
import gzip
from io import BytesIO
import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Tag
from lxml import etree

from joto_archive.config import CrawlConfig
from joto_archive.models import DiscoveredUrl, PageStatus
from joto_archive.rules import classify_url, normalize_url


_SITEMAP_GZIP_LIMIT = 32 * 1024 * 1024
_ROBOTS_SITEMAP_RE = re.compile(r"^\s*sitemap\s*:\s*(\S+)\s*(?:#.*)?$", re.IGNORECASE)


@dataclass(frozen=True)
class SitemapParseResult:
    """One parsed sitemap document, before any child documents are resolved."""

    kind: str
    page_urls: list[DiscoveredUrl] = field(default_factory=list)
    child_sitemaps: list[str] = field(default_factory=list)


def normalize_discovered_url(url: str, base_url: str) -> str:
    """Return a stable identity for an HTTP(S) URL discovered during crawling.

    Query keys are case-normalized and sorted, while values retain their exact
    case.  The WordPress identity keys ``page_id`` and ``p`` are therefore kept
    even when a source spells them with different capitalization.
    """

    return normalize_url(url, base_url)


def _classify(url: str, source: str, config: CrawlConfig) -> DiscoveredUrl:
    """Classify only after applying discovery's stronger canonicalization."""

    return classify_url(normalize_discovered_url(url, config.base_url), source, config)


def _sitemap_payload(data: bytes) -> bytes:
    if data.startswith(b"\x1f\x8b"):
        try:
            with gzip.GzipFile(fileobj=BytesIO(data)) as compressed:
                payload = compressed.read(_SITEMAP_GZIP_LIMIT + 1)
        except (EOFError, OSError) as exc:
            raise ValueError("invalid gzip sitemap") from exc
        if len(payload) > _SITEMAP_GZIP_LIMIT:
            raise ValueError("decompressed sitemap exceeds safety limit")
        return payload
    return data


def _xml_root(data: bytes) -> etree._Element:
    payload = _sitemap_payload(data)
    upper = payload.upper()
    if b"<!DOCTYPE" in upper or b"<!ENTITY" in upper:
        raise ValueError("DOCTYPE and entity declarations are forbidden in sitemaps")
    parser = etree.XMLParser(
        resolve_entities=False,
        no_network=True,
        recover=False,
        load_dtd=False,
        huge_tree=False,
    )
    try:
        return etree.fromstring(payload, parser=parser)
    except etree.XMLSyntaxError as exc:
        raise ValueError("invalid sitemap XML") from exc


def parse_sitemap_document(
    xml: bytes,
    config: CrawlConfig,
    *,
    source_url: str | None = None,
) -> SitemapParseResult:
    """Parse one ``urlset`` or ``sitemapindex`` document without fetching children."""

    root = _xml_root(xml)
    kind = etree.QName(root).localname.lower()
    loc_values = [
        value.strip()
        for value in root.xpath("./*[local-name()='url' or local-name()='sitemap']/*[local-name()='loc']/text()")
        if value.strip()
    ]
    if kind == "urlset":
        items = [_classify(value, "sitemap", config) for value in loc_values]
        if source_url:
            for item in items:
                item.discovered_from = normalize_discovered_url(source_url, config.base_url)
        return SitemapParseResult(kind=kind, page_urls=merge_discovered_urls(items))
    if kind == "sitemapindex":
        children = [normalize_discovered_url(value, config.base_url) for value in loc_values]
        return SitemapParseResult(kind=kind, child_sitemaps=list(dict.fromkeys(children)))
    raise ValueError(f"unsupported sitemap root element: {kind or '<empty>'}")


def parse_sitemap(xml: bytes, config: CrawlConfig) -> list[DiscoveredUrl]:
    """Parse page URLs from one sitemap document (backward-compatible API)."""

    return parse_sitemap_document(xml, config).page_urls


def parse_sitemap_documents(
    documents: Mapping[str, bytes],
    config: CrawlConfig,
    *,
    root_url: str | None = None,
) -> list[DiscoveredUrl]:
    """Resolve a sitemap tree from caller-supplied documents.

    ``documents`` maps sitemap URL to bytes.  Missing children are intentionally
    ignored here: the caller owns fetching and can separately report failures.
    Cycles are safe and each supplied document is parsed at most once.
    """

    normalized_documents = {
        normalize_discovered_url(url, config.base_url): payload
        for url, payload in documents.items()
    }
    pending = [
        normalize_discovered_url(root_url or config.sitemap_url, config.base_url)
    ]
    visited: set[str] = set()
    discovered: list[DiscoveredUrl] = []
    while pending:
        current = pending.pop(0)
        if current in visited:
            continue
        visited.add(current)
        payload = normalized_documents.get(current)
        if payload is None:
            continue
        result = parse_sitemap_document(payload, config, source_url=current)
        discovered.extend(result.page_urls)
        pending.extend(child for child in result.child_sitemaps if child not in visited)
    return merge_discovered_urls(discovered)


def parse_robots_sitemaps(text: str | bytes, base_url: str) -> list[str]:
    """Return de-duplicated ``Sitemap:`` URLs from robots.txt text."""

    urls: list[str] = []
    if isinstance(text, bytes):
        text = text.decode("utf-8", errors="replace")
    for line in text.splitlines():
        match = _ROBOTS_SITEMAP_RE.match(line)
        if match:
            urls.append(normalize_discovered_url(match.group(1), base_url))
    return list(dict.fromkeys(urls))


def homepage_seed(config: CrawlConfig) -> DiscoveredUrl:
    """Create the always-present homepage seed used alongside sitemap discovery."""

    return _classify(config.base_url, "homepage-seed", config)


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
    return (
        bool(stripped)
        and stripped != "#"
        and not stripped.startswith(("javascript:", "mailto:", "tel:", "data:"))
    )


_STATUS_PRIORITY = {
    PageStatus.EXCLUDED_AI: 100,
    PageStatus.REVIEW: 90,
    PageStatus.RESOURCE: 80,
    PageStatus.EXTERNAL: 70,
    PageStatus.ACTIVE: 60,
    PageStatus.ARCHIVED: 50,
    PageStatus.DUPLICATE: 40,
    PageStatus.UNREACHABLE: 30,
    PageStatus.ERROR: 20,
}


def _merge_two(previous: DiscoveredUrl, new: DiscoveredUrl) -> DiscoveredUrl:
    sources = list(
        dict.fromkeys(
            source
            for value in (previous.source, new.source)
            for source in value.split("|")
            if source
        )
    )
    winner = (
        new
        if _STATUS_PRIORITY.get(new.status, 0) > _STATUS_PRIORITY.get(previous.status, 0)
        else previous
    )
    navigation_path = previous.navigation_path or new.navigation_path
    if len(new.navigation_path) > len(navigation_path):
        navigation_path = new.navigation_path
    return winner.model_copy(
        update={
            "source": "|".join(sources),
            "discovered_from": previous.discovered_from or new.discovered_from,
            "navigation_path": list(navigation_path),
            "exclusion_rule": previous.exclusion_rule or new.exclusion_rule,
        }
    )


def merge_discovered_urls(items: Iterable[DiscoveredUrl]) -> list[DiscoveredUrl]:
    """Merge duplicate identities while retaining all sources and navigation data."""

    found: dict[str, DiscoveredUrl] = {}
    for item in items:
        canonical = item.model_copy(
            update={"url": normalize_discovered_url(item.url, item.url)}
        )
        previous = found.get(canonical.url)
        found[canonical.url] = canonical if previous is None else _merge_two(previous, canonical)
    return list(found.values())


def discover_links(html: str, page_url: str, config: CrawlConfig) -> list[DiscoveredUrl]:
    """Discover navigation links first, then all remaining public links."""

    soup = BeautifulSoup(html, "lxml")
    found: list[DiscoveredUrl] = []
    navigation_urls: set[str] = set()
    for navigation in soup.select("nav, #navigation"):
        for anchor in navigation.select("a[href]"):
            href = anchor.get("href", "")
            if not _is_navigable_href(href):
                continue
            item = _classify(urljoin(page_url, href), "navigation", config)
            item.discovered_from = normalize_discovered_url(page_url, config.base_url)
            item.navigation_path = _navigation_path(anchor)
            found.append(item)
            navigation_urls.add(item.url)
    for anchor in soup.select("a[href]"):
        href = anchor.get("href", "")
        if not _is_navigable_href(href):
            continue
        item = _classify(urljoin(page_url, href), "page-link", config)
        item.discovered_from = normalize_discovered_url(page_url, config.base_url)
        if item.url not in navigation_urls:
            found.append(item)
    return merge_discovered_urls(found)


def unnavigated_sitemap_urls(
    sitemap_items: Iterable[DiscoveredUrl],
    navigation_items: Iterable[DiscoveredUrl],
) -> list[DiscoveredUrl]:
    """Return sitemap pages absent from navigation (the historical/hidden set)."""

    navigation_urls = {
        normalize_discovered_url(item.url, item.url) for item in navigation_items
    }
    return [
        item
        for item in merge_discovered_urls(sitemap_items)
        if normalize_discovered_url(item.url, item.url) not in navigation_urls
    ]
