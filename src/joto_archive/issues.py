"""Objective source-content issue detection without rewriting content."""

import re

from bs4 import BeautifulSoup


EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)


def _digits(value: str) -> str:
    return re.sub(r"\D", "", value)


def detect_content_issues(html: str) -> list[str]:
    """Return evidence-backed mismatches visible in the public HTML."""

    soup = BeautifulSoup(html, "lxml")
    issues: list[str] = []
    for anchor in soup.select('a[href^="mailto:"]'):
        href = anchor.get("href", "").removeprefix("mailto:").split("?", 1)[0].strip().lower()
        visible_match = EMAIL.search(anchor.get_text(" ", strip=True))
        if visible_match and visible_match.group(0).lower() != href:
            issues.append(
                f"email mismatch: visible={visible_match.group(0)} href={href}"
            )
    for anchor in soup.select('a[href^="tel:"]'):
        href = _digits(anchor.get("href", "").removeprefix("tel:"))
        visible_text = anchor.get_text(" ", strip=True)
        visible = _digits(visible_text)
        if visible and href and visible != href:
            issues.append(f"phone mismatch: visible={visible_text} href={anchor.get('href', '')}")
    return list(dict.fromkeys(issues))

