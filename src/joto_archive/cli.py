"""Chinese command-line entry point for safe archive collection and review."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path
from typing import Sequence

from .config import CrawlConfig, load_config
from .crawler import ArchiveCrawler
from .fetch import BrowserRenderer, HttpFetcher, SecurityChallengeError
from .inventory import InventoryError, fetch_public_inventory
from .reports import generate_reports
from .rules import classify_url
from .storage import RunStorage
from .validate import ValidationReport, validate_run


MIN_FREE_BYTES = 5 * 1024**3
DEFAULT_CONFIG = Path("config/jototech.json")


def _add_config_argument(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG, help="采集配置 JSON")


def _add_collection_arguments(parser: argparse.ArgumentParser) -> None:
    _add_config_argument(parser)
    parser.add_argument("--run-id", help="本次独立采集编号；默认使用 UTC 时间")
    parser.add_argument(
        "--storage-state",
        type=Path,
        help="用户手动通过 WAF 后导出的 Playwright 状态文件（不会提交 Git）",
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="joto-archive",
        description="JOTOTECH 原站只读内容归档工具（不会修改原网站）",
    )
    commands = parser.add_subparsers(dest="command", required=True)

    smoke = commands.add_parser("smoke", help="采集 1—3 个页面并验证")
    _add_collection_arguments(smoke)
    smoke.add_argument("--url", action="append", required=True, help="要采集的公开页面 URL")

    crawl = commands.add_parser("crawl", help="按公开 Sitemap 执行全站采集")
    _add_collection_arguments(crawl)
    crawl.add_argument(
        "--confirm-full-crawl",
        action="store_true",
        help="确认三页冒烟已验收并授权全站采集",
    )

    validate = commands.add_parser("validate", help="重新验证一个未修改的采集目录")
    _add_config_argument(validate)
    validate.add_argument("run_dir", type=Path)

    report = commands.add_parser("report", help="根据现有清单重新生成中文报告")
    report.add_argument("run_dir", type=Path)
    return parser


def _output_root(config: CrawlConfig) -> Path:
    path = config.output_dir
    return path.resolve() if path.is_absolute() else (Path.cwd() / path).resolve()


def _free_bytes(path: Path) -> int:
    candidate = path.resolve()
    while not candidate.exists() and candidate != candidate.parent:
        candidate = candidate.parent
    return shutil.disk_usage(candidate).free


def _write_validation(run_dir: Path, report: ValidationReport) -> None:
    path = run_dir / "manifests" / "validation.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(report.model_dump_json(indent=2) + "\n", encoding="utf-8")


def _validate_report_finalize(
    storage: RunStorage,
    config: CrawlConfig,
    *,
    mode: str,
) -> int:
    forbidden = tuple(dict.fromkeys((*config.excluded_terms, *config.excluded_title_terms)))
    validation = validate_run(storage.run_dir, forbidden)
    _write_validation(storage.run_dir, validation)
    summary = generate_reports(storage.run_dir, validation)
    summary.update(mode=mode, validated=validation.valid)
    if not validation.valid:
        print(
            f"采集结果未通过验证：{len(validation.errors)} 个错误。"
            f"请查看 {storage.run_dir / 'reports' / '内容问题清单.md'}",
            file=sys.stderr,
        )
        return 2
    storage.finalize(summary)
    print(f"采集与验证完成：{storage.run_dir}")
    return 0


def _run_collection(args: argparse.Namespace, config: CrawlConfig, mode: str) -> int:
    output_root = _output_root(config)
    free = _free_bytes(output_root)
    if free < MIN_FREE_BYTES:
        print(
            f"磁盘剩余空间不足 5 GiB（当前约 {free / 1024**3:.1f} GiB），未创建采集目录。",
            file=sys.stderr,
        )
        return 2
    if args.storage_state is not None and not args.storage_state.is_file():
        print(f"浏览器状态文件不存在：{args.storage_state}", file=sys.stderr)
        return 2

    storage = RunStorage(output_root, args.run_id)
    try:
        with HttpFetcher(config) as fetcher:
            if mode == "full":
                inventory = fetch_public_inventory(config, fetcher)
                items = inventory.items
                storage.write_json("manifests/sitemap-documents.json", inventory.sitemap_urls)
                print(f"Sitemap 库存发现 {len(items)} 个页面入口。")
            else:
                items = [classify_url(url, "smoke", config) for url in args.url]
            with BrowserRenderer(
                config,
                storage.run_dir,
                storage_state=args.storage_state,
            ) as renderer:
                ArchiveCrawler(
                    config,
                    storage,
                    fetcher,
                    renderer,
                    follow_discovered_links=(mode == "full"),
                ).run(items)
    except SecurityChallengeError as error:
        print(
            "原站 WAF/CAPTCHA 要求人工验证，采集已立即停止；未绕过验证，也未发布结果。"
            "请由站点管理员白名单当前采集环境，或提供手动验证后导出的 --storage-state。"
            f"\n详情：{error}",
            file=sys.stderr,
        )
        return 3
    except InventoryError as error:
        print(f"公开 Sitemap 库存不完整，已停止：{error}", file=sys.stderr)
        return 2
    except Exception as error:
        print(f"采集未完成，未发布结果：{type(error).__name__}: {error}", file=sys.stderr)
        return 1
    return _validate_report_finalize(storage, config, mode=mode)


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "report":
        summary = generate_reports(args.run_dir)
        print(f"中文报告已生成：{Path(args.run_dir).resolve() / 'reports'}（URL {summary['total_urls']} 条）")
        return 0

    config = load_config(args.config)
    if args.command == "validate":
        forbidden = tuple(dict.fromkeys((*config.excluded_terms, *config.excluded_title_terms)))
        validation = validate_run(args.run_dir, forbidden)
        _write_validation(args.run_dir, validation)
        generate_reports(args.run_dir, validation)
        print("验证通过。" if validation.valid else f"验证未通过：{len(validation.errors)} 个错误。")
        return 0 if validation.valid else 2

    if args.command == "smoke":
        if not 1 <= len(args.url) <= 3:
            parser.error("smoke 必须提供 1—3 个 --url，不能超过 3 个")
        return _run_collection(args, config, "smoke")

    if not args.confirm_full_crawl:
        print(
            "未提供 --confirm-full-crawl：全站采集未启动，也未创建运行目录。"
            "请先验收三页冒烟结果。",
            file=sys.stderr,
        )
        return 2
    return _run_collection(args, config, "full")


if __name__ == "__main__":
    raise SystemExit(main())
