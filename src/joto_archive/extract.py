"""Lossless, ordered semantic extraction from rendered public page HTML.

The extractor deliberately keeps presentation markup out of the content model while
retaining the original source fragment and a stable source locator for every block.
Unknown visible content is evidence, not noise: it is preserved as an ``unknown``
block and is never silently discarded.
"""

from __future__ import annotations

import hashlib
import json
import re
from datetime import UTC, datetime
from pathlib import PurePosixPath
from urllib.parse import parse_qs, urljoin, urlsplit

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

from joto_archive.models import Block, FormField, PageRecord, PageStatus


HEADING_TAGS = {f"h{level}" for level in range(1, 7)}
GENERIC_CONTAINERS = {"article", "div", "main", "section"}
IGNORED_TAGS = {"aside", "footer", "header", "nav", "noscript", "script", "style", "template"}
INLINE_TAGS = {
    "a",
    "abbr",
    "b",
    "bdi",
    "bdo",
    "br",
    "cite",
    "code",
    "del",
    "em",
    "i",
    "ins",
    "kbd",
    "mark",
    "q",
    "s",
    "samp",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "time",
    "u",
    "var",
    "wbr",
}
DOWNLOAD_EXTENSIONS = {
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
SOURCE_METADATA_KEYS = {
    "formIndex",
    "mobileOnly",
    "sourceLocator",
    "sourceLocators",
    "sourceHidden",
    "sourceHiddenReasons",
    "viewport",
}
PARAGRAPH_SPLIT_TAGS = {
    "blockquote",
    "embed",
    "figure",
    "form",
    "iframe",
    "img",
    "object",
    "ol",
    "picture",
    "table",
    "ul",
    "video",
}


def _normal_text(value: str) -> str:
    """Normalize layout whitespace only; never alter source words or punctuation."""

    return " ".join(value.split())


def _visible_text(tag: Tag) -> str:
    # An empty separator preserves the exact relationship between adjacent text
    # nodes (notably punctuation immediately following inline markup).
    return _normal_text(tag.get_text("", strip=False))


def _is_hidden(tag: Tag, boundary: Tag | None = None) -> bool:
    """Return whether a node is non-content markup, not merely collapsed UI."""

    current: Tag | None = tag
    while current is not None:
        if current.name in IGNORED_TAGS:
            return True
        if current is boundary:
            break
        current = current.parent if isinstance(current.parent, Tag) else None
    return False


def _hidden_reasons(tag: Tag, boundary: Tag | None = None) -> list[str]:
    reasons: list[str] = []
    current: Tag | None = tag
    while current is not None:
        if current.has_attr("hidden") and "hidden-attribute" not in reasons:
            reasons.append("hidden-attribute")
        if str(current.get("aria-hidden", "")).lower() == "true" and "aria-hidden" not in reasons:
            reasons.append("aria-hidden")
        style = re.sub(r"\s+", "", str(current.get("style", "")).lower())
        if "display:none" in style and "display-none" not in reasons:
            reasons.append("display-none")
        if "visibility:hidden" in style and "visibility-hidden" not in reasons:
            reasons.append("visibility-hidden")
        if current is boundary:
            break
        current = current.parent if isinstance(current.parent, Tag) else None
    return reasons


def _page_id(source_url: str, soup: BeautifulSoup) -> tuple[str, str | None]:
    body_classes = " ".join(soup.body.get("class", [])) if soup.body else ""
    match = re.search(r"page-id-(\d+)", body_classes)
    query_id = parse_qs(urlsplit(source_url).query).get("page_id", [None])[0]
    source_id = match.group(1) if match else query_id
    source_label = source_id or "url"
    url_digest = hashlib.sha256(source_url.encode()).hexdigest()[:10]
    return f"page-{source_label}-{url_digest}", source_id


def _tag_locator(tag: Tag, root: Tag) -> str:
    """Return a deterministic CSS-like path within the selected content root."""

    parts: list[str] = []
    current: Tag | None = tag
    while current is not None:
        name = current.name or "node"
        element_id = current.get("id")
        if element_id:
            part = f"{name}#{element_id}"
        else:
            siblings = (
                [sibling for sibling in current.parent.find_all(name, recursive=False)]
                if isinstance(current.parent, Tag)
                else [current]
            )
            position = next(
                index for index, sibling in enumerate(siblings, start=1) if sibling is current
            )
            part = f"{name}:nth-of-type({position})"
        parts.append(part)
        if current is root:
            break
        current = current.parent if isinstance(current.parent, Tag) else None
    return " > ".join(reversed(parts))


def _absolute(source_url: str, value: str | None) -> str:
    return urljoin(source_url, value.strip()) if value and value.strip() else ""


def _srcset_urls(source_url: str, value: str | None) -> list[str]:
    if not value:
        return []
    urls: list[str] = []
    for candidate in value.split(","):
        raw = candidate.strip().split()[0] if candidate.strip() else ""
        absolute = _absolute(source_url, raw)
        if absolute and absolute not in urls:
            urls.append(absolute)
    return urls


def _image_data(container: Tag, source_url: str) -> dict[str, object]:
    image = container if container.name == "img" else container.find("img")
    source_urls: list[str] = []
    for source in container.find_all("source") if container.name != "img" else []:
        for attribute in ("srcset", "data-srcset"):
            for url in _srcset_urls(source_url, source.get(attribute)):
                if url not in source_urls:
                    source_urls.append(url)
        source_src = _absolute(source_url, source.get("src"))
        if source_src and source_src not in source_urls:
            source_urls.append(source_src)
    if image is not None:
        for attribute in ("srcset", "data-srcset"):
            for url in _srcset_urls(source_url, image.get(attribute)):
                if url not in source_urls:
                    source_urls.append(url)
        for attribute in ("src", "data-src", "data-original", "data-lazy-src"):
            image_url = _absolute(source_url, image.get(attribute))
            if image_url and image_url not in source_urls:
                source_urls.append(image_url)
    primary = _absolute(source_url, image.get("src")) if image is not None else ""
    if not primary and source_urls:
        primary = source_urls[0]
    caption = container.find("figcaption") if container.name == "figure" else None
    return {
        "url": primary,
        "sourceUrls": source_urls,
        "alt": image.get("alt", "") if image is not None else "",
        "title": image.get("title", "") if image is not None else "",
        "caption": _visible_text(caption) if caption is not None else "",
    }


def _field_label(form: Tag, element: Tag) -> str:
    label = element.find_parent("label")
    if label is None and element.get("id"):
        label = form.find("label", attrs={"for": element.get("id")})
    if label is not None:
        strings: list[str] = []
        for text_node in label.find_all(string=True):
            if isinstance(text_node, Comment):
                continue
            parent = text_node.parent
            if parent is not None and (
                parent.name in {"select", "textarea"}
                or parent.find_parent(["select", "textarea"]) is not None
            ):
                continue
            text = _normal_text(str(text_node))
            if text:
                strings.append(text)
        label_text = _normal_text(" ".join(strings))
        if label_text:
            return label_text
    return str(element.get("aria-label") or element.get("placeholder") or "")


def _form_fields(form: Tag) -> list[FormField]:
    fields: list[FormField] = []
    selector = "input[name], textarea[name], select[name]"
    for element in form.select(selector):
        input_type = str(element.get("type", "text")).lower()
        if element.name == "input" and input_type in {"button", "hidden", "image", "reset", "submit"}:
            continue
        required = element.has_attr("required") or str(element.get("aria-required", "")).lower() == "true"
        if not required:
            required = any(
                "required" in " ".join(parent.get("class", [])).lower()
                for parent in element.find_parents(limit=4)
            )
        fields.append(
            FormField(
                name=str(element.get("name", "")),
                label=_field_label(form, element),
                field_type=element.name if element.name != "input" else input_type,
                required=required,
                order=len(fields),
            )
        )
    return fields


def _is_download(tag: Tag) -> bool:
    if tag.name != "a":
        return False
    if tag.has_attr("download"):
        return True
    path = urlsplit(str(tag.get("href", ""))).path
    return PurePosixPath(path).suffix.lower() in DOWNLOAD_EXTENSIONS


def _is_button(tag: Tag) -> bool:
    if tag.name == "button":
        return True
    if tag.name == "input" and str(tag.get("type", "")).lower() in {
        "button",
        "image",
        "submit",
    }:
        return True
    classes = {str(item).lower() for item in tag.get("class", [])}
    return tag.name == "a" and (
        str(tag.get("role", "")).lower() == "button"
        or "vc_btn3" in classes
        or any("button" in item or item.startswith("btn") for item in classes)
    )


def _atomic_kind(tag: Tag) -> str | None:
    name = tag.name or ""
    if name in HEADING_TAGS:
        return "heading"
    if name == "p":
        return "paragraph"
    if name in {"ul", "ol"}:
        return "list"
    if name == "table":
        return "table"
    if name == "blockquote":
        return "quote"
    if name == "figure":
        return "video" if tag.find("video") is not None else "image"
    if name in {"img", "picture"}:
        return "image"
    if name == "source":
        media_type = str(tag.get("type", "")).lower()
        return "video" if media_type.startswith(("video/", "audio/")) else "image"
    if name == "form":
        return "formDefinition"
    if _is_download(tag):
        return "download"
    if _is_button(tag):
        return "button"
    if name == "video":
        return "video"
    if name in {"embed", "iframe", "object"}:
        return "embed"
    if tag.has_attr("data-custom-widget"):
        return "unknown"
    return None


def _video_data(tag: Tag, source_url: str) -> dict[str, object]:
    media = tag.find("video") if tag.name == "figure" else tag
    if media is None:
        media = tag
    sources: list[str] = []
    direct = _absolute(source_url, media.get("src"))
    if direct:
        sources.append(direct)
    for source in media.find_all("source"):
        url = _absolute(source_url, source.get("src"))
        if url and url not in sources:
            sources.append(url)
        for candidate in _srcset_urls(source_url, source.get("srcset")):
            if candidate not in sources:
                sources.append(candidate)
    return {
        "url": sources[0] if sources else "",
        "sourceUrls": sources,
        "poster": _absolute(source_url, media.get("poster")),
        "title": str(media.get("title", "")),
        "text": _visible_text(tag),
    }


def _semantic_block(
    tag: Tag,
    *,
    kind: str,
    order: int,
    source_url: str,
    root: Tag,
    viewport: str,
) -> tuple[Block, list[FormField]]:
    locator = _tag_locator(tag, root)
    data: dict[str, object] = {"sourceLocator": locator, "viewport": viewport}
    hidden_reasons = _hidden_reasons(tag, root)
    if hidden_reasons:
        data.update(sourceHidden=True, sourceHiddenReasons=hidden_reasons)
    fields: list[FormField] = []
    if kind == "heading":
        data.update(level=int(tag.name[1:]), text=_visible_text(tag))
    elif kind == "paragraph":
        data.update(text=_visible_text(tag), html=tag.decode_contents())
    elif kind == "list":
        data.update(
            style="ordered" if tag.name == "ol" else "unordered",
            items=[_visible_text(item) for item in tag.find_all("li", recursive=False)],
            html=tag.decode_contents(),
        )
    elif kind == "image":
        if tag.name == "source":
            source_urls = _srcset_urls(source_url, tag.get("srcset"))
            direct = _absolute(source_url, tag.get("src"))
            if direct and direct not in source_urls:
                source_urls.append(direct)
            data.update(url=source_urls[0] if source_urls else "", sourceUrls=source_urls, alt="", title="", caption="")
        else:
            data.update(_image_data(tag, source_url))
    elif kind == "table":
        rows = [
            [_visible_text(cell) for cell in row.find_all(["th", "td"], recursive=False)]
            for row in tag.find_all("tr")
        ]
        data.update(rows=rows, html=tag.decode_contents())
    elif kind == "quote":
        data.update(text=_visible_text(tag), html=tag.decode_contents())
    elif kind in {"button", "download"}:
        data.update(
            text=_visible_text(tag) or str(tag.get("value", "")),
            url=_absolute(source_url, tag.get("href")),
            title=str(tag.get("title", "")),
        )
    elif kind == "video":
        data.update(_video_data(tag, source_url))
    elif kind == "embed":
        raw_url = tag.get("data") if tag.name == "object" else tag.get("src")
        data.update(
            url=_absolute(source_url, raw_url),
            embedType=tag.name,
            mimeType=str(tag.get("type", "")),
            title=str(tag.get("title", "")),
            text=_visible_text(tag),
        )
    elif kind == "formDefinition":
        fields = _form_fields(tag)
        submit = tag.find("button") or tag.find("input", attrs={"type": re.compile(r"^(submit|button)$", re.I)})
        button_text = ""
        if submit is not None:
            button_text = _visible_text(submit) if submit.name == "button" else str(submit.get("value", ""))
        messages = [
            _visible_text(message)
            for message in tag.select('[class*="success"], [class*="error"], [role="alert"]')
            if _visible_text(message)
        ]
        data.update(
            fields=[field.model_dump() for field in fields],
            fieldCount=len(fields),
            buttonText=button_text,
            messages=list(dict.fromkeys(messages)),
            action=_absolute(source_url, tag.get("action")),
            method=str(tag.get("method", "get")).lower(),
        )
    elif kind == "unknown":
        data.update(text=_visible_text(tag))
    return Block(type=kind, order=order, data=data, source_html=str(tag)), fields


class _BlockWalker:
    def __init__(self, root: Tag, source_url: str, viewport: str) -> None:
        self.root = root
        self.source_url = source_url
        self.viewport = viewport
        self.blocks: list[Block] = []
        self.consumed_text_nodes: set[int] = set()
        self.issues: list[str] = []
        self._fragment_counts: dict[int, int] = {}

    def _mark_tag_text(self, tag: Tag) -> None:
        for text_node in tag.find_all(string=True):
            if not isinstance(text_node, Comment) and not _is_hidden(text_node.parent, self.root):
                self.consumed_text_nodes.add(id(text_node))

    def _append_tag(self, tag: Tag, kind: str) -> None:
        block, _ = _semantic_block(
            tag,
            kind=kind,
            order=len(self.blocks),
            source_url=self.source_url,
            root=self.root,
            viewport=self.viewport,
        )
        meaningful = bool(_visible_text(tag)) or kind in {
            "button",
            "download",
            "embed",
            "formDefinition",
            "image",
            "table",
            "unknown",
            "video",
        }
        if meaningful:
            self.blocks.append(block)
        self._mark_tag_text(tag)

    def _append_fragment(self, parent: Tag, parts: list[NavigableString | Tag]) -> None:
        source_html = "".join(str(part) for part in parts)
        text_parts: list[str] = []
        for part in parts:
            if isinstance(part, NavigableString):
                if not isinstance(part, Comment):
                    self.consumed_text_nodes.add(id(part))
                    text_parts.append(str(part))
            else:
                self._mark_tag_text(part)
                text_parts.append(part.get_text("", strip=False))
        text = _normal_text("".join(text_parts))
        if not text:
            return
        parent_key = id(parent)
        run = self._fragment_counts.get(parent_key, 0) + 1
        self._fragment_counts[parent_key] = run
        locator = f"{_tag_locator(parent, self.root)}::content-run({run})"
        hidden_reasons = _hidden_reasons(parent, self.root)
        metadata: dict[str, object] = {}
        if hidden_reasons:
            metadata = {"sourceHidden": True, "sourceHiddenReasons": hidden_reasons}
        self.blocks.append(
            Block(
                type="richText",
                order=len(self.blocks),
                data={
                    "text": text,
                    "html": source_html,
                    "sourceLocator": locator,
                    "viewport": self.viewport,
                    **metadata,
                },
                source_html=source_html,
            )
        )

    def _walk_container(self, container: Tag) -> None:
        buffer: list[NavigableString | Tag] = []

        def flush() -> None:
            if buffer:
                self._append_fragment(container, list(buffer))
                buffer.clear()

        for child in container.contents:
            if isinstance(child, Comment):
                continue
            if isinstance(child, NavigableString):
                if _normal_text(str(child)):
                    buffer.append(child)
                continue
            if not isinstance(child, Tag) or _is_hidden(child, self.root):
                continue
            kind = _atomic_kind(child)
            if child.name == "p" and child.find(list(PARAGRAPH_SPLIT_TAGS)) is not None:
                flush()
                self._walk_container(child)
                continue
            if kind is not None:
                flush()
                self._append_tag(child, kind)
                # libxml can attach following siblings to an unclosed HTML void
                # element in malformed legacy pages. Preserve those descendants
                # after capturing the void element itself instead of losing them.
                if child.name in {"embed", "img", "source"} and child.contents:
                    self._walk_container(child)
            elif child.name in GENERIC_CONTAINERS:
                flush()
                self._walk_container(child)
            elif child.name in INLINE_TAGS and not any(
                _atomic_kind(descendant) is not None for descendant in child.find_all(True)
            ):
                buffer.append(child)
            elif child.name in INLINE_TAGS:
                flush()
                self._walk_container(child)
            else:
                flush()
                self._append_tag(child, "unknown")
        flush()

    def extract(self) -> tuple[list[Block], list[str]]:
        self._walk_container(self.root)
        for text_node in self.root.find_all(string=True):
            if isinstance(text_node, Comment) or _is_hidden(text_node.parent, self.root):
                continue
            text = _normal_text(str(text_node))
            if not text or id(text_node) in self.consumed_text_nodes:
                continue
            parent = text_node.parent
            locator = (
                f"{_tag_locator(parent, self.root)}::unconsumed-text"
                if isinstance(parent, Tag)
                else "unconsumed-text"
            )
            self.blocks.append(
                Block(
                    type="unknown",
                    order=len(self.blocks),
                    data={
                        "text": text,
                        "sourceLocator": locator,
                        "viewport": self.viewport,
                        **(
                            {
                                "sourceHidden": True,
                                "sourceHiddenReasons": _hidden_reasons(parent, self.root),
                            }
                            if isinstance(parent, Tag) and _hidden_reasons(parent, self.root)
                            else {}
                        ),
                    },
                    source_html=str(text_node),
                )
            )
            self.issues.append(f"unconsumed visible text preserved at {locator}")
            self.consumed_text_nodes.add(id(text_node))
        return self.blocks, self.issues


def _block_fingerprint(block: Block) -> str:
    data = {key: value for key, value in block.data.items() if key not in SOURCE_METADATA_KEYS}
    return json.dumps({"type": block.type, "data": data}, ensure_ascii=False, sort_keys=True, default=str)


def merge_viewport_blocks(desktop: list[Block], mobile: list[Block]) -> list[Block]:
    """Create an ordered shortest common supersequence of viewport blocks."""

    left = [_block_fingerprint(block) for block in desktop]
    right = [_block_fingerprint(block) for block in mobile]
    lengths = [[0] * (len(right) + 1) for _ in range(len(left) + 1)]
    for i in range(len(left) - 1, -1, -1):
        for j in range(len(right) - 1, -1, -1):
            lengths[i][j] = (
                1 + lengths[i + 1][j + 1]
                if left[i] == right[j]
                else max(lengths[i + 1][j], lengths[i][j + 1])
            )

    merged: list[Block] = []
    i = j = 0
    while i < len(desktop) or j < len(mobile):
        if i < len(desktop) and j < len(mobile) and left[i] == right[j]:
            block = desktop[i].model_copy(deep=True)
            desktop_locator = block.data.get("sourceLocator", "")
            mobile_locator = mobile[j].data.get("sourceLocator", "")
            block.data["viewport"] = "desktop+mobile"
            block.data["sourceLocators"] = {
                "desktop": desktop_locator,
                "mobile": mobile_locator,
            }
            merged.append(block)
            i += 1
            j += 1
        elif j >= len(mobile) or (
            i < len(desktop) and lengths[i + 1][j] >= lengths[i][j + 1]
        ):
            merged.append(desktop[i].model_copy(deep=True))
            i += 1
        else:
            block = mobile[j].model_copy(deep=True)
            block.data["viewport"] = "mobile"
            block.data["mobileOnly"] = True
            merged.append(block)
            j += 1
    for order, block in enumerate(merged):
        block.order = order
    return merged


def _page_links(soup: BeautifulSoup, source_url: str) -> tuple[list[str], list[str], list[str]]:
    internal: list[str] = []
    external: list[str] = []
    downloads: list[str] = []
    source_host = urlsplit(source_url).netloc.lower()
    for anchor in soup.select("a[href]"):
        href = str(anchor.get("href", "")).strip()
        if not href or href.startswith(("#", "javascript:")):
            continue
        absolute = _absolute(source_url, href)
        if _is_download(anchor) and absolute not in downloads:
            downloads.append(absolute)
        scheme = urlsplit(absolute).scheme.lower()
        if scheme not in {"http", "https"}:
            continue
        target = internal if urlsplit(absolute).netloc.lower() == source_host else external
        if absolute not in target:
            target.append(absolute)
    return internal, external, downloads


def _flatten_form_fields(blocks: list[Block]) -> list[FormField]:
    output: list[FormField] = []
    form_index = 0
    for block in blocks:
        if block.type != "formDefinition":
            continue
        block.data["formIndex"] = form_index
        for raw in block.data.get("fields", []):
            field = FormField.model_validate(raw)
            output.append(field.model_copy(update={"order": len(output)}))
        form_index += 1
    return output


def extract_page(
    html: str,
    source_url: str,
    status: PageStatus,
    mobile_html: str | None = None,
) -> PageRecord:
    """Extract a CMS-neutral page record, optionally merging mobile evidence."""

    soup = BeautifulSoup(html, "lxml")
    root = (
        soup.select_one("main#content")
        or soup.select_one("#content")
        or soup.select_one("main")
        or soup.select_one('[role="main"]')
        or soup.body
    )
    if root is None:
        raise ValueError("page has no content root")
    desktop_blocks, issues = _BlockWalker(root, source_url, "desktop").extract()

    if mobile_html is not None:
        mobile_soup = BeautifulSoup(mobile_html, "lxml")
        mobile_root = (
            mobile_soup.select_one("main#content")
            or mobile_soup.select_one("#content")
            or mobile_soup.select_one("main")
            or mobile_soup.select_one('[role="main"]')
            or mobile_soup.body
        )
        if mobile_root is None:
            issues.append("mobile page has no content root")
            blocks = desktop_blocks
        else:
            mobile_blocks, mobile_issues = _BlockWalker(mobile_root, source_url, "mobile").extract()
            blocks = merge_viewport_blocks(desktop_blocks, mobile_blocks)
            issues.extend(mobile_issues)
    else:
        blocks = desktop_blocks

    for order, block in enumerate(blocks):
        block.order = order
    fields = _flatten_form_fields(blocks)
    page_id, source_page_id = _page_id(source_url, soup)
    head_title = _visible_text(soup.title) if soup.title is not None else ""
    heading_title = next(
        (str(block.data.get("text", "")) for block in blocks if block.type == "heading"),
        "",
    )
    title = head_title or heading_title or "Untitled"
    internal_links, external_links, download_links = _page_links(soup, source_url)
    canonical = "\n".join(block.model_dump_json() for block in blocks)
    return PageRecord(
        id=page_id,
        source_url=source_url,
        source_page_id=source_page_id,
        title=title,
        language=str(soup.html.get("lang", "und")) if soup.html else "und",
        status=status,
        content_type="article" if status is PageStatus.ARCHIVED else "page",
        blocks=blocks,
        internal_links=internal_links,
        external_links=external_links,
        download_links=download_links,
        form_fields=fields,
        captured_at=datetime.now(UTC).isoformat(),
        content_hash=hashlib.sha256(canonical.encode()).hexdigest(),
        issues=list(dict.fromkeys(issues)),
    )


def _escape_table(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\n", " ")


def page_to_markdown(page: PageRecord) -> str:
    """Render the semantic record as an auditable, human-readable Markdown copy."""

    output: list[str] = []
    for block in page.blocks:
        data = block.data
        if block.type == "heading":
            output.append(f"{'#' * int(data['level'])} {data['text']}")
        elif block.type in {"paragraph", "richText"}:
            output.append(str(data.get("text", "")))
        elif block.type == "list":
            prefix = "1." if data.get("style") == "ordered" else "-"
            output.append("\n".join(f"{prefix} {item}" for item in data.get("items", [])))
        elif block.type == "image":
            output.append(f"![{data.get('alt', '')}]({data.get('url', '')})")
            if data.get("caption"):
                output.append(f"*{data['caption']}*")
        elif block.type == "table":
            rows = data.get("rows", [])
            if rows:
                width = max(len(row) for row in rows)
                normalized = [list(row) + [""] * (width - len(row)) for row in rows]
                output.append("| " + " | ".join(_escape_table(cell) for cell in normalized[0]) + " |")
                output.append("| " + " | ".join("---" for _ in range(width)) + " |")
                output.extend(
                    "| " + " | ".join(_escape_table(cell) for cell in row) + " |"
                    for row in normalized[1:]
                )
        elif block.type == "quote":
            output.append("\n".join(f"> {line}" for line in str(data.get("text", "")).splitlines()))
        elif block.type in {"button", "download"}:
            text = str(data.get("text") or data.get("url") or block.type)
            url = str(data.get("url", ""))
            output.append(f"[{text}]({url})" if url else text)
        elif block.type in {"video", "embed"}:
            label = str(data.get("title") or data.get("text") or block.type.title())
            url = str(data.get("url", ""))
            output.append(f"[{label}]({url})" if url else f"[Structured block: {block.type}, order {block.order}]")
        elif block.type == "formDefinition":
            output.append(
                f"[Structured block: formDefinition, order {block.order}, "
                f"fields {data.get('fieldCount', 0)}]"
            )
        elif block.type == "unknown":
            output.append(block.source_html or str(data.get("text", "")))
        else:
            output.append(block.source_html or f"[Structured block: {block.type}, order {block.order}]")
    return "\n\n".join(part for part in output if part).strip() + "\n"
