# Solution Brand Visuals Design

## Goal

Replace the shared Cisco and category fallback imagery on all 19 non-Cisco
Solution detail pages with product-accurate, locally stored visuals that retain
one coherent JOTO visual language.

## Scope

The work covers 19 non-Cisco routes and their English, Chinese, and Persian
localized variants:

- Network: Extreme Networks, Aruba, Sangfor Network
- Security: KnowBe4, Palo Alto Networks, Fortinet, Sangfor Security,
  Check Point, OneLogin
- Server & Storage: Dell Technologies, Huawei, Inspur
- Collaboration: AudioCodes, Vodia, CyberData, InformaCast
- Safeguarding: Verkada, Hikvision, Keyking

Cisco already has four route-specific visuals and remains unchanged.

## Visual System

Each brand receives four independent images:

1. **Hero ecosystem** — the brand's principal product platform, portfolio, or
   connected solution ecosystem.
2. **Planning / architecture** — an official architecture diagram, planning
   interface, topology, policy model, or workflow that matches the first
   service card.
3. **Deployment / product** — real devices, endpoints, appliances, or a real
   deployment interface that matches the second service card.
4. **Operations / management** — a real monitoring, administration, analytics,
   incident, or lifecycle interface that matches the third service card.

Official product pages, media libraries, product tours, documentation, and
vendor-owned video stills are preferred. Generic data-center photography is
rejected when the service copy names a specific product family or console.

All production assets are saved under
`src/assets/partners/<partner-slug>/`. Images are normalized to WebP where
transparency is not required, stripped of metadata, and kept at a practical
long edge of 1600–1920 px.

## JOTO Treatment

The current `PartnerDetailPage` layout remains intact. Visual consistency comes
from:

- a dark, low-saturation base;
- the existing green aura, grid, scan, and wash layers;
- one clear focal point per image;
- consistent aspect ratios and responsive crops;
- no decorative copy added to the bitmap;
- accurate alt text naming only what is visible.

Vendor colors may remain visible as restrained accents. Images are not forced
into identical monochrome treatment because model recognition and interface
legibility take priority.

## Data Architecture

Create `src/content/partnerVisuals.ts` with:

```ts
export interface PartnerVisual {
  src: string;
  alt: string;
  position?: string;
}

export interface PartnerVisualSet {
  hero: PartnerVisual;
  planning: PartnerVisual;
  deployment: PartnerVisual;
  operations: PartnerVisual;
}
```

`createPartnerDetail` must require a `PartnerVisualSet`. It must not fall back
to category hero visuals or Cisco service images. The explicit set populates
the route hero and its three service cards.

## Source Traceability

`docs/content-sources/solution-brand-visuals.md` records one row per production
asset:

- local output path;
- brand and represented product/capability;
- official source URL and owner;
- retrieval date;
- transform applied.

Hotlinks are prohibited. Assets with watermarks, unclear ownership, or
publication-only restrictions are rejected.

## Verification

Automated tests enforce:

- four distinct images per non-Cisco route;
- no reuse of Cisco visuals;
- no cross-route visual reuse;
- correct hero and service image rendering;
- localized route compatibility.

The production build must emit all 76 non-Cisco assets. Desktop and mobile
visual QA must reject wrong brands, repeated images, stretched devices,
unreadable embedded interface copy, weak focal points, and crops that obscure
the represented product.

