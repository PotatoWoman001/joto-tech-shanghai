# Hero CTA Locale Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the homepage Explore Solutions CTA beside the hero headline at the three user-annotated desktop positions while preserving the mobile layout.

**Architecture:** Add a full-width relative heading stage around the existing RTL-aligned heading shell. English and Chinese keep their desktop CTA inside the heading shell; Persian renders the desktop CTA against the full-width stage's left edge so the button cannot cover the right-aligned title. Keep a mobile-only CTA below the supporting copy. Both instances consume the same localized CTA data and shared component markup.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite

## Global Constraints

- English and Chinese desktop CTAs use the right-side headline gap.
- Persian desktop CTA uses the full-width hero stage's left edge for RTL and must not overlap the headline.
- Mobile CTA remains below the description.
- CTA copy, href, color, size, hover behavior, and focus behavior remain unchanged.
- Do not change hero copy, title wrapping, background, or telemetry card.

---

### Task 1: Add locale-aware CTA placement

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `locale: "en" | "zh-CN" | "fa-IR"` from `useI18n()`.
- Consumes: `hero.cta.label` and `hero.cta.href`.
- Produces: `data-hero-cta-desktop`, `data-hero-cta-mobile`, `data-hero-heading-stage`, and `data-hero-heading-shell` hooks.

- [ ] **Step 1: Replace the old CTA layout test**

Update `src/App.test.tsx` to assert that each locale has a desktop CTA and a mobile CTA in the supporting-copy column. Assert that English and Chinese desktop CTAs stay inside the heading shell with `lg:left-[47%]`. Assert that the Persian desktop CTA is a direct child of the full-width heading stage with `lg:left-0`. Assert `hidden lg:inline-flex` for desktop and `lg:hidden` for mobile.

- [ ] **Step 2: Run the test and confirm failure**

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because the new CTA hooks and locale position classes do not exist yet.

- [ ] **Step 3: Extract shared CTA markup**

Add a local `HeroCta` component in `src/components/Hero.tsx` that receives `label`, `href`, `className`, and `testId`, then renders the current button styles and arrow unchanged.

- [ ] **Step 4: Add the desktop and mobile CTA instances**

Wrap the heading shell in a `data-hero-heading-stage` full-width relative container. Render the English and Chinese desktop CTA inside the heading shell with:

```tsx
"lg:left-[47%]"
```

For Persian, render the desktop CTA as a sibling of the heading shell with `lg:left-0`, anchored to the full-width stage. Render the mobile CTA after the description with `lg:hidden`. Remove the previous percentage-based Persian placement.

- [ ] **Step 5: Run the focused test**

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Run related hero and routing tests**

```bash
npm test -- --run src/App.test.tsx src/components/Header.test.tsx src/i18n/routing.test.ts
```

Expected: all tests pass.

- [ ] **Step 7: Build the root-domain artifact**

```bash
npm run build
```

Expected: TypeScript checking and Vite build succeed.

- [ ] **Step 8: Verify the Persian desktop layout at 1916px**

Open `/fa/` at a `1916 × 900` viewport and inspect the desktop CTA and second-line title. Expected: the CTA sits to the left of the title with visible separation and covers no Persian glyphs.

- [ ] **Step 9: Commit scoped files**

```bash
git add joto-site-v2/src/components/Hero.tsx joto-site-v2/src/App.test.tsx
git commit -m "feat: position hero CTA by locale"
```
