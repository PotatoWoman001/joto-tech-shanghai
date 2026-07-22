from __future__ import annotations

import base64
import io
import zipfile
from pathlib import Path
from types import SimpleNamespace

from PIL import Image
import pytest

from joto_archive.assets import AssetCandidate, AssetStore, asset_candidates, decode_goodq_url
from joto_archive.fetch import CaptchaDetectedError


def _png(width: int, height: int, color: str = "blue") -> bytes:
    output = io.BytesIO()
    Image.new("RGB", (width, height), color).save(output, format="PNG")
    return output.getvalue()


def _docx() -> bytes:
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as archive:
        archive.writestr("[Content_Types].xml", "<Types/>")
        archive.writestr("word/document.xml", "<document/>")
    return output.getvalue()


class FakeFetcher:
    def __init__(self, responses: dict[str, tuple[int, bytes, str]]) -> None:
        self.responses = responses
        self.calls: list[str] = []

    def get(self, url: str) -> SimpleNamespace:
        self.calls.append(url)
        status, body, content_type = self.responses[url]
        return SimpleNamespace(
            requested_url=url,
            final_url=url,
            status_code=status,
            content_type=content_type,
            body=body,
            attempts=1,
        )


def _goodq_url(original: str) -> str:
    encoded = base64.b64encode(original.encode()).decode().replace("=", "_p_p100_p_3D")
    return f"https://cdn-s.goodq.top/caches/cache-key/{encoded}.jpg"


def test_collects_picture_lazy_css_browser_and_public_document_candidates() -> None:
    original = "https://www.jototech.cn/qfy-content/uploads/2021/02/loaded.jpg"
    goodq = _goodq_url(original)
    html = """
    <html><head><style>.hero { background-image: url('/uploads/hero-1024x512.jpg') }</style></head>
    <body>
      <picture>
        <source data-srcset="/uploads/device-1600.jpg 1600w, /uploads/device-800.jpg 800w">
        <source srcset="/uploads/device.webp 2x" type="image/webp">
        <img src="/uploads/device-300x200.jpg"
             srcset="/uploads/device-1024x683.jpg 1024w"
             data-original="/uploads/device.jpg"
             data-lazy-src="/uploads/device-lazy.jpg"
             alt="Device" title="Device title">
      </picture>
      <figure><img data-src="/uploads/second.png" alt="Second"><figcaption>Second caption</figcaption></figure>
      <div style="background:url(https://static.example/background.png)"></div>
      <div data-bg="/uploads/lazy-background-800x400.jpg"></div>
      <a href="/files/guide.pdf">Internal guide</a>
      <a href="https://partner.example/manual.docx">External manual</a>
      <a href="/download?id=42" download type="application/pdf">Download endpoint</a>
      <img src="data:image/png;base64,AAAA">
      <img src="blob:https://www.jototech.cn/id">
      <a href="javascript:alert(1)">bad</a>
    </body></html>
    """

    candidates = asset_candidates(
        html,
        "https://www.jototech.cn/page",
        loaded_resource_urls=[goodq, "javascript:bad", "blob:https://example.test/id"],
    )
    flattened = [url for candidate in candidates for url in candidate.urls]

    assert original in flattened
    assert "https://www.jototech.cn/uploads/hero.jpg" in flattened
    assert "https://static.example/background.png" in flattened
    assert "https://www.jototech.cn/uploads/lazy-background.jpg" in flattened
    assert "https://www.jototech.cn/files/guide.pdf" in flattened
    assert "https://partner.example/manual.docx" in flattened
    assert "https://www.jototech.cn/download?id=42" in flattened
    assert not any(url.startswith(("data:", "blob:", "javascript:")) for url in flattened)

    images = [item for item in candidates if item.usage == "content-image"]
    assert images[0].source_position == "img[0]"
    assert images[0].alt == "Device"
    assert "https://www.jototech.cn/uploads/device-1600.jpg" in images[0].urls
    assert "https://www.jototech.cn/uploads/device.webp" in images[0].urls
    assert "https://www.jototech.cn/uploads/device-lazy.jpg" in images[0].urls
    assert images[1].source_position == "img[1]"
    assert images[1].caption == "Second caption"


