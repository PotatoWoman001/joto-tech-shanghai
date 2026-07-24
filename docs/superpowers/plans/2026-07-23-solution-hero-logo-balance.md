# Solution Hero Logo Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the redundant hero relationship line and rebalance vendor logos across all Solution detail pages.

**Architecture:** Make one presentation-only change in the shared `PartnerDetailPage`. Preserve all partner data and all non-Solution components.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite

## Global Constraints

- Do not modify homepage, About, Contact, or other completed pages.
- Apply the adjustment to all 20 Solution detail pages through the shared component.

---

### Task 1: Lock the shared hero behavior with tests

**Files:**
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`

- [ ] Change Cisco and Palo Alto assertions from two relationship labels to one.
- [ ] Assert the vendor logo uses `max-h-8` and `max-w-[140px]`.
- [ ] Run `npm test -- --run src/pages/PartnerDetailPage.test.tsx` and confirm the old implementation fails.

### Task 2: Update the shared hero lockup

**Files:**
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`

- [ ] Remove the hero-only `{detail.partnerName} × JOTO` paragraph.
- [ ] Change vendor-logo constraints to `max-h-8 max-w-[140px]`.
- [ ] Set the heading spacing to `mt-10`.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Verify and deliver

**Files:**
- No additional production files.

- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Inspect the Extreme Networks hero at desktop and mobile widths.
- [ ] Commit the isolated-branch change.
