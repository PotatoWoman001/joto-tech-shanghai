# Solution Brand Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared Cisco imagery on all 19 non-Cisco Solution detail pages with 76 locally stored, brand- and service-specific visuals that remain visually consistent with JOTO.

**Architecture:** Give every non-Cisco `PartnerDetail` an explicit four-image visual set: one hero visual and three service visuals. Keep the existing `PartnerDetailPage` presentation and dark overlay treatment, but make `createPartnerDetail` consume explicit per-brand assets so category and Cisco fallbacks cannot silently reappear.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, local WebP/PNG/JPG assets.

## Global Constraints

- Cover all 19 non-Cisco public Solution routes and all three localized variants.
- Each route must have one brand ecosystem hero and three service visuals matching planning, deployment/product, and operations/management content.
- Prefer official product, device, platform, or console imagery; do not fabricate model details.
- Save all production images locally under `src/assets/partners/<partner-slug>/`; do not hotlink.
- Record each original URL, owner, represented product, and retrieval date in `docs/content-sources/solution-brand-visuals.md`.
- Normalize delivery assets to WebP where transparency is not required, with a practical long edge of 1600–1920 px.
- Preserve the existing dark, low-saturation JOTO overlays and responsive crops.
- Do not alter Cisco’s four existing visuals.

---

## File Structure

- Create: `src/content/partnerVisuals.ts` — imports and exports the 19 explicit visual sets.
- Modify: `src/content/partners.ts` — requires an explicit visual set in `createPartnerDetail`.
- Modify: `src/content/partners.test.ts` — prevents shared Cisco/category fallbacks and verifies route-level uniqueness.
- Create: `src/assets/partners/<partner-slug>/{hero,planning,deployment,operations}.webp` — 76 localized production images.
- Create: `docs/content-sources/solution-brand-visuals.md` — source ledger for every production image.
- Modify: `src/pages/PartnerDetailPage.test.tsx` — verifies alt text and responsive visual rendering.
- Create: `docs/screenshots/solution-brand-visuals/` — desktop and mobile visual QA evidence.

## Required Visual Mapping

| Route slug | Hero ecosystem | Planning | Deployment / product | Operations / management |
|---|---|---|---|---|
| extreme-networks | Extreme Platform ONE / ExtremeCloud IQ | campus fabric topology | ExtremeSwitching + AP hardware | ExtremeCloud IQ operations |
| aruba | HPE Aruba Networking Central | Central campus architecture | CX switching + Aruba APs | Central health and experience |
| sangfor-network | Sangfor secure branch | multi-site SD-WAN topology | branch gateway deployment | link/application operations |
| knowbe4 | KnowBe4 human-risk platform | risk baseline/dashboard | awareness + phishing workflow | risk trend reporting |
| palo-alto-networks | Strata + Prisma + Cortex ecosystem | NGFW policy architecture | PA-Series / Prisma deployment | Cortex/SOC operations |
| fortinet | Fortinet Security Fabric | FortiGate/Fabric architecture | FortiGate + branch rollout | FortiManager/FortiAnalyzer |
| sangfor-security | Sangfor enterprise security | NGAF/risk architecture | gateway + endpoint integration | threat operations |
| check-point | Infinity platform ecosystem | Quantum policy architecture | Quantum + CloudGuard/Harmony | SmartConsole/threat operations |
| onelogin | OneLogin identity platform | identity/application blueprint | SSO/MFA connectors | access reporting/admin |
| dell-technologies | PowerEdge + Dell storage | workload/capacity planning | rack/server/storage deployment | OpenManage/iDRAC operations |
| huawei | OceanStor data infrastructure | storage/protection architecture | OceanStor hardware + SAN | DeviceManager/health |
| inspur | Inspur compute/storage ecosystem | AI/HPC platform sizing | servers/GPU cluster/storage | platform health/lifecycle |
| audiocodes | AudioCodes voice ecosystem | Teams/SIP call-flow design | Mediant SBC/gateway | OVOC voice operations |
| vodia | Vodia multi-tenant PBX | tenant/numbering plan | PBX/SIP/endpoint integration | tenant and call-quality console |
| cyberdata | CyberData SIP endpoints | paging zone/coverage plan | speakers/intercoms/endpoints | device health/site support |
| informacast | InformaCast notification ecosystem | event/audience workflow | channel/system integration | incident reporting/drills |
| verkada | Verkada Command ecosystem | site/video/retention plan | camera/access/sensor devices | Command alerts and operations |
| hikvision | Hikvision physical security | coverage/retention design | cameras/NVR/access control | HikCentral/device operations |
| keyking | Keyking access control | door/credential plan | controllers/readers/turnstiles | access events/device health |

