# Blog Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the shared fixed site navigation available on the Blog index and every Blog article page.

**Architecture:** Reuse the existing `Header` component at the page level so Blog routes inherit the same desktop, mobile, language, and interior-page link behavior as other pages. Add focused page tests that assert the primary navigation exists and that the brand link targets the locale-aware home URL.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library

## Global Constraints

- Reuse the existing `Header`; do not create a Blog-specific navigation component.
- Do not change Blog copy, article layout, navigation styling, or unrelated pages.
- Preserve existing uncommitted work and limit the implementation commit to Blog navigation files.

---

### Task 1: Lock Blog navigation behavior with page tests

**Files:**
- Modify: `src/pages/BlogPage.test.tsx`
- Modify: `src/pages/BlogArticlePage.test.tsx`

**Interfaces:**
- Consumes: `App`, `I18nProvider`, and the accessible `Primary navigation` label exposed by `Header`.
- Produces: regression coverage for navigation presence and locale-aware home links on Blog routes.

- [ ] **Step 1: Add a failing Blog index navigation test**

Add this test to `BlogPage.test.tsx`:

```tsx
it("renders the shared site navigation on the localized Blog index", () => {
  renderApp("/zh/blog");

  expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "JOTO TECH home" })).toHaveAttribute(
    "href",
    "/zh#top",
  );
});
```

- [ ] **Step 2: Add an article navigation regression test**

Add this test to `BlogArticlePage.test.tsx`:

```tsx
it("keeps the shared site navigation on article pages", () => {
  renderApp("/blog/enterprise-network-growth");

  expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "JOTO TECH home" })).toHaveAttribute(
    "href",
    "/#top",
  );
});
```

- [ ] **Step 3: Run the focused tests and verify the index assertion fails**

Run:

```bash
npm test -- --run src/pages/BlogPage.test.tsx src/pages/BlogArticlePage.test.tsx
```

Expected: `BlogPage.test.tsx` fails because the Blog index does not render `Primary navigation`; the article navigation test passes because `BlogArticlePage` already uses `Header`.

### Task 2: Render the shared Header on the Blog index

**Files:**
- Modify: `src/pages/BlogPage.tsx`
- Test: `src/pages/BlogPage.test.tsx`
- Test: `src/pages/BlogArticlePage.test.tsx`

**Interfaces:**
- Consumes: default export `Header(): JSX.Element` from `src/components/Header.tsx`.
- Produces: a fixed global navigation at the top of the Blog index without changing existing Blog content.

- [ ] **Step 1: Import and render Header**

Update `BlogPage.tsx`:

```tsx
import BlogCard from "../components/BlogCard";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";

// Inside the page's <main>, before the first content <section>:
<Header />
```

- [ ] **Step 2: Run focused tests and verify they pass**

Run:

```bash
npm test -- --run src/pages/BlogPage.test.tsx src/pages/BlogArticlePage.test.tsx
```

Expected: both test files pass.

- [ ] **Step 3: Run the complete automated verification**

Run:

```bash
npm test -- --run
npm run build
```

Expected: all tests pass, TypeScript reports no errors, and Vite completes the production build.

- [ ] **Step 4: Verify the rendered pages in a browser**

Open and inspect:

```text
http://127.0.0.1:5173/zh/blog
http://127.0.0.1:5173/zh/blog/enterprise-network-growth
```

Expected: the fixed header is visible on both pages; the JOTO brand returns to `/zh#top`; the desktop navigation is usable; at a mobile viewport the menu button opens the same full-screen navigation used elsewhere.

- [ ] **Step 5: Commit the navigation implementation**

```bash
git add src/pages/BlogPage.tsx src/pages/BlogPage.test.tsx src/pages/BlogArticlePage.test.tsx
git commit -m "fix: restore navigation across blog pages"
```
