# Apply Solution Copy to 19 Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将已确认中文文案总表按语义适配到 Cisco 以外的 19 个英文 Solution 详情页，同时确保 Cisco 页面及三个代表项目完全不变。

**Architecture:** 保留现有 `PartnerDetailPage` 和五段页面结构，以 `src/content/partners.ts` 作为唯一内容数据源。扩展非 Cisco 页面的工厂输入，使每页拥有独立的首屏、合作价值、服务和 CTA 文案；非 Cisco 页面的 `cases` 为空，由组件保留 `04` 代表项目板块但不渲染项目列表。

**Tech Stack:** React 18、TypeScript、Vite、Vitest、Testing Library、Tailwind CSS

## Global Constraints

- Cisco 的 `PartnerDetail` 数据对象逐字段保持不变。
- 只更新 Cisco 以外 19 个 Solution 详情页的内容，不修改首页、Contact 页面、导航或路由。
- 页面仍沿用 Cisco 的 `01–05` 结构，不新增独立页面组件。
- 19 页的标题、绿色标题、介绍、合作价值、三张服务卡及 CTA 必须与中文总表逐页对应，英文按意思重写而非逐字翻译。
- 19 页的代表项目数组为空，不显示虚构场景、客户或成果；Cisco 继续显示三个已确认项目。
- 所有 Contact CTA 继续链接 `/contact`。

---

### Task 1: 锁定 Cisco 与页面内容约束

**Files:**
- Modify: `joto-site-v2/src/content/partners.test.ts`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: `getPartnerDetail(pathname)` 与 `partnerDetails`
- Produces: Cisco 不变、19 页差异化、代表项目空状态的自动化回归约束

- [ ] **Step 1: 为 Cisco 写完整关键字段基线断言**

断言 Cisco 的 `title`、`accent`、`introduction`、三个服务标题、三个客户名称和 `cases.length === 3` 保持当前值。

- [ ] **Step 2: 为非 Cisco 页面写失败测试**

断言 19 页均有非模板化 `title`/`accent`/`relationshipTitle`，`cases.length === 0`，且服务标题组合不再统一为 `Assessment & Architecture`、`Deployment & Integration`、`Operations & Lifecycle`。

- [ ] **Step 3: 为页面渲染写失败测试**

断言 Extreme 页面显示 `Representative Projects` 标题但没有项目 `article`，首屏主 CTA 文案为 `Representative Projects`；Cisco 页面继续显示三个项目和 `View Cisco case studies`。

- [ ] **Step 4: 运行测试并确认新约束失败**

Run: `npm test -- --run src/content/partners.test.ts src/pages/PartnerDetailPage.test.tsx`

Expected: 非 Cisco 差异化内容与空项目断言失败，Cisco 既有断言通过。

### Task 2: 建立 19 页独立内容输入

**Files:**
- Modify: `joto-site-v2/src/content/partners.ts`

**Interfaces:**
- Consumes: `PartnerDetail`、`PartnerReason`、`PartnerService`、类别视觉素材与已验证能力点
- Produces: `createPartnerDetail(input): PartnerDetail`，其中 `input` 为每页提供独立 `title`、`accent`、关系文案、理由、服务文案与 CTA

- [ ] **Step 1: 扩展 `PartnerFactoryInput`**

增加每页必填字段：`title`、`accent`、`relationshipTitle`、`relationshipDescription`、`reasons`、`servicesTitle`、`servicesDescription`、三个 `serviceTitles`、三个 `serviceDescriptions`、`ctaTitle`、`ctaDescription`。

- [ ] **Step 2: 修改工厂映射**

移除通用标题和理由模板，逐字段使用输入；保留共享图片、图标、分类视觉、联系方式和能力点映射。非 Cisco 返回 `casesEyebrow: "Representative Projects"` 与 `cases: []`。

- [ ] **Step 3: 按中文总表填写 19 个输入对象**

逐页将中文定位适配为自然英文，覆盖 Network 3 页、Security 6 页、Server & Storage 3 页、Collaboration 4 页和 Safeguarding 3 页。

- [ ] **Step 4: 运行内容测试**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: 20 条路由全部通过；Cisco 三个项目保持不变；其他 19 页项目数组为空且字段差异化。

### Task 3: 渲染空的代表项目板块

**Files:**
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: `PartnerDetail.cases`
- Produces: 有项目时显示项目列表；无项目时只显示 `04 / Representative Projects` 板块标题，不输出空边框列表或内部等待说明

- [ ] **Step 1: 条件渲染项目列表**

只在 `detail.cases.length > 0` 时渲染项目列表容器；SectionHeading 和 `04` 编号始终保留。

- [ ] **Step 2: 根据项目状态更新首屏 CTA**

Cisco 保留 `View Cisco case studies`；非 Cisco 使用 `Representative Projects` 并仍锚定 `#partner-case-studies`，不再称为 `use cases`。

- [ ] **Step 3: 运行组件测试**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: Cisco 显示三个项目；Extreme 显示代表项目板块标题但没有项目文章。

### Task 4: 全量回归与视觉抽查

**Files:**
- Verify: `joto-site-v2/src/content/partners.ts`
- Verify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Verify: `joto-site-v2/src/**/*.test.tsx`

**Interfaces:**
- Consumes: 完成后的 20 页内容与页面组件
- Produces: 构建、测试、路由和视觉回归结果

- [ ] **Step 1: 运行完整测试**

Run: `npm test -- --run`

Expected: 全部测试通过。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: TypeScript 检查和 Vite 构建成功。

- [ ] **Step 3: 核对 Cisco 数据哈希与差异**

提取 `const ciscoDetail` 对象并与实施前 SHA-256 `5a6fcaaaf3aec3d201f5a94bef7716ae0d5e95747393d9b28b1536a69b0310a8` 比较；同时检查 `git diff` 不包含 Cisco 对象内容变化。

- [ ] **Step 4: 浏览器抽查五类页面**

检查 Cisco、Extreme Networks、KnowBe4、Huawei、AudioCodes、Verkada 的首屏、合作价值、服务、代表项目和 Contact 链接；确认无横向溢出、空项目列表边框或模板文案残留。

- [ ] **Step 5: 提交**

```bash
git add docs/superpowers/specs/2026-07-23-solution-copy-architecture-zh-design.md docs/superpowers/plans/2026-07-23-apply-solution-copy-to-19-pages.md joto-site-v2/docs/solution-copy-architecture-zh.md joto-site-v2/src/content/partners.ts joto-site-v2/src/content/partners.test.ts joto-site-v2/src/pages/PartnerDetailPage.tsx joto-site-v2/src/pages/PartnerDetailPage.test.tsx
git commit -m "feat: apply distinct copy to solution detail pages"
```
