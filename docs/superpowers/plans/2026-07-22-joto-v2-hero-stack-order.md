# JOTO V2 Hero Stack Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Hero 三段内容在所有尺寸统一为绿色眉题、主标题、说明文案的顺序，并在 PC 端把标题再放大一级、随内容流自然上移。

**Architecture:** 保留单一 Hero 内容源和单一 `<h1>`，删除桌面说明文案的重复渲染与绝对定位。玻璃卡在 `lg` 断点改为相对 Hero 外层绝对定位，使三段内容进入正常流后不会把卡片推向导航。

**Tech Stack:** React 18、TypeScript、Tailwind CSS 3.4、Vitest、Testing Library、Playwright CLI。

## Global Constraints

- 所有尺寸从上到下固定为 `1 绿色眉题 → 2 主标题 → 3 说明文案`。
- 三个板块共享相同左侧起点，标题第二行保留品牌缩进。
- PC 从 1024px 起，标题最小字号约 112px，并较上一版上移。
- 玻璃卡和 CTA 保持现有视觉区域，不与三段内容重叠。
- 不修改文案、链接、背景视频或其他页面板块。
- 不部署，只更新本地预览。

---

### Task 1: 锁定单一内容顺序

**Files:**
- Modify: `joto-site-v2/src/App.test.tsx`
- Test: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: Hero 的 `ENTERPRISE-READY IT SOLUTIONS`、`We Make IT Happen.` 和完整说明文案。
- Produces: 三段内容只渲染一次且 DOM 顺序固定为眉题、标题、说明文案的回归约束。

- [x] **Step 1: 写入失败测试**

将现有 Hero 文案测试改为只接受一个说明文案节点，并检查三个节点的文档顺序：

```tsx
const { container } = render(<App />);
const hero = container.querySelector('section[aria-labelledby="hero-title"]');
const eyebrow = within(hero as HTMLElement).getByText(
  "ENTERPRISE-READY IT SOLUTIONS",
);
const heading = within(hero as HTMLElement).getByRole("heading", {
  level: 1,
  name: "We Make IT Happen.",
});
const description = within(hero as HTMLElement).getByText(
  "Enterprise networks, security, data centers, collaboration and physical safeguarding — designed, built and supported for the world's most demanding companies since 2010.",
);

expect(eyebrow.compareDocumentPosition(heading)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
);
expect(heading.compareDocumentPosition(description)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
);
```

- [x] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，因为当前说明文案渲染两次且标题位于眉题之前。

### Task 2: 重排 Hero 并调整桌面构图

**Files:**
- Modify: `joto-site-v2/src/components/Hero.tsx`
- Test: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: `siteContent.hero` 的现有字段。
- Produces: 一套共享的眉题、标题、说明文案结构，以及 PC 独立定位的玻璃卡。

- [x] **Step 1: 删除重复桌面说明文案**

删除 `top-[17%]` 的 `hidden lg:block` 说明文案容器，让说明文案只在主内容流中渲染一次。

- [x] **Step 2: 固定 PC 玻璃卡**

为现有玻璃卡增加以下 `lg` 类，使其在 PC 端相对 Hero 主容器固定在右上区域，手机和平板保留流式位置：

```tsx
lg:absolute lg:right-[12.5%] lg:top-[20%] lg:m-0 lg:translate-y-0
```

- [x] **Step 3: 重排三段内容并放大 PC 标题**

将绿色眉题移动到 `<h1>` 前；标题桌面类改为：

```tsx
lg:text-[clamp(7rem,11vw,10.5rem)]
```

标题后方的响应式行统一渲染说明文案与 CTA：

```tsx
<div className="mt-6 flex max-w-[1180px] flex-col gap-7 sm:mt-7 sm:flex-row sm:items-end sm:justify-between">
  <p className="max-w-lg font-sans text-[14px] leading-6 text-white/70 lg:max-w-[48%] lg:text-[clamp(1.05rem,1.7vw,1.35rem)] lg:font-normal lg:leading-[1.55] lg:tracking-[-0.018em] lg:text-white/62">
    {hero.description}
  </p>
  {/* 保留现有 CTA */}
</div>
```

- [x] **Step 4: 运行页面测试**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

### Task 3: 完整验证与本地保存

**Files:**
- Modify: `docs/superpowers/plans/2026-07-22-joto-v2-hero-stack-order.md`
- Artifacts: `joto-site-v2/output/playwright/`

**Interfaces:**
- Consumes: Tasks 1–2 的 Hero 实现。
- Produces: 完整测试、构建、375px/768px/1024px 视觉证据与本地 Git 提交。

- [x] **Step 1: 运行完整测试、构建与差异检查**

Run: `npm test -- --run && npm run build && git diff --check`

Expected: 19 项测试全部通过，Vite 生产构建成功，无空白错误。

- [x] **Step 2: 使用真实浏览器验证三个视口**

使用 Playwright CLI 检查：

- 375×812：眉题、标题、说明文案依次排列，CTA 完整可见。
- 768×900：三段顺序一致，说明文案与 CTA 平衡。
- 1024×768：标题字号约 112px，位置高于上一版；玻璃卡、说明文案与 CTA 互不遮挡。
- 每个视口均满足 `document.documentElement.scrollWidth === innerWidth`。

- [x] **Step 3: 暂存并提交指定文件**

```bash
git add docs/superpowers/plans/2026-07-22-joto-v2-hero-stack-order.md joto-site-v2/src/App.test.tsx joto-site-v2/src/components/Hero.tsx
git commit -m "feat: reorder JOTO hero content"
```
