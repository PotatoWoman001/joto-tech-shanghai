# JOTO Visual Revision Precision Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the service-image treatment and JD JOY +「京东」logo from task `019f89a7-feae-7b72-b728-c0548848b183` into the current website without reverting current functionality.

**Architecture:** Keep the current six-card Services data model, 3D pointer interaction, routes, pages, logo walls, and tests as the baseline. Extend the existing typed content with image metadata and logo treatment metadata, then render those additions inside the current components using conditional styling.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite

## Global Constraints

- Preserve every unrelated staged, unstaged, and untracked file in the current working tree.
- Do not copy whole source files or merge the source worktree branch.
- Do not remove current About, Contact, customer logo wall, partner data, typewriter, Cisco detail page, or global-map behavior.
- Do not copy `output/` or temporary download files from the source worktree.
- Do not create Git commits while unrelated user changes are staged.

---

### Task 1: Lock the merged content contract

**Files:**
- Modify: `joto-site-v2/src/components/Services.test.tsx`
- Modify: `joto-site-v2/src/content/en.test.ts`
- Modify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: `siteContent.services.items`, `siteContent.caseStudies.items`, `Services`, and `App`.
- Produces: regression assertions for six service images and the original-color JD logo.

- [ ] **Step 1: Add failing service-image assertions**

In `Services.test.tsx`, assert that all six cards expose images and that a representative image has descriptive alt text:

```tsx
expect(region.getAllByRole("img")).toHaveLength(6);
expect(
  region.getByRole("img", {
    name: "Security operator monitoring multiple live systems in a control center",
  }),
).toBeInTheDocument();
```

- [ ] **Step 2: Add failing JD content assertions**

In `en.test.ts`, locate `JD International` and assert:

```tsx
expect(jd?.logo).toMatch(/jd-joy-chinese\.png$/i);
expect(jd?.logoTreatment).toBe("original");
```

- [ ] **Step 3: Add failing JD render assertions**

In `App.test.tsx`, render the homepage and assert the JD logo does not have `brightness-0` or `invert`.

- [ ] **Step 4: Run focused tests and verify failure**

Run: `npm test -- --run src/components/Services.test.tsx src/content/en.test.ts src/App.test.tsx`

Expected: FAIL because service images, `logoTreatment`, and the JD JOY asset are not yet connected.

### Task 2: Adapt source visuals to the current typed components

**Files:**
- Create: `joto-site-v2/src/assets/services/advisory-planning.webp`
- Create: `joto-site-v2/src/assets/services/design-integration.webp`
- Create: `joto-site-v2/src/assets/services/managed-support.webp`
- Create: `joto-site-v2/src/assets/services/security-compliance.webp`
- Create: `joto-site-v2/src/assets/logos/jd-joy-chinese.png`
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Modify: `joto-site-v2/src/components/Services.tsx`
- Modify: `joto-site-v2/src/components/CaseStudies.tsx`

**Interfaces:**
- Consumes: the current six service records and existing `CaseStudy` records.
- Produces: `ServiceItem.image: string`, `ServiceItem.imageAlt: string`, and optional `CaseStudy.logoTreatment: "original" | "monochrome"`.

- [ ] **Step 1: Copy only the five approved binary assets**

Copy the four service WebP files and `jd-joy-chinese.png` from the source worktree into the matching current asset directories. Do not copy the source `output/` directory.

- [ ] **Step 2: Extend the content types**

Add these exact fields:

```ts
export interface ServiceItem {
  icon: ServiceIcon;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface CaseStudy {
  client: string;
  sector: string;
  summary: string;
  capabilities: string[];
  logo?: string;
  logoTreatment?: "original" | "monochrome";
}
```

- [ ] **Step 3: Map imagery without changing the approved six services**

Import the five assets in `en.ts`. Keep all six current titles and descriptions, mapping advisory photography to planning, integration photography to deployment and procurement, managed-support photography to support and staffing, and security photography to security. Set descriptive `imageAlt` values and switch JD to `jd-joy-chinese.png` with `logoTreatment: "original"`.

- [ ] **Step 4: Render blended imagery inside the current service card**

Keep `data-service-card`, icon mapping, pointer tilt, grid breakpoints, headings, and descriptions. Append a visual below the copy using an elliptical mask, `scale-[1.08]`, reduced brightness/saturation, a green color blend, and a dark radial edge overlay. Increase the card minimum height only enough to prevent copy/image overlap.

- [ ] **Step 5: Respect case-study logo treatment**

In `CaseStudies.tsx`, retain the existing sizing classes and apply `brightness-0 invert` only when `item.logoTreatment !== "original"`.

- [ ] **Step 6: Run focused tests**

Run: `npm test -- --run src/components/Services.test.tsx src/content/en.test.ts src/App.test.tsx`

Expected: PASS.

### Task 3: Regression, build, and responsive verification

**Files:**
- Verify: `joto-site-v2/src`

**Interfaces:**
- Consumes: the completed precision merge.
- Produces: test, build, and browser evidence that current behavior is preserved.

- [ ] **Step 1: Run the full suite**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully; the existing Vite chunk-size warning is acceptable.

- [ ] **Step 3: Inspect responsive layouts**

Run the local Vite server and inspect the homepage at 1440px, 768px, and 375px widths. Confirm the six-card grid remains three/two/one columns, service images sit below copy without overlap, JD remains in color, and `scrollWidth` equals viewport width.
