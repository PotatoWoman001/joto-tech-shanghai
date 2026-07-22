# JOTO V2 Visual Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 JOTO V2 首页按已确认视觉规格完成六处修订，同时保留 Solution 分类与品牌导航层级。

**Architecture:** 继续使用现有 React 单页组件和 `siteContent` 内容模型。新增六张项目本地 WebP 视觉资源；Solutions 只改变卡片呈现，不删除 `vendors` 数据；世界地图使用生成底图配合 HTML/CSS 节点，文字仍由现有内容模型渲染。

**Tech Stack:** React 18、TypeScript、Tailwind CSS 3.4、Vite 5、Vitest、Testing Library、Playwright CLI、内置图片生成工具。

## Global Constraints

- 保留深色站点、HLS Hero 视频、现有导航名称和 Solution → Category → Vendor 层级。
- 页面不渲染 Technology Portfolio，但不得删除导航依赖的品牌数据。
- 新图片不得包含品牌、文字、人物或水印，并存放在项目内，不依赖第三方 CDN。
- 页面语言继续使用英文；现有中文品牌名称不翻译。
- 375px、768px、1440px 宽度下均不得出现横向溢出。
- 不修改与本任务无关的未跟踪目录和文档。

---

### Task 1: 生成并登记服务分类和世界地图视觉资源

**Files:**
- Create: `joto-site-v2/src/assets/solutions/network.webp`
- Create: `joto-site-v2/src/assets/solutions/security.webp`
- Create: `joto-site-v2/src/assets/solutions/server-storage.webp`
- Create: `joto-site-v2/src/assets/solutions/collaboration.webp`
- Create: `joto-site-v2/src/assets/solutions/safeguarding.webp`
- Create: `joto-site-v2/src/assets/global/world-map.webp`
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Test: `joto-site-v2/src/content/en.test.ts`

**Interfaces:**
- Consumes: `SolutionCategory` 和 `siteContent.solutions.categories`。
- Produces: `SolutionCategory.image: string`、`SolutionCategory.imageAlt: string`；六张可直接由 Vite 导入的本地 WebP。

- [ ] **Step 1: 为内容模型写失败测试**

在 `src/content/en.test.ts` 增加：

```ts
it("assigns a local visual and descriptive alt text to every solution category", () => {
  for (const category of siteContent.solutions.categories) {
    expect(category.image).toMatch(/\.(png|webp|jpg|jpeg)$/i);
    expect(category.imageAlt.trim().length).toBeGreaterThan(10);
  }
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/en.test.ts`

Expected: FAIL，提示 `image` 或 `imageAlt` 不存在。

- [ ] **Step 3: 使用内置图片生成工具分别生成六张图**

五张服务图统一使用以下约束：网站服务分类卡片、16:10 横向构图、电影感企业科技摄影、黑色与墨绿色背景、克制的青绿色光线、高对比、边缘留有暗部、无人物、无品牌、无文字、无水印。

分别使用以下主体提示：

```text
Network: enterprise network fabric, fiber paths, switches and data flows forming a precise connected system.
Security: layered cyber defense operations, protected identity and network perimeter expressed through secure illuminated infrastructure.
Server & Storage: premium data-center racks, compute nodes and storage arrays with clear depth and resilient architecture.
Collaboration: enterprise voice, paging and unified communications represented by connected audio waves and meeting endpoints.
Safeguarding: integrated video security, access control and facility monitoring represented by cameras, sensors and secure entry systems.
World map: accurate full-world equirectangular map silhouette, dark editorial cartography, subtle borders and grid, generous empty margins, no labels, no markers, no text.
```

- [ ] **Step 4: 将最终图片复制进项目并转换为 WebP**

最终分类图保存为 `src/assets/solutions/*.webp`，地图保存为 `src/assets/global/world-map.webp`。使用本地图片工具输出高质量 WebP，单张分类图目标宽度 1600px，地图目标宽度 2048px；保留生成源文件在项目 `output/imagegen/` 供后续调整。

- [ ] **Step 5: 扩展类型并登记资源**

将 `SolutionCategory` 改为：

```ts
export interface SolutionCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  vendors: Vendor[];
}
```

在 `src/content/en.ts` 导入五张分类图，并为每个分类添加准确英文 `image` 与 `imageAlt`。品牌数组保持原样。

- [ ] **Step 6: 运行内容测试并提交**

Run: `npm test -- --run src/content/en.test.ts`

Expected: PASS。

