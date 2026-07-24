# JOTO V2 Services Photography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为四张 End-to-End 服务卡接入已确认的真实摄影图片、适度增加卡片高度，并恢复 Starbucks 案例 Logo 的原始绿色细节。

**Architecture:** 四张照片转换为项目本地 WebP，由 `ServiceItem` 内容模型提供图片和 Alt 文本；`Services` 使用同一响应式卡片组件在 PC 端形成左文右图、在较小屏幕形成浅横图。`CaseStudy.logoTreatment` 控制 Logo 使用浅色滤镜或原始配色，不在组件中判断客户名称。

**Tech Stack:** React 18、TypeScript、Tailwind CSS 3.4、Pillow WebP、Vitest、Testing Library、Playwright CLI。

## Global Constraints

- 只使用设计说明中确认的四张普通 Unsplash 真实摄影，不使用 AI 生成图或带水印预览。
- 资源保存在项目本地，不使用远程热链；每张 WebP 目标体积不超过约 120KB。
- PC 服务卡最小高度约 440px，图片位于右侧且最大宽度约 220px。
- 1024px 以下使用约 96–120px 的浅横图，不改变服务区现有网格断点。
- Starbucks 显示原始绿白 Logo，其他案例保持现有浅色 Logo 视觉。
- 不部署，只更新本地预览。

---

### Task 1: 图片资源与内容模型

**Files:**
- Create: `joto-site-v2/src/assets/services/advisory-planning.webp`
- Create: `joto-site-v2/src/assets/services/design-integration.webp`
- Create: `joto-site-v2/src/assets/services/security-compliance.webp`
- Create: `joto-site-v2/src/assets/services/managed-support.webp`
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Modify: `joto-site-v2/src/content/en.test.ts`

**Interfaces:**
- Consumes: 四张已下载到 `joto-site-v2/output/playwright/` 的 1200×700 JPEG 候选图。
- Produces: `ServiceItem.image: string`、`ServiceItem.imageAlt: string`、`CaseStudy.logoTreatment?: "light" | "original"`。

- [x] **Step 1: 写入失败内容测试**

在 `src/content/en.test.ts` 增加：

```ts
it("assigns a local photograph and descriptive alt text to every service", () => {
  for (const service of siteContent.services.items) {
    expect(service.image).toMatch(/\.webp$/i);
    expect(service.imageAlt.trim().length).toBeGreaterThan(20);
  }
});

it("preserves the original Starbucks logo colors", () => {
  const starbucks = siteContent.caseStudies.items.find(
    ({ client }) => client === "Starbucks China",
  );

  expect(starbucks?.logoTreatment).toBe("original");
});
```

- [x] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/content/en.test.ts`

Expected: FAIL，因为服务项尚无图片字段，Starbucks 尚无 Logo 处理字段。

- [x] **Step 3: 转换四张本地 WebP**

使用 Pillow 读取已确认的 JPEG，保持 1200×700，并以质量 78、method 6 输出 WebP：

```python
from pathlib import Path
from PIL import Image

root = Path("joto-site-v2")
sources = {
    "advisory-planning.webp": root / "output/playwright/service-candidate-planning.jpg",
    "design-integration.webp": root / "output/playwright/service-candidate-integration-final.jpg",
    "security-compliance.webp": root / "output/playwright/service-candidate-security-alt-a.jpg",
    "managed-support.webp": root / "output/playwright/service-candidate-support-alt.jpg",
}
target = root / "src/assets/services"
target.mkdir(parents=True, exist_ok=True)

for filename, source in sources.items():
    with Image.open(source) as image:
        image.convert("RGB").save(target / filename, "WEBP", quality=78, method=6)