### Task 1: Make explicit visual sets mandatory

**Files:**
- Create: `src/content/partnerVisuals.ts`
- Modify: `src/content/partners.ts`
- Test: `src/content/partners.test.ts`

**Interfaces:**
- Produces: `PartnerVisualSet` with `hero`, `planning`, `deployment`, and `operations`.
- Consumes: local image imports from each partner asset directory.

- [ ] **Step 1: Write the failing structural tests**

```ts
const nonCisco = partnerDetails.filter(({ partnerName }) => partnerName !== "Cisco");
const ciscoImages = new Set(partnerDetails[0].services.map(({ image }) => image));

it("assigns four explicit non-Cisco visuals to every additional partner", () => {
  for (const detail of nonCisco) {
    const images = [detail.heroVisual.src, ...detail.services.map(({ image }) => image)];
    expect(new Set(images)).toHaveLength(4);
    expect(images.every((image) => !ciscoImages.has(image))).toBe(true);
  }
});

it("does not reuse a visual across different non-Cisco routes", () => {
  const images = nonCisco.flatMap((detail) => [
    detail.heroVisual.src,
    ...detail.services.map(({ image }) => image),
  ]);
  expect(new Set(images)).toHaveLength(19 * 4);
});
```

- [ ] **Step 2: Run the tests and confirm the shared-image failure**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: FAIL because all non-Cisco pages currently reuse category hero images and `cisco-consulting.jpg`, `cisco-integration.jpg`, and `cisco-managed-services.jpg`.

- [ ] **Step 3: Define the explicit visual-set contract**

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

- [ ] **Step 4: Require the contract in the factory**

Add `visuals: PartnerVisualSet` to `PartnerFactoryInput`. Replace the category visual and Cisco service-image fallbacks with `visuals.hero`, `visuals.planning`, `visuals.deployment`, and `visuals.operations`; use `position ?? "object-center"` for each crop.

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: PASS after every factory call has an explicit visual set.

### Task 2: Acquire and normalize the 76 official visuals

**Files:**
- Create: `src/assets/partners/<partner-slug>/{hero,planning,deployment,operations}.webp`
- Create: `docs/content-sources/solution-brand-visuals.md`
- Modify: `src/content/partnerVisuals.ts`

**Interfaces:**
- Consumes: the mapping table above and official vendor media/product pages.
- Produces: `partnerVisuals: Record<PartnerVisualKey, PartnerVisualSet>`.

- [ ] **Step 1: Process brands in five reviewable batches**

Batch 1 is Network (Extreme Networks, Aruba, Sangfor Network); Batch 2 is Security (KnowBe4, Palo Alto Networks, Fortinet, Sangfor Security, Check Point, OneLogin); Batch 3 is Server & Storage (Dell Technologies, Huawei, Inspur); Batch 4 is Collaboration (AudioCodes, Vodia, CyberData, InformaCast); Batch 5 is Safeguarding (Verkada, Hikvision, Keyking).

- [ ] **Step 2: Record every source before download**

Use one row per output file:

```md
| Output | Brand | Product/capability | Official source URL | Retrieved | Transform |
|---|---|---|---|---|---|
| `src/assets/partners/extreme-networks/hero.webp` | Extreme Networks | Platform ONE / ExtremeCloud IQ | `https://www.extremenetworks.com/platform-one` | 2026-07-24 | crop, resize, WebP |
```

- [ ] **Step 3: Normalize each approved source**

Run ImageMagick with the exact input/output pair for each source:

```bash
magick input.png -auto-orient -resize '1920x1920>' -strip -quality 84 \
  src/assets/partners/<partner-slug>/<role>.webp
