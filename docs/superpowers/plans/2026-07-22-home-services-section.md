# Homepage Services Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage delivery cards with the six approved service offerings and keep Services navigation anchored to the homepage.

**Architecture:** Keep service copy in the typed content model and map a small icon identifier to Lucide components inside `Services.tsx`. Preserve the existing section heading component, reveal behavior, and JOTO V2 visual language while changing the grid to a responsive six-card layout.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest, Testing Library

## Global Constraints

- The section ID remains exactly `services`.
- The heading and supporting paragraph remain unchanged.
- No service detail routes or card links are introduced.
- The service eyebrow is exactly `END-TO-END SERVICES`.
- The reference site's six service titles and descriptions are used verbatim and in the approved order.

---

### Task 1: Lock the service-section contract with a component test

**Files:**
- Create: `joto-site-v2/src/components/Services.test.tsx`

**Interfaces:**
- Consumes: the default `Services` React component.
- Produces: regression coverage for copy, count, section anchor, and non-navigation behavior.

- [ ] **Step 1: Write the failing test**

Create a test that renders `<Services />`, asserts `id="services"`, the retained heading and paragraph, `END-TO-END SERVICES`, all six level-three headings, and zero links inside the section.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --run src/components/Services.test.tsx`
Expected: FAIL because the current section still has the old eyebrow and four cards.

### Task 2: Update the service content model and component

**Files:**
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Modify: `joto-site-v2/src/components/Services.tsx`

**Interfaces:**
- Consumes: `ServiceItem` objects with `icon`, `title`, and `description`.
- Produces: a responsive six-card section at `#services`.

- [ ] **Step 1: Replace the bullet-point type with an icon key**

Define `ServiceIcon = "planning" | "deployment" | "support" | "security" | "staffing" | "procurement"` and make `ServiceItem.icon` use that union.

- [ ] **Step 2: Replace the content records**

Set the eyebrow to `END-TO-END SERVICES`, retain the existing title and paragraph, and replace the four old records with the six approved reference records.

- [ ] **Step 3: Implement the responsive cards**

Map the icon keys to `Compass`, `Wrench`, `Clock4`, `ShieldHalf`, `Users`, and `PackageCheck`. Render decorative icon tiles, numbered labels, headings, and descriptions in a one/two/three-column responsive grid without links.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- --run src/components/Services.test.tsx`
Expected: PASS.

### Task 3: Regression and layout verification

**Files:**
- Verify: `joto-site-v2/src/components/Header.test.tsx`
- Verify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: the completed Services section and existing navigation.
- Produces: evidence that the complete app still builds and Services remains an in-page destination.

- [ ] **Step 1: Run the full suite**

Run: `npm test -- --run`
Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 3: Inspect desktop and mobile views**

Run the local Vite server and inspect `#services` at desktop and mobile widths. Confirm three/two/one-column layout, readable copy, no overflow, and direct header navigation to the section.
