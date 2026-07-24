# Customer Logo Wall Dark Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将全站客户 Logo Wall 改为单排连续暗色玻璃光带，并确保全部 42 个 Logo 在桌面端和移动端均完整清晰。

**Architecture:** 保留 `CustomerLogoWall` 作为首页、所有 Solution 详情页和预览页的唯一共享组件；组件将现有两行数据展平为一个可访问主序列和一个装饰循环副本。样式集中在 `src/index.css`，Logo 数据与单项视觉缩放继续由 `src/content/customerLogos.ts` 管理。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、原生 CSS 动画、Vitest、Testing Library、Vite。

## Global Constraints

- 使用现有 42 个客户 Logo，不新增、不删除、不改变排序。
- 不允许任何独立 Logo 卡片、白色背景、单项边框或单项圆角。
- 全部 Logo 在暗色光带中统一显示为银白单色。
- 桌面端和移动端都保持单排；动画匀速、可暂停，并支持 `prefers-reduced-motion`。
- 图片加载失败时必须显示品牌名称。
- 仅提交本次 Logo Wall 相关文件，不包含工作区内其他未完成修改。

---

### Task 1: 锁定单排结构与可访问性

**Files:**
- Modify: `src/components/CustomerLogoWall.test.tsx`
- Modify: `src/components/CustomerLogoWall.tsx`

**Interfaces:**
- Consumes: `customerLogoRows: readonly (readonly CustomerLogo[])[]`
- Produces: 一个 `.customer-logo-wall__track`、一个 `data-logo-sequence="primary"` 主序列、一个 `data-logo-sequence="duplicate"` 装饰副本。

- [ ] **Step 1: 写入失败测试**

将组件测试更新为以下结构断言：

```tsx
it("renders all 42 unique logos in one accessible sequence", () => {
  const { container } = render(<CustomerLogoWall />);

  expect(screen.getAllByRole("img")).toHaveLength(42);
  expect(container.querySelectorAll(".customer-logo-wall__track")).toHaveLength(1);
  expect(container.querySelectorAll('[data-logo-sequence="primary"]')).toHaveLength(1);
  expect(container.querySelectorAll('[data-logo-sequence="duplicate"]')).toHaveLength(1);
  expect(
    container.querySelector('[data-logo-sequence="duplicate"]'),
  ).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelector(".customer-logo-wall__track--reverse")).toBeNull();
});

it("does not render individual logo cards", () => {
  const { container } = render(<CustomerLogoWall />);

  for (const item of container.querySelectorAll("[data-customer-logo-item]")) {
    expect(item.className).not.toMatch(/bg-\\[#f4f6f5\\]|rounded-lg|shadow-/);
  }
});
```

- [ ] **Step 2: 运行测试并确认旧实现失败**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: FAIL；旧实现存在两个滚动轨道、两个装饰副本和独立白色卡片。

- [ ] **Step 3: 实现单排共享组件**

在 `CustomerLogoWall.tsx` 中：

```tsx
const customerLogos = customerLogoRows.flat();

function LogoItem({ decorative, logo }: LogoItemProps) {
  const [failed, setFailed] = useState(false);
  const scale = logo.scale ?? "standard";

  return (
    <li
      aria-hidden={decorative || undefined}
      className="customer-logo-wall__item group flex h-24 shrink-0 items-center justify-center px-6 sm:h-28 sm:px-8"
      data-customer-logo-item
    >
      {failed ? (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e7efec]/80">
          {logo.name}
        </span>
      ) : (
        <img
          alt={decorative ? "" : `${logo.name} logo`}
          className={`${logoScaleClasses[scale]} customer-logo-wall__logo w-auto object-contain`}
          data-logo-scale={scale}
          decoding="async"
          onError={() => setFailed(true)}
          src={logo.src}
        />
      )}
    </li>
  );
}
```

组件主体只创建一个轨道：

```tsx
<div className="customer-logo-wall__viewport overflow-hidden" role="group">
  <div
    className="customer-logo-wall__track flex w-max"
    style={{ "--logo-wall-duration": "132s" } as CSSProperties}
  >
    <LogoSequence decorative={false} logos={customerLogos} />
    <LogoSequence decorative logos={customerLogos} />
  </div>
</div>
```

- [ ] **Step 4: 运行组件测试**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: PASS；42 个可访问图片、一个主序列、一个隐藏副本、没有反向轨道和白色卡片。

- [ ] **Step 5: 提交结构修改**

```bash
git add src/components/CustomerLogoWall.tsx src/components/CustomerLogoWall.test.tsx
git commit -m "refactor: simplify customer logo wall track"
```

### Task 2: 实现暗色玻璃光带与响应式动画

