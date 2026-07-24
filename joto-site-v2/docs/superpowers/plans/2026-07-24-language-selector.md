# Language Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add browser-language detection and a discreet persistent language menu.

**Architecture:** Keep route construction in `src/i18n/routing.ts`, first-visit redirect logic in `I18nProvider`, and interactive menu state in a focused `LanguageSelector` component used by `Header`.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library.

## Global Constraints

- Preserve English `/`, Chinese `/zh`, and Persian `/fa` route conventions.
- Respect explicit localized URLs.
- Do not use IP geolocation or add dependencies.

---

### Task 1: Locale preference helpers and first-visit redirect

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/i18n/I18nProvider.tsx`
- Test: `src/i18n/routing.test.ts`

- [ ] Add deterministic browser-language mapping and preference key helpers.
- [ ] Add tests for Chinese, Persian, and English fallback detection.
- [ ] Redirect only unprefixed visits with no stored preference.
- [ ] Run `npx vitest --run src/i18n/routing.test.ts src/i18n/I18nProvider.test.tsx`.

### Task 2: Compact language menu

**Files:**
- Create: `src/components/LanguageSelector.tsx`
- Create: `src/components/LanguageSelector.test.tsx`
- Modify: `src/components/Header.tsx`

- [ ] Test that only the current language is visible before opening.
- [ ] Test menu expansion, current-language state, and preference persistence.
- [ ] Implement outside-click and Escape dismissal.
- [ ] Replace the exposed three-language pill in `Header`.
- [ ] Run the component tests and production build.

