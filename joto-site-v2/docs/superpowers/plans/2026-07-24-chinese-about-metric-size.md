# Chinese About Metric Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 仅缩小中文首页 About 四个绿色指标值，保留英文和波斯语现有字号。

**Architecture:** `About` 从现有 `useI18n()` 读取 `locale`，中文版优先使用一条统一的小字号类；非中文继续走原有的文本长度分支。新增独立组件测试验证语言隔离，避免修改工作区内正在进行的 `App.test.tsx` 变更。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library

## Global Constraints

- 只修改中文版指标字号。
- 不修改卡片结构、文案、颜色、间距和动效。
- 不混入工作区其他未完成修改。

---

### Task 1: 增加中文专属指标字号

**Files:**
- Modify: `src/components/About.tsx`
- Create: `src/components/About.test.tsx`

**Interfaces:**
- Consumes: `useI18n().locale` 与 `siteContent.about.stats`
- Produces: `[data-about-stat-value]`，中文使用 `text-[clamp(2.1rem,3.25vw,3.25rem)]`

- [ ] **Step 1: 写失败测试**

```tsx
it("uses smaller metric values only on the Chinese homepage", () => {
  window.history.replaceState({}, "", "/zh/");
  const { container } = render(
    <I18nProvider>
      <About />
    </I18nProvider>,
  );

  container.querySelectorAll("[data-about-stat-value]").forEach((value) => {
    expect(value).toHaveClass("text-[clamp(2.1rem,3.25vw,3.25rem)]");
  });
});
```

另加英文断言，确认 `2010` 仍使用 `text-[clamp(2.8rem,4.8vw,4.5rem)]`。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/About.test.tsx`

Expected: FAIL，因为组件尚未提供 `data-about-stat-value` 与中文专属字号类。

- [ ] **Step 3: 实现语言隔离**

在 `About.tsx` 中读取 `locale`：

```tsx
const { locale, siteContent } = useI18n();
const isChinese = locale === "zh-CN";
```

指标值字号类优先判断中文：

```tsx
isChinese
  ? "text-[clamp(2.1rem,3.25vw,3.25rem)]"
  : isVeryLongValue
    ? "text-[clamp(1.6rem,3vw,3.15rem)]"
    : isLongValue
      ? "text-[clamp(1.85rem,3.4vw,3.6rem)]"
      : "text-[clamp(2.8rem,4.8vw,4.5rem)]"
```

- [ ] **Step 4: 验证**

Run: `npm test -- --run src/components/About.test.tsx`

Expected: PASS。

Run: `npm run build`

Expected: TypeScript 与 Vite production build 成功。

- [ ] **Step 5: 提交与发布**

仅提交本计划列出的四个文件，并从提交状态构建 GitHub Pages，防止带入其他未完成修改。
