# JOTO 三语网站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 JOTO 全站增加中文和面向伊朗的波斯语版本，并保持英文默认版本与导航布局稳定。

**Architecture:** 使用 URL 语言前缀、强类型内容包和 React Context。页面组件共享，根文档方向按语言设置，Header 单独固定 LTR。

**Tech Stack:** React 18、TypeScript、Vite、Vitest、Testing Library、Tailwind CSS。

## Global Constraints

- 英文现有 URL 与视觉行为保持不变。
- 中文前缀为 `/zh`，波斯语前缀为 `/fa`。
- 波斯语内容为 RTL；Header、导航顺序和语言入口位置固定 LTR。
- 不新增运行时国际化依赖。
- 全部公开页面与详情页必须覆盖。

---

### Task 1: 语言路由与上下文

**Files:**
- Create: `joto-site-v2/src/i18n/routing.ts`
- Create: `joto-site-v2/src/i18n/I18nProvider.tsx`
- Create: `joto-site-v2/src/i18n/routing.test.ts`
- Modify: `joto-site-v2/src/main.tsx`

**Interfaces:**
- Produces: `Locale = "en" | "zh-CN" | "fa-IR"`、`parseLocalizedPath()`、`localizedHref()`、`useI18n()`。

- [ ] 编写路径解析和链接生成失败测试，覆盖 `/`、`/zh/about`、`/fa/solutions/network/cisco` 与锚点。
- [ ] 运行 `npm test -- --run src/i18n/routing.test.ts`，预期测试因模块不存在而失败。
- [ ] 实现纯函数与 Provider，并同步 `document.documentElement.lang/dir`。
- [ ] 再次运行该测试，预期通过。

### Task 2: 三套内容包

**Files:**
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Create: `joto-site-v2/src/content/zh-CN.ts`
- Create: `joto-site-v2/src/content/fa-IR.ts`
- Create: `joto-site-v2/src/content/index.ts`
- Create: `joto-site-v2/src/content/locales.test.ts`

**Interfaces:**
- Produces: `LocalizedContent { site: SiteContent; ui: UiContent }` 和 `contentByLocale`。

- [ ] 编写三套内容结构、关键翻译与波斯语字符测试。
- [ ] 运行内容测试，预期因内容包不存在而失败。
- [ ] 完成中文和伊朗波斯语专业翻译，保留品牌、型号、联系方式和资源引用。
- [ ] 运行内容测试，预期通过。

### Task 3: 全站组件接入

**Files:**
- Modify: `joto-site-v2/src/App.tsx`
- Modify: `joto-site-v2/src/components/*.tsx`
- Modify: `joto-site-v2/src/pages/AboutPage.tsx`
- Modify: `joto-site-v2/src/pages/ContactPage.tsx`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Modify: `joto-site-v2/src/content/partners.ts`

**Interfaces:**
- Consumes: `useI18n()` 与 `localizedHref()`。

- [ ] 更新测试，断言中文/波斯语页面、语言切换及 Header `dir="ltr"`。
- [ ] 运行相关组件测试，预期在接入前失败。
- [ ] 将所有用户可见硬编码文案改为内容包读取，所有站内链接保留当前语言。
- [ ] 运行全部 Vitest，预期通过。

### Task 4: RTL 样式与逐页验收

**Files:**
- Modify: `joto-site-v2/src/index.css`
- Modify: `joto-site-v2/index.html`

**Interfaces:**
- Consumes: 根元素 `lang="fa-IR" dir="rtl"` 与 Header `dir="ltr"`。

- [ ] 添加波斯语字体、RTL 文本规则、双向隔离和表单方向规则。
- [ ] 运行 `npm run build`，预期 TypeScript 与 Vite 构建成功。
- [ ] 运行完整测试 `npm test -- --run`，预期全部通过。
- [ ] 用浏览器验证 12 个语言/页面组合及桌面、移动导航，确认无溢出、RTL 正确且导航位置一致。
