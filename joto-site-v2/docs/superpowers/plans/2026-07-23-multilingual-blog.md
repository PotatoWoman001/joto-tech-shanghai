# Multilingual Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a six-article, fully localized editorial Blog with list and detail pages, and update the responsive navigation so Blog is a primary item and Contact is a separate action beside the existing language selector.

**Architecture:** A dedicated `content/blog.ts` module owns stable slugs, imagery, localized metadata, and structured article bodies. Focused Blog card, index, and detail components consume that module, while the existing pathname-based router and locale-prefix helpers continue to own routing. Header changes remain isolated from Blog content.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, existing JOTO i18n and pathname routing.

## Global Constraints

- Keep language labels unchanged as `EN / 中文 / فارسی`.
- Desktop primary navigation is `SOLUTIONS / SERVICES / CASE STUDIES / ABOUT / BLOG`.
- Render Contact as a separate action immediately left of the language selector.
- Provide complete English, Simplified Chinese, and Persian content for all six articles.
- Do not invent customer names, performance figures, or unsupported claims.
- Reuse existing JOTO TECH imagery and visual tokens.
- Preserve locale prefixes and the same article slug while switching language.

---

### Task 1: Blog Content Model and Six Localized Articles

**Files:**
- Create: `src/content/blog.ts`
- Create: `src/content/blog.test.ts`

**Interfaces:**
- Produces: `BlogArticle`, `BlogArticleTranslation`, `blogArticles`, `getBlogArticle(slug)`, and `blogPageCopy`.
- Consumes: `Locale` from `src/i18n/routing.ts` and existing image modules.

- [ ] **Step 1: Write the failing content tests**

```ts
import { describe, expect, it } from "vitest";
import { blogArticles, getBlogArticle } from "./blog";

describe("blog content", () => {
  it("publishes six localized articles with stable slugs", () => {
    expect(blogArticles).toHaveLength(6);
    expect(new Set(blogArticles.map(({ slug }) => slug)).size).toBe(6);
    for (const article of blogArticles) {
      expect(article.translations.en.body.length).toBeGreaterThan(3);
      expect(article.translations["zh-CN"].body.length).toBeGreaterThan(3);
      expect(article.translations["fa-IR"].body.length).toBeGreaterThan(3);
    }
  });

  it("finds an article by exact slug", () => {
    expect(getBlogArticle("enterprise-network-growth")?.featured).toBe(true);
    expect(getBlogArticle("missing-article")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npm test -- --run src/content/blog.test.ts`

Expected: FAIL because `src/content/blog.ts` does not exist.

- [ ] **Step 3: Implement the content types and data**

```ts
export type BlogBodyBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export interface BlogArticleTranslation {
  category: string;
  title: string;
  excerpt: string;
  imageAlt: string;
  dateLabel: string;
  readingTime: string;
  body: BlogBodyBlock[];
}

export interface BlogArticle {
  slug: string;
  publishedAt: string;
  featured: boolean;
  image: string;
  translations: Record<Locale, BlogArticleTranslation>;
}

export const getBlogArticle = (slug: string) =>
  blogArticles.find((article) => article.slug === slug);
```

Create six records using the approved topics and existing assets. Each translation contains at least four structured body blocks and uses only approved factual material.

- [ ] **Step 4: Run content tests**

Run: `npm test -- --run src/content/blog.test.ts`

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog.ts src/content/blog.test.ts
git commit -m "feat: add multilingual blog content"
```

---

### Task 2: Navigation Order, Contact Action, and Language Labels

**Files:**
- Modify: `src/content/en.ts`
- Modify: `src/content/en.test.ts`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: the existing `siteContent.nav`, `localizedHref`, and `switchHref`.
- Produces: Blog primary links and a separate localized Contact action.

- [ ] **Step 1: Update tests for the approved header contract**

```ts
expect(siteContent.nav.map(({ label }) => label)).toEqual([
  "SOLUTIONS",
  "SERVICES",
  "CASE STUDIES",
  "ABOUT",
  "BLOG",
]);
expect(siteContent.nav.find(({ label }) => label === "BLOG")?.href).toBe("/blog");
expect(localeMeta["zh-CN"].label).toBe("中文");
expect(localeMeta["fa-IR"].label).toBe("فارسی");
```

In `Header.test.tsx`, assert that Contact is outside `Primary navigation`, links to `/contact`, and appears before the language selector in the header action container. Assert that the mobile menu contains Blog and Contact.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --run src/content/en.test.ts src/components/Header.test.tsx`

Expected: FAIL because Contact remains in `siteContent.nav` and Blog is absent.

- [ ] **Step 3: Implement desktop and mobile navigation**

Change `siteContent.nav` to replace Contact with Blog. Add a desktop Contact anchor immediately before the existing language selector:

```tsx
<div className="relative z-[70] ml-auto flex items-center gap-3 lg:ml-5">
  <a
    className="hidden rounded-full border border-joto-green/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-joto-green hover:text-joto-ink lg:inline-flex"
    href={localizedHref("/contact", locale)}
  >
    {t("CONTACT")}
  </a>
  <div aria-label={t("Language selector")} className="flex items-center gap-1 rounded-full border border-white/15 bg-black/15 p-1">
    {/* existing locale links */}
  </div>
</div>
```

Add Contact after the mapped primary links inside the mobile full-screen menu.

- [ ] **Step 4: Run navigation tests**

Run: `npm test -- --run src/content/en.test.ts src/components/Header.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/en.ts src/content/en.test.ts src/components/Header.tsx src/components/Header.test.tsx
git commit -m "feat: add blog and reposition contact navigation"
```

