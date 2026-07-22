# JOTO V2 Navigation and Grid Follow-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 Hero 标题顺序、Solutions 响应式网格与桌面 Solutions 菜单交互。

**Architecture:** 保持现有 React 单页组件边界，只修改 `Hero`、`Solutions` 和 `Header`。桌面菜单使用组件状态控制可见性，并保留现有手机菜单状态与锚点数据。

**Tech Stack:** React 18、TypeScript、Tailwind CSS 3.4、Vitest、Testing Library、Playwright CLI。

## Global Constraints

- 不新增或删除 Solution 分类和品牌数据。
- 手机导航行为保持不变。
- 不部署，只更新本地预览。
- 不修改无关项目和未跟踪文件。

---

### Task 1: Hero 与 Solutions 网格

**Files:**
- Modify: `joto-site-v2/src/components/Hero.tsx`
- Modify: `joto-site-v2/src/components/Solutions.tsx`

**Interfaces:**
- Consumes: `siteContent.hero`、`siteContent.solutions.categories`。
- Produces: 新的 Hero 顺序，以及单列/双列跨行/五列响应式网格。

- [ ] **Step 1: 调整 Hero 顺序**

将 `<h1>` 放在眉题 `<p>` 前，并把眉题上边距改为 `mt-4 sm:mt-5`。

- [ ] **Step 2: 调整网格断点**

网格使用 `md:grid-cols-2 lg:grid-cols-5`，最后一张卡添加 `md:col-span-2 lg:col-span-1`。

- [ ] **Step 3: 运行页面测试**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

### Task 2: 桌面 Solutions 目录交互

**Files:**
- Modify: `joto-site-v2/src/components/Header.tsx`
- Modify: `joto-site-v2/src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `siteContent.solutions.categories`、`vendorAnchor()`。
- Produces: `desktopSolutionsOpen: boolean` 控制的桌面目录。

- [ ] **Step 1: 写入点击打开回归测试**

断言桌面 `SOLUTIONS` 按钮点击后 `aria-expanded="true"`，且页面不存在 `SOLUTIONS / CATEGORY / VENDOR`。

- [ ] **Step 2: 实现受控目录**

增加桌面状态；入口改为按钮；下拉容器从导航底部开始并使用顶部透明内边距跨过悬停间隙；Escape、离开容器和目录链接关闭状态。

- [ ] **Step 3: 运行 Header 测试**

Run: `npm test -- --run src/components/Header.test.tsx`

Expected: PASS。

### Task 3: 全量验证

**Files:**
- Artifacts: `joto-site-v2/output/playwright/`

**Interfaces:**
- Consumes: Tasks 1–2 的页面实现。
- Produces: 测试、构建和浏览器验收结果。

- [ ] **Step 1: 运行测试与构建**

Run: `npm test -- --run && npm run build`

Expected: 现有测试全部 PASS，Vite 构建成功。

- [ ] **Step 2: 浏览器验证**

在 1440px、1024px、768px 检查网格列数、Hero 顺序、菜单点击与悬停移动；确认页面无横向溢出。

- [ ] **Step 3: 提交**

```bash
git add docs/superpowers/specs/2026-07-22-joto-v2-navigation-grid-followup-design.md docs/superpowers/plans/2026-07-22-joto-v2-navigation-grid-followup.md joto-site-v2/src/components/Hero.tsx joto-site-v2/src/components/Solutions.tsx joto-site-v2/src/components/Header.tsx joto-site-v2/src/components/Header.test.tsx
git commit -m "fix: refine JOTO navigation and solution layout"
```
