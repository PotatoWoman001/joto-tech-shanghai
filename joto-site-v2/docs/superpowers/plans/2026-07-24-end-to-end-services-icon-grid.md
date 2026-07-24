# End-to-End Services Icon Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage service photography cards with a compact six-cell icon grid in the approved snake sequence.

**Architecture:** Keep service content in `content/en.ts` in logical lifecycle order and use desktop grid-placement classes in `Services.tsx` to create the visual snake. Simplify `ServiceItem` by removing unused image fields and retain the existing localized content flow.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vitest.

## Global Constraints

- Do not add arrows or a loop symbol.
- Use three columns by two rows on desktop.
- Remove every service photograph.
- Preserve reduced-motion support.
- Do not touch unrelated dirty files.

---

### Task 1: Rebuild the service grid

**Files:**
- Modify: `src/components/Services.test.tsx`
- Modify: `src/components/Services.tsx`
- Modify: `src/content/en.ts`
- Modify: `src/content/types.ts`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `services.items: ServiceItem[]` from localized site content.
- Produces: six `[data-service-card]` elements, six `[data-service-icon]` elements, and no service images.

- [ ] **Step 1: Update the component test**

Assert lifecycle order as Planning, Design, Procurement, Outsourcing, Security, Support; assert six icons and zero images.

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- --run src/components/Services.test.tsx`

Expected: FAIL because the existing order and six images remain.

- [ ] **Step 3: Implement the icon-only snake grid**

Reorder content into logical lifecycle order, remove image fields, apply desktop placement classes `[1,2,3,6,5,4]`, and simplify cards to icon/title/description.

- [ ] **Step 4: Replace the image-card CSS**

Use contiguous bordered cells, thick green line icons, pointer-local glow, slight hover lift, and reduced-motion fallbacks.

- [ ] **Step 5: Verify**

Run: `npm test -- --run src/components/Services.test.tsx src/App.test.tsx`

Expected: PASS.

Run: `npm run build`

Expected: production build completes successfully.
