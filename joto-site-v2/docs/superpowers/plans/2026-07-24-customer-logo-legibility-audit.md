# Customer Logo Legibility Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all 42 customer brands readable in the scrolling logo wall and stop the monochrome treatment from destroying Orange, FORVIA, Yuwell, and WuXi AppTec marks.

**Architecture:** Keep `customerLogos.ts` as the source of display metadata, extend its treatment union with an `original` mode, and render a persistent name label in `CustomerLogoWall.tsx`. Keep styling in the existing logo-wall section of `index.css`, preserving the current single-track marquee and accessibility model.

**Tech Stack:** React 19, TypeScript, Tailwind utility classes, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Keep exactly 42 unique customer entries.
- Keep one horizontal marquee track with a decorative duplicate sequence.
- Every customer entry must have a visible, correctly capitalized brand name.
- The duplicate sequence must remain hidden from assistive technology.
- Do not replace unrelated in-progress changes in `src/index.css` or elsewhere.

---

### Task 1: Encode legibility and treatment requirements in tests

**Files:**
- Modify: `src/components/CustomerLogoWall.test.tsx`
- Modify: `src/content/customerLogos.test.ts`

**Interfaces:**
- Consumes: `CustomerLogoWall`, `customerLogoRows`
- Produces: assertions for `.customer-logo-wall__name` and `data-logo-treatment="original"`

- [ ] **Step 1: Write the failing component tests**

Add assertions that the component renders 84 visible brand-name elements (42 primary plus 42 duplicate), that each representative name appears twice, and that FORVIA and Orange use the `original` treatment:

```tsx
expect(container.querySelectorAll(".customer-logo-wall__name")).toHaveLength(84);
expect(screen.getAllByText("FORVIA")).toHaveLength(2);
expect(screen.getAllByText("WuXi AppTec")).toHaveLength(2);
expect(screen.getByRole("img", { name: "FORVIA logo" })).toHaveAttribute(
  "data-logo-treatment",
  "original",
);
```

Update the failed-image assertion so one persistent `McDonald’s` name remains in each sequence after the primary image fails.

- [ ] **Step 2: Write the failing content test**

Add an assertion that the four filter-sensitive brands use `original`:

```ts
expect(
  customerLogoRows
    .flat()
    .filter((logo) => logo.treatment === "original")
    .map((logo) => logo.name),
).toEqual(["Orange", "FORVIA", "Yuwell", "WuXi AppTec"]);
```

- [ ] **Step 3: Run focused tests and verify failure**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx src/content/customerLogos.test.ts
```

Expected: FAIL because persistent names and the `original` treatment do not exist yet.

### Task 2: Implement persistent names and safe original-color treatment

**Files:**
- Modify: `src/content/customerLogos.ts`
- Modify: `src/components/CustomerLogoWall.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `CustomerLogo.treatment`
- Produces: `CustomerLogoTreatment = "solid" | "contrast" | "original"`, `.customer-logo-wall__name`, `.customer-logo-wall__logo--original`

- [ ] **Step 1: Extend the treatment metadata**

Change the union and mark the four audited entries:

```ts
export type CustomerLogoTreatment = "solid" | "contrast" | "original";

{ name: "Orange", scale: "compact", src: orange, treatment: "original" },
{ name: "FORVIA", src: forvia, treatment: "original" },
{ name: "Yuwell", scale: "compact", src: yuwell, treatment: "original" },
{ name: "WuXi AppTec", src: wuxiApptec, treatment: "original" },
```

- [ ] **Step 2: Render the logo and name as a vertical group**

Keep the name outside the image failure branch, increase only the item’s internal height, and add the original-treatment modifier:

```tsx
<li className="customer-logo-wall__item group flex h-24 shrink-0 flex-col items-center justify-center gap-2 sm:h-28">
  {!failed && (
    <img
      className={`${logoScaleClasses[scale]} customer-logo-wall__logo ${
        treatment === "contrast"
          ? "customer-logo-wall__logo--contrast"
          : treatment === "original"
            ? "customer-logo-wall__logo--original"
            : ""
      } object-contain`}
    />
  )}
  <span className="customer-logo-wall__name">{logo.name}</span>
</li>
```

The primary image keeps `${logo.name} logo` alternative text; the duplicate image keeps an empty alternative and its sequence remains `aria-hidden`.

- [ ] **Step 3: Add focused CSS without rewriting unrelated styles**

Add:

```css
.customer-logo-wall__logo--original {
  filter: none;
  opacity: 0.94;
}

.customer-logo-wall__name {
  max-width: 12rem;
  color: rgb(231 239 236 / 0.78);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.035em;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}

.customer-logo-wall__item:hover .customer-logo-wall__logo--original {
  filter: none;
  opacity: 1;
}

.customer-logo-wall__item:hover .customer-logo-wall__name {
  color: rgb(255 255 255 / 0.98);
}
```

- [ ] **Step 4: Run focused tests and verify pass**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx src/content/customerLogos.test.ts
```

Expected: both files PASS.

### Task 3: Verify the complete wall in build and browser

**Files:**
- Verify: `src/components/CustomerLogoWall.tsx`
- Verify: `src/content/customerLogos.ts`
- Verify: `src/index.css`

**Interfaces:**
- Consumes: `/preview/customer-logo-wall`
- Produces: a tested preview for user review

- [ ] **Step 1: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0 with no TypeScript or Vite build errors.

- [ ] **Step 2: Inspect all entries in the browser**

Open `http://127.0.0.1:5174/preview/customer-logo-wall` and verify:

- the wall has one scrolling row;
- every visible mark has a readable name below it;
- Orange retains orange;
- FORVIA retains the hollow white center of the “O”;
- Yuwell and WuXi AppTec are identifiable from their names even though their supplied marks are icon-led;
- long names do not wrap or overlap;
- the mobile viewport preserves the same behavior.

- [ ] **Step 3: Review the diff**

Run:

```bash
git diff --check
git diff -- src/components/CustomerLogoWall.tsx src/components/CustomerLogoWall.test.tsx src/content/customerLogos.ts src/content/customerLogos.test.ts src/index.css
```

Expected: no whitespace errors and only the intended logo-wall changes.

- [ ] **Step 4: Commit the implementation**

Stage only the audited logo-wall files and commit:

```bash
git add joto-site-v2/src/components/CustomerLogoWall.tsx \
  joto-site-v2/src/components/CustomerLogoWall.test.tsx \
  joto-site-v2/src/content/customerLogos.ts \
  joto-site-v2/src/content/customerLogos.test.ts \
  joto-site-v2/src/index.css \
  joto-site-v2/docs/superpowers/plans/2026-07-24-customer-logo-legibility-audit.md
git commit -m "fix: make customer logos identifiable"
```
