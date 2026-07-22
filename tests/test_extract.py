from pathlib import Path

from joto_archive.extract import extract_page, page_to_markdown
from joto_archive.models import PageStatus


ARTICLE_HTML = Path("tests/fixtures/article.html").read_text(encoding="utf-8")
MOBILE_HTML = Path("tests/fixtures/responsive-content.html").read_text(encoding="utf-8")
DESKTOP_HTML = """<!doctype html><html lang="en"><head><title>Responsive Page</title></head>
<body><main id="content"><h1>Shared title</h1><p>Shared paragraph.</p>
<img src="/uploads/shared.jpg" alt="Shared"></main></body></html>"""


def test_extracts_every_supported_shape_in_source_order() -> None:
    page = extract_page(
        ARTICLE_HTML,
        "https://www.jototech.cn/article",
        PageStatus.ARCHIVED,
    )

    types = [block.type for block in page.blocks]
    assert types == [
        "heading",
        "paragraph",
        "richText",
        "heading",
        "richText",
        "list",
        "image",
        "table",
        "quote",
        "button",
        "download",
        "video",
        "embed",
        "embed",
        "embed",
        "formDefinition",
        "formDefinition",
        "unknown",
    ]
    assert [block.order for block in page.blocks] == list(range(len(page.blocks)))
    assert page.blocks[2].data["text"] == "Before child heading"
    assert page.blocks[4].data["text"] == "After child heading"
    assert page.blocks[6].data["sourceUrls"] == [
        "https://www.jototech.cn/uploads/photo.webp",
        "https://www.jototech.cn/uploads/photo-300x200.jpg",
    ]
    assert page.blocks[-1].source_html == (
        "<legacy-card>Preserve this unknown widget</legacy-card>"
    )
    assert all(block.data.get("sourceLocator") for block in page.blocks)


def test_form_count_and_field_count_are_not_conflated() -> None:
    page = extract_page(
        ARTICLE_HTML,
        "https://www.jototech.cn/article",
        PageStatus.ARCHIVED,
    )

    forms = [block for block in page.blocks if block.type == "formDefinition"]
    assert len(forms) == 2
    assert [form.data["fieldCount"] for form in forms] == [1, 2]
    assert [field.name for field in page.form_fields] == ["name", "email", "topic"]
    assert page.form_fields[0].required is True
    assert forms[1].data["buttonText"] == "Join"


def test_markdown_preserves_original_content_and_excludes_page_chrome() -> None:
    page = extract_page(
        ARTICLE_HTML,
        "https://www.jototech.cn/article",
        PageStatus.ARCHIVED,
    )
    markdown = page_to_markdown(page)

    assert markdown.index("# Historical Article") < markdown.index("Original paragraph")
    assert markdown.index("Before child heading") < markdown.index("## Details")
    assert markdown.index("## Details") < markdown.index("After child heading")
    assert "- First" in markdown
    assert "![Device]" in markdown
    assert "> A preserved quotation." in markdown
    assert "[Manual PDF](https://www.jototech.cn/files/manual.pdf)" in markdown
    assert "Preserve this unknown widget" in markdown
    assert "Footer content" not in markdown


def test_merges_desktop_and_mobile_without_duplicates_and_keeps_mobile_only() -> None:
    page = extract_page(
        DESKTOP_HTML,
        "https://www.jototech.cn/responsive",
        PageStatus.ACTIVE,
        mobile_html=MOBILE_HTML,
    )

    assert [block.data.get("text") or block.data.get("alt") for block in page.blocks] == [
        "Shared title",
        "Shared paragraph.",
        "Mobile-only instruction.",
        "Shared",
    ]
    mobile_only = page.blocks[2]
    assert mobile_only.data["viewport"] == "mobile"
    assert mobile_only.data["mobileOnly"] is True
    assert page.blocks[0].data["viewport"] == "desktop+mobile"
    assert set(page.blocks[0].data["sourceLocators"]) == {"desktop", "mobile"}


def test_unclassified_visible_text_is_preserved_as_unknown_without_rewriting() -> None:
    html = """<html><head><title>Unknown</title></head><body><main id="content">
    <custom-product data-code="A-1">Exact MixedCase متن فارسی ； punctuation!</custom-product>
    </main></body></html>"""
    page = extract_page(html, "https://www.jototech.cn/unknown", PageStatus.ARCHIVED)

    assert len(page.blocks) == 1
    assert page.blocks[0].type == "unknown"
    assert page.blocks[0].data["text"] == "Exact MixedCase متن فارسی ； punctuation!"
    assert page.issues == []
    assert "Exact MixedCase متن فارسی ； punctuation!" in page.blocks[0].source_html


def test_media_inside_text_container_and_empty_unknown_markup_are_not_lost() -> None:
    html = """<html><head><title>Mixed media</title></head><body><main id="content">
    <p>Before<img src="/inside.jpg" alt="Inside">After</p>
    <figure><video src="/inside.mp4"></video><figcaption>Video caption</figcaption></figure>
    <custom-placeholder data-slot="future"></custom-placeholder>
    <p>Repeated</p><p>Repeated</p>
    </main></body></html>"""
    page = extract_page(html, "https://www.jototech.cn/media", PageStatus.ARCHIVED)

    assert [block.type for block in page.blocks[:6]] == [
        "richText",
        "image",
        "richText",
        "video",
        "unknown",
        "paragraph",
    ]
    assert page.blocks[0].data["text"] == "Before"
    assert page.blocks[2].data["text"] == "After"
    assert page.blocks[3].data["url"] == "https://www.jototech.cn/inside.mp4"
    assert page.blocks[4].source_html == (
        '<custom-placeholder data-slot="future"></custom-placeholder>'
    )
    repeated = [block for block in page.blocks if block.data.get("text") == "Repeated"]
    assert len(repeated) == 2
    assert repeated[0].data["sourceLocator"] != repeated[1].data["sourceLocator"]


def test_empty_document_title_uses_heading_and_input_button_is_semantic() -> None:
    html = """<html lang="fa"><head><title> </title></head><body><main id="content">
    <h1>عنوان اصلی</h1><input type="button" value="Open catalogue">
    </main></body></html>"""
    page = extract_page(html, "https://www.jototech.cn/fa", PageStatus.ACTIVE)

    assert page.title == "عنوان اصلی"
    assert page.language == "fa"
    assert page.blocks[1].type == "button"
    assert page.blocks[1].data["text"] == "Open catalogue"


def test_collapsed_tab_content_is_preserved_and_marked_hidden() -> None:
    html = """<html><head><title>Tabs</title></head><body><main id="content">
    <section style="display:none"><h2>Older specification</h2><p hidden>Exact archived detail.</p></section>
    <section aria-hidden="true"><p>Second tab detail.</p></section>
    </main></body></html>"""
    page = extract_page(html, "https://www.jototech.cn/tabs", PageStatus.ARCHIVED)
    assert [block.data.get("text") for block in page.blocks] == [
        "Older specification",
        "Exact archived detail.",
        "Second tab detail.",
    ]
    assert all(block.data["sourceHidden"] is True for block in page.blocks)
    assert page.blocks[0].data["sourceHiddenReasons"] == ["display-none"]
    assert set(page.blocks[1].data["sourceHiddenReasons"]) == {"hidden-attribute", "display-none"}
