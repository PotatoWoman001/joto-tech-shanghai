from pathlib import Path

from joto_archive.config import load_config
from joto_archive.discovery import discover_links, parse_sitemap
from joto_archive.models import PageStatus


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