def test_decode_goodq_url_rejects_non_goodq_and_malformed_values() -> None:
    original = "https://www.jototech.cn/qfy-content/uploads/photo.jpg"
    assert decode_goodq_url(_goodq_url(original)) == original
    assert decode_goodq_url("https://example.test/not-goodq.jpg") is None
    assert decode_goodq_url("https://cdn-s.goodq.top/caches/not-base64.jpg") is None


def test_archive_downloads_every_candidate_and_selects_by_real_pixel_area(tmp_path: Path) -> None:
    small_url = "https://www.jototech.cn/uploads/photo-2000x2000.png"
    corrupt_url = "https://www.jototech.cn/uploads/photo-original.png"
    large_url = "https://www.jototech.cn/uploads/photo-100x100.png"
    small = _png(200, 150)
    large = _png(1200, 800)
    fetcher = FakeFetcher(
        {
            small_url: (200, small, "image/png"),
            corrupt_url: (200, b"not an image", "image/png"),
            large_url: (200, large, "image/png"),
        }
    )
    candidate = AssetCandidate(
        urls=[small_url, corrupt_url, large_url],
        alt="Device",
        usage="content-image",
        source_position="img[0]",
        kind="image",
    )

    store = AssetStore(tmp_path, fetcher)
    record = store.archive([candidate], "page-1")[0]

    assert fetcher.calls == [small_url, corrupt_url, large_url]
    assert (record.width, record.height, record.byte_size) == (1200, 800, len(large))
    assert record.final_url == large_url
    assert "selected-raster-by-pixel-area" in record.quality_note
    assert "highest-publicly-available" not in record.quality_note
    rejected = next(item for item in store.failures if item["url"] == corrupt_url)
    assert rejected["page_id"] == "page-1"
    assert rejected["source_position"] == "img[0]"
    assert rejected["reason"] == "invalid-image-magic"
    evidence = [item for item in store.candidate_evidence if item["source_position"] == "img[0]"]
    assert len(evidence) == 3
    assert sum(item["valid"] for item in evidence) == 2


def test_mime_mismatch_is_rejected_and_does_not_stop_later_candidate(tmp_path: Path) -> None:
    fake_url = "https://www.jototech.cn/uploads/fake.jpg"
    good_url = "https://www.jototech.cn/uploads/good.png"
    fetcher = FakeFetcher(
        {
            fake_url: (200, _png(10, 10), "image/jpeg"),
            good_url: (200, _png(20, 30), "image/png"),
        }
    )
    store = AssetStore(tmp_path, fetcher)

    record = store.archive(
        [AssetCandidate(urls=[fake_url, good_url], kind="image", source_position="img[0]")],
        "page-1",
    )[0]

    assert fetcher.calls == [fake_url, good_url]
    assert record.final_url == good_url
    assert any(
        item["url"] == fake_url and item["reason"] == "mime-mismatch:declared=image/jpeg:detected=image/png"
        for item in store.failures
    )


def test_svg_is_validated_and_ranked_separately_from_raster(tmp_path: Path) -> None:
    svg_url = "https://www.jototech.cn/uploads/logo.svg"
    raster_url = "https://www.jototech.cn/uploads/logo.png"
    svg = b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>'
    fetcher = FakeFetcher(
        {
            svg_url: (200, svg, "image/svg+xml"),
            raster_url: (200, _png(3000, 2000), "image/png"),
        }
    )
    store = AssetStore(tmp_path, fetcher)

    record = store.archive(
        [AssetCandidate(urls=[raster_url, svg_url], kind="image", source_position="img[0]")],
        "page-1",
    )[0]

    assert fetcher.calls == [raster_url, svg_url]
    assert record.final_url == svg_url
    assert record.mime_type == "image/svg+xml"
    assert record.relative_path.suffix == ".svg"
    assert record.width is None and record.height is None
    assert "selected-svg-vector" in record.quality_note
    assert "not-ranked-by-raster-pixels" in record.quality_note


