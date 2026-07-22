from pathlib import Path

import pytest
from pydantic import ValidationError

from joto_archive.config import CrawlConfig, load_config


def test_load_config_has_safe_defaults() -> None:
    config = load_config(Path("config/jototech.json"))
    assert config.base_url == "https://www.jototech.cn/"
    assert config.request_delay_seconds >= 0.75
    assert config.max_workers == 1
    assert "15197" in config.excluded_page_ids
    assert set(config.excluded_page_ids) >= {"15197", "15071", "14249", "14227"}
    assert "8406" in config.excluded_post_ids
    assert "translator.jototech.cn" in config.excluded_domains
    assert set(config.excluded_terms) >= {"joto-ai", "jotoai", "dify"}
    assert set(config.excluded_title_terms) >= {"joto ai", "joto.ai", "dify"}
    assert config.desktop_viewport == (1440, 1000)
    assert config.mobile_viewport == (390, 844)


def test_config_rejects_parallel_workers() -> None:
    source = load_config(Path("config/jototech.json")).model_dump()
    source["max_workers"] = 2
    with pytest.raises(ValidationError):
        CrawlConfig.model_validate(source)


def test_config_rejects_aggressive_request_delay() -> None:
    source = load_config(Path("config/jototech.json")).model_dump()
    source["request_delay_seconds"] = 0.1
    with pytest.raises(ValidationError):
        CrawlConfig.model_validate(source)
