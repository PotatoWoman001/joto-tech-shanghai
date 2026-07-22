# JOTO V2 Hero Copy and Responsive Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 更新 JOTO V2 Hero 的两行品牌主张、说明文案与手机/平板垂直位置。

**Architecture:** 扩展现有 `siteContent.hero` 一个第二行字段，继续由内容模型驱动文案。`Hero` 只调整标题标记和断点类名，不改变视频、导航、玻璃卡与 CTA 组件边界。

**Tech Stack:** React 18、TypeScript、Tailwind CSS 3.4、Vitest、Testing Library、Playwright CLI。

## Global Constraints

- 1024px 及以上保持桌面端底部构图；说明文案限制在左半区，避开右侧玻璃卡。
- Hero 保持 `min-height: 100svh` 与现有 HLS 视频。
- 不部署，只更新本地预览。
- 不修改无关项目或未跟踪文件。

---

### Task 1: Hero 内容模型与回归测试

**Files:**
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Modify: `joto-site-v2/src/content/en.test.ts`
- Modify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: `SiteContent.hero`。
- Produces: `hero.headlineSecondLine: string` 与新说明文案。

- [x] **Step 1: 写入失败测试**

断言页面包含名称为 `We Make IT Happen.` 的一级标题，并包含以 `Enterprise networks, security, data centers` 开头的新说明文案。

- [x] **Step 2: 运行失败测试**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，旧标题和旧说明文案仍存在。

- [x] **Step 3: 扩展并更新内容模型**

为 `SiteContent.hero` 增加 `headlineSecondLine: string`；设置 `headline: "We Make"`、`accent: "IT"`、`headlineSecondLine: "Happen"`，并替换完整说明文案。

### Task 2: Hero 标题与响应式位置

**Files:**
- Modify: `joto-site-v2/src/components/Hero.tsx`

**Interfaces:**
- Consumes: `hero.headline`、`hero.accent`、`hero.headlineSecondLine`、`hero.description`。
- Produces: 两行视觉标题，以及 `<lg` 垂直居中、`lg` 底部对齐的 Hero 内容组。

- [x] **Step 1: 重组标题标记**

第一行使用块级 `We Make` 和衬线斜体 `IT`；第二行使用 `Happen` 与绿色句点，保持单一 `<h1>` 可访问名称。

- [x] **Step 2: 调整响应式类名**

内容容器使用 `items-center lg:items-end`；标题使用移动端最小约 56px、桌面端最高约 156px 的 `clamp()`；桌面说明文案缩小、左对齐并限制在左侧 48%，放在标题上方且不遮挡右侧玻璃卡。

- [x] **Step 3: 运行页面测试**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

### Task 3: 全量验证与提交

**Files:**
- Artifacts: `joto-site-v2/output/playwright/`

**Interfaces:**
- Consumes: Tasks 1–2 的 Hero 实现。
- Produces: 测试、构建和 375px/768px/1168px 视觉证据。

- [x] **Step 1: 运行完整测试与构建**

Run: `npm test -- --run && npm run build`

Expected: 全部测试 PASS，Vite 构建成功。

- [x] **Step 2: 浏览器验证**

在 375×812、768×900、1168×900 检查标题换行、内容组位置、导航安全间距与页面横向溢出。

- [x] **Step 3: 提交**

```bash
git add docs/superpowers/specs/2026-07-22-joto-v2-hero-copy-responsive-design.md docs/superpowers/plans/2026-07-22-joto-v2-hero-copy-responsive.md joto-site-v2/src/content/types.ts joto-site-v2/src/content/en.ts joto-site-v2/src/App.test.tsx joto-site-v2/src/components/Hero.tsx
git commit -m "feat: refresh JOTO hero messaging"
```