def test_sha_dedup_keeps_distinct_page_and_position_references(tmp_path: Path) -> None:
    first_url = "https://www.jototech.cn/uploads/shared.png"
    second_url = "https://static.example/shared-copy.png"
    image = _png(640, 480)
    fetcher = FakeFetcher(
        {
            first_url: (200, image, "image/png"),
            second_url: (200, image, "image/png"),
        }
    )
    store = AssetStore(tmp_path, fetcher)

    first = store.archive(
        [AssetCandidate(urls=[first_url], alt="Front", title="A", caption="Caption A", source_position="img[0]")],
        "page-1",
    )[0]
    second = store.archive(
        [AssetCandidate(urls=[second_url], alt="Back", title="B", caption="Caption B", source_position="img[4]")],
        "page-2",
    )[0]

    assert first.sha256 == second.sha256
    assert first.relative_path == second.relative_path
    assert len(list((tmp_path / "assets" / "images").iterdir())) == 1
    assert set(store.by_hash[first.sha256].referenced_by) == {"page-1", "page-2"}
    assert [(ref.page_id, ref.alt, ref.title, ref.caption, ref.source_position) for ref in store.references] == [
        ("page-1", "Front", "A", "Caption A", "img[0]"),
        ("page-2", "Back", "B", "Caption B", "img[4]"),
    ]
    assert all(ref.status == "downloaded" and ref.source_url for ref in store.references)


def test_public_pdf_requires_document_magic_and_archives_after_bad_candidate(tmp_path: Path) -> None:
    bad_url = "https://partner.example/guide-old.pdf"
    good_url = "https://partner.example/guide.pdf"
    pdf = b"%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n"
    fetcher = FakeFetcher(
        {
            bad_url: (200, b"Access denied", "application/pdf"),
            good_url: (200, pdf, "application/pdf; charset=binary"),
        }
    )
    store = AssetStore(tmp_path, fetcher)

    record = store.archive(
        [AssetCandidate(urls=[bad_url, good_url], kind="document", usage="download-link", source_position="a[0]")],
        "page-1",
    )[0]

    assert fetcher.calls == [bad_url, good_url]
    assert record.mime_type == "application/pdf"
    assert record.relative_path.parent == Path("assets/documents")
    assert (tmp_path / record.relative_path).read_bytes() == pdf
    assert any(item["url"] == bad_url and item["reason"] == "invalid-document-magic" for item in store.failures)


def test_word_ooxml_is_verified_from_zip_contents_not_filename_alone(tmp_path: Path) -> None:
    url = "https://partner.example/manual.docx"
    body = _docx()
    fetcher = FakeFetcher(
        {
            url: (
                200,
                body,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        }
    )
    store = AssetStore(tmp_path, fetcher)

    record = store.archive(
        [AssetCandidate(urls=[url], kind="document", usage="download-link", source_position="a[0]")],
        "page-1",
    )[0]

    assert record.mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    assert record.relative_path.suffix == ".docx"
    assert (tmp_path / record.relative_path).read_bytes() == body


def test_public_csv_is_archived_but_html_error_page_is_rejected(tmp_path: Path) -> None:
    bad_url = "https://partner.example/error.csv"
    good_url = "https://partner.example/data.csv"
    fetcher = FakeFetcher(
        {
            bad_url: (200, b"<html>Access denied</html>", "text/csv"),
            good_url: (200, "名称,值\n示例,1\n".encode(), "text/csv"),
        }
    )
    store = AssetStore(tmp_path, fetcher)
    record = store.archive(
        [AssetCandidate(urls=[bad_url, good_url], kind="document", source_position="a[0]")],
        "page-1",
    )[0]
    assert record.mime_type == "text/csv"
    assert record.relative_path.suffix == ".csv"
    assert any(item.get("url") == bad_url for item in store.failures)


def test_security_challenge_during_asset_fetch_fails_fast(tmp_path: Path) -> None:
    class ChallengeFetcher:
        def get(self, url: str) -> SimpleNamespace:
            raise CaptchaDetectedError(url)

    store = AssetStore(tmp_path, ChallengeFetcher())
    with pytest.raises(CaptchaDetectedError):
        store.archive(
            [AssetCandidate(urls=["https://example.test/a.png"], source_position="img[0]")],
            "page-1",
        )
