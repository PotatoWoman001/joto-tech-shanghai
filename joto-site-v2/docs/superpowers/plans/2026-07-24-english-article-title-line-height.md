# English Article Title Line Height Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase only the English Blog article hero title line height from `0.87` to `1.04` so multiline titles no longer overlap.

**Architecture:** Keep the existing `BlogArticlePage` typography and select the title line-height utility from the current locale. Lock the locale boundary with focused component tests before browser and production verification.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- Apply `leading-[1.04]` only to English Blog article hero titles.
- Keep Chinese and Persian Blog article title behavior unchanged.
- Do not change title font size, tracking, Blog cards, body headings, or unrelated pages.

---

### Task 1: Add locale-specific title line-height coverage

**Files:**
- Modify: `src/pages/BlogArticlePage.test.tsx`
- Test: `src/pages/BlogArticlePage.test.tsx`

**Interfaces:**
- Consumes: `renderApp(pathname: string)` and the article page level-one heading.
- Produces: regression coverage for English `leading-[1.04]` and non-English `leading-[0.87]`.

- [ ] **Step 1: Add the failing locale-specific test**

Add:

```tsx
it("loosens only the English article title line height", () => {
  const english = renderApp("/blog/enterprise-network-growth");
  expect(screen.getByRole("heading", { level: 1 })).toHaveClass("leading-[1.04]");
  english.unmount();

  const chinese = renderApp("/zh/blog/enterprise-network-growth");
  expect(screen.getByRole("heading", { level: 1 })).toHaveClass("leading-[0.87]");
  expect(screen.getByRole("heading", { level: 1 })).not.toHaveClass("leading-[1.04]");
  chinese.unmount();

  renderApp("/fa/blog/enterprise-network-growth");
  expect(screen.getByRole("heading", { level: 1 })).toHaveClass("leading-[0.87]");
  expect(screen.getByRole("heading", { level: 1 })).not.toHaveClass("leading-[1.04]");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --run src/pages/BlogArticlePage.test.tsx
```

Expected: FAIL because the English title still has `leading-[0.87]`.

### Task 2: Apply the English-only title line height

**Files:**
- Modify: `src/pages/BlogArticlePage.tsx`
- Test: `src/pages/BlogArticlePage.test.tsx`

**Interfaces:**
- Consumes: `locale` from `useI18n()`.
- Produces: English hero title class `leading-[1.04]`; all other locales keep `leading-[0.87]`.

- [ ] **Step 1: Select the line-height utility by locale**

Replace the article title class with:

```tsx
<h1
  className={`max-w-6xl text-balance text-[clamp(3.4rem,7.6vw,8.2rem)] font-medium tracking-[-0.072em] ${
    locale === "en" ? "leading-[1.04]" : "leading-[0.87]"
  }`}
>
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
npm test -- --run src/pages/BlogArticlePage.test.tsx
```

Expected: all Blog article tests pass.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test -- --run
npm run build
```

Expected: all tests pass and the production build completes.

- [ ] **Step 4: Verify the English title in the browser**

Open:

```text
http://127.0.0.1:5173/blog/enterprise-network-growth
```

Expected: computed title line height is approximately `1.04 × font-size`; the descender in “Building” no longer overlaps the following line. Chinese and Persian computed title behavior remains unchanged.

- [ ] **Step 5: Commit and publish**

```bash
git add docs/superpowers/plans/2026-07-24-english-article-title-line-height.md src/pages/BlogArticlePage.tsx src/pages/BlogArticlePage.test.tsx
git commit -m "fix: loosen English article title spacing"
git push origin codex/joto-trilingual-zh-en-fa
```