```bash
git add joto-site-v2/src/assets/solutions joto-site-v2/src/assets/global joto-site-v2/src/content/types.ts joto-site-v2/src/content/en.ts joto-site-v2/src/content/en.test.ts
git commit -m "feat: add JOTO service and global visuals"
```

### Task 2: 重组 Hero 信息层级和 Solutions 分类卡片

**Files:**
- Modify: `joto-site-v2/src/App.test.tsx`
- Modify: `joto-site-v2/src/components/Hero.tsx`
- Modify: `joto-site-v2/src/components/Solutions.tsx`

**Interfaces:**
- Consumes: `hero.description`、Task 1 新增的分类图片字段、现有 `vendorAnchor()`。
- Produces: 桌面放大主张、移动端紧凑主张、无可见品牌列表的五张视觉卡片，以及仍可落到分类卡片顶部的品牌锚点。

- [ ] **Step 1: 更新 Solutions 的失败测试**

将原有分类测试调整为：

```ts
expect(region.getAllByRole("img")).toHaveLength(5);
expect(region.queryByText("Cisco")).not.toBeInTheDocument();
expect(container.querySelector("#solution-network-cisco")).toBeInTheDocument();
```

- [ ] **Step 2: 运行 App 测试并确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，因为分类卡片仍显示品牌且没有五张分类图。

- [ ] **Step 3: 调整 Hero**

在桌面端将 `hero.description` 放到首屏中左部：

```tsx
<p className="absolute left-12 top-[24%] hidden max-w-[720px] text-[clamp(2rem,3vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.035em] text-white/72 lg:block">
  {hero.description}
</p>
```

在主标题下保留只在 `lg` 以下显示的紧凑说明。CTA 继续位于标题区域，玻璃卡片位置不变。

- [ ] **Step 4: 重做 Solutions 卡片**

删除可见品牌列表与等级组件。每张卡片按“编号 → 图片 → 分类名称 → 简介”排版：

```tsx
<div className="mt-8 aspect-[16/10] overflow-hidden border border-white/10 bg-[#0b1210]">
  <img
    src={category.image}
    alt={category.imageAlt}
    loading="lazy"
    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100"
  />
</div>
```

在卡片顶部为每个品牌保留不可见锚点：

```tsx
{category.vendors.map((vendor) => (
  <span
    aria-hidden="true"
    className="absolute left-0 top-0"
    id={vendorAnchor(category.id, vendor.name).slice(1)}
    key={vendor.name}
  />
))}
```

- [ ] **Step 5: 运行 App 测试并提交**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

```bash
git add joto-site-v2/src/App.test.tsx joto-site-v2/src/components/Hero.tsx joto-site-v2/src/components/Solutions.tsx
git commit -m "feat: strengthen hero and solution storytelling"
```

### Task 3: 统一案例 Logo 并修复 About 文字溢出

**Files:**
- Modify: `joto-site-v2/src/components/CaseStudies.tsx`
- Modify: `joto-site-v2/src/components/About.tsx`
- Test: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: 现有案例 Logo 和 `about.stats`。
- Produces: 高度一致的 Logo 舞台，以及按字符长度选择安全字号的统计值。

- [ ] **Step 1: 增加长统计值回归测试**

在 `src/App.test.tsx` 中断言：

```ts
expect(screen.getByText("LIFECYCLE")).toHaveClass("break-words");
expect(screen.getByText("MULTI-VENDOR")).toHaveClass("break-words");
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，因为统计值尚无溢出保护类。

- [ ] **Step 3: 放大并统一案例 Logo**

用固定舞台替换当前 `mb-8 h-10`：

```tsx
<div className="mb-8 flex h-24 min-w-0 items-end sm:h-28">
  <img
    src={item.logo}
    alt={`${item.client} logo`}
    loading="lazy"
    className="max-h-20 w-auto max-w-[min(100%,260px)] object-contain object-left brightness-0 invert sm:max-h-24"
  />
</div>
```

- [ ] **Step 4: 为统计卡增加自适应字号和换行保护**

```tsx
const isLongValue = stat.value.length > 7;

<p
  className={`min-w-0 break-words font-medium leading-[0.96] tracking-[-0.06em] text-[#5ed29c] [overflow-wrap:anywhere] ${
    isLongValue
      ? "text-[clamp(1.65rem,2.8vw,2.75rem)]"
      : "text-[clamp(2.75rem,5vw,5rem)]"
  }`}
>
  {stat.value}
