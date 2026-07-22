"""Typed crawl configuration."""

import json
from pathlib import Path

from pydantic import BaseModel, Field, field_validator


class CrawlConfig(BaseModel):
    """Safety and output settings for a crawl."""

    base_url: str
    sitemap_url: str
    output_dir: Path
    request_delay_seconds: float = Field(ge=0.75)
    request_timeout_seconds: float = Field(gt=0)
    max_retries: int = Field(ge=1, le=5)
    max_workers: int = Field(default=1, ge=1, le=1)
    excluded_terms: tuple[str, ...]
    excluded_title_terms: tuple[str, ...]
    excluded_page_ids: tuple[str, ...]
    desktop_viewport: tuple[int, int]
    mobile_viewport: tuple[int, int]
    user_agent: str

    @field_validator("base_url", "sitemap_url")
    @classmethod
    def require_https(cls, value: str) -> str:
        if not value.startswith("https://"):
            raise ValueError("crawl URLs must use HTTPS")
        return value


def load_config(path: Path) -> CrawlConfig:
    """Load and validate crawl settings from JSON."""

    return CrawlConfig.model_validate(json.loads(path.read_text(encoding="utf-8")))

