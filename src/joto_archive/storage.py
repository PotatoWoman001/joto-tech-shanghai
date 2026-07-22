"""Immutable run storage and deterministic archive serialization."""

from __future__ import annotations

import csv
import json
import os
import re
import tempfile
from datetime import UTC, datetime
from pathlib import Path
from typing import Iterable, Mapping, Sequence

from pydantic import BaseModel

from .models import PageRecord


SAFE_COMPONENT = re.compile(r"[^A-Za-z0-9._-]+")


def safe_component(value: str) -> str:
    cleaned = SAFE_COMPONENT.sub("-", value).strip("-.")
    return cleaned or "item"


def default_run_id(now: datetime | None = None) -> str:
    stamp = (now or datetime.now(UTC)).astimezone(UTC)
    return stamp.strftime("%Y%m%dT%H%M%SZ")


def _jsonable(value: object) -> object:
    if isinstance(value, BaseModel):
        return value.model_dump(mode="json")
    if isinstance(value, Path):
        return value.as_posix()
    return value


def _atomic_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8", newline="") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        temporary_path = Path(temporary)
        if temporary_path.exists():
            temporary_path.unlink()


class RunStorage:
    """Write one crawl into a new directory; never reuse an earlier run."""

    def __init__(self, output_root: Path, run_id: str | None = None) -> None:
        self.output_root = output_root.resolve()
        self.run_id = safe_component(run_id or default_run_id())
        self.run_dir = self.output_root / "runs" / self.run_id
        if self.run_dir.exists():
            raise FileExistsError(f"run already exists: {self.run_dir}")
        self.run_dir.mkdir(parents=True)
        for directory in ("pages", "raw", "rendered", "markdown", "screenshots", "assets", "manifests", "reports"):
            (self.run_dir / directory).mkdir()

    def write_json(self, relative_path: str | Path, value: object) -> Path:
        path = self.run_dir / relative_path
        payload = json.dumps(_jsonable(value), ensure_ascii=False, indent=2, sort_keys=True)
        _atomic_text(path, payload + "\n")
        return path

    def write_text(self, relative_path: str | Path, value: str) -> Path:
        path = self.run_dir / relative_path
        _atomic_text(path, value)
        return path

    def write_bytes(self, relative_path: str | Path, value: bytes) -> Path:
        path = self.run_dir / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
        try:
            with os.fdopen(descriptor, "wb") as handle:
                handle.write(value)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, path)
        finally:
            temporary_path = Path(temporary)
            if temporary_path.exists():
                temporary_path.unlink()
        return path

    def write_csv(
        self,
        relative_path: str | Path,
        rows: Iterable[Mapping[str, object]],
        fieldnames: Sequence[str],
    ) -> Path:
        path = self.run_dir / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
        try:
            with os.fdopen(descriptor, "w", encoding="utf-8-sig", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
                writer.writeheader()
                for row in rows:
                    writer.writerow({key: _jsonable(value) for key, value in row.items()})
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, path)
        finally:
            temporary_path = Path(temporary)
            if temporary_path.exists():
                temporary_path.unlink()
        return path

    def write_page(
        self,
        page: PageRecord,
        *,
        markdown: str,
        raw_html: str,
        rendered_html: str,
        mobile_html: str = "",
    ) -> dict[str, Path]:
        page_id = safe_component(page.id)
        written = {
            "json": self.write_json(Path("pages") / f"{page_id}.json", page),
            "markdown": self.write_text(Path("markdown") / f"{page_id}.md", markdown),
            "raw_html": self.write_text(Path("raw") / f"{page_id}.html", raw_html),
            "rendered_html": self.write_text(Path("rendered") / f"{page_id}.desktop.html", rendered_html),
        }
        if mobile_html:
            written["mobile_html"] = self.write_text(
                Path("rendered") / f"{page_id}.mobile.html", mobile_html
            )
        return written

    def finalize(self, summary: Mapping[str, object]) -> Path:
        """Publish the run pointer only after validation has succeeded."""

        self.write_json("run.json", dict(summary) | {"run_id": self.run_id, "complete": True})
        latest = self.output_root / "latest.json"
        _atomic_text(
            latest,
            json.dumps({"run_id": self.run_id, "path": str(self.run_dir)}, ensure_ascii=False, indent=2) + "\n",
        )
        return latest
