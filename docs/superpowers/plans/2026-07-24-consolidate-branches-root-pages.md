# Consolidate Branches and Root Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate every still-relevant branch change into the current multilingual source branch and publish the verified result at `https://potatowoman001.github.io/`.

**Architecture:** Use `codex/joto-trilingual-zh-en-fa` as the integration baseline because it already contains `main` and `codex/sunny-cisco-detail`. Merge only unique branch histories, resolve conflicts in favor of the latest approved homepage and Services UI, then build a root-base production bundle and publish it to the `PotatoWoman001.github.io` repository.

**Tech Stack:** Git worktrees, React 18, TypeScript, Vite, Vitest, GitHub Pages.

## Global Constraints

- Preserve the latest approved six-cell Services design; do not restore old photo cards.
- Preserve Chinese, English, and Persian routing and copy.
- Do not commit local Playwright screenshots under `joto-site-v2/output/`.
- Run focused tests after each merge and a production Vite build before deployment.
- Publish root-domain assets with Vite base `/`.

---

### Task 1: Integrate unique solution-detail history

**Files:**
- Modify: files changed by `codex/all-solution-detail-pages`
- Test: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`
- Test: `joto-site-v2/src/content/partners.test.ts`

**Interfaces:**
- Consumes: current multilingual source branch
- Produces: one integration commit containing non-duplicated solution pages and copy

- [ ] **Step 1: Merge without committing**

Run: `git merge --no-ff --no-commit codex/all-solution-detail-pages`

- [ ] **Step 2: Resolve conflicts using the current branch for shared shell/UI and the solution branch for genuinely missing detail content**

Run: `git status --short`

- [ ] **Step 3: Run focused tests**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx src/content/partners.test.ts`

Expected: all selected tests pass.

- [ ] **Step 4: Commit**

Run: `git commit -m "merge: consolidate solution detail pages"`

### Task 2: Integrate unique logo-wall history

**Files:**
- Modify: files changed by `codex/joto-logo-wall`
- Test: `joto-site-v2/src/App.test.tsx`
- Test: `joto-site-v2/src/content/customerLogos.test.ts`

**Interfaces:**
- Consumes: Task 1 integrated tree
- Produces: one integration commit retaining the latest normalized logo wall

- [ ] **Step 1: Merge without committing**

Run: `git merge --no-ff --no-commit codex/joto-logo-wall`

- [ ] **Step 2: Resolve shared-file conflicts in favor of the latest current logo-wall implementation**

Run: `git status --short`

- [ ] **Step 3: Run focused tests**

Run: `npm test -- --run src/App.test.tsx src/content/customerLogos.test.ts`

Expected: all selected tests pass.

- [ ] **Step 4: Commit**

Run: `git commit -m "merge: consolidate customer logo wall"`

### Task 3: Record superseded visual branch without regressing Services

**Files:**
- Preserve: `joto-site-v2/src/components/Services.tsx`
- Preserve: `joto-site-v2/src/index.css`

**Interfaces:**
- Consumes: Task 2 integrated tree and `codex/joto-visual-revision`
- Produces: merged ancestry with latest Services implementation preserved

- [ ] **Step 1: Merge visual branch without committing**

Run: `git merge --no-ff --no-commit codex/joto-visual-revision`

- [ ] **Step 2: Resolve Services conflicts in favor of the integration branch**

Run: `git checkout --ours joto-site-v2/src/components/Services.tsx joto-site-v2/src/index.css`

- [ ] **Step 3: Verify Services**

Run: `npm test -- --run src/components/Services.test.tsx`

Expected: the six approved services test passes.

- [ ] **Step 4: Commit**

Run: `git commit -m "merge: record superseded visual revision"`

### Task 4: Verify and push consolidated source

**Files:**
- Test: all `joto-site-v2/src/**/*.test.*`

**Interfaces:**
- Consumes: fully integrated source tree
- Produces: pushed consolidated source branch

- [ ] **Step 1: Run all tests**

Run: `npm test -- --run`

Expected: all test files pass.

- [ ] **Step 2: Build production output**

Run: `npx vite build --base=/`

Expected: Vite completes successfully and creates `joto-site-v2/dist`.

- [ ] **Step 3: Push the consolidated branch**

Run: `git push origin codex/joto-trilingual-zh-en-fa`

### Task 5: Publish to the root GitHub Pages repository

**Files:**
- Replace generated deployment files in `PotatoWoman001/PotatoWoman001.github.io`
- Create: `.nojekyll`
- Create: `404.html` copied from the SPA `index.html`

**Interfaces:**
- Consumes: Task 4 `joto-site-v2/dist`
- Produces: `https://potatowoman001.github.io/`

- [ ] **Step 1: Clone the root Pages repository into a temporary directory**

Run: `gh repo clone PotatoWoman001/PotatoWoman001.github.io <temporary-directory>`

- [ ] **Step 2: Replace generated site files with the root-base production bundle**

Run: `rsync -a --delete --exclude=.git joto-site-v2/dist/ <temporary-directory>/`

- [ ] **Step 3: Add SPA fallback and Pages marker**

Run: `cp index.html 404.html` and create `.nojekyll`.

- [ ] **Step 4: Commit and push**

Run: `git commit -m "deploy: publish consolidated JOTO site"` then `git push origin main`.

- [ ] **Step 5: Verify Pages status**

Run: `gh api repos/PotatoWoman001/PotatoWoman001.github.io/pages/builds/latest`

Expected: status becomes `built` for the new commit.
