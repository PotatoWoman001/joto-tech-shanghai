"""Fail-closed retrieval of the public sitemap inventory.

The transport is injected deliberately: this module only orchestrates GET
results supplied by a caller-owned fetcher and never opens or closes a network
client itself.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from joto_archive.config import CrawlConfig
from joto_archive.discovery import (
    homepage_seed,
    merge_discovered_urls,
    normalize_discovered_url,
    parse_sitemap_document,
)
from joto_archive.fetch import SecurityChallengeError
from joto_archive.models import DiscoveredUrl, FetchResult


MAX_SITEMAP_DOCUMENTS = 100
MAX_INVENTORY_PAGES = 10_000


class Fetcher(Protocol):
    """The minimal read-only transport needed by inventory discovery."""

    def get(self, url: str) -> FetchResult: ...


class InventoryError(RuntimeError):
    """Base class for a sitemap inventory that cannot be trusted as complete."""


class SitemapFetchError(InventoryError):
    """A sitemap document could not be fetched."""


class SitemapHttpError(InventoryError):
    """A sitemap document returned a non-success HTTP status."""


class SitemapParseError(InventoryError):
    """A response was not a valid sitemap XML document."""


class InventoryLimitError(InventoryError):
    """A safety limit was reached before inventory could be completed."""


@dataclass(frozen=True)
class InventoryResult:
    """Complete public page inventory and the sitemap documents behind it."""

    items: list[DiscoveredUrl]
    sitemap_urls: list[str]


def _fetch_sitemap(url: str, fetcher: Fetcher) -> FetchResult:
    try:
        result = fetcher.get(url)
    except SecurityChallengeError:
        raise
    except Exception as exc:
        raise SitemapFetchError(f"failed to fetch sitemap document: {url}") from exc

    if not 200 <= result.status_code < 300:
        raise SitemapHttpError(
            f"sitemap document returned HTTP {result.status_code}: {url}"
        )
    return result


def _parse_sitemap(result: FetchResult, source_url: str, config: CrawlConfig):
    content_type = result.content_type.partition(";")[0].strip().lower()
    is_gzip = result.body.startswith(b"\x1f\x8b")
    xml_media_type = "xml" in content_type
    gzip_media_type = "gzip" in content_type or "x-gzip" in content_type
    octet_stream_gzip = content_type == "application/octet-stream" and is_gzip
    xml_sniffed = result.body.lstrip().startswith((b"<?xml", b"<urlset", b"<sitemapindex"))
    if not (xml_media_type or xml_sniffed or (is_gzip and (gzip_media_type or octet_stream_gzip))):
        raise SitemapParseError(
            f"sitemap response is not XML or gzip XML ({content_type or 'unknown'}): "
            f"{source_url}"
        )
    try:
        return parse_sitemap_document(result.body, config, source_url=source_url)
    except ValueError as exc:
        raise SitemapParseError(f"invalid sitemap document: {source_url}") from exc


def fetch_public_inventory(
    config: CrawlConfig,
    fetcher: Fetcher,
) -> InventoryResult:
    """Fetch the configured sitemap tree and always merge in the homepage seed.

    The sitemap tree is all-or-nothing. Missing children, HTTP errors, invalid
    XML, and safety-limit breaches raise a dedicated :class:`InventoryError`
    instead of silently returning a partial inventory. Security challenges are
    propagated unchanged so the caller can stop the whole crawl immediately.

    The caller owns the fetcher's lifecycle (for example, an ``HttpFetcher``
    context manager around this function).
    """

    root_url = normalize_discovered_url(config.sitemap_url, config.base_url)
    pending = [root_url]
    queued = {root_url}
    visited: set[str] = set()
    sitemap_urls: list[str] = []
    discovered: list[DiscoveredUrl] = [homepage_seed(config)]

    while pending:
        current = pending.pop(0)
        queued.discard(current)
        if current in visited:
            continue
        if len(visited) >= MAX_SITEMAP_DOCUMENTS:
            raise InventoryLimitError(
                f"sitemap document limit exceeded ({MAX_SITEMAP_DOCUMENTS})"
            )

        fetched = _fetch_sitemap(current, fetcher)
        parsed = _parse_sitemap(fetched, current, config)
        visited.add(current)
        sitemap_urls.append(current)

        discovered.extend(parsed.page_urls)
        merged = merge_discovered_urls(discovered)
        if len(merged) > MAX_INVENTORY_PAGES:
            raise InventoryLimitError(
                f"page inventory limit exceeded ({MAX_INVENTORY_PAGES})"
            )

        new_children = [
            child
            for child in parsed.child_sitemaps
            if child not in visited and child not in queued
        ]
        if len(visited) + len(queued) + len(new_children) > MAX_SITEMAP_DOCUMENTS:
            raise InventoryLimitError(
                f"sitemap document limit exceeded ({MAX_SITEMAP_DOCUMENTS})"
            )
        pending.extend(new_children)
        queued.update(new_children)

    return InventoryResult(
        items=merge_discovered_urls(discovered),
        sitemap_urls=sitemap_urls,
    )
