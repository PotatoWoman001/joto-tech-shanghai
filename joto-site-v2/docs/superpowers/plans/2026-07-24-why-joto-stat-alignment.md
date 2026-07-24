# Why JOTO Stat Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一 Why JOTO 四个信息格说明文字的纵向基线。

**Architecture:** 将信息格容器改为纵向 Flex，并用 `mt-auto` 将说明文字锚定到底部。首页和 About 详情页使用同一规则。

**Tech Stack:** React、TypeScript、Tailwind CSS、Vitest、Vite

## Global Constraints

- 保留现有内容、字号、边框、卡片高度和响应式结构。
- 不混入其他工作区改动。

---

### Task 1: 对齐 Why JOTO 信息格

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `about.stats`
- Produces: 底部说明文字基线一致的信息格

- [ ] **Step 1: 更新布局测试**

断言四个说明文字存在、带有 `mt-auto`，且父容器包含 `flex flex-col`。

- [ ] **Step 2: 更新两个页面的卡片布局**

将卡片改为 `flex flex-col`，将说明文字的 `mt-12` 改为 `mt-auto pt-12`。

- [ ] **Step 3: 验证**

Run: `npm test -- --run src/App.test.tsx`

Expected: 16 tests pass.

Run: `npm run build`

Expected: Vite build succeeds.
