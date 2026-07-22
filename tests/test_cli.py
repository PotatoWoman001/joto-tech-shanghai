from __future__ import annotations

from argparse import Namespace
from pathlib import Path

import pytest

import joto_archive.cli as cli
from joto_archive.config import load_config
from joto_archive.validate import ValidationFinding, ValidationReport


CONFIG_PATH = Path("config/jototech.json")


def test_smoke_refuses_more_than_three_urls_before_collection(monkeypatch: pytest.MonkeyPatch) -> None:
    called = False

    def fake_run(*args: object, **kwargs: object) -> int:
        nonlocal called
        called = True
        return 0

    monkeypatch.setattr(cli, "_run_collection", fake_run)
    with pytest.raises(SystemExit) as raised:
        cli.main(
            [
                "smoke",
                "--url", "https://www.jototech.cn/1",
                "--url", "https://www.jototech.cn/2",
                "--url", "https://www.jototech.cn/3",
                "--url", "https://www.jototech.cn/4",
            ]
        )
    assert raised.value.code == 2
    assert called is False


def test_full_crawl_requires_confirmation_before_collection(monkeypatch: pytest.MonkeyPatch) -> None:
    called = False

    def fake_run(*args: object, **kwargs: object) -> int:
        nonlocal called
        called = True
        return 0

    monkeypatch.setattr(cli, "_run_collection", fake_run)
    assert cli.main(["crawl", "--config", str(CONFIG_PATH)]) == 2
    assert called is False


def test_confirmed_full_and_valid_smoke_delegate(monkeypatch: pytest.MonkeyPatch) -> None:
    modes: list[str] = []

    def fake_run(args: Namespace, config: object, mode: str) -> int:
        modes.append(mode)
        return 0

    monkeypatch.setattr(cli, "_run_collection", fake_run)
    assert cli.main(["crawl", "--confirm-full-crawl"]) == 0
    assert cli.main(["smoke", "--url", "https://www.jototech.cn/"]) == 0
    assert modes == ["full", "smoke"]


class FakeStorage:
    def __init__(self, run_dir: Path) -> None:
        self.run_dir = run_dir
        self.finalized: dict[str, object] | None = None

    def finalize(self, summary: dict[str, object]) -> Path:
        self.finalized = summary
        return self.run_dir / "latest.json"


def test_validation_failure_generates_report_but_never_finalizes(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    storage = FakeStorage(tmp_path)
    report = ValidationReport(
        valid=False,
        findings=[ValidationFinding(severity="error", code="gap", message="missing")],
    )
    generated: list[object] = []
    monkeypatch.setattr(cli, "validate_run", lambda *args: report)
    monkeypatch.setattr(cli, "generate_reports", lambda *args: generated.append(args) or {})
    config = load_config(CONFIG_PATH)

    result = cli._validate_report_finalize(storage, config, mode="smoke")  # type: ignore[arg-type]
    assert result == 2
    assert storage.finalized is None
    assert generated
    assert (tmp_path / "manifests/validation.json").is_file()


def test_validation_success_is_the_only_path_that_finalizes(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    storage = FakeStorage(tmp_path)
    report = ValidationReport(valid=True)
    monkeypatch.setattr(cli, "validate_run", lambda *args: report)
    monkeypatch.setattr(cli, "generate_reports", lambda *args: {"captured_pages": 3})
    config = load_config(CONFIG_PATH)

    result = cli._validate_report_finalize(storage, config, mode="smoke")  # type: ignore[arg-type]
    assert result == 0
    assert storage.finalized == {
        "captured_pages": 3,
        "mode": "smoke",
        "validated": True,
    }


def test_low_disk_space_refuses_before_run_directory_is_created(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    config = load_config(CONFIG_PATH).model_copy(update={"output_dir": tmp_path / "archive"})
    monkeypatch.setattr(cli, "_free_bytes", lambda path: cli.MIN_FREE_BYTES - 1)
    args = Namespace(run_id="never", storage_state=None, url=["https://www.jototech.cn/"])
    assert cli._run_collection(args, config, "smoke") == 2
    assert not (tmp_path / "archive").exists()
