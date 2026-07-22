"""Discover and archive publicly available page assets without losing references.

Asset binaries and page references deliberately have separate models: a SHA-256
digest identifies one stored binary, while every occurrence keeps its own alt,
title, caption, usage, and DOM position.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import io
import mimetypes
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Protocol
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree

from bs4 import BeautifulSoup, Tag
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel

from joto_archive.fetch import SecurityChallengeError
from joto_archive.models import AssetRecord, AssetReference


SIZE_SUFFIX = re.compile(r"-(\d+)x(\d+)(?=\.[a-zA-Z0-9]+$)")
CSS_BACKGROUND_URL = re.compile(
    r"(?:background(?:-image)?|content)\s*:[^;{}]*?url\(\s*[\"']?([^\"')]+)",
    re.IGNORECASE,
)
IMAGE_EXTENSIONS = {".apng", ".avif", ".bmp", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".tif", ".tiff", ".webp"}
DOCUMENT_EXTENSIONS = {
    ".7z",
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
DOWNLOAD_EXTENSIONS = IMAGE_EXTENSIONS | DOCUMENT_EXTENSIONS
UNSAFE_SCHEMES = {"blob", "data", "javascript"}


class Fetcher(Protocol):
    def get(self, url: str) -> Any: ...


class AssetCandidate(BaseModel):
    urls: list[str]
    alt: str = ""
    title: str = ""
    caption: str = ""
    usage: str = "content-image"
    source_position: str = ""
    kind: str = "image"


@dataclass(frozen=True)
class _Inspection:
    source_url: str
    final_url: str
    body: bytes
    declared_mime: str
    detected_mime: str
    kind: str
    width: int | None = None
    height: int | None = None

    @property
    def digest(self) -> str:
        return hashlib.sha256(self.body).hexdigest()


def _safe_absolute(raw: str, page_url: str) -> str | None:
    value = raw.strip()
    if not value or value.startswith("#"):
        return None
    scheme = urlsplit(value).scheme.lower()
    if scheme in UNSAFE_SCHEMES:
        return None
    absolute = urljoin(page_url, value)
    return absolute if urlsplit(absolute).scheme.lower() in {"http", "https"} else None


def _original_variant(url: str) -> str:
    parts = urlsplit(url)
    if Path(parts.path).suffix.lower() not in IMAGE_EXTENSIONS:
        return url
    path = SIZE_SUFFIX.sub("", parts.path)
    return parts._replace(path=path).geturl()


def _decode_base64_url(token: str) -> str | None:
    value = unquote(token).replace("_p_p100_p_3D", "=")
    value = value.replace("-", "+").replace("_", "/")
    value += "=" * (-len(value) % 4)
    try:
        decoded = base64.b64decode(value, validate=True).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError, ValueError):
        return None
    return decoded if decoded.startswith(("http://", "https://")) else None


def decode_goodq_url(url: str) -> str | None:
    """Recover the public origin embedded in a GoodQ cache URL, if present."""

    parts = urlsplit(url)
    hostname = (parts.hostname or "").lower()
    if hostname != "goodq.top" and not hostname.endswith(".goodq.top"):
        return None

    # GoodQ appends the rendered extension to an encoded path segment. Work
    # backwards so path layouts other than the currently observed one remain
    # harmless and decodable.
    for segment in reversed([item for item in parts.path.split("/") if item]):
        attempts = [segment]
        if "." in segment:
            attempts.insert(0, segment.rsplit(".", 1)[0])
        for token in attempts:
            decoded = _decode_base64_url(token)
            if decoded:
                return decoded
    return None


def _srcset_values(value: str) -> list[tuple[float, str]]:
    parsed: list[tuple[float, str]] = []
    for item in value.split(","):
        pieces = item.strip().split()
        if not pieces:
            continue
        score = 0.0
        if len(pieces) > 1:
            descriptor = pieces[-1].lower()
            try:
                if descriptor.endswith("w"):
                    score = float(descriptor[:-1])
                elif descriptor.endswith("x"):
                    score = float(descriptor[:-1]) * 10_000
            except ValueError:
                score = 0.0
        parsed.append((score, pieces[0]))
    return parsed


def _expanded_urls(values: list[tuple[float, str]], page_url: str) -> list[str]:
    expanded: list[tuple[float, int, str]] = []
    for order, (score, raw) in enumerate(values):
        absolute = _safe_absolute(raw, page_url)
        if not absolute:
            continue
        decoded = decode_goodq_url(absolute)
        bases = [decoded, absolute] if decoded else [absolute]
        for base_index, base in enumerate(bases):
            if not base:
                continue
            original = _original_variant(base)
            if original != base:
                expanded.append((score, 3 - base_index, original))
            expanded.append((score, 1 - base_index, base))
    # Ordering is only a deterministic hint. AssetStore still retrieves and
    # validates every URL before it selects anything.
    expanded.sort(key=lambda item: (item[1], item[0]), reverse=True)
    return list(dict.fromkeys(item[2] for item in expanded))


def _image_values(image: Tag) -> list[tuple[float, str]]:
    values: list[tuple[float, str]] = []
    picture = image.find_parent("picture")
    if picture:
        for source in picture.select("source"):
            for attr in ("srcset", "data-srcset", "data-lazy-srcset"):
                values.extend(_srcset_values(str(source.get(attr, ""))))
            for attr in ("src", "data-src", "data-original", "data-lazy-src"):
                if source.get(attr):
                    values.append((0, str(source[attr])))
    for attr in ("srcset", "data-srcset", "data-lazy-srcset"):
        values.extend(_srcset_values(str(image.get(attr, ""))))
    for attr in (
        "data-original",
        "data-src",
        "data-lazy-src",
        "data-lazy",
        "data-url",
        "src",
    ):
        if image.get(attr):
            values.append((0, str(image[attr])))
    return values


def asset_candidates(
    html: str,
    page_url: str,
    loaded_resource_urls: list[str] | tuple[str, ...] | None = None,
) -> list[AssetCandidate]:
    """Collect logical assets and all of their public candidate variants."""

    soup = BeautifulSoup(html, "lxml")
    output: list[AssetCandidate] = []

    for image_index, image in enumerate(soup.select("img")):
        urls = _expanded_urls(_image_values(image), page_url)
        if not urls:
            continue
        figure = image.find_parent("figure")
        figcaption = figure.find("figcaption") if figure else None
        output.append(
            AssetCandidate(
                urls=urls,
                alt=str(image.get("alt", "")),
                title=str(image.get("title", "")),
                caption=figcaption.get_text(" ", strip=True) if figcaption else "",
                usage="content-image",
                source_position=f"img[{image_index}]",
                kind="image",
            )
        )

    style_sources = [tag.get_text(" ", strip=False) for tag in soup.select("style")]
    style_sources.extend(str(tag.get("style", "")) for tag in soup.select("[style]"))
    background_index = 0
    for style in style_sources:
        for raw in CSS_BACKGROUND_URL.findall(style):
            urls = _expanded_urls([(0, raw)], page_url)
            if urls:
                output.append(
                    AssetCandidate(
                        urls=urls,
                        usage="css-background",
                        source_position=f"background[{background_index}]",
                        kind="image",
                    )
                )
                background_index += 1

    for element in soup.select("[data-bg], [data-background], [data-background-image]"):
        for attribute in ("data-bg", "data-background", "data-background-image"):
            raw = str(element.get(attribute, "")).strip()
            if not raw:
                continue
            match = re.fullmatch(r"url\(\s*[\"']?([^\"')]+)[\"']?\s*\)", raw, re.IGNORECASE)
            urls = _expanded_urls([(0, match.group(1) if match else raw)], page_url)
            if urls:
                output.append(
                    AssetCandidate(
                        urls=urls,
                        usage="lazy-css-background",
                        source_position=f"background[{background_index}]",
                        kind="image",
                    )
                )
                background_index += 1

    for anchor_index, anchor in enumerate(soup.select("a[href]")):
        href = _safe_absolute(str(anchor.get("href", "")), page_url)
        if not href:
            continue
        extension = Path(urlsplit(href).path).suffix.lower()
        declared_type = _normalise_mime(str(anchor.get("type", "")))
        explicit_download = anchor.has_attr("download")
        type_is_download = declared_type.startswith("image/") or declared_type.startswith(
            ("application/", "text/csv")
        )
        if extension not in DOWNLOAD_EXTENSIONS and not explicit_download and not type_is_download:
            continue
        kind = "image" if extension in IMAGE_EXTENSIONS or declared_type.startswith("image/") else "document"
        output.append(
            AssetCandidate(
                urls=_expanded_urls([(0, href)], page_url),
                title=anchor.get_text(" ", strip=True),
                usage="download-link",
                source_position=f"a[{anchor_index}]",
                kind=kind,
            )
        )

    for resource_index, raw in enumerate(loaded_resource_urls or ()):
        resource = _safe_absolute(raw, page_url)
        if not resource:
            continue
        decoded = decode_goodq_url(resource)
        inspect_url = decoded or resource
        extension = Path(urlsplit(inspect_url).path).suffix.lower()
        if extension not in DOWNLOAD_EXTENSIONS:
            continue
        kind = "image" if extension in IMAGE_EXTENSIONS else "document"
        urls = _expanded_urls([(0, resource)], page_url)
        if urls:
            output.append(
                AssetCandidate(
                    urls=urls,
                    usage="browser-loaded-resource",
                    source_position=f"performance[{resource_index}]",
                    kind=kind,
                )
            )
    return output


def _normalise_mime(value: str) -> str:
    mime = value.split(";", 1)[0].strip().lower()
    aliases = {"image/jpg": "image/jpeg", "image/x-png": "image/png", "application/x-pdf": "application/pdf"}
    return aliases.get(mime, mime)


def _raster_inspection(body: bytes) -> tuple[str, int, int] | None:
    try:
        with Image.open(io.BytesIO(body)) as image:
            width, height = image.size
            detected_format = (image.format or "").upper()
            image.verify()
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError):
        return None
    mime = Image.MIME.get(detected_format)
    return (_normalise_mime(mime), width, height) if mime else None


def _is_svg(body: bytes) -> bool:
    try:
        root = ElementTree.fromstring(body)
    except ElementTree.ParseError:
        return False
    return root.tag.rsplit("}", 1)[-1].lower() == "svg"


def _document_magic(body: bytes, url: str) -> str | None:
    if body.startswith(b"%PDF-"):
        return "application/pdf"
    if body.startswith(b"{\\rtf"):
        return "application/rtf"
    if body.startswith(b"Rar!\x1a\x07"):
        return "application/vnd.rar"
    if body.startswith(b"7z\xbc\xaf\x27\x1c"):
        return "application/x-7z-compressed"
    if body.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):
        extension = Path(urlsplit(url).path).suffix.lower()
        return {
            ".doc": "application/msword",
            ".xls": "application/vnd.ms-excel",
            ".ppt": "application/vnd.ms-powerpoint",
        }.get(extension, "application/x-ole-storage")
    if body.startswith(b"PK\x03\x04") and zipfile.is_zipfile(io.BytesIO(body)):
        with zipfile.ZipFile(io.BytesIO(body)) as archive:
            names = set(archive.namelist())
        if any(name.startswith("word/") for name in names):
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        if any(name.startswith("xl/") for name in names):
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        if any(name.startswith("ppt/") for name in names):
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        return "application/zip"
    extension = Path(urlsplit(url).path).suffix.lower()
    if extension in {".csv", ".txt"} and b"\x00" not in body[:4096]:
        sample = body[:4096].lstrip().lower()
        if sample.startswith((b"<!doctype html", b"<html", b"<head", b"<body")):
            return None
        try:
            body.decode("utf-8-sig")
        except UnicodeDecodeError:
            return None
        return "text/csv" if extension == ".csv" else "text/plain"
    return None


def _mime_matches(declared: str, detected: str) -> bool:
    if not declared or declared == "application/octet-stream":
        return True
    if declared == detected:
        return True
    if detected == "image/svg+xml" and declared in {"application/xml", "text/xml", "text/plain"}:
        return True
    if detected == "application/rtf" and declared in {"application/rtf", "text/rtf"}:
        return True
    if detected == "text/csv" and declared in {"text/csv", "text/plain", "application/csv"}:
        return True
    if detected.startswith("application/vnd.openxmlformats-officedocument"):
        return declared in {detected, "application/zip", "application/x-zip-compressed"}
    if detected == "application/zip":
        return declared in {"application/zip", "application/x-zip-compressed"}
    if detected == "application/x-ole-storage":
        return declared in {"application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint"}
    return False


def _inspect_response(response: Any, source_url: str, kind: str) -> tuple[_Inspection | None, str]:
    status_code = int(getattr(response, "status_code", 0))
    if status_code != 200:
        return None, f"http-status-{status_code}"
    body = bytes(getattr(response, "body", b""))
    if not body:
        return None, "empty-body"
    final_url = str(getattr(response, "final_url", source_url))
    declared = _normalise_mime(str(getattr(response, "content_type", "")))

    if kind == "image":
        if _is_svg(body):
            detected, width, height = "image/svg+xml", None, None
        else:
            raster = _raster_inspection(body)
            if raster is None:
                return None, "invalid-image-magic"
            detected, width, height = raster
    else:
        detected = _document_magic(body, final_url)
        if detected is None:
            return None, "invalid-document-magic"
        width = height = None

    if not _mime_matches(declared, detected):
        return None, f"mime-mismatch:declared={declared or 'missing'}:detected={detected}"
    return (
        _Inspection(
            source_url=source_url,
            final_url=final_url,
            body=body,
            declared_mime=declared,
            detected_mime=detected,
            kind=kind,
            width=width,
            height=height,
        ),
        "valid",
    )


def _suffix_for(inspection: _Inspection) -> str:
    extension = Path(urlsplit(inspection.final_url).path).suffix.lower()
    preferred = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
        "image/tiff": ".tiff",
        "image/bmp": ".bmp",
        "image/x-icon": ".ico",
        "application/pdf": ".pdf",
        "application/rtf": ".rtf",
        "application/vnd.rar": ".rar",
        "application/x-7z-compressed": ".7z",
        "application/zip": ".zip",
        "application/msword": ".doc",
        "application/vnd.ms-excel": ".xls",
        "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    }
    return preferred.get(inspection.detected_mime, extension or mimetypes.guess_extension(inspection.detected_mime) or ".bin")


def _choose(valid: list[_Inspection], kind: str) -> tuple[_Inspection, str]:
    if kind == "image":
        vectors = [item for item in valid if item.detected_mime == "image/svg+xml"]
        rasters = [item for item in valid if item.detected_mime != "image/svg+xml"]
        if vectors:
            chosen = max(vectors, key=lambda item: len(item.body))
            note = (
                "selected-svg-vector;not-ranked-by-raster-pixels;"
                f"verified-svg={len(vectors)};verified-raster={len(rasters)};selected-bytes={len(chosen.body)}"
            )
            return chosen, note
        chosen = max(rasters, key=lambda item: ((item.width or 0) * (item.height or 0), len(item.body)))
        note = (
            "selected-raster-by-pixel-area-then-bytes;"
            f"verified-raster={len(rasters)};selected={chosen.width}x{chosen.height};selected-bytes={len(chosen.body)}"
        )
        return chosen, note
    chosen = max(valid, key=lambda item: len(item.body))
    return chosen, f"selected-document-by-verified-byte-size;verified-documents={len(valid)};selected-bytes={len(chosen.body)}"


class AssetStore:
    def __init__(self, output_dir: Path, fetcher: Fetcher):
        self.output_dir = output_dir
        self.fetcher = fetcher
        self.by_hash: dict[str, AssetRecord] = {}
        self.references: list[AssetReference] = []
        self.failures: list[dict[str, Any]] = []
        self.candidate_evidence: list[dict[str, Any]] = []
        self._response_cache: dict[str, Any] = {}

    def _fetch(self, url: str) -> tuple[Any | None, str | None]:
        cached = self._response_cache.get(url)
        if cached is not None:
            if isinstance(cached, Exception):
                return None, f"fetch-exception:{type(cached).__name__}:{cached}"
            return cached, None
        try:
            response = self.fetcher.get(url)
        except SecurityChallengeError:
            raise
        except Exception as error:  # Fetch errors are evidence, not crawl-stopping errors.
            self._response_cache[url] = error
            return None, f"fetch-exception:{type(error).__name__}:{error}"
        self._response_cache[url] = response
        return response, None

    def archive(self, candidates: list[AssetCandidate], page_id: str) -> list[AssetRecord]:
        records: list[AssetRecord] = []
        for candidate in candidates:
            valid: list[_Inspection] = []
            for candidate_index, url in enumerate(candidate.urls):
                evidence: dict[str, Any] = {
                    "page_id": page_id,
                    "source_position": candidate.source_position,
                    "usage": candidate.usage,
                    "candidate_index": candidate_index,
                    "url": url,
                    "valid": False,
                }
                response, fetch_error = self._fetch(url)
                if fetch_error:
                    evidence["reason"] = fetch_error
                    self.failures.append(dict(evidence))
                    self.candidate_evidence.append(evidence)
                    continue
                inspection, reason = _inspect_response(response, url, candidate.kind)
                evidence.update(
                    {
                        "status_code": int(getattr(response, "status_code", 0)),
                        "final_url": str(getattr(response, "final_url", url)),
                        "declared_mime": _normalise_mime(str(getattr(response, "content_type", ""))),
                        "byte_size": len(bytes(getattr(response, "body", b""))),
                        "reason": reason,
                    }
                )
                if inspection is None:
                    self.failures.append(dict(evidence))
                    self.candidate_evidence.append(evidence)
                    continue
                evidence.update(
                    {
                        "valid": True,
                        "detected_mime": inspection.detected_mime,
                        "width": inspection.width,
                        "height": inspection.height,
                        "sha256": inspection.digest,
                    }
                )
                self.candidate_evidence.append(evidence)
                valid.append(inspection)

            if not valid:
                self.failures.append(
                    {
                        "page_id": page_id,
                        "source_position": candidate.source_position,
                        "usage": candidate.usage,
                        "candidate_urls": " | ".join(candidate.urls),
                        "reason": "no-verified-candidate",
                    }
                )
                continue

            chosen, quality_note = _choose(valid, candidate.kind)
            digest = chosen.digest
            matching_urls = list(
                dict.fromkeys(
                    url
                    for item in valid
                    if item.digest == digest
                    for url in (item.source_url, item.final_url)
                )
            )
            existing = self.by_hash.get(digest)
            if existing is None:
                suffix = _suffix_for(chosen)
                folder = "images" if candidate.kind == "image" else "documents"
                relative = Path("assets") / folder / f"{digest}{suffix}"
                target = self.output_dir / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(chosen.body)
                existing = AssetRecord(
                    asset_id=f"asset-{digest[:16]}",
                    source_urls=matching_urls,
                    final_url=chosen.final_url,
                    relative_path=relative,
                    original_filename=Path(urlsplit(chosen.final_url).path).name,
                    suggested_filename=relative.name,
                    mime_type=chosen.detected_mime,
                    byte_size=len(chosen.body),
                    sha256=digest,
                    width=chosen.width,
                    height=chosen.height,
                    # Per-occurrence metadata belongs to AssetReference.
                    alt="",
                    title="",
                    caption="",
                    usage_notes=[],
                    referenced_by=[page_id],
                    is_external=not (
                        (urlsplit(chosen.final_url).hostname or "").lower() == "jototech.cn"
                        or (urlsplit(chosen.final_url).hostname or "").lower().endswith(".jototech.cn")
                    ),
                    quality_note=quality_note,
                )
                self.by_hash[digest] = existing
            else:
                for url in matching_urls:
                    if url not in existing.source_urls:
                        existing.source_urls.append(url)
                if page_id not in existing.referenced_by:
                    existing.referenced_by.append(page_id)

            usage_note = f"{candidate.usage}:{candidate.source_position}"
            if usage_note not in existing.usage_notes:
                existing.usage_notes.append(usage_note)
            self.references.append(
                AssetReference(
                    asset_id=existing.asset_id,
                    page_id=page_id,
                    local_path=existing.relative_path,
                    source_url=chosen.source_url,
                    selected_url=chosen.final_url,
                    candidate_urls=candidate.urls,
                    alt=candidate.alt,
                    title=candidate.title,
                    caption=candidate.caption,
                    usage=candidate.usage,
                    source_position=candidate.source_position,
                )
            )
            records.append(existing)
        return records
