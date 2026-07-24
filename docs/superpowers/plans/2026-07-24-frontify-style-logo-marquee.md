# Frontify-Style Logo Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing customer logo ribbon with a transparent, single-row, right-to-left infinite marquee matching the approved Frontify reference.

**Architecture:** Keep the existing customer-logo data and image fallback behavior. Simplify only the presentation layer in `CustomerLogoWall.tsx` and its scoped CSS so the component has one continuous duplicated sequence, no ribbon background, and no item cards.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, scoped global CSS, Vitest, Testing Library.

## Global Constraints

- One logo row only.
- Animate continuously from right to left.
- No card backgrounds, ribbon background, or borders.
- Retain a centered heading and white/near-white logo treatment.
- Pause on hover/focus and respect `prefers-reduced-motion`.

---

### Task 1: Lock the approved DOM contract in tests

**Files:**
- Modify: `joto-site-v2/src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `CustomerLogoWall`
- Produces: assertions for one transparent marquee viewport and two sequence copies

- [ ] **Step 1: Add failing assertions**

Assert that the component exposes `data-logo-marquee`, contains exactly one viewport, has two sequences, and does not render the former `customer-logo-wall__ribbon` class.

- [ ] **Step 2: Run the focused test**

Run: `npm test -- --run src/components/CustomerLogoWall.test.tsx`

Expected: the new marquee assertion fails before implementation.

### Task 2: Simplify the component and styles

**Files:**
- Modify: `joto-site-v2/src/components/CustomerLogoWall.tsx`
- Modify: `joto-site-v2/src/index.css`

**Interfaces:**
- Consumes: `customerLogoRows`, `CustomerLogo`, `CustomerLogoScale`
- Produces: one transparent right-to-left marquee with image fallback

- [ ] **Step 1: Remove card sizing and ribbon markup**

Use a single transparent viewport and two adjacent `LogoSequence` elements. Keep every item as a plain flex slot without background or border.

- [ ] **Step 2: Update sizing and motion CSS**

Retain `customer-logo-wall-scroll` from `translate3d(0,0,0)` to `translate3d(-50%,0,0)`, widen inter-logo spacing, remove ribbon styles, keep subtle edge masks, and retain pause/reduced-motion behavior.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- --run src/components/CustomerLogoWall.test.tsx src/content/customerLogos.test.ts src/App.test.tsx`

Expected: all selected tests pass.

### Task 3: Verify production output

**Files:**
- Verify: `joto-site-v2/dist`

**Interfaces:**
- Consumes: completed component and CSS
- Produces: verified deployable build

- [ ] **Step 1: Build**

Run: `npx vite build --base=/`

Expected: Vite build completes successfully.

- [ ] **Step 2: Commit**

Run: `git add` the plan, component, CSS, and test, then `git commit -m "feat: simplify customer logo marquee"`.
