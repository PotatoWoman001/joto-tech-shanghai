# Hero CTA Fixed Gap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the desktop Hero CTA beside the second headline line and keep an approximately `64px` visual gap from the green period in English, Chinese, and Persian.

**Architecture:** `Hero` keeps two responsive CTA instances that share the existing `HeroCta` component. The desktop instance joins the visible second headline line in one direction-aware flex row with `lg:gap-16`; the mobile instance remains below the supporting copy. A visually hidden `h1` preserves one complete accessible heading while the visual title and CTA remain separate semantic elements.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 3, Vitest, Testing Library, Vite, Playwright CLI.

## Global Constraints

- Desktop layout begins at Tailwind's existing `lg` breakpoint.
- The desktop CTA gap is `lg:gap-16` (`64px`) for `en`, `zh-CN`, and `fa-IR`.
- English and Chinese place the CTA after the green period; Persian inherits RTL and places it before the green period visually.
- Below `lg`, the CTA remains below the supporting copy.
- CTA text, link, size, colors, animation, hover behavior, and focus styling remain unchanged.
- Do not modify or stage unrelated `SolutionCategoryPage` worktree changes.

---

### Task 1: Add a direction-aware desktop CTA row

**Files:**
- Modify: `joto-site-v2/src/App.test.tsx`
- Modify: `joto-site-v2/src/components/Hero.tsx`
- Modify: `joto-site-v2/src/index.css`

**Interfaces:**
- Consumes: `HeroCta({ className, href, label, placement })`, `locale`, and `siteContent.hero`.
- Produces: `[data-hero-title-row]`, `[data-hero-cta-desktop]`, and `[data-hero-cta-mobile]` selectors used by tests and browser verification.

- [ ] **Step 1: Write the failing component test**

Replace the current three-locale CTA test with:

```tsx
it.each([
  { language: "English", pathname: "/" },
  { language: "Chinese", pathname: "/zh/" },
  { language: "Persian", pathname: "/fa/" },
])(
  "uses one fixed desktop title-to-CTA gap for $language",
  ({ pathname }) => {
    window.history.replaceState({}, "", pathname);

    const { container } = renderApp();
    const titleRow = container.querySelector(
      "[data-hero-title-row]",
    ) as HTMLElement;
    const copyColumn = container.querySelector(
      "[data-hero-copy-column]",
    ) as HTMLElement;
    const desktopCta = titleRow.querySelector(
      "[data-hero-cta-desktop]",
    ) as HTMLAnchorElement;
    const mobileCta = copyColumn.querySelector(
      "[data-hero-cta-mobile]",
    ) as HTMLAnchorElement;

    expect(titleRow).toHaveClass("flex", "w-fit", "lg:gap-16");
    expect(desktopCta).toHaveClass("hidden", "lg:inline-flex");
    expect(mobileCta).toHaveClass("lg:hidden");
    expect(desktopCta).toHaveAttribute("href", "#solutions");
    expect(mobileCta).toHaveAttribute("href", "#solutions");
    expect(titleRow.className).not.toMatch(/lg:left-/);
  },
);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- --run src/App.test.tsx -t "fixed desktop title-to-CTA gap"
```

Expected: FAIL because `[data-hero-title-row]` and the responsive desktop/mobile CTA selectors do not exist in the current implementation.

- [ ] **Step 3: Restore responsive CTA identity**

Update the CTA props and component:

```tsx
interface HeroCtaProps {
  className: string;
  href: string;
  label: string;
  placement: "desktop" | "mobile";
}

function HeroCta({ className, href, label, placement }: HeroCtaProps) {
  return (
    <a
      className={`group w-fit shrink-0 items-center gap-3 rounded-full bg-joto-green px-6 py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-[#070b0a] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green ${className}`}
      data-hero-cta={placement}
      data-hero-cta-desktop={placement === "desktop" ? "true" : undefined}
      data-hero-cta-mobile={placement === "mobile" ? "true" : undefined}
      href={href}
    >
      {label}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
        size={16}
      />
    </a>
  );
}
```

- [ ] **Step 4: Build the accessible visual heading and desktop row**

Replace the current `h1` block inside `[data-hero-heading-shell]` with:

```tsx
<h1 className="sr-only" id="hero-title">
  {hero.headline} {hero.accent} {hero.headlineSecondLine}.
</h1>
<div
  className="hero-display-heading font-sans text-[clamp(1.8rem,9vw,4rem)] font-semibold leading-[0.86] tracking-[-0.065em] text-white lg:text-[clamp(4.75rem,7.8vw,8rem)]"
