# Customer Logo Wall Home Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 默认开启客户 Logo 墙，并将其放在首页 `03 SELECTED EXPERIENCE` 与 `04 ABOUT JOTO` 之间。

**Architecture:** 保留现有 `featureFlags.customerLogoWall` 和按需加载边界，只改变默认值与 `App` 中的挂载位置。组件、素材、预览路由和动效均不变。

**Tech Stack:** React 18、TypeScript 5.6、Vitest、Testing Library、Vite 5。

## Global Constraints

- `CustomerLogoWall` 继续通过 `React.lazy` 按需加载。
- `featureFlags.customerLogoWall` 保留，并将默认值设为 `true`。
- 首页顺序固定为 `CaseStudies → CustomerLogoWall → About → GlobalPresence`。
- 独立预览路径 `/preview/customer-logo-wall` 保持不变。
- 不修改 Logo 素材、标题、动效或其他首页区块。

---

### Task 1: Activate and place the Logo wall between sections 03 and 04

**Files:**
- Modify: `joto-site-v2/src/App.tsx`
- Modify: `joto-site-v2/src/App.test.tsx`
- Modify: `joto-site-v2/src/config/features.ts`
- Modify: `joto-site-v2/docs/qa-report.md`

**Interfaces:**
- Consumes: `featureFlags.customerLogoWall: boolean` and lazy `CustomerLogoWall`.
- Produces: default-enabled homepage order `#case-studies → #customer-logo-wall → #about`.

- [ ] **Step 1: Update the failing integration tests**

Set `featureFlags.customerLogoWall = true` in `afterEach`. Replace the default-off assertion with an explicit disabled-state test:

```tsx
it("can hide the customer logo wall through the retained feature flag", () => {
  featureFlags.customerLogoWall = false;
  const { container } = render(<App />);

  expect(container.querySelector("#customer-logo-wall")).not.toBeInTheDocument();
});
```

Replace the placement test with:

```tsx
it("places the enabled customer logo wall between Selected Experience and About JOTO", async () => {
  const { container } = render(<App />);
  await screen.findByRole("heading", { name: "TRUSTED BY INDUSTRY LEADERS" });
  const caseStudies = container.querySelector("#case-studies") as HTMLElement;
  const logoWall = container.querySelector("#customer-logo-wall") as HTMLElement;
  const about = container.querySelector("#about") as HTMLElement;

  expect(caseStudies.compareDocumentPosition(logoWall)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(logoWall.compareDocumentPosition(about)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});
```

- [ ] **Step 2: Run the App test and verify the old placement/default fails**

Run from `joto-site-v2/`:

```bash
npm test -- --run src/App.test.tsx
```

Expected: the new default and `CaseStudies → CustomerLogoWall → About` assertions fail before implementation.

- [ ] **Step 3: Implement the approved default and placement**

Set the flag in `src/config/features.ts`:

```ts
export const featureFlags: { customerLogoWall: boolean } = {
  customerLogoWall: true,
};
```

Move the guarded lazy block in `App.tsx` to this exact boundary:

```tsx
<CaseStudies />
{featureFlags.customerLogoWall && (
  <Suspense fallback={null}>
    <CustomerLogoWall />
  </Suspense>
)}
<About />
<GlobalPresence />
```

- [ ] **Step 4: Run automated verification**

```bash
npm test -- --run
npm run build
```

Expected: all tests pass; TypeScript and Vite production build succeed.

- [ ] **Step 5: Verify the homepage in a real browser**

At 1440×1000 and 390×844, confirm:

```text
#case-studies precedes #customer-logo-wall
#customer-logo-wall precedes #about
the public homepage renders the Logo wall by default
the page has no horizontal overflow
```

- [ ] **Step 6: Record QA and commit**

Append the approved placement and browser result to `docs/qa-report.md`, then run:

```bash
git add joto-site-v2/src/App.tsx joto-site-v2/src/App.test.tsx joto-site-v2/src/config/features.ts joto-site-v2/docs/qa-report.md docs/superpowers/specs/2026-07-22-joto-v2-customer-logo-wall-design.zh-CN.md docs/superpowers/plans/2026-07-22-joto-v2-customer-logo-wall-home-placement.md
git commit -m "feat: activate logo wall between experience and about"
```
