# 中文站文案润色 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一润色中文站文案，并将三语 IT 采购服务调整为面向国际业务。

**Architecture:** 保持现有以英文源内容加 `zh`、`fa` 字典本地化的结构。中文润色集中在 `translations.ts`；IT 采购先更新 `en.ts` 英文源文本，再以同一新键提供中文和波斯语译文。

**Tech Stack:** React、TypeScript、Vite、自定义 i18n 字典

## Global Constraints

- 不修改页面结构、路由、组件行为和项目事实。
- 不改动 IT 采购之外的英文与波斯语文案。
- 中文标题使用直接、专业、自然的 B2B 技术服务语气。

---

### Task 1: 润色中文首页与公共页面文案

**Files:**
- Modify: `src/i18n/translations.ts`
- Test: `src/i18n/I18nProvider.test.tsx`

**Interfaces:**
- Consumes: `zh: Record<string, string>`
- Produces: `siteContentByLocale["zh-CN"]`

- [ ] **Step 1:** 更新首页、关于页、联系页和公共页脚的中文标题与正文。
- [ ] **Step 2:** 保留所有英文源键，确保翻译查找方式不变。
- [ ] **Step 3:** 运行 `npm test -- --run`，预期全部测试通过。

### Task 2: 润色中文解决方案详情模板

**Files:**
- Modify: `src/i18n/translations.ts`
- Test: `src/content/partners.test.ts`

**Interfaces:**
- Consumes: `localizePartnerDetail(locale, detail)`
- Produces: 自然、统一的中文合作伙伴详情文案

- [ ] **Step 1:** 调整供应商简介、服务标题、场景标题和 CTA 文案。
- [ ] **Step 2:** 保留合作伙伴名称、产品名称、能力项和项目数据。
- [ ] **Step 3:** 运行合作伙伴内容测试，预期全部通过。

### Task 3: 更新三语 IT 采购国际化定位

**Files:**
- Modify: `src/content/en.ts`
- Modify: `src/i18n/translations.ts`
- Test: `src/content/en.test.ts`

**Interfaces:**
- Consumes: `siteContent.services.items`
- Produces: 英文、中文、波斯语的全球业务采购描述

- [ ] **Step 1:** 将英文源文案改为面向国际市场运营的组织。
- [ ] **Step 2:** 为新英文键添加中文和波斯语译文，删除旧的在华限定表达。
- [ ] **Step 3:** 运行内容测试，预期三语均不包含地域限定。

### Task 4: 构建与浏览器验收

**Files:**
- Verify: `src/content/en.ts`
- Verify: `src/i18n/translations.ts`

**Interfaces:**
- Consumes: 完成后的三语内容
- Produces: 可在本地浏览器验证的构建结果

- [ ] **Step 1:** 运行 `npm run build`，预期 TypeScript 与 Vite 构建通过。
- [ ] **Step 2:** 检查中文首页、关于页、联系页和代表性详情页。
- [ ] **Step 3:** 检查三语 IT 采购卡片，确认国际化表述和页面无溢出。
