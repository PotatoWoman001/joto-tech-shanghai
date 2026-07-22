from datetime import UTC, datetime
from pathlib import Path

import pytest

from joto_archive.models import Block, PageRecord, PageStatus
from joto_archive.storage import RunStorage, default_run_id, safe_component


def sample_page() -> PageRecord:
    return PageRecord(
        id="page/一",
        source_url="https://www.jototech.cn/sample",
        title="示例",
        language="zh-CN",
        status=PageStatus.ARCHIVED,
        content_type="page",
        blocks=[Block(type="paragraph", order=0, data={"text": "正文"})],
        captured_at="2026-07-22T00:00:00Z",
        content_hash="abc",
    )


def test_run_id_and_safe_component_are_deterministic():
    assert default_run_id(datetime(2026, 7, 22, 1, 2, 3, tzinfo=UTC)) == "20260722T010203Z"
    assert safe_component("page/一") == "page"


def test_run_directory_is_immutable(tmp_path: Path):
    RunStorage(tmp_path, "smoke")
    with pytest.raises(FileExistsError):
        RunStorage(tmp_path, "smoke")


def test_page_outputs_and_latest_are_written_only_on_finalize(tmp_path: Path):
    storage = RunStorage(tmp_path, "smoke")
    paths = storage.write_page(
        sample_page(),
        markdown="# 示例\n",
        raw_html="<html>raw</html>",
        rendered_html="<html>desktop</html>",
        mobile_html="<html>mobile</html>",
    )
    assert all(path.is_file() and path.stat().st_size for path in paths.values())
    assert not (tmp_path / "latest.json").exists()
    latest = storage.finalize({"validated": True})
    assert latest.is_file()
    assert '"complete": true' in (storage.run_dir / "run.json").read_text()


def test_csv_is_utf8_bom_for_spreadsheet_review(tmp_path: Path):
    storage = RunStorage(tmp_path, "csv")
    path = storage.write_csv("manifests/pages.csv", [{"title": "中文"}], ["title"])
    assert path.read_bytes().startswith(b"\xef\xbb\xbf")


def test_json_recursively_serializes_models_and_paths(tmp_path: Path):
    storage = RunStorage(tmp_path, "models")
    path = storage.write_json("manifests/pages.json", [sample_page(), {"path": Path("a/b")}])
    text = path.read_text(encoding="utf-8")
    assert '"title": "示例"' in text
    assert '"path": "a/b"' in text
