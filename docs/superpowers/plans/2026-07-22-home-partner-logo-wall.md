# Home Partner Logo Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页 Partners 区块改成紧凑、无等级标签的 19 品牌 Logo 墙，并按确认的业务优先级排序。

**Architecture:** 复用现有 `Vendor` 数据结构并增加可选 Logo 尺寸档位；从原始网站包迁入 7 个缺失素材；`Partners.tsx` 只渲染响应式 Logo 卡片并提供图片失败回退。解决方案区块中的合作等级数据保持不变。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library、Vite、Playwright。

## Global Constraints

- 首页前八个品牌顺序固定为 Cisco、Extreme Networks、Sangfor、Fortinet、Palo Alto Networks、KnowBe4、Verkada、Hikvision。
- 首页 Logo 卡片不显示 Partner、Gold Partner、Platinum Partner、品牌名称或说明文字。
- 不删除解决方案数据中的 `tier`，不改变菜单或解决方案区块的等级表现。
- 响应式网格为手机 2 列、平板 3 列、普通桌面 4 列、宽桌面 5 列。

---

### Task 1: 迁入缺失 Logo 并固定数据顺序

**Files:**
- Create: `joto-site-v2/src/assets/logos/knowbe4.svg`
- Create: `joto-site-v2/src/assets/logos/onelogin.svg`
- Create: `joto-site-v2/src/assets/logos/inspur.svg`
- Create: `joto-site-v2/src/assets/logos/vodia.svg`
- Create: `joto-site-v2/src/assets/logos/cyberdata.png`
- Create: `joto-site-v2/src/assets/logos/informacast.svg`
- Create: `joto-site-v2/src/assets/logos/keyking.png`
- Modify: `joto-site-v2/src/content/types.ts`
- Modify: `joto-site-v2/src/content/en.ts`
- Modify: `joto-site-v2/src/content/en.test.ts`

**Interfaces:**
- Produces: `Vendor.logoScale?: "compact" | "standard" | "wide"`；`siteContent.partners.items` 为 19 个均带 `logo` 的稳定数组。

- [ ] **Step 1: 写入数据失败测试**

在 `en.test.ts` 断言前八个品牌顺序以及所有 Partner 都有 Logo：

```ts
expect(siteContent.partners.items.slice(0, 8).map(({ name }) => name)).toEqual([
  "Cisco",
  "Extreme Networks",
  "Sangfor 深信服",
  "Fortinet",
  "Palo Alto Networks",
  "KnowBe4",
  "Verkada",
  "Hikvision",
]);
expect(siteContent.partners.items).toHaveLength(19);
expect(siteContent.partners.items.every(({ logo }) => Boolean(logo))).toBe(true);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd joto-site-v2 && npm test -- en.test.ts --run`

Expected: FAIL，现有顺序与 Logo 完整性不符合断言。

- [ ] **Step 3: 复制本地原始包素材**

从 `/Users/cuihua/Desktop/JOTO TECH/9. Vibe Coding/JOTO Cisco Solution - Persian/joto-website/public/logos/` 复制七个缺失文件到当前项目同名目录，不修改源包。

- [ ] **Step 4: 导入素材并重排数据**

给缺失 Vendor 增加 `logo`，把首页数组重排为：固定前八项，然后 Aruba、Check Point、OneLogin、Dell Technologies、Huawei、Inspur、AudioCodes、Vodia、CyberData、InformaCast、Keyking。把首页说明改为不声明等级的多厂商合作文案。

- [ ] **Step 5: 运行数据测试确认通过**

Run: `cd joto-site-v2 && npm test -- en.test.ts --run`

Expected: PASS。

### Task 2: 实现紧凑 Logo 墙

**Files:**
- Create: `joto-site-v2/src/components/Partners.test.tsx`
- Modify: `joto-site-v2/src/components/Partners.tsx`

**Interfaces:**
- Consumes: `siteContent.partners.items`、可选 `logoScale`。
- Produces: `#partners` 内 19 张 `data-partner-logo-card` 卡片；图片失败时显示品牌名。

- [ ] **Step 1: 写入组件失败测试**

测试 19 张卡片、前八张图片顺序、禁止出现等级与说明文案，以及图片 error 后品牌名回退。

```tsx
expect(container.querySelectorAll("[data-partner-logo-card]")).toHaveLength(19);
expect(screen.queryByText(/Gold Partner|Platinum Partner/)).not.toBeInTheDocument();
expect(screen.queryByText(siteContent.partners.items[0].description)).not.toBeInTheDocument();
fireEvent.error(screen.getByRole("img", { name: "Cisco logo" }));
expect(screen.getByText("Cisco")).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd joto-site-v2 && npm test -- Partners.test.tsx --run`

Expected: FAIL，现有组件仍显示等级、名称和说明，且没有卡片测试标记。

- [ ] **Step 3: 实现 Logo 卡片和响应式网格**

抽出内部 `PartnerLogoCard` 管理图片失败状态；使用 `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`。卡片高度 `h-24 md:h-28`，Logo 通过三档类控制最大尺寸，保留居中、低饱和默认态和悬停提亮。

- [ ] **Step 4: 压缩区块留白**

区块使用 `py-20 sm:py-24 md:py-28 lg:py-32`，Logo 墙使用 `mt-10 md:mt-14`，不再使用原来的 `min-h-40/44`、底部文字布局和等级徽章。

- [ ] **Step 5: 运行组件测试确认通过**

Run: `cd joto-site-v2 && npm test -- Partners.test.tsx --run`

Expected: PASS。

### Task 3: 回归与视觉验证

**Files:**
- Create: `joto-site-v2/output/playwright/partner-logo-wall-desktop.png`
- Create: `joto-site-v2/output/playwright/partner-logo-wall-mobile.png`

**Interfaces:**
- Produces: 1440px 桌面和 390px 手机验证截图。

- [ ] **Step 1: 运行完整测试和构建**

Run: `cd joto-site-v2 && npm test -- --run`；`cd joto-site-v2 && npm run build`

Expected: 全部测试通过，生产构建成功。

- [ ] **Step 2: 启动本地站点并打开首页 Partners 区块**

使用 Vite 和 Playwright 打开 `/#partners`，确认 19 张图片均成功加载。

- [ ] **Step 3: 桌面验证**

在 1440px 宽度确认宽桌面为 5 列、前八项顺序正确、卡片无任何等级或说明文字，并保存桌面截图。

- [ ] **Step 4: 手机验证**

在 390px 宽度确认 2 列布局、Logo 不溢出且卡片高度紧凑，并保存手机截图。

- [ ] **Step 5: 最终检查**

Run: `git diff --check`

Expected: 无空白错误。