**Files:**
- Modify: `src/index.css`
- Test: `src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `.customer-logo-wall__viewport`、`.customer-logo-wall__track`、`.customer-logo-wall__logo`、`.customer-logo-wall__item`
- Produces: 无卡片暗色光带、银白单色 Logo、左右渐隐、可暂停动画和减少动态模式。

- [ ] **Step 1: 为关键样式类增加结构测试**

```tsx
it("marks every logo for the dark glass treatment", () => {
  const { container } = render(<CustomerLogoWall />);

  expect(container.querySelector(".customer-logo-wall__ribbon")).toBeInTheDocument();
  expect(container.querySelectorAll(".customer-logo-wall__logo")).toHaveLength(84);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: FAIL；组件尚未提供 `.customer-logo-wall__ribbon`。

- [ ] **Step 3: 增加光带结构与样式**

在组件中把视口包裹或标记为：

```tsx
<div className="customer-logo-wall__ribbon relative border-y border-white/10 bg-[#0a1210]/82">
```

在 `src/index.css` 中替换旧 Logo Wall 样式：

```css
.customer-logo-wall__ribbon {
  background:
    radial-gradient(circle at 50% 50%, rgba(94, 210, 156, 0.09), transparent 56%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.008)),
    rgba(5, 14, 11, 0.9);
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.025),
    inset 0 -1px rgba(255, 255, 255, 0.018);
}

.customer-logo-wall__viewport {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}

.customer-logo-wall__logo {
  opacity: 0.78;
  filter: grayscale(1) brightness(0) invert(0.94) sepia(0.08);
  transition: filter 300ms ease, opacity 300ms ease, transform 300ms ease;
}

.customer-logo-wall__item:hover .customer-logo-wall__logo {
  opacity: 1;
  filter: grayscale(1) brightness(0) invert(1);
  transform: scale(1.025);
}

.customer-logo-wall__track {
  animation: customer-logo-wall-scroll var(--logo-wall-duration, 132s) linear infinite;
  will-change: transform;
}
```

保留暂停与减少动态逻辑；减少动态时隐藏副本并允许横向滚动。

- [ ] **Step 4: 运行组件测试和内容测试**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx src/content/customerLogos.test.ts
```

Expected: PASS。

- [ ] **Step 5: 提交视觉样式**

```bash
git add src/components/CustomerLogoWall.tsx src/components/CustomerLogoWall.test.tsx src/index.css
git commit -m "feat: add dark glass customer logo ribbon"
```

### Task 3: 全量 Logo 视觉审查与尺寸校准

**Files:**
- Modify if required: `src/content/customerLogos.ts`
- Modify if required: `src/content/customerLogos.test.ts`

**Interfaces:**
- Consumes: `CustomerLogo.scale: "compact" | "standard" | "prominent"`
- Produces: 42 个 Logo 的最终视觉尺寸配置。

- [ ] **Step 1: 启动现有开发预览**

Run:

```bash
npm run dev
```

Expected: Vite 输出本地地址并保持运行。

- [ ] **Step 2: 打开全量预览路由**

打开：

```text
/zh/preview/customer-logo-wall
```

在桌面视口检查完整轨道的每一个 Logo；通过横向滚动或暂停动画分段查看 42 项。

- [ ] **Step 3: 逐项校准异常 Logo**

仅在可见图形明显偏大或偏小时，修改 `customerLogos.ts` 中该项的 `scale`。每次修改只允许使用现有三个枚举值：

```ts
{ name: "Brand", scale: "compact", src: brand }
{ name: "Brand", scale: "standard", src: brand }
{ name: "Brand", scale: "prominent", src: brand }
```

验收标准：无裁切、无空白、无可见白底、银白对比清楚，相邻 Logo 的视觉高度差不超过约 25%。

- [ ] **Step 4: 检查移动端**

在约 `390 × 844` 视口检查同一路由。验收标准：Logo 不被上下裁切、光带不超过约 `9rem`、左右渐隐自然、页面无纵向高度膨胀。

- [ ] **Step 5: 运行完整测试与构建**

Run:

```bash
npm test -- --run
npm run build
```

Expected: 所有测试 PASS，TypeScript 和 Vite 构建成功。

- [ ] **Step 6: 提交尺寸校准**

仅在数据文件发生变化时运行：

```bash
git add src/content/customerLogos.ts src/content/customerLogos.test.ts
git commit -m "fix: balance customer logo visual scale"
```

### Task 4: 隔离提交并发布

**Files:**
- Verify only: `src/components/CustomerLogoWall.tsx`
- Verify only: `src/components/CustomerLogoWall.test.tsx`
- Verify only: `src/content/customerLogos.ts`
- Verify only: `src/content/customerLogos.test.ts`
- Verify only: `src/index.css`

**Interfaces:**
- Consumes: 已通过测试和构建的当前分支。
- Produces: 远端 Git 提交和已更新的网站。

- [ ] **Step 1: 审查提交范围**

Run:

```bash
git status --short
git diff --stat HEAD
git diff --check
```

Expected: 本任务文件无格式错误；工作区内其他未完成文件保持未暂存。

- [ ] **Step 2: 推送当前分支**

Run:

```bash
git push origin codex/joto-trilingual-zh-en-fa
```

Expected: 远端分支更新成功。

- [ ] **Step 3: 使用现有站点配置发布**

使用 `.openai/hosting.json` 中现有 `project_id` 构建、保存版本并部署，不创建新站点。

- [ ] **Step 4: 验证线上页面**

检查线上首页和任意一个 Solution 详情页。验收标准：两处均显示相同的单排暗色玻璃 Logo Wall；无白卡、无白底、无 Logo 缺失。
