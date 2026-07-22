"""Deterministic URL normalization and crawl classification rules."""

import re
from pathlib import PurePosixPath
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit

from bs4 import BeautifulSoup

from joto_archive.config import CrawlConfig
from joto_archive.models import DiscoveredUrl, PageStatus


DROP_QUERY_PREFIXES = ("utm_",)
DROP_QUERY_KEYS = {"fbclid", "gclid"}
RESOURCE_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".zip",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
}


def normalize_url(url: str, base_url: str) -> str:
    """Resolve and normalize a URL without inventing a new page identity."""

    absolute = urljoin(base_url, url.strip())
    parts = urlsplit(absolute)
    base_host = urlsplit(base_url).hostname
    scheme = "https" if parts.hostname == base_host else parts.scheme.lower()
    netloc = parts.netloc.lower()
    query_items = [
        (key, value)
        for key, value in parse_qsl(parts.query, keep_blank_values=True)
        if key not in DROP_QUERY_KEYS and not key.startswith(DROP_QUERY_PREFIXES)
    ]
    path = parts.path or "/"
    if path != "/":
        path = path.rstrip("/")
    return urlunsplit((scheme, netloc, path, urlencode(query_items), ""))


def _exclusion_rule(url: str, config: CrawlConfig) -> str | None:
    normalized = normalize_url(url, config.base_url).lower()
    parts = urlsplit(normalized)
    query = dict(parse_qsl(parts.query))
    if parts.hostname in config.excluded_domains:
        return f"domain:{parts.hostname}"
    if query.get("page_id") in config.excluded_page_ids:
        return f"page_id:{query['page_id']}"
    if query.get("p") in config.excluded_post_ids:
        return f"post_id:{query['p']}"
    searchable = f"{parts.path}?{parts.query}".lower()
    for term in config.excluded_terms:
        escaped = re.escape(term.lower())
        if re.search(rf"(^|[^a-z0-9]){escaped}([^a-z0-9]|$)", searchable):
            return f"term:{term}"
    return None


def _review_rule(url: str, config: CrawlConfig) -> str | None:
    parts = urlsplit(normalize_url(url, config.base_url).lower())
    query = dict(parse_qsl(parts.query))
    if query.get("page_id") in config.review_page_ids:
        return f"review-page_id:{query['page_id']}"
    if query.get("p") in config.review_post_ids:
        return f"review-post_id:{query['p']}"
    return None


def title_exclusion_rule(html: str, config: CrawlConfig) -> str | None:
    """Classify opaque URLs using only page-owned title metadata."""

    soup = BeautifulSoup(html, "lxml")
    candidates: list[str] = []
    if soup.title:
        candidates.append(soup.title.get_text(" ", strip=True))
    for meta in soup.select('meta[property="og:title"], meta[name="twitter:title"]'):
        candidates.append(meta.get("content", ""))
    title_text = " ".join(candidates).lower()
    for term in config.excluded_title_terms:
        escaped = re.escape(term.lower())
        if re.search(rf"(^|[^a-z0-9]){escaped}([^a-z0-9]|$)", title_text):
            return f"title:{term}"
    return None


def classify_url(url: str, source: str, config: CrawlConfig) -> DiscoveredUrl:
    """Assign one unambiguous processing status to a discovered URL."""

    normalized = normalize_url(url, config.base_url)
    parts = urlsplit(normalized)
    base_host = urlsplit(config.base_url).hostname
    rule = _exclusion_rule(normalized, config)
    review_rule = _review_rule(normalized, config)
    suffix = PurePosixPath(parts.path).suffix.lower()
    if rule:
        status = PageStatus.EXCLUDED_AI
    elif review_rule:
        status = PageStatus.REVIEW
    elif parts.hostname != base_host:
        status = PageStatus.EXTERNAL
    elif suffix in RESOURCE_EXTENSIONS:
        status = PageStatus.RESOURCE
    elif normalized == normalize_url(config.base_url, config.base_url) or source == "navigation":
        status = PageStatus.ACTIVE
    else:
        status = PageStatus.ARCHIVED
    return DiscoveredUrl(
        url=normalized,
        source=source,
        status=status,
        exclusion_rule=rule or review_rule,
    )
