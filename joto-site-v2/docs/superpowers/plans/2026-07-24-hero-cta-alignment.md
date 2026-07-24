# Hero 主按钮三语对齐实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将英文、中文和波斯语首页 Hero 主按钮统一移动到说明文案下方，并相对说明文案容器水平居中。

**Architecture:** 三种语言继续复用 `Hero` 组件。将说明文案与按钮包入一个具有语言对应最大宽度的纵向内容列，通过 `items-center` 让按钮以该列为基准居中；保留现有语言缩进、链接和交互样式。

**Tech Stack:** React、TypeScript、Tailwind CSS、Vitest、Testing Library、Vite

## Global Constraints

- 不修改三语内容数据、按钮链接或按钮交互。
- 不使用绝对定位或固定横向坐标移动按钮。
- 中文保留现有左侧缩进，波斯语保留 RTL 阅读方向。
- 桌面端与移动端均采用“说明文案在上、按钮在下”的顺序。

---

### Task 1: 让三语 Hero 按钮进入说明文案列

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `useI18n()` 提供的 `locale` 与 `siteContent.hero`
- Produces: `data-hero-copy-column` 与 `data-hero-description`，用于验证三语共享布局结构

- [ ] **Step 1: 写入失败测试**

在 `src/App.test.tsx` 中加入：

```tsx
it.each([
  ["English", "/"],
  ["Chinese", "/zh/"],
  ["Persian", "/fa/"],
])("centers the %s hero CTA below its supporting copy", (_language, pathname) => {
  window.history.replaceState({}, "", pathname);

  const { container } = renderApp();
  const copyColumn = container.querySelector("[data-hero-copy-column]") as HTMLElement;
  const description = copyColumn.querySelector("[data-hero-description]") as HTMLElement;
  const cta = copyColumn.querySelector("[data-hero-cta]") as HTMLElement;

  expect(copyColumn).toHaveClass("flex", "flex-col", "items-center");
  expect(copyColumn).toContainElement(description);
  expect(copyColumn).toContainElement(cta);
  expect(description.compareDocumentPosition(cta)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});
```

- [ ] **Step 2: 运行定向测试并确认失败**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL，因为 `data-hero-copy-column` 与 `data-hero-description` 尚不存在。

- [ ] **Step 3: 实现共享纵向文案列**

在 `src/components/Hero.tsx` 中：

```tsx
<div
  className={`mt-6 sm:mt-7 ${
    isChinese
      ? "ml-[clamp(0.9rem,4.5vw,2rem)] lg:ml-[clamp(2.375rem,3.9vw,4rem)]"
      : ""
  }`}
  data-hero-support
>
  <div
    className={`flex w-full flex-col items-center ${
      isChinese ? "max-w-[31rem]" : "max-w-[56rem]"
    }`}
    data-hero-copy-column
  >
    <p
      className="w-full font-sans text-[14px] leading-6 text-white/70 lg:text-[clamp(1.05rem,1.7vw,1.35rem)] lg:font-normal lg:leading-[1.55] lg:tracking-[-0.018em] lg:text-white/62"
      data-hero-description
    >
      {hero.description}
    </p>
    <a
      className="group mt-5 inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-joto-green px-6 py-3.5 font-sans text-[12px] font-bold uppercase tracking-[0.08em] text-[#070b0a] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-joto-green sm:mt-6"
      data-hero-cta
      href={hero.cta.href}
    >
      {hero.cta.label}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
        size={16}
      />
    </a>
  </div>
</div>
```

- [ ] **Step 4: 运行定向测试**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: PASS。

- [ ] **Step 5: 运行全量测试与生产构建**

Run:

```bash
npm test -- --run
npm run build
```

Expected: 所有测试通过，Vite 生产构建成功。

- [ ] **Step 6: 浏览器视觉验证**

在桌面端分别检查：

```text
/
/zh/
/fa/
```

并抽查移动端，确认按钮在说明文字下方、相对说明文字框居中，且无重叠或溢出。

- [ ] **Step 7: 提交**

```bash
git add src/App.test.tsx src/components/Hero.tsx docs/superpowers/plans/2026-07-24-hero-cta-alignment.md
git commit -m "fix: align trilingual hero CTA below copy"
```

- [ ] **Step 8: 推送并发布**

推送当前功能分支，使用干净构建结果更新 `PotatoWoman001.github.io` 的 `main` 分支，并等待 GitHub Pages 状态为 `built`。
