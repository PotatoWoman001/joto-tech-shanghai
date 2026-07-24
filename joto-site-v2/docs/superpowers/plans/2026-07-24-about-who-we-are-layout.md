# About Who We Are Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 About 页 “Who we are” 改成参考站的左文右统计紧凑布局。

**Architecture:** 在 `AboutPage.tsx` 内定义仅供该页面使用的四项统计，避免修改首页共享的 `about.stats`。通过响应式 Tailwind 网格实现桌面双栏和手机两列。

**Tech Stack:** React、TypeScript、Tailwind CSS、Vitest、Testing Library

## Global Constraints

- 只修改 `/about` 的 “Who we are” 板块。
- 数据与版式采用已确认的参考站版本。
- 保留工作区内所有无关未提交改动。

---

### Task 1: 更新 Who we are 布局

**Files:**
- Create: `src/pages/AboutPage.test.tsx`
- Modify: `src/pages/AboutPage.tsx`

- [ ] 新增失败测试，验证四项参考站数据、桌面双栏容器和紧凑统计卡。
- [ ] 运行 `npm test -- --run src/pages/AboutPage.test.tsx`，确认测试先失败。
- [ ] 在 `AboutPage.tsx` 添加页面专属统计数据，并将板块改成 `lg:grid-cols-[1.4fr_1fr]`；统计卡使用 `rounded-2xl`、`p-5/p-6`，不设置大 `min-height`。
- [ ] 再次运行定向测试并运行 `npm run build`。
- [ ] 使用真实浏览器检查 1440px 与 390px 视口，只提交本任务文件。
