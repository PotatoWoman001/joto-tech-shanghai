"""Shared data models for discovery, capture, extraction, and storage."""

from enum import StrEnum
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class PageStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DUPLICATE = "duplicate"
    EXCLUDED_AI = "excluded-ai"
    EXTERNAL = "external"
    RESOURCE = "resource"
    REVIEW = "review"
    UNREACHABLE = "unreachable"
    ERROR = "error"


class DiscoveredUrl(BaseModel):
    url: str
    source: str
    discovered_from: str | None = None
    navigation_path: list[str] = Field(default_factory=list)
    status: PageStatus
    exclusion_rule: str | None = None


class Block(BaseModel):
    type: str
    order: int
    data: dict[str, Any]
    source_html: str | None = None


class FormField(BaseModel):
    name: str
    label: str
    field_type: str
    required: bool
    order: int


class AssetRecord(BaseModel):
    asset_id: str
    source_urls: list[str]
    final_url: str
    relative_path: Path
    original_filename: str
    suggested_filename: str
    mime_type: str
    byte_size: int
    sha256: str
    width: int | None = None
    height: int | None = None
    alt: str = ""
    title: str = ""
    caption: str = ""
    usage_notes: list[str] = Field(default_factory=list)
    referenced_by: list[str] = Field(default_factory=list)
    is_external: bool = False
    download_status: str = "downloaded"
    quality_note: str = "highest-publicly-available"


class PageRecord(BaseModel):
    id: str
    source_url: str
    source_aliases: list[str] = Field(default_factory=list)
    source_page_id: str | None = None
    title: str
    language: str
    status: PageStatus
    navigation_path: list[str] = Field(default_factory=list)
    breadcrumbs: list[str] = Field(default_factory=list)
    content_type: str
    blocks: list[Block]
    assets: list[str] = Field(default_factory=list)
    internal_links: list[str] = Field(default_factory=list)
    external_links: list[str] = Field(default_factory=list)
    download_links: list[str] = Field(default_factory=list)
    form_fields: list[FormField] = Field(default_factory=list)
    captured_at: str
    content_hash: str
    issues: list[str] = Field(default_factory=list)


class FetchResult(BaseModel):
    requested_url: str
    final_url: str
    status_code: int
    content_type: str
    body: bytes
    attempts: int
    redirect_chain: list[str] = Field(default_factory=list)
    truncated: bool = False


class RenderedPage(BaseModel):
    url: str
    html: str
    mobile_html: str = ""
    desktop_screenshot: Path
    mobile_screenshot: Path
    console_errors: list[str] = Field(default_factory=list)
    resource_urls: list[str] = Field(default_factory=list)
    blocked_requests: list[str] = Field(default_factory=list)
    redirect_chain: list[str] = Field(default_factory=list)
