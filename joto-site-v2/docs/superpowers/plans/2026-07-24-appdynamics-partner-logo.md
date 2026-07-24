# AppDynamics Partner Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the twentieth technology-portfolio card with an accurate AppDynamics logo backed by JOTO's archived certified-partner page.

**Architecture:** Keep AppDynamics in the homepage technology-portfolio data only; do not add it to the five solution-detail categories. Bundle the official AppDynamics SVG locally and render it through the existing `Vendor` and `Partners` components.

**Tech Stack:** React, TypeScript, Vite, Vitest, local SVG assets.

## Global Constraints

- Preserve all existing uncommitted logo-wall and service-section work.
- Use the horizontal SVG from the official `Appdynamics/CWOM-Action-Integration` repository.
- Change only the monochrome fill needed for contrast on the existing light card; do not alter the logo paths.
- Keep AppDynamics as the twentieth and final portfolio item.

---

### Task 1: Add and verify the AppDynamics portfolio item

**Files:**
- Create: `src/assets/logos/appdynamics.svg`
- Modify: `src/content/en.ts`
- Modify: `src/content/en.test.ts`
- Modify: `src/components/Partners.test.tsx`

**Interfaces:**
- Consumes: existing `Vendor` type and `partners.items` array.
- Produces: `vendors.appDynamics` with a local SVG and a final twentieth logo card.

- [ ] **Step 1: Update the tests to require twenty cards and AppDynamics last**

```ts
expect(siteContent.partners.items).toHaveLength(20);
expect(siteContent.partners.items.at(-1)?.name).toBe("AppDynamics");
expect(container.querySelectorAll("[data-partner-logo-card]")).toHaveLength(20);
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run: `npm test -- --run src/content/en.test.ts src/components/Partners.test.tsx`

Expected: FAIL because the current portfolio has 19 items.

- [ ] **Step 3: Add the official local SVG and vendor data**

```ts
import appDynamicsLogo from "../assets/logos/appdynamics.svg";

appDynamics: {
  name: "AppDynamics",
  logo: appDynamicsLogo,
  logoScale: "wide",
  description:
    "Application performance monitoring and observability for business-critical digital services.",
},
```

Append `vendors.appDynamics` after `vendors.keyking` in `partners.items`.

- [ ] **Step 4: Run focused tests, the complete suite, and production build**

Run: `npm test -- --run src/content/en.test.ts src/components/Partners.test.tsx`

Expected: PASS.

Run: `npm test -- --run && npm run build`

Expected: all tests and the production build pass.

- [ ] **Step 5: Verify the live layout**

Open the Chinese homepage at the technology portfolio, confirm a complete 5×4 desktop grid, and verify the AppDynamics wordmark is legible in the last card.

- [ ] **Step 6: Commit and deploy**

Commit only the AppDynamics asset, data, tests, and this plan together with any already-approved shared work that is intentionally in scope. Push the feature branch, deploy the production build to the fixed GitHub Pages repository, and verify the published asset hash.
