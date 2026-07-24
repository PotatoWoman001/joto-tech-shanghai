# Partner Case Logo Dark-Mode Legibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore recognizable brand colors and negative space for representative-project logos on the dark Solution detail pages.

**Architecture:** Keep the existing `PartnerCaseStudy.logoTreatment` data contract and `150×48px` component slot. Classify only the logos that lose structure under a universal white filter as `brand`; keep single-color marks on the existing `monochrome` path.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Do not redraw, trace, or generatively alter official logos.
- Standard logo slots remain exactly `150×48px`.
- Harrow's portrait exception remains unchanged.
- All three locales reuse identical logo files and treatments.
- Jinnet and Quasar Medical remain text fallbacks.

---

### Task 1: Define logo-treatment coverage

**Files:**
- Modify: `src/content/partnerCases.test.ts`
- Modify: `src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: `getPartnerCases(pathname, locale)` and `PartnerCaseStudy.logoTreatment`.
- Produces: Regression coverage for brand-preserving and monochrome rendering.

- [ ] **Step 1: Write the failing data test**

Assert that Starbucks, SSIS, and 中科创威 use `brand`, while Pall, Dulwich, DFX, Bunge, Amlogic, Boston Scientific, and YK Pao do not.

- [ ] **Step 2: Run the focused data test**

Run: `npm test -- --run src/content/partnerCases.test.ts`

Expected: FAIL because all partner-case logos currently default to `monochrome`.

- [ ] **Step 3: Write the failing component test**

Assert that Starbucks has `data-logo-treatment="brand"` and does not have `brightness-0 invert`, while Dulwich keeps the monochrome classes.

- [ ] **Step 4: Run the focused component test**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL because Starbucks currently renders as monochrome.

### Task 2: Apply per-logo treatments

**Files:**
- Modify: `src/content/partnerCases.ts`
- Modify: `src/pages/PartnerDetailPage.tsx`

**Interfaces:**
- Consumes: `logoTreatment?: "monochrome" | "brand"`.
- Produces: Per-logo dark-background rendering that preserves official geometry and colors.

- [ ] **Step 1: Mark structure-dependent logos as brand assets**

Set `logoTreatment: "brand"` on Starbucks, SSIS, and 中科创威. Keep every Pall-backed project on the monochrome path so its transparent negative space remains readable.

- [ ] **Step 2: Keep brand assets at full opacity**

Use full opacity for `brand`; retain the existing slightly softened white treatment for monochrome logos.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- --run src/content/partnerCases.test.ts src/pages/PartnerDetailPage.test.tsx`

Expected: PASS.

- [ ] **Step 4: Commit the implementation**

```bash
git add src/content/partnerCases.ts src/content/partnerCases.test.ts src/pages/PartnerDetailPage.tsx src/pages/PartnerDetailPage.test.tsx
git commit -m "fix: preserve partner case logo details"
```

### Task 3: Visual and production verification

**Files:**
- Inspect: all Solution routes with representative projects.
- Do not modify unrelated workspace files.

**Interfaces:**
- Consumes: local Vite preview at `http://127.0.0.1:5176`.
- Produces: desktop, mobile, and three-locale verification evidence.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Inspect all affected routes**

At desktop and `390×844`, inspect Palo Alto Networks, KnowBe4, Extreme Networks, Fortinet, Aruba, Sangfor network/security, and Hikvision. Verify every image loads, standard slots remain `150×48px`, brand logos retain internal detail, and there is no horizontal overflow.

- [ ] **Step 4: Verify locale consistency**

On an affected route, switch among English, Chinese, and Persian. Verify identical logo assets/treatments and correct RTL layout.

- [ ] **Step 5: Run final repository checks**

Run: `git diff --check` and review `git status --short`.

Expected: no whitespace errors; unrelated user changes remain untouched.