```

Expected: an image with no upscaling, no EXIF payload, and a long edge no greater than 1920 px.

- [ ] **Step 4: Add descriptive, product-accurate alt text**

Alt text must name visible real products or interfaces, such as “FortiGate appliances connected through the Fortinet Security Fabric” or “FortiManager and FortiAnalyzer centralized operations interface”; it must not claim unseen capabilities.

- [ ] **Step 5: Run structural tests after each brand batch**

Run: `npm test -- --run src/content/partners.test.ts src/i18n/solutionProfiles.test.ts`

Expected: PASS with four distinct visuals for every route completed so far; merge a batch only after all routes in it are complete.

### Task 3: Verify rendering, crops, and localization

**Files:**
- Modify: `src/pages/PartnerDetailPage.test.tsx`
- Create: `docs/screenshots/solution-brand-visuals/`

**Interfaces:**
- Consumes: completed `PartnerDetail` visual data.
- Produces: automated rendering checks and desktop/mobile screenshots.

- [ ] **Step 1: Add a representative rendering test per category**

```ts
it.each([
  "/solutions/network/extreme-networks",
  "/solutions/security/fortinet",
  "/solutions/server-storage/dell-technologies",
  "/solutions/collaboration/audiocodes",
  "/solutions/safeguarding/verkada",
])("renders the route-specific hero and service visuals for %s", (pathname) => {
  const detail = getPartnerDetail(pathname)!;
  renderDetail(pathname);
  expect(screen.getByRole("img", { name: detail.heroVisual.alt })).toHaveAttribute(
    "src",
    detail.heroVisual.src,
  );
  for (const service of detail.services) {
    expect(screen.getByRole("img", { name: service.imageAlt })).toHaveAttribute(
      "src",
      service.image,
    );
  }
});
```

- [ ] **Step 2: Run page and localization tests**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx src/i18n/solutionProfiles.test.ts`

Expected: PASS in English content data and in both Chinese and Persian localized profiles.

- [ ] **Step 3: Build the production site**

Run: `npm run build`

Expected: exit code 0 with all 76 assets emitted under `dist/assets/`.

- [ ] **Step 4: Capture desktop and mobile QA**

For every route, capture the hero and three service cards at 1440×1000 and 390×844. Save screenshots under `docs/screenshots/solution-brand-visuals/<partner-slug>-{desktop,mobile}.png`.

- [ ] **Step 5: Review the screenshot matrix**

Reject any page with a wrong brand, repeated image, embedded unreadable copy, stretched product, weak focal point, or crop that hides the represented device/interface. Update `imagePosition` and recapture until all 38 screenshots pass.

### Task 4: Full regression and delivery

**Files:**
- Modify only files found by the final review.

**Interfaces:**
- Consumes: all completed assets, mappings, tests, and screenshots.
- Produces: a deployable build and traceable delivery commit.

- [ ] **Step 1: Run the full regression suite**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run the final production build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 3: Audit prohibited fallbacks**

Run:

```bash
rg -n "ciscoConsulting|ciscoIntegration|ciscoManagedServices|category\\.visual" \
  src/content/partners.ts src/content/partnerVisuals.ts
```

Expected: Cisco images appear only inside the explicit Cisco detail; `createPartnerDetail` has no category-image fallback.

- [ ] **Step 4: Commit the completed implementation**

```bash
git add src/assets/partners src/content/partnerVisuals.ts src/content/partners.ts \
  src/content/partners.test.ts src/pages/PartnerDetailPage.test.tsx \
  docs/content-sources/solution-brand-visuals.md \
  docs/screenshots/solution-brand-visuals
git commit -m "feat: add brand-specific solution visuals"
```

- [ ] **Step 5: Deploy and verify the public routes**

Push the active integration branch, wait for GitHub Pages to report `built`, and verify one route from each category plus all directly referenced image assets return HTTP 200.
