# Customer Logo Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清除客户 Logo 素材中的白色或浅灰底板与无效留白，并用有限的视觉尺寸档位让 42 个 Logo 在卡片中呈现接近的视觉重量。

**Architecture:** 素材层先将边缘连续浅色背景转换为透明并按 alpha 边界裁切；内容层为少数特殊比例 Logo 声明 `compact`、`standard` 或 `prominent` 档位；组件层只负责把档位映射为稳定的 Tailwind 类。现有滚动、卡片和灰度悬停交互保持不变。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library、Pillow（仅用于机械处理 PNG 素材）、Playwright 浏览器验证。

## Global Constraints

- 不更改客户名单、排序、卡片数量、滚动速度、页面文案和其他页面区块。
- 保留默认灰度、悬停恢复彩色的交互。
- 不给任何 Logo 新增白色底板。
- 标准横向 Logo 目标视觉高度约 32–36px；方形或徽章类约 38–42px。
- 仅处理 `joto-site-v2/src/assets/customer-logos/`、客户 Logo 数据、客户 Logo 墙组件及其测试和验证产物。

---

### Task 1: 清理 PNG 背景与画布留白

**Files:**
- Modify: `joto-site-v2/src/assets/customer-logos/*.png`

**Interfaces:**
- Consumes: 现有 PNG 的 RGBA 像素数据。
- Produces: 背景透明、按非透明内容裁切且四周保留 4px 安全边距的 PNG；文件名和导入路径不变。

- [ ] **Step 1: 记录处理前异常素材**

使用 Pillow 检查全部 PNG 的四角、alpha 覆盖率和近白像素比例。明确把 `bosch.png`、`sennics.png`、`changshu-bank.png`、`saint-gobain.png` 作为不透明浅色背景重点样本。

Run:

```bash
/Users/cuihua/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -c 'from PIL import Image; import glob,os; [print(os.path.basename(f), Image.open(f).convert("RGBA").getpixel((0,0))) for f in glob.glob("joto-site-v2/src/assets/customer-logos/*.png")]'
```

Expected: 四个重点样本的左上角 alpha 为 `255`，其余绝大多数素材为 `0`。

- [ ] **Step 2: 执行保守的浅色背景透明化与 alpha 裁切**

对四个重点样本，将接近中性白或浅灰的像素按亮度渐变转换为透明：仅处理 `min(R,G,B) >= 232` 且 `max(R,G,B)-min(R,G,B) <= 24` 的像素；`min >= 248` 时 alpha 设为 0，232–247 之间线性过渡。随后对全部 PNG 依据 alpha 非零区域裁切并添加 4px 透明安全边距。保留原始色彩模式为 RGBA，并覆盖原文件。

- [ ] **Step 3: 验证素材输出**

Run:

```bash
/Users/cuihua/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -c 'from PIL import Image; import glob,os; [print(os.path.basename(f), Image.open(f).mode, Image.open(f).size, Image.open(f).convert("RGBA").getpixel((0,0))) for f in glob.glob("joto-site-v2/src/assets/customer-logos/*.png")]'
```

Expected: 全部 PNG 为可透明显示的 RGBA 输出，四个重点样本四角 alpha 为 `0`，且没有素材内容贴到画布边缘。

- [ ] **Step 4: 暂存素材改动供后续视觉验证**

```bash
git add joto-site-v2/src/assets/customer-logos
```

### Task 2: 增加尺寸档位并用测试锁定映射