>
  <span
    aria-hidden="true"
    className={`block whitespace-nowrap ${isChinese ? "pl-[0.5em]" : ""}`}
    data-hero-line="primary"
  >
    {hero.headline}{" "}
    <span className="hero-accent-word inline-block font-serif font-normal italic tracking-[-0.04em] text-joto-green">
      <TypewriterWords words={hero.accentWords} />
    </span>
  </span>
  <div
    className="flex w-fit items-end gap-0 lg:gap-16"
    data-hero-title-row
  >
    <span
      aria-hidden="true"
      className={`text-white/78 ${
        isChinese ? "pl-[0.5em]" : "sm:ps-[0.65em]"
      }`}
      data-hero-line="secondary"
    >
      {hero.headlineSecondLine}
      <span className="text-joto-green">.</span>
    </span>
    <HeroCta
      className="hidden lg:mb-[0.08em] lg:inline-flex"
      href={hero.cta.href}
      label={hero.cta.label}
      placement="desktop"
    />
  </div>
</div>
```

Keep `[data-hero-heading-shell]` as the containing `relative max-w-[1100px]` block. The `aria-hidden` attribute belongs only to the visual text nodes, never to the CTA.

- [ ] **Step 5: Preserve locale-specific display typography**

Extend the existing English heading selector and add the visual Hero heading to the Chinese locale rule in `src/index.css`:

```css
html[lang="en"] main :is(h1, h2, h3, h4, h5, h6, .hero-display-heading) {
  font-family: "Poppins", "Inter", sans-serif;
}

html[lang="zh-CN"] main :is(h1, .hero-display-heading) {
  line-height: 1.08;
  letter-spacing: 0.015em;
}
```

Keep the existing Chinese `h2` and `h3` rules unchanged. This preserves the current English Poppins display face and the current Chinese heading rhythm after visual text moves outside the semantic `h1`.

- [ ] **Step 6: Restore the mobile CTA below supporting copy**

Update the CTA in `[data-hero-copy-column]`:

```tsx
<HeroCta
  className="mt-5 inline-flex sm:mt-6 lg:hidden"
  href={hero.cta.href}
  label={hero.cta.label}
  placement="mobile"
/>
```

- [ ] **Step 7: Run the focused test and verify it passes**

Run:

```bash
npm test -- --run src/App.test.tsx -t "fixed desktop title-to-CTA gap"
```

Expected: PASS for English, Chinese, and Persian.

- [ ] **Step 8: Run the full automated checks**

Run:

```bash
npm test -- --run
npm run build
```

Expected: all Vitest tests pass and `tsc --noEmit && vite build` exits with code `0`.

- [ ] **Step 9: Commit the implementation**

```bash
git add joto-site-v2/src/App.test.tsx joto-site-v2/src/components/Hero.tsx joto-site-v2/src/index.css
git commit -m "fix: unify hero CTA headline gap"
```

### Task 2: Verify the three locales in a real browser

**Files:**
- Create: `joto-site-v2/output/playwright/hero-cta-gap-en.png`
- Create: `joto-site-v2/output/playwright/hero-cta-gap-zh.png`
- Create: `joto-site-v2/output/playwright/hero-cta-gap-fa.png`

**Interfaces:**
- Consumes: `[data-hero-title-row]`, `[data-hero-line="secondary"]`, and `[data-hero-cta-desktop]`.
- Produces: measured edge gaps and three desktop screenshots for delivery evidence.

- [ ] **Step 1: Start the Vite development server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL and keeps running.

- [ ] **Step 2: Open each locale at the same desktop viewport**

Use Playwright CLI with a `1440 × 900` viewport to visit:

```text
http://127.0.0.1:<port>/
http://127.0.0.1:<port>/zh/
http://127.0.0.1:<port>/fa/
```

Expected: the desktop CTA is visible beside the second title line on every route.

- [ ] **Step 3: Measure the green-period-to-button gap**

For each route, read `getBoundingClientRect()` for `[data-hero-line="secondary"]` and `[data-hero-cta-desktop]`. Compute the LTR gap as `cta.left - secondary.right`; compute the RTL gap as `secondary.left - cta.right`.

Expected: each computed gap is `64px` within a `±2px` rendering tolerance.

- [ ] **Step 4: Capture the three locale screenshots**

Save screenshots to:

```text
output/playwright/hero-cta-gap-en.png
output/playwright/hero-cta-gap-zh.png
output/playwright/hero-cta-gap-fa.png
```

Expected: no title/CTA overlap, clipping, or horizontal viewport overflow.

- [ ] **Step 5: Check the mobile fallback**

At `390 × 844`, confirm `[data-hero-cta-desktop]` is hidden and `[data-hero-cta-mobile]` is visible on `/`, `/zh/`, and `/fa/`.

Expected: the CTA remains below supporting copy in every locale.
