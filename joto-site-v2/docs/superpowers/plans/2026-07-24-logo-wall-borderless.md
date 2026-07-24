# Logo Wall Borderless Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 移除 Logo Wall 上下两条细线，同时保留现有视觉和交互。

**Architecture:** 仅调整现有 `.customer-logo-wall__ribbon` 样式，不改变组件结构或数据。通过移除上下内阴影消除边界线。

**Tech Stack:** React、TypeScript、CSS、Vitest、Vite

## Global Constraints

- 不修改 Logo 数据、滚动速度、左右渐隐及响应式尺寸。
- 不混入工作区内其他尚未提交的改动。

---

### Task 1: 移除 Logo Wall 上下内描边

**Files:**
- Modify: `src/index.css:645-653`
- Test: `src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `.customer-logo-wall__ribbon`
- Produces: 无上下内描边的暗色玻璃 Logo Wall

- [ ] **Step 1: 修改样式**

删除以下声明：

```css
box-shadow:
  inset 0 1px rgba(255, 255, 255, 0.025),
  inset 0 -1px rgba(255, 255, 255, 0.018);
```

- [ ] **Step 2: 运行组件测试**

Run: `npm test -- --run src/components/CustomerLogoWall.test.tsx`

Expected: 4 tests pass.

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`

Expected: Vite build succeeds.

- [ ] **Step 4: 提交**

```bash
git add src/index.css docs/superpowers/specs/2026-07-24-logo-wall-borderless-design.md docs/superpowers/plans/2026-07-24-logo-wall-borderless.md
git commit -m "fix: soften customer logo wall edges"
```
