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

### Task 5: 首屏绿色斜体标题缩小 20%

**Files:**
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx:62-69`
- Test: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: `detail.accent: string`。
- Produces: 绿色斜体标题独立字号 `text-[clamp(2.8rem,6.64vw,6.72rem)]`，即原 `clamp(3.5rem,8.3vw,8.4rem)` 的 80%。

- [ ] **Step 1: 写失败测试**

在现有页面测试中定位 `delivered by JOTO.`，验证它具有独立的 80% 字号类：

```tsx
const accent = screen.getByText("delivered by JOTO.");
expect(accent).toHaveClass("text-[clamp(2.8rem,6.64vw,6.72rem)]");
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL，因为斜体标题目前继承 `h1` 的完整字号。

- [ ] **Step 3: 添加独立字号**

将斜体元素更新为：

```tsx
<em className="font-serif text-[clamp(2.8rem,6.64vw,6.72rem)] font-normal tracking-[-0.045em] text-joto-green">
  {detail.accent}
</em>
```

- [ ] **Step 4: 验证页面**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx && npm run build`

Expected: 页面测试和生产构建全部通过。随后在 1440×900 与 390×844 浏览器视口确认绿色斜体行约缩小 20%、换行正常且无横向溢出。

- [ ] **Step 5: 提交调整**

```bash
git add joto-site-v2/src/pages/PartnerDetailPage.tsx joto-site-v2/src/pages/PartnerDetailPage.test.tsx docs/superpowers/plans/2026-07-22-sunny-cisco-detail.md
git commit -m "style: refine Cisco hero title scale"
```

### Task 6: 真实照片服务卡片

**Files:**
- Create: `joto-site-v2/src/assets/partners/cisco-consulting.jpg`
- Create: `joto-site-v2/src/assets/partners/cisco-integration.jpg`
- Create: `joto-site-v2/src/assets/partners/cisco-managed-services.jpg`
- Modify: `joto-site-v2/src/content/partners.ts`
- Modify: `joto-site-v2/src/content/partners.test.ts`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.tsx`
- Modify: `joto-site-v2/src/pages/PartnerDetailPage.test.tsx`
- Modify: `joto-site-v2/docs/content-sources.md`

**Interfaces:**
- Extends: `PartnerService` with `icon: "compass" | "wrench" | "headphones"`, `image: string`, `imageAlt: string`, and `imagePosition: string`.
- Consumes: three locally imported JPEG assets and existing service copy/capabilities.
- Produces: three rounded service cards with responsive photos, Lucide icons, descriptions, and capability lists.

- [ ] **Step 1: 写数据与页面失败测试**

在 `partners.test.ts` 中验证每项服务都包含本地图片、可访问替代文本和唯一图标：

```tsx
expect(detail?.services.map((service) => service.icon)).toEqual([
  "compass",
  "wrench",
  "headphones",
]);
for (const service of detail?.services ?? []) {
  expect(service.image).toMatch(/cisco-.*\.jpg$/);
  expect(service.imageAlt.length).toBeGreaterThan(20);
}
```

在 `PartnerDetailPage.test.tsx` 的服务区域断言三张场景图与三个命名图标：