**Files:**
- Modify: `joto-site-v2/src/content/customerLogos.ts`
- Modify: `joto-site-v2/src/components/CustomerLogoWall.tsx`
- Modify: `joto-site-v2/src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `CustomerLogo` 的 `name` 和 `src`。
- Produces: `CustomerLogoScale = "compact" | "standard" | "prominent"`、可选字段 `scale?: CustomerLogoScale`，以及 `logoScaleClasses: Record<CustomerLogoScale, string>`。

- [ ] **Step 1: 写入失败测试**

为组件增加断言：Bosch 使用默认 `standard` 档，超宽 Logo（如 IMG Academy）使用 `prominent` 档，方形标志（如 Haday）使用 `compact` 档；每个 `<img>` 具有 `data-logo-scale`，同时继续验证 42 个可访问图片与隐藏循环副本。

```tsx
expect(screen.getByRole("img", { name: "Bosch logo" })).toHaveAttribute(
  "data-logo-scale",
  "standard",
);
expect(screen.getByRole("img", { name: "IMG Academy logo" })).toHaveAttribute(
  "data-logo-scale",
  "prominent",
);
expect(screen.getByRole("img", { name: "Haday logo" })).toHaveAttribute(
  "data-logo-scale",
  "compact",
);
```

- [ ] **Step 2: 运行测试确认失败**

Run:

```bash
cd joto-site-v2 && npm test -- CustomerLogoWall.test.tsx --run
```

Expected: FAIL，提示缺少 `data-logo-scale`。

- [ ] **Step 3: 实现尺寸档位**

在 `customerLogos.ts` 中定义：

```ts
export type CustomerLogoScale = "compact" | "standard" | "prominent";

export interface CustomerLogo {
  name: string;
  src: string;
  scale?: CustomerLogoScale;
}
```

默认使用 `standard`。方形、圆形或图形占比高的素材设置为 `compact`；超宽且字高偏小的素材设置为 `prominent`。组件映射为：

```ts
const logoScaleClasses: Record<CustomerLogoScale, string> = {
  compact: "max-h-10 max-w-[6.5rem] sm:max-h-[2.625rem] sm:max-w-[7rem]",
  standard: "max-h-9 max-w-[9.75rem] sm:max-h-10 sm:max-w-[10.5rem]",
  prominent: "max-h-8 max-w-[10.5rem] sm:max-h-9 sm:max-w-[11rem]",
};
```

图片保留 `w-auto object-contain opacity-70 grayscale brightness-50` 和现有 hover 类，并增加 `data-logo-scale={scale}`。

- [ ] **Step 4: 运行组件测试确认通过**

Run:

```bash
cd joto-site-v2 && npm test -- CustomerLogoWall.test.tsx --run
```

Expected: PASS，3 个测试全部通过。

- [ ] **Step 5: 运行完整测试与构建**

Run:

```bash
cd joto-site-v2 && npm test -- --run
cd joto-site-v2 && npm run build
```

Expected: 所有 Vitest 测试通过；TypeScript 与 Vite 生产构建成功。

### Task 3: 浏览器视觉验证与微调

**Files:**
- Modify if needed: `joto-site-v2/src/content/customerLogos.ts`
- Modify if needed: `joto-site-v2/src/components/CustomerLogoWall.tsx`
- Create: `joto-site-v2/output/customer-logo-wall-normalized.png`

**Interfaces:**
- Consumes: Task 1 的透明素材与 Task 2 的尺寸档位。
- Produces: 桌面预览截图和通过视觉检查的最终档位分配。

- [ ] **Step 1: 启动本地预览**

Run:

```bash
cd joto-site-v2 && npm run dev -- --host 127.0.0.1
```

Expected: Vite 输出可访问的本地端口。

- [ ] **Step 2: 打开专用预览页并冻结滚动**

访问 `/preview/customer-logo-wall`，设置桌面视口 1440×900；通过浏览器注入样式暂停 `.customer-logo-wall__track` 动画，确保两行 Logo 可稳定比较。

- [ ] **Step 3: 检查并微调档位**

重点检查 Bosch、Sennics、常熟农商银行和 Saint-Gobain 不再出现内部白色矩形；逐一比较相邻 Logo 的可见图形高度、最大宽度和左右安全区。若某 Logo 明显偏大或偏小，只在三个档位之间调整，不新增任意像素尺寸。

- [ ] **Step 4: 保存验证截图**

保存桌面截图到 `joto-site-v2/output/customer-logo-wall-normalized.png`，截图中至少包含两行完整可见的连续卡片。

- [ ] **Step 5: 最终回归**

Run:

```bash
cd joto-site-v2 && npm test -- --run
cd joto-site-v2 && npm run build
git diff --check
```

Expected: 测试、构建与 diff 格式检查全部通过。
