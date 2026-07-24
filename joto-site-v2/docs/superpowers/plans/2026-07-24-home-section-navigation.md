# Homepage Section Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the Services and Case Studies header links reach the matching homepage sections in English, Chinese, and Persian on desktop and mobile.

**Architecture:** Keep the existing shared navigation data (`#services` and `#case-studies`) and route every link through the existing `pageHref` and `localizedHref` helpers. Add cross-locale regression coverage rather than duplicating locale-specific URLs in the component.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, Vite, GitHub Pages

## Global Constraints

- Services must target the current language homepage `#services` section.
- Case Studies must target the current language homepage `#case-studies` section.
- English uses `/`, Chinese uses `/zh/`, and Persian uses `/fa/`.
- Desktop and mobile navigation must share the same destination.
- Do not change navigation copy, homepage section content, or unrelated navigation items.

---

### Task 1: Add three-language navigation regression coverage

**Files:**
- Modify: `src/components/Header.test.tsx`
- Verify: `src/components/Header.tsx`
- Verify: `src/content/en.ts`
- Verify: `src/lib/anchors.ts`

**Interfaces:**
- Consumes: `pageHref(href: string, fromDetailPage: boolean): string`
- Consumes: `localizedHref(href: string, locale: Locale): string`
- Produces: Regression coverage for the Services and Case Studies destinations in all three locales.

- [ ] **Step 1: Add the cross-locale desktop test**

Add this test inside `describe("Header", ...)` in `src/components/Header.test.tsx`:

```tsx
it.each([
  {
    pathname: "/about",
    navigationName: "Primary navigation",
    servicesLabel: "SERVICES",
    caseStudiesLabel: "CASE STUDIES",
    servicesHref: "/#services",
    caseStudiesHref: "/#case-studies",
  },
  {
    pathname: "/zh/about",
    navigationName: "主导航",
    servicesLabel: "服务",
    caseStudiesLabel: "客户案例",
    servicesHref: "/zh/#services",
    caseStudiesHref: "/zh/#case-studies",
  },
  {
    pathname: "/fa/about",
    navigationName: "پیمایش اصلی",
    servicesLabel: "خدمات",
    caseStudiesLabel: "مطالعات موردی",
    servicesHref: "/fa/#services",
    caseStudiesHref: "/fa/#case-studies",
  },
])(
  "links $pathname desktop navigation to localized homepage sections",
  ({
    pathname,
    navigationName,
    servicesLabel,
    caseStudiesLabel,
    servicesHref,
    caseStudiesHref,
  }) => {
    window.history.replaceState({}, "", pathname);
    renderHeader();

    const navigation = screen.getByRole("navigation", { name: navigationName });
    expect(within(navigation).getByRole("link", { name: servicesLabel })).toHaveAttribute(
      "href",
      servicesHref,
    );
    expect(
      within(navigation).getByRole("link", { name: caseStudiesLabel }),
    ).toHaveAttribute("href", caseStudiesHref);
  },
);
```

- [ ] **Step 2: Run the desktop regression test**

Run:

```bash
npm test -- --run src/components/Header.test.tsx
```

Expected: `src/components/Header.test.tsx` passes for English, Chinese, and Persian. If the current shared routing is intact, no production-code change is required.

- [ ] **Step 3: Add the cross-locale mobile test**

Add this test inside the same `describe("Header", ...)` block:

```tsx
it.each([
  ["/about", "Open menu", "Mobile navigation", "SERVICES", "CASE STUDIES", "/#services", "/#case-studies"],
  ["/zh/about", "打开菜单", "移动端导航", "服务", "客户案例", "/zh/#services", "/zh/#case-studies"],
  ["/fa/about", "باز کردن منو", "پیمایش موبایل", "خدمات", "مطالعات موردی", "/fa/#services", "/fa/#case-studies"],
])(
  "links %s mobile navigation to localized homepage sections",
  async (
    pathname,
    openMenuLabel,
    navigationName,
    servicesLabel,
    caseStudiesLabel,
    servicesHref,
    caseStudiesHref,
  ) => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", pathname);
    renderHeader();

    await user.click(screen.getByRole("button", { name: openMenuLabel }));
    const navigation = screen.getByRole("navigation", { name: navigationName });

    expect(within(navigation).getByRole("link", { name: servicesLabel })).toHaveAttribute(
      "href",
      servicesHref,
    );
    expect(
      within(navigation).getByRole("link", { name: caseStudiesLabel }),
    ).toHaveAttribute("href", caseStudiesHref);
  },
);
```

- [ ] **Step 4: Run the complete header suite**

Run:

```bash
npm test -- --run src/components/Header.test.tsx
```

Expected: all Header tests pass.

- [ ] **Step 5: Commit only the navigation regression test**

```bash
git add joto-site-v2/src/components/Header.test.tsx
git commit -m "test: cover localized homepage navigation"
```

### Task 2: Build and verify the public links

**Files:**
- Verify: `dist/index.html`
- Verify: generated JavaScript bundle under `dist/assets/`

**Interfaces:**
- Consumes: The tested shared navigation configuration from Task 1.
- Produces: A production build whose three localized routes expose the expected homepage anchors.

- [ ] **Step 1: Run the focused routing and header tests**

Run:

```bash
npm test -- --run src/components/Header.test.tsx src/i18n/routing.test.ts
```

Expected: both test files pass.

- [ ] **Step 2: Build the GitHub Pages artifact**

Run:

```bash
npm run build:github-pages
```

Expected: TypeScript checking succeeds and Vite creates `dist/` without errors.

- [ ] **Step 3: Verify the production site**

Open these routes and inspect the Services and Case Studies header links:

```text
https://potatowoman001.github.io/
https://potatowoman001.github.io/zh/
https://potatowoman001.github.io/fa/
```

Expected:

```text
English: /#services and /#case-studies
Chinese: /zh/#services and /zh/#case-studies
Persian: /fa/#services and /fa/#case-studies
```

- [ ] **Step 4: Preserve the user's working tree**

Confirm that no unrelated modified or untracked files are staged:

```bash
git status --short
git diff --cached --name-only
```

Expected: only the navigation test created by Task 1 is part of the implementation commit.
