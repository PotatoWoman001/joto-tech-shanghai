# Fixed Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the JOTO navigation visible at the top of the viewport while scrolling on desktop and mobile.

**Architecture:** Preserve the existing `Header` component and menu state. Change only the header positioning and surface treatment so the same navigation remains fixed and readable over every section without changing hero media or page content.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite

## Global Constraints

- Do not modify the hero video, background brightness, animation, or other visual content.
- Preserve the existing header height, navigation content, locale switcher, desktop solution directory, and mobile menu behavior.
- The fixed treatment must apply to English, Chinese, and Persian routes.

---

### Task 1: Fix and verify the site header

**Files:**
- Modify: `src/components/Header.test.tsx`
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: the existing `Header(): JSX.Element` component and its locale-aware navigation state.
- Produces: the same `Header` interface with a fixed top-level `<header>` element.

- [ ] **Step 1: Write the failing fixed-position test**

Add this test inside the existing `describe("Header", ...)` block:

```tsx
it("keeps the navigation fixed and readable while the page scrolls", () => {
  const { container } = renderHeader();
  const header = container.querySelector("header");

  expect(header).toHaveClass("fixed", "inset-x-0", "top-0", "z-50");
  expect(header).toHaveClass("bg-[#070b0a]/90", "backdrop-blur-md");
  expect(header).not.toHaveClass("absolute");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --run src/components/Header.test.tsx
```

Expected: FAIL because the header still has `absolute` and lacks the fixed surface classes.

- [ ] **Step 3: Implement the minimal fixed header**

Replace the opening header class in `src/components/Header.tsx` with:

```tsx
<header
  className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070b0a]/90 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
  dir="ltr"
>
```

Do not change `Hero.tsx`, `HlsBackgroundVideo.tsx`, or any media-related class.

- [ ] **Step 4: Run the focused test and production build**

Run:

```bash
npm test -- --run src/components/Header.test.tsx
npm run build
```

Expected: the header test file passes and the TypeScript/Vite production build completes successfully.

- [ ] **Step 5: Verify desktop and mobile behavior in the local preview**

At desktop width, open `/zh`, scroll below the hero, and verify:

```text
header top = 0
header position = fixed
header remains visible
desktop solution directory opens above page content
```

At a mobile viewport, reload `/zh`, scroll below the hero, and verify:

```text
header top = 0
header position = fixed
mobile menu opens full-screen and closes normally
```

Also inspect the hero background before and after the change to confirm its video source, opacity, and visual brightness were not modified.

- [ ] **Step 6: Commit only the navigation implementation**

```bash
git add src/components/Header.tsx src/components/Header.test.tsx
git commit -m "fix: keep navigation visible while scrolling"
```
