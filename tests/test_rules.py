from pathlib import Path

from joto_archive.config import load_config
from joto_archive.models import PageStatus
from joto_archive.rules import classify_url, normalize_url, title_exclusion_rule


CONFIG = load_config(Path("config/jototech.json"))


def test_normalize_url_removes_tracking_fragment_and_trailing_slash() -> None:
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


def test_dify_matching_uses_token_boundaries() -> None:
    item = classify_url("https://www.jototech.cn/modify", "sitemap", CONFIG)
    assert item.status is PageStatus.ARCHIVED


def test_excludes_confirmed_numeric_alias_and_ai_subdomain() -> None:
    post = classify_url("https://www.jototech.cn/?p=8406", "sitemap", CONFIG)
    alias = classify_url("https://www.jototech.cn/?page_id=15071", "page-link", CONFIG)
    subdomain = classify_url("https://translator.jototech.cn/anything", "page-link", CONFIG)
    assert post.status is PageStatus.EXCLUDED_AI
    assert post.exclusion_rule == "post_id:8406"
    assert alias.status is PageStatus.EXCLUDED_AI
    assert subdomain.status is PageStatus.EXCLUDED_AI


def test_ambiguous_generic_page_is_held_for_review() -> None:
    item = classify_url("https://www.jototech.cn/?page_id=15192", "sitemap", CONFIG)
    assert item.status is PageStatus.REVIEW


def test_title_preflight_checks_title_not_navigation_copy() -> None:
    assert title_exclusion_rule("<title>JOTO | Dify Partner</title>", CONFIG) == "title:dify"
    normal = '<title>Cisco Networking</title><nav>JOTO AI Solution</nav>'
    assert title_exclusion_rule(normal, CONFIG) is None
    assert title_exclusion_rule("<title>How to modify a firewall</title>", CONFIG) is None


def test_sitemap_only_normal_page_is_archived() -> None:
    item = classify_url("https://www.jototech.cn/msp", "sitemap", CONFIG)
    assert item.status is PageStatus.ARCHIVED


def test_navigation_page_and_home_are_active() -> None:
    nav = classify_url("https://www.jototech.cn/?page_id=11105", "navigation", CONFIG)
    home = classify_url("https://www.jototech.cn/", "sitemap", CONFIG)
    assert nav.status is PageStatus.ACTIVE
    assert home.status is PageStatus.ACTIVE


def test_same_site_document_is_a_resource_not_a_page() -> None:
    item = classify_url("https://www.jototech.cn/files/manual.pdf", "page-link", CONFIG)
    assert item.status is PageStatus.RESOURCE


def test_external_document_is_external() -> None:
    item = classify_url("https://partner.example/manual.pdf", "page-link", CONFIG)
    assert item.status is PageStatus.EXTERNAL
