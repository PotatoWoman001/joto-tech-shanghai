# Solution 详情页 CTA 标题字号统一实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 19 个厂商 Solution 详情页底部绿色 CTA 主标题统一缩小到与 03 服务板块标题相同的响应式字号。

**Architecture:** 19 个页面均由 `PartnerDetailPage` 渲染，因此只修改共享 CTA 标题的 Tailwind 字号类。先用组件测试锁定新字号，再做最小样式修改，并通过测试、构建和中英波三语页面视觉检查验证。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library、Vite

## Global Constraints

- 只影响 19 个厂商 Solution 详情页，不修改 Solution 分类总览页、About 页或其他绿色区域。
- CTA 主标题字号必须为 `clamp(2.25rem, 5.5vw, 5.75rem)`。
- 不修改 CTA 文案、说明文字、按钮、背景、间距、栅格布局、字重或颜色。
- 保留现有中文、英文和波斯文排版规则。

---

### Task 1: 统一共享 CTA 标题字号并完成验证

**Files:**
- Modify: `src/pages/PartnerDetailPage.test.tsx`
- Modify: `src/pages/PartnerDetailPage.tsx:430`

**Interfaces:**
- Consumes: `PartnerDetailPage` 的 `detail.ctaTitle: string` 与现有 Tailwind 响应式排版。
- Produces: 所有 19 个厂商详情页共享 `text-[clamp(2.25rem,5.5vw,5.75rem)]` 的 CTA 标题样式。

- [ ] **Step 1: 写入失败测试**

在 `src/pages/PartnerDetailPage.test.tsx` 的 `renders confirmed Extreme products without commercial amounts` 用例中，紧接 `cases` 定义后加入：

```tsx
const ctaTitle = screen.getByRole("heading", {
  level: 2,
  name: "让网络运营回归简单。",
});

expect(ctaTitle).toHaveClass("text-[clamp(2.25rem,5.5vw,5.75rem)]");
expect(ctaTitle).not.toHaveClass("text-[clamp(3.2rem,7.5vw,8rem)]");
```

- [ ] **Step 2: 运行测试并确认先失败**

Run:

```bash
npm test -- --run src/pages/PartnerDetailPage.test.tsx
```

Expected: FAIL，错误指出 CTA 标题缺少 `text-[clamp(2.25rem,5.5vw,5.75rem)]`，仍包含旧字号类。

- [ ] **Step 3: 实施最小样式修改**

在 `src/pages/PartnerDetailPage.tsx` 中将 CTA 标题改为：

```tsx
<h2 className="max-w-5xl text-[clamp(2.25rem,5.5vw,5.75rem)] font-medium leading-[0.86] tracking-[-0.07em]">
  {detail.ctaTitle}
</h2>
```

- [ ] **Step 4: 运行组件测试**

Run:

```bash
npm test -- --run src/pages/PartnerDetailPage.test.tsx
```

Expected: PASS，`PartnerDetailPage.test.tsx` 全部测试通过。

- [ ] **Step 5: 运行生产构建**

Run:

```bash
npm run build
```

Expected: `tsc --noEmit` 与 `vite build` 成功完成，退出码为 0。

- [ ] **Step 6: 启动本地预览并检查页面**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 3009
```

在桌面端检查：

```text
http://127.0.0.1:3009/zh/solutions/network/extreme-networks/
```

确认 CTA 标题“让网络运营回归简单。”计算字号最大为 `92px`，与 03 服务标题相同，并检查一个长标题详情页没有异常溢出：

```text
http://127.0.0.1:3009/zh/solutions/security/knowbe4/
```

将视口切换至移动端宽度 `390px`，确认 CTA 标题最小字号为 `36px`，无横向溢出。再检查英文或波斯文详情页，确认语言排版规则未受影响。

- [ ] **Step 7: 检查差异并提交**

Run:

```bash
git diff --check
git diff -- src/pages/PartnerDetailPage.tsx src/pages/PartnerDetailPage.test.tsx
git add src/pages/PartnerDetailPage.tsx src/pages/PartnerDetailPage.test.tsx
git commit -m "fix: reduce solution CTA title size"
```

Expected: 差异仅包含 CTA 字号测试与共享样式修改；提交成功。