</p>
```

卡片本身增加 `min-w-0 overflow-hidden`，案例标题与标签容器增加 `min-w-0`。

- [ ] **Step 5: 运行测试并提交**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

```bash
git add joto-site-v2/src/App.test.tsx joto-site-v2/src/components/CaseStudies.tsx joto-site-v2/src/components/About.tsx
git commit -m "fix: balance case logos and prevent text overflow"
```

### Task 4: 移除 Technology Portfolio 并换成世界地图

**Files:**
- Create: `joto-site-v2/src/components/GlobalMap.tsx`
- Modify: `joto-site-v2/src/components/GlobalPresence.tsx`
- Modify: `joto-site-v2/src/App.tsx`
- Modify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: `src/assets/global/world-map.webp`、`globalPresence.regions`。
- Produces: `GlobalMap` 视觉组件；页面不再渲染 `Partners`；Global Presence 编号为 05。

- [ ] **Step 1: 更新页面结构失败测试**

```ts
expect(document.querySelector("#partners")).not.toBeInTheDocument();
expect(screen.getByRole("img", { name: /world map showing JOTO/i })).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，因为 Partners 仍存在且世界地图尚未渲染。

- [ ] **Step 3: 创建 GlobalMap**

`GlobalMap.tsx` 导入地图底图，使用相对容器和七个 HTML 节点覆盖关键地区。节点使用百分比定位和 `aria-hidden="true"`，地图图片使用：

```tsx
<img
  src={worldMap}
  alt="World map showing JOTO's international delivery footprint"
  loading="lazy"
  className="absolute inset-0 h-full w-full object-cover opacity-75"
/>
```

中国、日本、泰国、新加坡、美国和英国的城市名称仍只在右侧现有列表中出现，避免地图文字拥挤。

- [ ] **Step 4: 替换雷达图并移除 Partners**

在 `GlobalPresence.tsx` 使用 `<GlobalMap />` 取代圆环雷达，保留 24×7 文案并将 SectionHeading 的 `index` 改为 `05`。在 `App.tsx` 删除 `Partners` 导入和 `<Partners />`。

- [ ] **Step 5: 运行测试并提交**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

```bash
git add joto-site-v2/src/components/GlobalMap.tsx joto-site-v2/src/components/GlobalPresence.tsx joto-site-v2/src/App.tsx joto-site-v2/src/App.test.tsx
git commit -m "feat: replace partner grid with global map"
```

### Task 5: 全量构建与三档浏览器验收

**Files:**
- Modify if required: `joto-site-v2/src/components/*.tsx`
- Artifacts: `joto-site-v2/output/playwright/`

**Interfaces:**
- Consumes: Tasks 1–4 完整页面。
- Produces: 通过测试和构建的本地预览，以及 375px、768px、1440px 三档无溢出证据。

- [ ] **Step 1: 运行完整自动化测试**

Run: `npm test -- --run`

Expected: 全部 PASS。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: TypeScript 与 Vite 构建成功，无错误。

- [ ] **Step 3: 确认浏览器自动化前置条件**

Run: `command -v npx >/dev/null 2>&1`

Expected: exit code 0。

- [ ] **Step 4: 使用现有 `http://127.0.0.1:4174/` 做三档检查**

分别设置 375×812、768×1024、1440×1000。每档检查：

```js
({
  viewport: window.innerWidth,
  documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  offenders: Array.from(document.querySelectorAll("body *"))
    .filter((element) => element.scrollWidth > element.clientWidth + 1)
    .map((element) => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 80) }))
    .slice(0, 20),
})
```

Expected: `documentOverflow` 为 `false`；不存在由文本造成的可见溢出。

- [ ] **Step 5: 检查关键视觉和导航行为**

- Hero 桌面端放大主张占据原空白区，手机端不与玻璃卡重叠。
- 五张服务图均正常加载，页面卡片中无品牌列表。
- 案例 Logo 显著增大并保持一致。
- `LIFECYCLE`、`MULTI-VENDOR` 无出框。
- Technology Portfolio 不存在。
- 世界地图和地区列表完整显示。
- 桌面 Solution 菜单以及手机 Solution 分类/品牌折叠仍可使用。

- [ ] **Step 6: 最终回归提交**

如浏览器检查产生必要修复，完成后再次运行 `npm test -- --run && npm run build`，然后提交：

```bash
git add joto-site-v2/src joto-site-v2/output/playwright
git commit -m "test: complete responsive visual regression"
```

