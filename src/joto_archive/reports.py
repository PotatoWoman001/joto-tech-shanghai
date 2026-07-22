"""Generate human-readable Chinese delivery reports for an archive run.

The reporting layer is intentionally read-only with respect to crawl evidence: it
only reads run manifests/page JSON and writes derived Markdown into ``reports/``.
Empty or partially populated manifests still produce a complete, stable report so
an operator can see which categories contain no records.
"""

from __future__ import annotations

import json
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit


CAPTURED_STATUSES = {"active", "archived", "duplicate"}
RESOURCE_EXTENSIONS = {
    ".csv",
    ".doc",
    ".docx",
    ".pdf",
    ".ppt",
    ".pptx",
    ".rar",
    ".rtf",
    ".txt",
    ".xls",
    ".xlsx",
    ".zip",
}


def _read_json(path: Path, default: Any) -> Any:
    if not path.is_file():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8-sig"))
    except (OSError, UnicodeError, json.JSONDecodeError):
        return default


def _records(value: Any) -> list[dict[str, Any]]:
    """Normalize common manifest wrappers to a list of record dictionaries."""

    if isinstance(value, Mapping):
        for key in ("items", "records", "urls", "assets", "issues", "errors"):
            nested = value.get(key)
            if isinstance(nested, list):
                value = nested
                break
        else:
            return [dict(value)]
    if not isinstance(value, list):
        return []
    return [dict(item) for item in value if isinstance(item, Mapping)]


def _as_validation(value: Any, run_dir: Path) -> dict[str, Any]:
    if value is None:
        for candidate in (
            run_dir / "validation.json",
            run_dir / "manifests" / "validation.json",
            run_dir / "reports" / "validation-report.json",
        ):
            if candidate.is_file():
                return _read_json(candidate, {})
        return {}
    if isinstance(value, (str, Path)):
        return _read_json(Path(value), {})
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if isinstance(value, Mapping):
        return dict(value)
    return {}


def _write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def _url(record: Mapping[str, Any]) -> str:
    return str(record.get("url") or record.get("source_url") or record.get("final_url") or "")


def _reason(record: Mapping[str, Any]) -> str:
    return str(
        record.get("exclusion_rule")
        or record.get("reason")
        or record.get("message")
        or record.get("error")
        or "未填写原因"
    )


def _status(record: Mapping[str, Any]) -> str:
    raw = record.get("status", "")
    return str(getattr(raw, "value", raw)).lower()


def _nav_path(record: Mapping[str, Any]) -> list[str]:
    raw = record.get("navigation_path") or record.get("navigationPath") or []
    return [str(item) for item in raw] if isinstance(raw, list) else []


def _is_unlinked(record: Mapping[str, Any]) -> bool:
    if _status(record) not in CAPTURED_STATUSES or _nav_path(record):
        return False
    # Some producers write an explicit boolean after comparing the navigation
    # crawl with sitemap discovery. Prefer that evidence when available.
    explicit = record.get("in_navigation")
    if explicit is not None:
        return not bool(explicit)
    explicit = record.get("found_in_navigation")
    if explicit is not None:
        return not bool(explicit)
    source = str(record.get("source", "")).lower()
    return "navigation" not in source and source not in {"nav", "menu"}