```tsx
expect(within(services as HTMLElement).getAllByRole("img")).toHaveLength(3);
for (const service of detail!.services) {
  expect(within(services as HTMLElement).getByRole("img", { name: service.imageAlt })).toBeInTheDocument();
  expect(within(services as HTMLElement).getByLabelText(`${service.title} icon`)).toBeInTheDocument();
}
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/partners.test.ts src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL，因为 `PartnerService` 尚无图片和图标字段，页面也尚未渲染服务图片。

- [ ] **Step 3: 下载已确认的真实照片为本地资源**

```bash
curl -L "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=82" -o src/assets/partners/cisco-consulting.jpg
curl -L "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=82" -o src/assets/partners/cisco-integration.jpg
curl -L "https://images.pexels.com/photos/37605911/pexels-photo-37605911.jpeg?auto=compress&cs=tinysrgb&w=1600" -o src/assets/partners/cisco-managed-services.jpg
```

验证三个文件均为 JPEG 且宽度不低于 1200px：

```bash
file src/assets/partners/cisco-*.jpg
sips -g pixelWidth src/assets/partners/cisco-*.jpg
```

- [ ] **Step 4: 扩展服务数据**

在 `partners.ts` 导入三张图片，并把 `PartnerService` 更新为：

```tsx
export interface PartnerService {
  title: string;
  description: string;
  capabilities: string[];
  icon: "compass" | "wrench" | "headphones";
  image: string;
  imageAlt: string;
  imagePosition: string;
}
```

三项服务依次写入：

```tsx
{
  icon: "compass",
  image: ciscoConsulting,
  imageAlt: "IT consultants and client stakeholders discussing enterprise network planning around a conference table",
  imagePosition: "object-center",
}
{
  icon: "wrench",
  image: ciscoIntegration,
  imageAlt: "Engineer installing and configuring technical equipment during an on-site integration",
  imagePosition: "object-center",
}
{
  icon: "headphones",
  image: ciscoManagedServices,
  imageAlt: "IT operations engineer viewed from behind monitoring systems inside a server room",
  imagePosition: "object-center",
}
```

- [ ] **Step 5: 实现圆角照片服务卡片**

在 `PartnerDetailPage.tsx` 导入 `Compass`, `Wrench`, `Headphones`，并增加映射：

```tsx
const serviceIcons = {
  compass: Compass,
  wrench: Wrench,
  headphones: Headphones,
};
```

每张服务卡片使用下列结构：

```tsx
const ServiceIcon = serviceIcons[service.icon];

<article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/12 bg-[#080d0c]">
  <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
    <img
      alt={service.imageAlt}
      className={`h-full w-full object-cover saturate-[0.78] transition-transform duration-700 group-hover:scale-[1.025] ${service.imagePosition}`}
      loading="lazy"
      src={service.image}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080d0c]/50" />
    <div
      aria-label={`${service.title} icon`}
      className="absolute bottom-0 left-6 grid h-12 w-12 translate-y-1/2 place-items-center rounded-xl border border-[#2949a8] bg-[#0c1830] text-[#9cb1ff] shadow-xl"
    >
      <ServiceIcon aria-hidden="true" className="h-5 w-5" />
    </div>
  </div>
  <div className="flex flex-1 flex-col p-7 pt-11 sm:p-8 sm:pt-12">
    <h3>{service.title}</h3>
    <p>{service.description}</p>
    <ul>{/* existing capability items */}</ul>
  </div>
</article>
```

服务网格改为 `mt-16 grid gap-4 lg:grid-cols-3`，能力勾选标记使用 `text-[#7f9cff]`，保留现有文案与完整五项能力。

- [ ] **Step 6: 记录素材来源**

在 `docs/content-sources.md` 增加三张照片的来源页面、作者/平台、用途与本地文件名。Managed Services 来源页面固定为 `https://www.pexels.com/photo/it-technician-working-in-data-center-server-room-37605911/`。

- [ ] **Step 7: 运行自动验证**

Run: `npm test -- --run && npm run build`

Expected: 24 个现有测试加新增断言全部通过，生产构建成功。

- [ ] **Step 8: 浏览器验证**

Run: `npm run dev -- --host 127.0.0.1 --port 3002`

在 1440×900 与 390×844 检查：三张照片不重复；人物和动作未被严重裁切；桌面照片为 16:10、移动端为 4:3；图标、正文和五项能力完整；页面无横向溢出。

- [ ] **Step 9: 提交服务卡片改版**

```bash
git add joto-site-v2/src/assets/partners/cisco-*.jpg joto-site-v2/src/content/partners.ts joto-site-v2/src/content/partners.test.ts joto-site-v2/src/pages/PartnerDetailPage.tsx joto-site-v2/src/pages/PartnerDetailPage.test.tsx joto-site-v2/docs/content-sources.md docs/superpowers/plans/2026-07-22-sunny-cisco-detail.md
git commit -m "feat: add visual Cisco service cards"
```