```

Run: `du -h src/assets/services/*.webp`

Expected: 四个文件存在，单文件约 120KB 或更小；若某文件超过目标，将该文件以质量 72 重新输出。

- [x] **Step 4: 扩展类型并绑定内容**

为 `ServiceItem` 增加必填 `image`、`imageAlt`，为 `CaseStudy` 增加可选 `logoTreatment`。在 `en.ts` 导入四张 WebP，并按设计说明写入四项服务的准确 Alt 文本；Starbucks 项增加：

```ts
logoTreatment: "original",
```

- [x] **Step 5: 运行内容测试**

Run: `npm test -- --run src/content/en.test.ts`

Expected: PASS。

### Task 2: 服务卡响应式图片与 Logo 显示

**Files:**
- Modify: `joto-site-v2/src/App.test.tsx`
- Modify: `joto-site-v2/src/components/Services.tsx`
- Modify: `joto-site-v2/src/components/CaseStudies.tsx`

**Interfaces:**
- Consumes: Task 1 的 `service.image`、`service.imageAlt` 和 `item.logoTreatment`。
- Produces: 四张带真实图片的服务卡，以及保留原色的 Starbucks Logo。

- [x] **Step 1: 写入失败渲染测试**

在 `src/App.test.tsx` 增加：

```tsx
it("renders a real local photograph for every end-to-end service", () => {
  const { container } = render(<App />);
  const services = within(container.querySelector("#services") as HTMLElement);

  expect(services.getAllByRole("img")).toHaveLength(4);
  expect(
    services.getByRole("img", {
      name: "Security operator monitoring multiple live systems in a control center",
    }),
  ).toBeInTheDocument();
});

it("keeps the Starbucks logo in its original colors", () => {
  render(<App />);
  const logo = screen.getByRole("img", { name: "Starbucks China logo" });

  expect(logo).not.toHaveClass("brightness-0");
  expect(logo).not.toHaveClass("invert");
});
```

- [x] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，因为服务卡尚未渲染图片，Starbucks 仍使用统一反色滤镜。

- [x] **Step 3: 重组服务卡**

将 `Services` 的卡片改为 `group flex min-h-[380px] flex-col ... lg:min-h-[440px]`。编号下方建立响应式内容区：

```tsx
<div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(120px,34%)] lg:items-start lg:gap-8">
  <div className="min-w-0">
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </div>
  <div className="relative h-24 overflow-hidden border border-white/12 sm:h-28 lg:aspect-[3/2] lg:h-auto lg:max-w-[220px]">
    <img
      src={service.image}
      alt={service.imageAlt}
      loading="lazy"
      className="h-full w-full object-cover brightness-[0.72] saturate-[0.72] transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
    />
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(7,11,10,0.04),rgba(49,201,154,0.16))]" />
  </div>
</div>
```

功能点列表使用 `mt-auto pt-8`，继续在 `sm` 断点两列显示。

- [x] **Step 4: 按内容字段切换 Logo 滤镜**

在 `CaseStudies` 中保持公共尺寸类，只对非 `original` Logo 增加 `brightness-0 invert`：

```tsx
className={`max-h-20 w-auto max-w-full object-contain object-left sm:max-h-24 sm:max-w-[260px] ${
  item.logoTreatment === "original" ? "" : "brightness-0 invert"
}`}
```

- [x] **Step 5: 运行渲染测试**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

### Task 3: 构建、视觉验证与提交

**Files:**
- Modify: `docs/superpowers/plans/2026-07-22-joto-v2-services-photography.md`
- Artifacts: `joto-site-v2/output/playwright/`

**Interfaces:**
- Consumes: Tasks 1–2 的内容与组件实现。
- Produces: 完整测试、构建、四个视口视觉证据和本地提交。

- [x] **Step 1: 运行完整测试、构建与差异检查**

Run: `npm test -- --run && npm run build && git diff --check`

Expected: 全部测试通过，Vite 构建成功，无空白错误；只允许现有的大包体积警告。

- [x] **Step 2: 使用 Playwright 验证服务卡**

检查 375×812、768×900、1024×768、1440×900：

- 四张图片加载成功，保持真实摄影细节且无水印。
- PC 卡片约 440px 高，图片在右侧，功能点不被遮挡。
- 1024px 以下图片为紧凑横条，卡片没有异常拉长或横向溢出。
- Starbucks Logo 显示绿色细节，不再是白色空圆。
- `document.documentElement.scrollWidth === innerWidth`。

- [x] **Step 3: 暂存并提交指定文件**

```bash
git add docs/superpowers/plans/2026-07-22-joto-v2-services-photography.md joto-site-v2/src/assets/services joto-site-v2/src/content/types.ts joto-site-v2/src/content/en.ts joto-site-v2/src/content/en.test.ts joto-site-v2/src/components/Services.tsx joto-site-v2/src/components/CaseStudies.tsx joto-site-v2/src/App.test.tsx
git commit -m "feat: add photography to JOTO service cards"
```
