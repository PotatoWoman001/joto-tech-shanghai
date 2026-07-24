# Home About Metric Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把首页 About 区块重排为左侧叙事、右侧四张纵向圆角指标卡，并保持三语与响应式布局一致。

**Architecture:** 继续使用 `content/en.ts` 与 `I18nProvider` 提供三语内容，仅重构 `About.tsx` 的展示结构。组件保留既有 `Reveal` 动效，通过 Tailwind 类完成双栏、圆角卡片、绿色强调与移动端回落。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library

## Global Constraints

- 不新增依赖。
- 不修改四项指标的现有文案与翻译。
- 桌面端双栏、移动端单栏、波斯语 RTL 必须保留。
- 不触碰工作区内与本任务无关的未跟踪文件。

---

### Task 1: 重排首页 About 区块

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `siteContent.about` 中的 `eyebrow`、`title`、`description`、`secondary`、`stats`
- Produces: `#about` 内的 `[data-about-copy]`、`[data-about-stats]` 与四个 `[data-about-stat-card]`

- [ ] **Step 1: 写失败测试**

在 `src/App.test.tsx` 中把旧的长文本保护测试扩展为结构测试：

```tsx
it("places the About narrative beside four stacked metric cards", () => {
  const { container } = renderApp();
  const section = container.querySelector("#about") as HTMLElement;

  expect(section.querySelector("[data-about-layout]")).toHaveClass("lg:grid-cols-12");
  expect(section.querySelector("[data-about-copy]")).toBeInTheDocument();
  expect(section.querySelector("[data-about-stats]")).toHaveClass("lg:col-span-5");
  expect(section.querySelectorAll("[data-about-stat-card]")).toHaveLength(4);
  expect(screen.getByText("LIFECYCLE")).toHaveClass("whitespace-nowrap");
  expect(screen.getByText("MULTI-VENDOR")).toHaveClass("whitespace-nowrap");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，原因是新 `data-about-*` 标记与新布局类尚不存在。

- [ ] **Step 3: 实现双栏与指标卡**

在 `src/components/About.tsx` 中移除 `SectionHeading`，保留 `Reveal`，将结构改为：

```tsx
<div data-about-layout className="grid gap-12 border-t border-white/15 pt-6 lg:grid-cols-12 lg:gap-10">
  <div data-about-copy className="lg:col-span-7">
    {/* eyebrow、title、description、secondary */}
  </div>
  <div data-about-stats className="grid gap-4 lg:col-span-5">
    {about.stats.map((stat, index) => (
      <Reveal data-about-stat-card>
        {/* label 在上、绿色 value 在下、圆角细描边与轻微光晕 */}
      </Reveal>
    ))}
  </div>
</div>
```

指标值使用 `whitespace-nowrap` 与按长度变化的 `clamp()` 字号，卡片使用 `rounded-[1.75rem] border border-white/15 bg-[#090e0c]`。

- [ ] **Step 4: 运行测试与生产构建**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS。

Run: `npm run build`

Expected: TypeScript 与 Vite production build 均成功。

- [ ] **Step 5: 浏览器验证三语**

分别检查 `/`、`/zh/`、`/fa/`：

- 桌面端左右双栏；
- 右侧四张纵向圆角卡片；
- 中文“全生命周期”保持一行；
- 波斯语 RTL 无溢出；
- 移动端回落为单栏。

- [ ] **Step 6: 提交与发布**

```bash
git add src/components/About.tsx src/App.test.tsx docs/superpowers/specs/2026-07-24-home-about-metric-cards-design.md docs/superpowers/plans/2026-07-24-home-about-metric-cards.md
git commit -m "feat: redesign homepage about metrics"
git push
```

随后构建静态站点并更新 `PotatoWoman001.github.io` 的 `main` 分支。