def _markdown_table(headers: Sequence[str], rows: Sequence[Sequence[Any]]) -> str:
    if not rows:
        return "（无）"

    def cell(value: Any) -> str:
        text = str(value if value not in (None, "") else "—")
        return text.replace("|", "\\|").replace("\n", "<br>")

    lines = [
        "| " + " | ".join(cell(item) for item in headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    lines.extend("| " + " | ".join(cell(item) for item in row) + " |" for row in rows)
    return "\n".join(lines)


def _page_documents(run_dir: Path) -> list[dict[str, Any]]:
    pages: list[dict[str, Any]] = []
    for path in sorted((run_dir / "pages").glob("*.json")):
        value = _read_json(path, {})
        if isinstance(value, Mapping):
            pages.append(dict(value))
    return pages


def _content_issues(run_dir: Path, pages: Sequence[Mapping[str, Any]]) -> list[dict[str, str]]:
    found: list[dict[str, str]] = []
    raw = _read_json(run_dir / "manifests" / "content-issues.json", [])
    if isinstance(raw, list):
        for item in raw:
            if isinstance(item, str):
                found.append({"page": "—", "issue": item})
            elif isinstance(item, Mapping):
                found.append(
                    {
                        "page": str(item.get("url") or item.get("page_id") or item.get("page") or "—"),
                        "issue": str(item.get("issue") or item.get("message") or item.get("description") or item),
                    }
                )
    for page in pages:
        page_label = str(page.get("source_url") or page.get("id") or "—")
        issues = page.get("issues", [])
        if isinstance(issues, list):
            for issue in issues:
                if issue:
                    found.append({"page": page_label, "issue": str(issue)})

    unique: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for item in found:
        key = (item["page"], item["issue"])
        if key not in seen:
            seen.add(key)
            unique.append(item)
    return unique


def _validation_findings(validation: Mapping[str, Any]) -> list[dict[str, Any]]:
    raw = validation.get("findings", [])
    return [dict(item) for item in raw if isinstance(item, Mapping)] if isinstance(raw, list) else []


def _resource_counts(
    assets: Sequence[Mapping[str, Any]], references: Sequence[Mapping[str, Any]]
) -> tuple[int, int]:
    successful_ids = {
        str(asset.get("asset_id"))
        for asset in assets
        if asset.get("asset_id")
        and str(asset.get("download_status", "downloaded")).lower() == "downloaded"
    }
    successful_refs = {
        str(ref.get("asset_id"))
        for ref in references
        if ref.get("asset_id") and _status(ref) == "downloaded"
    }
    success = len(successful_ids | successful_refs)
    failures = sum(1 for ref in references if _status(ref) not in {"", "downloaded"})
    failures += sum(
        1
        for asset in assets
        if str(asset.get("download_status", "downloaded")).lower() != "downloaded"
    )
    return success, failures


def _is_external_file(record: Mapping[str, Any]) -> bool:
    if bool(record.get("is_external")):
        return True
    url = _url(record) or str(record.get("selected_url") or record.get("source_url") or "")
    suffix = Path(urlsplit(url).path).suffix.lower()
    host = (urlsplit(url).hostname or "").lower()
    is_jototech = host == "jototech.cn" or host.endswith(".jototech.cn")
    return suffix in RESOURCE_EXTENSIONS and bool(host) and not is_jototech


def generate_reports(
    run_dir: Path | str,
    validation_report: Any = None,
) -> dict[str, Any]:
    """Write the four Chinese delivery reports and return their numeric summary."""

    run_dir = Path(run_dir).resolve()
    manifests = run_dir / "manifests"
    urls = _records(_read_json(manifests / "urls.json", []))
    assets = _records(_read_json(manifests / "assets.json", []))
    references = _records(_read_json(manifests / "asset-references.json", []))
    errors = _records(_read_json(manifests / "crawl-errors.json", []))
    blocked = _records(_read_json(manifests / "blocked-requests.json", []))
    pages = _page_documents(run_dir)
    validation = _as_validation(validation_report, run_dir)
    findings = _validation_findings(validation)

    active = [item for item in urls if _status(item) == "active"]
    historical = [item for item in urls if _status(item) == "archived"]
    duplicates = [item for item in urls if _status(item) == "duplicate"]
    excluded_ai = [item for item in urls if _status(item) == "excluded-ai"]
    review = [item for item in urls if _status(item) == "review"]
    unreachable = [item for item in urls if _status(item) in {"unreachable", "error"}]
    unlinked = [item for item in urls if _is_unlinked(item)]
    resource_success, resource_failed = _resource_counts(assets, references)
    external_files = [item for item in assets if _is_external_file(item)]
    external_files.extend(item for item in references if _is_external_file(item))
    external_file_keys = {
        str(item.get("asset_id") or item.get("selected_url") or item.get("source_url") or _url(item))
        for item in external_files
    }
    external_file_keys.discard("")

    form_count = 0
    form_field_count = 0
    for page in pages:
        blocks = page.get("blocks", [])
        form_blocks = [
            item
            for item in blocks
            if isinstance(item, Mapping) and item.get("type") == "formDefinition"
        ] if isinstance(blocks, list) else []
        form_count += len(form_blocks)
        fields = page.get("form_fields")
        if isinstance(fields, list):
            form_field_count += len(fields)
        else:
            form_field_count += sum(
                int(item.get("data", {}).get("fieldCount", 0))
                for item in form_blocks
                if isinstance(item.get("data"), Mapping)
            )

    issues = _content_issues(run_dir, pages)
    unresolved_errors = [item for item in errors if not bool(item.get("resolved", False))]
    validation_errors = [item for item in findings if item.get("severity") == "error"]
    goodq_assets = [
        item
        for item in assets
        if any("goodq.top" in str(url).lower() for url in item.get("source_urls", []))
        or "goodq.top" in _url(item).lower()
    ]
    agify_records = [
        item
        for item in blocked + references
        if "agify" in json.dumps(item, ensure_ascii=False).lower()
    ]

    validation_valid = validation.get("valid")
    summary: dict[str, Any] = {
        "total_urls": len(urls),
        "captured_pages": len(active) + len(historical) + len(duplicates),
        "active_pages": len(active),
        "historical_pages": len(historical),
        "unlinked_pages": len(unlinked),
        "excluded_ai_pages": len(excluded_ai),
        "review_pages": len(review),
        "duplicate_pages": len(duplicates),
        "unreachable_pages": len(unreachable),
        "resource_success": resource_success,
        "resource_failed": resource_failed,
        "external_files": len(external_file_keys),
        "forms": form_count,
        "form_fields": form_field_count,
        "content_issues": len(issues),
        "unresolved_crawl_errors": len(unresolved_errors),
        "validation_errors": len(validation_errors),
        "validation_valid": validation_valid if isinstance(validation_valid, bool) else None,
        "goodq_assets": len(goodq_assets),
        "agify_records": len(agify_records),
    }

    status_text = (
        "通过" if summary["validation_valid"] is True else
        "未通过" if summary["validation_valid"] is False else
        "未提供验证结果"
    )
    main_report = f"""# 网站内容采集报告

## 本次交付概览

| 项目 | 数量/状态 |
| --- | ---: |
| 发现 URL | {summary['total_urls']} |
| 已归档页面（当前页面、历史页面及重复页证据） | {summary['captured_pages']} |
| 当前页面 | {summary['active_pages']} |
| 历史页面（仅保留内容，暂不加入新站导航） | {summary['historical_pages']} |
| 未出现在导航的页面 | {summary['unlinked_pages']} |
| JOTO AI / Dify 排除页面 | {summary['excluded_ai_pages']} |
| 待人工复核 | {summary['review_pages']} |
| 重复页面 | {summary['duplicate_pages']} |
| 不可达或采集错误页面 | {summary['unreachable_pages']} |
| 资源归档成功 | {summary['resource_success']} |
| 资源归档失败 | {summary['resource_failed']} |
| 外部公开文件 | {summary['external_files']} |
| 联系表单 | {summary['forms']} |
| 表单字段 | {summary['form_fields']} |
| 验证状态 | {status_text} |

“未出现在导航的页面”是指页面可通过公开 URL、Sitemap 或其他公开链接访问，但没有从原站主导航链接中发现；它不等于隐藏、私密或需要删除。此类页面已保留内容，默认暂不放入新站导航。

## 资源迁移说明

- 页面实际使用的图片、背景图、图标及公开下载文件按清单归档；外部公开文件单独计数。
- GoodQ 来源资源记录 {summary['goodq_assets']} 项，已为替换到新站自有服务器、OSS 或 COS 做准备。最终切换地址应在建站阶段完成，不再长期依赖 goodq.top。
- 图片清晰度以公开可取得的真实像素版本为准；同一二进制文件可去重，但每个页面上的 Alt、标题、说明和位置仍由引用清单分别保存。
- Agify 相关记录 {summary['agify_records']} 项：只记录原站加载情况，不迁移原脚本。新站如需要客服功能，应接入新站自己的 Agify 配置。

## 表单说明

本次识别到 {summary['forms']} 个表单、{summary['form_fields']} 个字段。二者是不同统计：一个表单可包含多个字段。本阶段只保存字段、标签、类型、必填状态及页面位置，不复制旧提交接口，也不连接邮件或数据库。

## 后续阶段提醒

- 新前端与视觉设计：本次只保证内容和证据完整，后续再用新的前端实现。
- 运营后台：后续建设可由运营人员编辑页面的后台，并将本次 JSON/Markdown 内容导入。
- 数据库：待新数据库方案确定后再连接，当前归档不迁移旧站数据库和表单提交接口。
- SEO：新域名上线前必须重新完成站点结构、标题描述、Canonical、结构化数据、重定向和 Sitemap 方案。
- 上线前应再次执行资源闭环、链接、移动端、表单和排除项验收。
"""

    issue_rows = [[item["page"], item["issue"]] for item in issues]
    issue_report = f"""# 内容问题清单

本清单只记录原站公开内容中发现的问题，不擅自改写原文。原文证据仍保留，后续由负责人决定如何修改。

## 内容问题

{_markdown_table(['页面/记录', '问题'], issue_rows)}

## 采集与验证异常

{_markdown_table(
    ['阶段/代码', '页面或文件', '说明'],
    [[item.get('stage', '采集'), item.get('url', '—'), _reason(item)] for item in unresolved_errors]
    + [[item.get('code', '验证'), item.get('path', '—'), item.get('message', '—')] for item in validation_errors],
)}
"""

    review_report = f"""# 待人工复核

待复核项目不会生成新站 CMS 正文，确认保留或排除后再进入后续建站流程。

## 名称或归属不明确的页面

{_markdown_table(
    ['URL', '复核原因', '发现来源'],
    [[_url(item), _reason(item), item.get('source', '—')] for item in review],
)}

## 未出现在主导航的公开页面

这些页面可通过公开 URL、Sitemap 或其他公开链接访问，但没有从原站主导航链接中发现。它们已保存内容，默认暂不加入新站导航，并不自动视为应删除页面。

{_markdown_table(
    ['URL', '状态', '发现来源'],
    [[_url(item), _status(item), item.get('source', '—')] for item in unlinked],
)}

## 重复页面

{_markdown_table(
    ['URL', '主记录/重复目标', '说明'],
    [[_url(item), item.get('duplicate_of', '—'), _reason(item)] for item in duplicates],
)}

## 不可达或采集错误

{_markdown_table(
    ['URL', '状态/阶段', '说明'],
    [[_url(item), _status(item), _reason(item)] for item in unreachable]
    + [[item.get('url', '—'), item.get('stage', '采集'), _reason(item)] for item in unresolved_errors],
)}
"""

    exclusion_report = f"""# 排除清单

本清单记录确定不迁入新站内容库的项目。原始网站不会被修改。

## JOTO AI / Dify 页面

{_markdown_table(
    ['URL', '排除规则', '发现来源'],
    [[_url(item), _reason(item), item.get('source', '—')] for item in excluded_ai],
)}

## 第三方脚本

- Agify：只记录原站加载情况，不迁移旧脚本或旧配置；新站如启用客服，应使用自己的 Agify。
- JOTO AI / Dify：相关正文、历史页面及其独立入口不进入 CMS 内容交付。
- 原始 HTML 证据可能包含全站公共导航或脚本中的相关字样，但该证据与 CMS 可用正文隔离保存，不能直接发布到新站。
"""

    _write(run_dir / "reports" / "采集报告.md", main_report)
    _write(run_dir / "reports" / "内容问题清单.md", issue_report)
    _write(run_dir / "reports" / "待人工复核.md", review_report)
    _write(run_dir / "reports" / "排除清单.md", exclusion_report)
    _write(
        run_dir / "reports" / "summary.json",
        json.dumps(summary, ensure_ascii=False, indent=2),
    )
    return summary


# A descriptive alias for callers that think in terms of writing artifacts.
write_reports = generate_reports