---

### Task 3: Editorial Blog Index

**Files:**
- Create: `src/components/BlogCard.tsx`
- Create: `src/pages/BlogPage.tsx`
- Create: `src/pages/BlogPage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `blogArticles`, `blogPageCopy`, `Locale`, `localizedHref`, `Header`, and `SiteFooter`.
- Produces: `/blog`, `/zh/blog`, and `/fa/blog` index views.

- [ ] **Step 1: Write the failing page test**

```tsx
it("renders one featured story and all six localized articles", () => {
  window.history.replaceState({}, "", "/blog");
  render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
  expect(screen.getByRole("heading", { level: 1, name: "Insights for connected enterprises." })).toBeInTheDocument();
  expect(screen.getAllByRole("article")).toHaveLength(6);
  expect(screen.getByRole("link", { name: /Building an Enterprise Network/ })).toHaveAttribute(
    "href",
    "/blog/enterprise-network-growth",
  );
});
```

Add a Chinese-route assertion for `/zh/blog`.

- [ ] **Step 2: Run the page test and verify failure**

Run: `npm test -- --run src/pages/BlogPage.test.tsx`

Expected: FAIL because `BlogPage` is not routed.

- [ ] **Step 3: Implement the reusable card**

`BlogCard` receives `article`, `locale`, and `featured`. It renders a semantic `<article>`, localized metadata, an existing cover image, and a localized link.

- [ ] **Step 4: Implement the index and route**

```tsx
if (pathname === "/blog" || pathname === "/blog/") {
  return <BlogPage />;
}
```

The page uses one wide featured article and a responsive `md:grid-cols-2 xl:grid-cols-3` grid for the remaining five cards.

- [ ] **Step 5: Run index tests**

Run: `npm test -- --run src/pages/BlogPage.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/BlogCard.tsx src/pages/BlogPage.tsx src/pages/BlogPage.test.tsx src/App.tsx
git commit -m "feat: add editorial blog index"
```

---

### Task 4: Localized Article Detail and Missing State

**Files:**
- Create: `src/pages/BlogArticlePage.tsx`
- Create: `src/pages/BlogArticlePage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `getBlogArticle`, `blogArticles`, localized body blocks, `localizedHref`, `Header`, and `SiteFooter`.
- Produces: valid article detail pages and an article-not-found state under `/blog/:slug`.

- [ ] **Step 1: Write failing article-route tests**

```tsx
it("renders the requested article in Chinese on the same slug", () => {
  window.history.replaceState({}, "", "/zh/blog/enterprise-network-growth");
  render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
  expect(screen.getByRole("heading", { level: 1, name: "构建能够随业务增长的企业网络" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
    "href",
    "/blog/enterprise-network-growth",
  );
});

it("renders an article-not-found state for an unknown slug", () => {
  window.history.replaceState({}, "", "/blog/unknown");
  render(
    <I18nProvider>
      <App />
    </I18nProvider>,
  );
  expect(screen.getByRole("heading", { name: "Article not found." })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Back to insights" })).toHaveAttribute("href", "/blog");
});
```

- [ ] **Step 2: Run the detail tests and verify failure**

Run: `npm test -- --run src/pages/BlogArticlePage.test.tsx`

Expected: FAIL because detail routing and rendering do not exist.

- [ ] **Step 3: Implement the route matcher**

```ts
const blogSlug = pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
if (blogSlug) {
  return <BlogArticlePage article={getBlogArticle(blogSlug)} />;
}
```

- [ ] **Step 4: Implement structured article rendering**

Map `heading`, `paragraph`, `list`, and `quote` blocks to semantic elements. Render two related articles excluding the current slug. Keep body width near `max-w-3xl`, with a full-width cover image and existing JOTO green accents.

- [ ] **Step 5: Run detail tests**

Run: `npm test -- --run src/pages/BlogArticlePage.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/BlogArticlePage.tsx src/pages/BlogArticlePage.test.tsx src/App.tsx
git commit -m "feat: add localized blog article pages"
```

---

### Task 5: Footer Integration and Full Verification

**Files:**
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/SiteFooter.test.tsx`
- Modify only if validation reveals a scoped issue: Blog files created above.

**Interfaces:**
- Consumes: the public `/blog` route and locale helpers.
- Produces: a discoverable Blog link in the footer and verified responsive pages.

- [ ] **Step 1: Add a failing footer assertion**

```ts
expect(within(company).getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
```

- [ ] **Step 2: Implement the footer Blog link and run its tests**

Run: `npm test -- --run src/components/SiteFooter.test.tsx`

Expected: PASS after adding `{ label: "Blog", href: "/blog" }` to the company links.

- [ ] **Step 3: Run all focused Blog and navigation tests**

Run:

```bash
npm test -- --run src/content/blog.test.ts src/content/en.test.ts src/components/Header.test.tsx src/components/SiteFooter.test.tsx src/pages/BlogPage.test.tsx src/pages/BlogArticlePage.test.tsx
```

Expected: PASS.

- [ ] **Step 4: Run production validation**

Run: `npm run build`

Expected: TypeScript and Vite build succeed.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 5: Visually verify responsive behavior**

Inspect `/blog` and one article at desktop, tablet, and mobile widths. Confirm:

- no horizontal overflow;
- header order and Contact placement;
- featured/grid collapse behavior;
- readable article measure;
- Persian RTL layout;
- language switching preserves the article slug.

- [ ] **Step 6: Commit**

```bash
git add src/components/SiteFooter.tsx src/components/SiteFooter.test.tsx
git commit -m "feat: complete blog navigation and verification"
```
