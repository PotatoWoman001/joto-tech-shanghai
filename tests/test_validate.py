import hashlib
import json
from pathlib import Path

from PIL import Image

from joto_archive.validate import validate_run


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")


def make_valid_run(root: Path) -> Path:
    for name in ("pages", "markdown", "raw", "rendered", "screenshots", "assets", "manifests"):
        (root / name).mkdir(parents=True, exist_ok=True)
    page = {"id": "one", "blocks": [{"type": "paragraph", "data": {"text": "正文"}}]}
    write_json(root / "pages/one.json", page)
    (root / "markdown/one.md").write_text("正文", encoding="utf-8")
    (root / "raw/one.html").write_text("<p>正文</p>", encoding="utf-8")
    (root / "rendered/one.desktop.html").write_text("<p>正文</p>", encoding="utf-8")
    (root / "rendered/one.mobile.html").write_text("<p>正文</p>", encoding="utf-8")
    for device in ("desktop", "mobile"):
        Image.new("RGB", (10, 10), "white").save(root / f"screenshots/one.{device}.png")
    binary = b"asset"
    (root / "assets/a.bin").write_bytes(binary)
    write_json(root / "manifests/urls.json", [{"url": "https://example.test/one", "status": "archived", "page_id": "one"}])
    write_json(root / "manifests/assets.json", [{"asset_id": "a", "relative_path": "assets/a.bin", "sha256": hashlib.sha256(binary).hexdigest()}])
    write_json(root / "manifests/asset-references.json", [{"asset_id": "a", "source_url": "https://cdn.test/a", "status": "downloaded"}])
    write_json(root / "manifests/asset-errors.json", [])
    write_json(root / "manifests/crawl-errors.json", [])
    write_json(root / "manifests/content-issues.json", [])
    for name in ("urls", "assets", "asset-references", "asset-errors", "content-issues", "crawl-errors"):
        (root / f"manifests/{name}.csv").write_text("header\n", encoding="utf-8")
    write_json(root / "manifests/baselines.json", {"one": {"dom_text_blocks": 1, "extracted_text_blocks": 1, "network_asset_urls": 1, "archived_asset_urls": 1}})
    return root


def test_valid_run_passes(tmp_path: Path):
    report = validate_run(make_valid_run(tmp_path), ["Dify", "JOTO AI"])
    assert report.valid, report.findings


def test_unresolved_error_and_forbidden_content_fail(tmp_path: Path):
    run = make_valid_run(tmp_path)
    page = json.loads((run / "pages/one.json").read_text())
    page["blocks"][0]["data"]["text"] = "Dify"
    write_json(run / "pages/one.json", page)
    write_json(run / "manifests/crawl-errors.json", [{"url": "u", "stage": "fetch", "message": "failed", "resolved": False}])
    report = validate_run(run, ["Dify"])
    assert not report.valid
    assert {finding.code for finding in report.errors} >= {"forbidden-content", "unresolved-crawl-error"}


def test_review_page_must_not_have_cms_output(tmp_path: Path):
    run = make_valid_run(tmp_path)
    write_json(run / "manifests/urls.json", [{"url": "u", "status": "review", "page_id": "one"}])
    report = validate_run(run)
    assert "excluded-page-output" in {finding.code for finding in report.errors}


def test_unresolved_asset_error_fails_delivery(tmp_path: Path):
    run = make_valid_run(tmp_path)
    write_json(
        run / "manifests/asset-errors.json",
        [{"url": "https://cdn.test/missing.jpg", "reason": "timeout", "resolved": False}],
    )
    report = validate_run(run)
    assert "unresolved-asset-error" in {finding.code for finding in report.errors}
