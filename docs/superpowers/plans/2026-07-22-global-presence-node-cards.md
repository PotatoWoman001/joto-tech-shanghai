# Global Presence Node Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the six static Global Presence columns into animated, region-specific node cards that remain linked to the interactive world map.

**Architecture:** Keep `GlobalMap` as the interaction source and place a responsive six-card grid beneath it. `GlobalPresence` owns the shared `activeRegion` state and uses a stable English region configuration for map keys while localized content supplies visible labels.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library, Vite

## Global Constraints

- Preserve the current interactive map, markers, route highlighting, and pointer parallax.
- Use abstract Lucide icons; do not add flags, photographs, or realistic landmark illustrations.
- Keep motion between 3–5px with 5–7 second staggered cycles.
- Disable transform animation under `prefers-reduced-motion: reduce`.
- Preserve English, Simplified Chinese, and Persian visible content while using stable English map keys.
- Do not create Git commits while unrelated user changes remain staged or unstaged.

---

### Task 1: Lock the node-card and map-link contract

**Files:**
- Create: `joto-site-v2/src/components/GlobalPresence.test.tsx`

**Interfaces:**
- Consumes: the default `GlobalPresence` component and current `GlobalMap` marker attributes.
- Produces: regression coverage for six cards, six icons, responsive grid markup, and region-to-map interaction.

- [ ] **Step 1: Write the failing component test**

Render `<GlobalPresence />`, then assert:

```tsx
expect(container.querySelector("[data-region-grid]")).toBeInTheDocument();
expect(container.querySelectorAll("[data-region-card]")).toHaveLength(6);
expect(container.querySelectorAll("[data-region-icon]")).toHaveLength(6);
```

Hover the Japan card and assert the Tokyo map marker becomes active:

```tsx
fireEvent.mouseEnter(screen.getByRole("button", { name: /Japan.*Tokyo/i }));
expect(container.querySelector('[data-marker-id="tokyo"]')).toHaveAttribute(
  "data-active",
  "true",
);
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --run src/components/GlobalPresence.test.tsx`

Expected: FAIL because the current vertical list has no node-grid/card/icon attributes.

### Task 2: Build the responsive animated node-card strip

**Files:**
- Modify: `joto-site-v2/src/components/GlobalPresence.tsx`
- Modify: `joto-site-v2/src/index.css`
- Modify: `joto-site-v2/src/i18n/translations.ts`

**Interfaces:**
- Consumes: localized `globalPresence.regions` in a fixed six-region order and `GlobalMap(activeRegion, onActiveRegionChange)`.
- Produces: `REGION_PRESENTATION` entries with stable `key` and Lucide `icon`, plus six `data-region-card` buttons.

- [ ] **Step 1: Define stable region presentation metadata**

Create a six-entry configuration in this order:

```ts
const REGION_PRESENTATION = [
  { key: "China", icon: Building2 },
  { key: "Japan", icon: Mountain },
  { key: "Thailand", icon: Landmark },
  { key: "Singapore", icon: Waves },
  { key: "United States", icon: RadioTower },
  { key: "United Kingdom", icon: Clock3 },
] as const;
```

Use each configuration key for `activeRegion`; use localized region objects only for visible country and city text.

- [ ] **Step 2: Change the section composition**

Render the map at full width, followed by:

```tsx
<div
  className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
  data-region-grid
>
```

Each cell remains a `button` with `aria-pressed`, `data-region-card`, `data-region-key`, and mouse/focus handlers that update the shared stable key.

- [ ] **Step 3: Render icon, count, country, and cities**

Add `LOCATION` and `LOCATIONS` to the Simplified Chinese and Persian dictionaries. Each card renders a decorative animated icon orb, a localized `1 LOCATION`/`N LOCATIONS` count via `t`, the localized region label, and localized city list. The icon receives staggered inline `animationDelay` and `animationDuration` values.

- [ ] **Step 4: Add card motion and state styles**

Add `global-region-float`, card radial glow, animated top energy line, icon-orb styling, hover/focus/active states, and reduced-motion overrides to `index.css`.

- [ ] **Step 5: Run the focused tests**

Run: `npm test -- --run src/components/GlobalPresence.test.tsx src/components/GlobalMap.test.tsx`

Expected: PASS.

### Task 3: Complete regression and responsive verification

**Files:**
- Verify: `joto-site-v2/src`

**Interfaces:**
- Consumes: completed node cards and existing trilingual application.
- Produces: automated and visual evidence for the final design.

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully; the existing chunk-size warning is acceptable.

- [ ] **Step 3: Inspect responsive layouts**

Run the local Vite server and inspect Global Presence at 1440px, 768px, and 375px. Confirm six/three-or-two/one-column behavior, no text clipping, no horizontal overflow, visible low-amplitude motion, map linkage, and reduced-motion CSS coverage.
