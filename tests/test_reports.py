import json
from pathlib import Path

from joto_archive.reports import generate_reports


def write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")


def test_writes_complete_chinese_reports_and_keeps_form_counts_distinct(tmp_path: Path) -> None:
    write_json(
        tmp_path / "manifests/urls.json",
        [
            {"url": "https://site.test/current", "status": "active", "source": "navigation", "navigation_path": ["产品"]},
            {"url": "https://site.test/old", "status": "archived", "source": "sitemap", "navigation_path": []},
            {"url": "https://site.test/dify", "status": "excluded-ai", "source": "sitemap", "exclusion_rule": "Dify"},
            {"url": "https://site.test/check", "status": "review", "source": "sitemap", "reason": "名称不清晰"},
            {"url": "https://site.test/copy", "status": "duplicate", "source": "link", "duplicate_of": "page-main"},
            {"url": "https://site.test/missing", "status": "unreachable", "reason": "404"},
            {"url": "https://site.test/smoke", "status": "active", "source": "smoke", "navigation_path": []},
        ],
    )
    write_json(
        tmp_path / "manifests/assets.json",
        [
            {
                "asset_id": "img-1",
                "download_status": "downloaded",
                "source_urls": ["https://goodq.top/original/photo.jpg"],
            },
            {
                "asset_id": "pdf-1",
                "download_status": "downloaded",
                "source_url": "https://files.example.test/manual.pdf",
                "is_external": True,
            },
            {
                "asset_id": "internal-pdf",
                "download_status": "downloaded",
                "source_url": "https://www.jototech.cn/files/internal.pdf",
                "is_external": False,
            },
        ],
    )
    write_json(
        tmp_path / "manifests/asset-references.json",
        [
            {"asset_id": "img-1", "status": "downloaded", "source_url": "https://goodq.top/photo.jpg"},
            {"status": "failed", "source_url": "https://files.test/lost.doc", "error": "timeout"},
        ],
    )
    write_json(
        tmp_path / "manifests/crawl-errors.json",
        [{"url": "https://site.test/missing", "stage": "fetch", "message": "404", "resolved": False}],
    )
    write_json(
        tmp_path / "manifests/blocked-requests.json",
        [{"url": "https://widget.agify.example/chat", "reason": "third party"}],
    )
    write_json(
        tmp_path / "pages/page-one.json",
        {
            "id": "page-one",
            "source_url": "https://site.test/current",
            "blocks": [
                {"type": "formDefinition", "data": {"fieldCount": 1}},
                {"type": "formDefinition", "data": {"fieldCount": 2}},
            ],
            "form_fields": [{"name": "name"}, {"name": "email"}, {"name": "topic"}],
            "issues": ["email mismatch"],
        },
    )

    summary = generate_reports(
        tmp_path,
        {"valid": False, "findings": [{"severity": "error", "code": "asset-gap", "message": "有资源缺失"}]},
    )

    assert summary["forms"] == 2
    assert summary["form_fields"] == 3
    assert summary["historical_pages"] == 1
    assert summary["unlinked_pages"] == 2  # smoke scope cannot establish navigation membership
    assert summary["excluded_ai_pages"] == 1
    assert summary["resource_success"] == 3
    assert summary["resource_failed"] == 1
    assert summary["external_files"] == 2
    assert summary["goodq_assets"] == 1
    assert summary["agify_records"] == 1

    report = (tmp_path / "reports/采集报告.md").read_text(encoding="utf-8")
    assert "一个表单可包含多个字段" in report
    assert "公开 URL、Sitemap 或其他公开链接访问" in report
    assert "GoodQ" in report and "OSS 或 COS" in report
    assert "Agify" in report and "不迁移原脚本" in report
    assert all(term in report for term in ("SEO", "数据库", "新前端", "运营后台"))

    issue_text = (tmp_path / "reports/内容问题清单.md").read_text(encoding="utf-8")
    assert issue_text.count("email mismatch") == 1
    assert "名称不清晰" in (tmp_path / "reports/待人工复核.md").read_text(encoding="utf-8")
    assert "https://site.test/dify" in (tmp_path / "reports/排除清单.md").read_text(encoding="utf-8")
    assert json.loads((tmp_path / "reports/summary.json").read_text())["forms"] == 2


def test_empty_manifests_still_write_stable_reports(tmp_path: Path) -> None:
    summary = generate_reports(tmp_path)

    assert summary["total_urls"] == 0
    assert summary["forms"] == 0
    assert summary["form_fields"] == 0
    assert summary["validation_valid"] is None
    for name in ("采集报告.md", "内容问题清单.md", "待人工复核.md", "排除清单.md"):
        text = (tmp_path / "reports" / name).read_text(encoding="utf-8")
        assert text.endswith("\n")
        assert "（无）" in text or name == "采集报告.md"
