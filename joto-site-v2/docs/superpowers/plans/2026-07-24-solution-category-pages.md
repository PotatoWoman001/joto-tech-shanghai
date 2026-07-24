# Solution Category Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为五个 Solution 大类增加三语言独立详情页，并把首页与导航的大类入口从首个厂商页改到对应大类页。

**Architecture:** 使用一个数据驱动的 `SolutionCategoryPage` 渲染五类页面。新内容文件只维护分类级文案和案例映射，图片、厂商与 Logo 继续复用 `SiteContent`；`App.tsx` 在厂商详情解析之前匹配大类路径。

**Tech Stack:** React 18、TypeScript、Vite、Tailwind CSS、Vitest、Testing Library、现有自定义多语言路由。

## Global Constraints

- 保留现有 20 个厂商详情页及其 URL。
- 英文、中文、波斯语大类页必须同时上线。
- 波斯语正文 RTL，Header 继续 LTR。
- 不增加 React Router 或新运行时依赖。
- 不复制五套页面组件。
- 不提交 `output/` 浏览器截图。

---

### Task 1: 建立大类详情数据模型

**Files:**
- Create: `src/content/solutionCategories.ts`
- Create: `src/content/solutionCategories.test.ts`

**Interfaces:**
- Produces: `SolutionCategoryDetail`、`solutionCategoryDetails`、`getSolutionCategoryDetail(pathname, locale)`
- Consumes: `Locale` from `src/i18n/routing.ts`

- [ ] **Step 1: 编写失败测试**

断言五个路径唯一、每页六项能力，并检查 `/solutions/network` 在三种语言下分别返回自然的标题、摘要和能力文案。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/content/solutionCategories.test.ts`

Expected: FAIL，因为模块尚不存在。

- [ ] **Step 3: 实现三语言数据**

从旧版 `joto-website/lib/data.ts` 提取五类能力结构，使用 `LocalizedText = Record<Locale, string>` 保存三语言文案。实现路径尾部斜杠归一化。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- --run src/content/solutionCategories.test.ts`

Expected: PASS。

### Task 2: 实现共享大类页面

**Files:**
- Create: `src/pages/SolutionCategoryPage.tsx`
- Create: `src/pages/SolutionCategoryPage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `SolutionCategoryDetail`、`siteContent.solutions.categories`、`siteContent.caseStudies.items`
- Produces: `<SolutionCategoryPage detail={detail} />`

- [ ] **Step 1: 编写失败页面测试**

渲染 Network 页并断言：

- 一级标题和摘要存在；
- 六项能力存在；
- Cisco、Extreme Networks、Aruba、Sangfor 均链接到厂商详情；
- Harrow 代表案例存在；
- CTA 指向 `/contact`。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/SolutionCategoryPage.test.tsx`

Expected: FAIL，因为页面组件尚不存在。

- [ ] **Step 3: 实现页面**

使用当前站黑绿视觉：

- 首屏左右分栏并复用分类摄影图；
- 能力区使用 3×2 网格；
- 技术伙伴区使用浅色 Logo 卡和深色说明区；
- 案例区复用现有案例 Logo、摘要和能力标签；
- CTA 进入本地化联系页；
- 结尾复用 `SiteFooter`。

- [ ] **Step 4: 接入 `App.tsx`**

在 `getPartnerDetail(pathname)` 之前调用 `getSolutionCategoryDetail(pathname, locale)`；匹配时返回大类页，避免与 `/solutions/:category/:vendor` 冲突。

- [ ] **Step 5: 运行页面测试**

Run: `npm test -- --run src/pages/SolutionCategoryPage.test.tsx src/App.test.tsx`

Expected: PASS。

### Task 3: 改造首页卡片入口

**Files:**
- Modify: `src/components/SolutionCard.tsx`
- Modify: `src/components/SolutionCard.test.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `category.id`、`locale`
- Produces: `localizedHref(\`/solutions/${category.id}\`, locale)`

- [ ] **Step 1: 更新失败断言**

将 Network 卡入口的预期从 `/solutions/network/cisco` 改为 `/solutions/network`，并覆盖 `/zh/solutions/network` 与 `/fa/solutions/network`。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/SolutionCard.test.tsx src/App.test.tsx`

Expected: FAIL，旧代码仍解析首个厂商。

- [ ] **Step 3: 更新链接实现**

删除 `primaryVendor` 与 `vendorAnchor` 依赖，直接基于 `category.id` 构造大类路径。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- --run src/components/SolutionCard.test.tsx src/App.test.tsx`

Expected: PASS。

### Task 4: 改造桌面和移动导航

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `category.id`、`vendorAnchor`
- Produces: 大类标题链接与厂商链接两级导航

- [ ] **Step 1: 更新失败断言**

断言桌面菜单和移动菜单中的 Network 标题进入 `/solutions/network`，Cisco 仍进入 `/solutions/network/cisco`。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/Header.test.tsx`

Expected: FAIL，大类标题仍进入首页锚点。

- [ ] **Step 3: 更新导航**

桌面和移动端大类标题使用 `localizedHref(\`/solutions/${category.id}\`, locale)`；厂商链接保持现状。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm test -- --run src/components/Header.test.tsx`

Expected: PASS。

### Task 5: 完整验证与浏览器预览

**Files:**
- Verify: `src/content/solutionCategories.ts`
- Verify: `src/pages/SolutionCategoryPage.tsx`
- Verify: `src/components/SolutionCard.tsx`
- Verify: `src/components/Header.tsx`

- [ ] **Step 1: 运行全套自动化检查**

Run: `npm test -- --run`

Expected: 24 个以上测试文件全部通过。

Run: `npx tsc --noEmit`

Expected: exit 0。

Run: `npm run build`

Expected: Vite production build succeeds。

- [ ] **Step 2: 浏览器检查**

检查：

- `/zh/solutions/network`
- `/fa/solutions/security`
- `/solutions/server-storage`

确认桌面和移动布局无横向溢出、语言方向正确、分类和厂商链接层级正确。

- [ ] **Step 3: 交付首版**

保持本地开发服务运行，在右侧浏览器打开中文 Network 大类页供用户标注；未收到推送指令前不提交 GitHub。
