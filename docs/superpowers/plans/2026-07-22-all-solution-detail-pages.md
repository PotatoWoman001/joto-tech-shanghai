# All Solution Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Solution 目录中的 20 个厂商提供统一、完整、可直接访问的详情页。

**Architecture:** 保留一个数据驱动的 `PartnerDetailPage`，通过厂商内容工厂生成共同服务与场景结构，再用逐厂商配置写入专属能力。路由继续由 pathname 查找数据，不增加路由依赖。

**Tech Stack:** React 18、TypeScript、Vite、Tailwind CSS、Vitest、Testing Library

## Global Constraints

- 保留 Cisco 页现有视觉语言和已核实案例。
- 新增 19 个厂商详情页，共 20 个公开厂商路由。
- 不新增未经核实的合作等级或客户案例。
- 所有生产图片使用项目本地资源。
- 桌面端与移动端 Solution 导航全部直达详情页。

---

### Task 1: 全量厂商内容模型与数据

**Files:**
- Modify: `joto-site-v2/src/content/partners.ts`
- Modify: `joto-site-v2/src/content/partners.test.ts`

**Interfaces:**
- Produces: `partnerDetails: PartnerDetail[]`，包含 20 个唯一 pathname。
- Produces: `getPartnerDetail(pathname: string): PartnerDetail | undefined`。

- [ ] **Step 1: 添加失败测试**

断言期望的 20 个 pathname、厂商名、三项服务、三个第四段条目和尾部斜杠兼容。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: FAIL，因为目前只有 Cisco。

- [ ] **Step 3: 泛化数据结构并添加 19 个配置**

加入分类视觉、可选网络遥测、第四段标题与适用场景字段；按官方产品线写入每个厂商的九项核心能力。

- [ ] **Step 4: 运行数据测试**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: PASS，20 个路径全部存在且唯一。

### Task 2: 泛化详情页模板

**Files:**
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: 任意 `PartnerDetail`。
- Produces: 无 Cisco 写死标题、按钮、板块说明和页脚的五段式详情页。

- [ ] **Step 1: 添加非 Cisco 页面失败测试**

渲染 Palo Alto Networks 页面，断言页面显示其专属内容，不出现 Cisco 文案和网络遥测。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL，因为当前模板多处写死 Cisco。

- [ ] **Step 3: 替换所有硬编码并支持分类主视觉**

按钮、SectionHeading、第四段、页脚全部读取数据；仅在 `heroVisual.telemetry === true` 时渲染 Cisco 网络遥测组件。

- [ ] **Step 4: 运行页面测试**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: PASS，Cisco 和非 Cisco 页面均正确。

### Task 3: 全量导航路由

**Files:**
- Modify: `joto-site-v2/src/lib/anchors.ts`
- Modify: `joto-site-v2/src/components/Header.test.tsx`
- Modify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Produces: `vendorAnchor(categoryId, vendorName)` 返回 `/solutions/<category>/<slug>`。

- [ ] **Step 1: 添加失败测试**

断言 Aruba、KnowBe4、Dell Technologies、AudioCodes、Verkada 等代表链接均为详情页路径，并由 `App` 正确渲染。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/components/Header.test.tsx src/App.test.tsx`

Expected: FAIL，因为当前除 Cisco 外均为首页锚点。

- [ ] **Step 3: 统一生成厂商路径**

复用现有 slug 规则生成公开路径；详情页内打开其他厂商时保持直达链接。

- [ ] **Step 4: 运行导航与 App 测试**

Run: `npm test -- --run src/components/Header.test.tsx src/App.test.tsx`

Expected: PASS。

### Task 4: 来源记录、全量测试与视觉验收

**Files:**
- Modify: `joto-site-v2/docs/content-sources.md`
- Modify only if verification finds an issue in scoped implementation files.

- [ ] **Step 1: 补充老官网来源与事实边界**

记录 Extreme Networks、KnowBe4、OneLogin、Verkada 的 JOTO 老官网来源，以及各厂商官方产品参考。

- [ ] **Step 2: 运行全量测试**

Run: `npm test -- --run`

Expected: PASS。

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`

Expected: TypeScript 与 Vite 构建 PASS。

- [ ] **Step 4: 浏览器抽查五类页面**

在 1440×900 和 390×844 下抽查 Extreme Networks、Palo Alto Networks、Dell Technologies、AudioCodes、Verkada；确认 Logo、首屏、三张服务卡、三个适用场景、CTA、导航和横向溢出均正常。
