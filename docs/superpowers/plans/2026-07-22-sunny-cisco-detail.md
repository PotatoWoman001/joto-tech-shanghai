# Sunny Cisco Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Sunny Try 网站中新增可复用的 Cisco 合作伙伴详情页，并通过 Network / Cisco 导航进入该页面。

**Architecture:** 使用一个数据驱动的 `PartnerDetailPage` 模板渲染首屏、合作关系、服务、案例和 CTA。`App.tsx` 根据 pathname 选择首页或详情页；不增加 React Router 依赖。

**Tech Stack:** React 18、TypeScript、Vite、Tailwind CSS、Vitest、Testing Library

## Global Constraints

- 详情页只在 `codex/sunny-cisco-detail` 分支开发。
- 视觉必须使用 Sunny Try 的深绿色、JOTO green、网格和编辑式大标题。
- 内容与 Tommy 版 Cisco 页面保持一致，但不得复制 Tommy 组件或 CSS。
- 不新增产品目录或交付流程。
- 路由为 `/solutions/network/cisco`。

---

### Task 1: Cisco 数据与真实主视觉素材

**Files:**
- Create: `joto-site-v2/src/content/partners.ts`
- Create: `joto-site-v2/src/content/partners.test.ts`
- Create: `joto-site-v2/src/assets/partners/cisco-network-management.png`

**Interfaces:**
- Produces: `PartnerDetail` 类型和 `partnerDetails` 数据集合。
- Produces: `getPartnerDetail(pathname: string): PartnerDetail | undefined`。

- [ ] **Step 1: 写失败测试**

验证 `/solutions/network/cisco` 返回 Cisco 数据，包含三项服务、三个案例、`sales@jototech.cn` 和本地图片。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: FAIL，因为数据模块尚不存在。

- [ ] **Step 3: 添加数据和图片**

创建 `PartnerDetail` 数据结构，并写入已经确认的 Cisco 内容。复制 Cisco 官方真实组合图作为本地资源。

- [ ] **Step 4: 运行测试**

Run: `npm test -- --run src/content/partners.test.ts`

Expected: PASS。

### Task 2: 路由与导航

**Files:**
- Modify: `joto-site-v2/src/App.tsx`
- Modify: `joto-site-v2/src/components/Header.tsx`
- Modify: `joto-site-v2/src/components/Header.test.tsx`
- Modify: `joto-site-v2/src/lib/anchors.ts`

**Interfaces:**
- Consumes: `getPartnerDetail(window.location.pathname)`。
- Produces: Cisco 导航链接 `/solutions/network/cisco`。
- Produces: 详情页上的首页导航使用 `/#section-id`。

- [ ] **Step 1: 写失败测试**

增加 Cisco 链接和详情页路径渲染测试。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/Header.test.tsx src/App.test.tsx`

Expected: FAIL。

- [ ] **Step 3: 实现 pathname 页面选择和导航链接**

首页继续渲染现有组件；匹配到详情页数据时渲染 `PartnerDetailPage`。Header 根据页面上下文生成正确的首页和锚点链接。

- [ ] **Step 4: 运行测试**

Run: `npm test -- --run src/components/Header.test.tsx src/App.test.tsx`

Expected: PASS。

### Task 3: Sunny 风格合作伙伴详情页

**Files:**
- Create: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Create: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`
- Modify: `joto-site-v2/src/components/Header.tsx`

**Interfaces:**
- Consumes: `PartnerDetail`。
- Produces: 可复用的 `PartnerDetailPage({ detail })`。

- [ ] **Step 1: 写页面失败测试**

验证页面包含 Cisco × JOTO、三项服务、三个案例、两个 CTA 和产品图片 alt 文本。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL。

- [ ] **Step 3: 实现五个页面板块**

使用 Sunny Try 的配色、字体、网格边框、SectionHeading 和 Reveal 模式完成首屏、合作关系、服务、案例和 CTA。主视觉直接叠化到背景，不增加图片边框。

- [ ] **Step 4: 运行页面测试**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: PASS。

### Task 4: 全量验证与本地预览

**Files:**
- Modify only if verification finds a scoped issue.

- [ ] **Step 1: 运行全量测试**

Run: `npm test -- --run`

Expected: PASS。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: PASS。

- [ ] **Step 3: 在 3002 端口启动预览**

Run: `npm run dev -- --host 127.0.0.1 --port 3002`

Expected: `/solutions/network/cisco` 返回页面。

- [ ] **Step 4: 浏览器验证**

检查 1440×900 和 390×844，确认导航、首屏产品图、三项服务、案例和 CTA 正常，无横向溢出。

- [ ] **Step 5: 提交独立分支**

```bash
git add joto-site-v2 docs/superpowers/specs/2026-07-22-sunny-cisco-detail-design.zh-CN.md docs/superpowers/plans/2026-07-22-sunny-cisco-detail.md
git commit -m "feat: add Sunny Cisco detail page"
```

