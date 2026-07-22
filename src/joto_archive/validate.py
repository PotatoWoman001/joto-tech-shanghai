"""Fail-closed validation for a completed archive run."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import Any, Iterable

from PIL import Image
from pydantic import BaseModel, Field


class ValidationFinding(BaseModel):
    severity: str
    code: str
    message: str
    path: str | None = None


class ValidationReport(BaseModel):
    valid: bool
    findings: list[ValidationFinding] = Field(default_factory=list)

    @property
    def errors(self) -> list[ValidationFinding]:
        return [finding for finding in self.findings if finding.severity == "error"]


def _read_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _error(findings: list[ValidationFinding], code: str, message: str, path: Path | None = None) -> None:
    findings.append(
        ValidationFinding(
            severity="error", code=code, message=message, path=str(path) if path else None
        )
    )


def _boundary_pattern(terms: Iterable[str]) -> re.Pattern[str] | None:
    escaped = [re.escape(term.strip()) for term in terms if term.strip()]
    if not escaped:
        return None
    return re.compile(r"(?<![A-Za-z0-9])(?:" + "|".join(escaped) + r")(?![A-Za-z0-9])", re.I)


def validate_run(run_dir: Path, forbidden_terms: Iterable[str] = ()) -> ValidationReport:
    run_dir = run_dir.resolve()
    findings: list[ValidationFinding] = []
    urls = _read_json(run_dir / "manifests" / "urls.json", [])
    assets = _read_json(run_dir / "manifests" / "assets.json", [])
    references = _read_json(run_dir / "manifests" / "asset-references.json", [])
    crawl_errors = _read_json(run_dir / "manifests" / "crawl-errors.json", [])
    baselines = _read_json(run_dir / "manifests" / "baselines.json", {})

    captured_statuses = {"active", "archived", "duplicate"}
    excluded_statuses = {"excluded-ai", "review", "external", "resource"}
    expected_page_files: set[Path] = set()
    forbidden = _boundary_pattern(forbidden_terms)

    for entry in urls:
        status = entry.get("status")
        page_id = entry.get("page_id")
        if status in captured_statuses:
            if not page_id:
                _error(findings, "missing-page-id", f"captured URL has no page_id: {entry.get('url')}")
                continue
            companions = [
                run_dir / "pages" / f"{page_id}.json",
                run_dir / "markdown" / f"{page_id}.md",
                run_dir / "raw" / f"{page_id}.html",
                run_dir / "rendered" / f"{page_id}.desktop.html",
            ]
            expected_page_files.add(companions[0])
            for path in companions:
                if not path.is_file() or not path.stat().st_size:
                    _error(findings, "missing-companion", f"missing or empty page companion for {page_id}", path)
            page_path = companions[0]
            if page_path.exists() and page_path.stat().st_size:
                page = _read_json(page_path, {})
                if not page.get("blocks"):
                    _error(findings, "empty-content", f"no extracted blocks for {page_id}", page_path)
                if status == "duplicate" and not page.get("duplicate_of"):
                    _error(findings, "open-duplicate", f"duplicate page has no duplicate_of: {page_id}", page_path)
                if forbidden and forbidden.search(json.dumps(page, ensure_ascii=False)):
                    _error(findings, "forbidden-content", f"excluded AI term found in CMS-ready page {page_id}", page_path)

            for device in ("desktop", "mobile"):
                flat_path = run_dir / "screenshots" / f"{page_id}.{device}.png"
                nested_path = run_dir / "screenshots" / device / f"{page_id}.png"
                image_path = flat_path if flat_path.exists() else nested_path
                try:
                    with Image.open(image_path) as image:
                        image.verify()
                except Exception as exc:  # Pillow exposes multiple decode exceptions
                    _error(findings, "invalid-screenshot", f"{page_id} {device} screenshot: {exc}", image_path)

            baseline = baselines.get(page_id)
            if not baseline:
                _error(findings, "missing-baseline", f"independent capture baseline missing for {page_id}")
            else:
                if baseline.get("extracted_text_blocks", 0) < baseline.get("dom_text_blocks", 0):
                    _error(findings, "text-count-gap", f"DOM text count exceeds extracted count for {page_id}")
                if baseline.get("archived_asset_urls", 0) < baseline.get("network_asset_urls", 0):
                    _error(findings, "asset-count-gap", f"network asset count exceeds archived count for {page_id}")
        elif status in excluded_statuses and page_id:
            page_path = run_dir / "pages" / f"{page_id}.json"
            if page_path.exists():
                _error(findings, "excluded-page-output", f"excluded/review URL generated CMS output: {page_id}", page_path)

    for path in (run_dir / "pages").glob("*.json"):
        if path not in expected_page_files:
            _error(findings, "orphan-page", "page output is not represented by the URL manifest", path)

    assets_by_id = {asset.get("asset_id"): asset for asset in assets if asset.get("asset_id")}
    for asset_id, asset in assets_by_id.items():
        relative_path = asset.get("relative_path")
        if not relative_path:
            _error(findings, "asset-no-path", f"asset has no relative path: {asset_id}")
            continue
        path = run_dir / relative_path
        if not path.is_file():
            _error(findings, "missing-asset", f"asset file missing: {asset_id}", path)
            continue
        expected_hash = asset.get("sha256")
        if expected_hash and hashlib.sha256(path.read_bytes()).hexdigest() != expected_hash:
            _error(findings, "asset-hash-mismatch", f"asset hash mismatch: {asset_id}", path)

    referenced_ids: set[str] = set()
    for reference in references:
        if reference.get("status") != "downloaded":
            _error(findings, "unresolved-asset-reference", f"asset reference unresolved: {reference.get('source_url') or reference.get('selected_url')}")
            continue
        asset_id = reference.get("asset_id")
        if not asset_id or asset_id not in assets_by_id:
            _error(findings, "unknown-asset-reference", f"asset reference has unknown asset_id: {asset_id}")
        else:
            referenced_ids.add(asset_id)
    for asset_id in assets_by_id.keys() - referenced_ids:
        _error(findings, "orphan-asset", f"asset has no page reference: {asset_id}")

    for error in crawl_errors:
        if not error.get("resolved", False):
            _error(findings, "unresolved-crawl-error", f"{error.get('stage')}: {error.get('url')} — {error.get('message')}")

    return ValidationReport(valid=not any(item.severity == "error" for item in findings), findings=findings)
