# Partner Case Logo Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为八个 Solution 代表项目板块接入经过官方来源核验的客户 Logo，并把所有标准 Logo 统一到与 Cisco 页面一致的 `150 × 48 px` 白色单色槽位。

**Architecture:** 官方 SVG/透明 PNG 本地化到独立的代表项目素材目录，`partnerCases.ts` 继续作为三语言共享的唯一 Logo 映射入口。`PartnerDetailPage` 只负责标准槽位、Harrow 竖版特例和文字回退；素材来源与未采用图片的原因记录在独立文档中。

**Tech Stack:** React 18、TypeScript、Vite 静态资源导入、Tailwind CSS、Vitest、Testing Library、浏览器响应式验收。

## Global Constraints

- 只使用客户官方网站、官方媒体资源页或官网当前实际使用的 Logo。
- 不使用百科、Logo 聚合站、搜索结果缩略图、社交媒体头像或 AI 生成素材。
- 官方来源无法核验时保留客户名称文字回退，不自行重绘。
- 标准 Logo 固定使用 `150 × 48 px` 槽位、保持比例、左对齐并以白色单色显示。
- Harrow International School 继续使用现有 `100 × 96 px` 竖版特例。
- 三种语言必须共用同一套 Logo 引用。
- 同一品牌在不同路由或不同法人条目中必须复用同一资源。
- 不修改代表项目文字、数量、顺序、项目归属或无项目页面的隐藏逻辑。
- 不修改首页客户 Logo 墙或 Cisco 既有素材。
- 保留工作区中与本任务无关的现有修改。

---

## 文件结构

- Create: `src/assets/customer-logos/partner-cases/dulwich-college-international.svg`
  - Dulwich College International 官网页头字标。
- Create: `src/assets/customer-logos/partner-cases/dfx-advance.svg`
  - DFX Advance 官网页头内联 SVG。
- Create: `src/assets/customer-logos/partner-cases/ssis.svg`
  - Shanghai Singapore International School 官网页头 Logo。
- Create: `src/assets/customer-logos/partner-cases/yk-pao-school.png`
  - Shanghai YK Pao School 官网页头 Logo。
- Create: `src/assets/customer-logos/partner-cases/bunge.svg`
  - Bunge 官网页头 Logo。
- Create: `src/assets/customer-logos/partner-cases/boston-scientific.svg`
  - Boston Scientific 官网页头 Logo。
- Create: `src/assets/customer-logos/partner-cases/zhongke-chuangwei.png`
  - 中科创威官网页头 Logo。
- Create: `src/assets/customer-logos/partner-cases/pall.png`
  - Pall 官网页头 Logo。
- Create: `docs/content-sources/partner-case-logos.md`
  - 记录十个图片品牌的官方页面、原始素材 URL、获取日期与处理方式，并记录 Quasar Medical、Jinnet 保留文字回退的原因。
- Modify: `src/content/partnerCases.test.ts`
  - 先定义 15 个项目的 Logo 覆盖、复用和三语言一致性要求。
- Modify: `src/content/partnerCases.ts`
  - 导入八个新增素材，复用现有 Starbucks 与 Amlogic 素材，为对应项目赋值并移除 Starbucks 彩色处理。
- Modify: `src/pages/PartnerDetailPage.test.tsx`
  - 验证标准与竖版槽位、单色处理和文字回退。
- Modify: `src/pages/PartnerDetailPage.tsx`
  - 将标准图片从最大尺寸约束改为固定 `150 × 48 px` 槽位。

### Task 1: 用测试锁定 Logo 覆盖与共享关系

**Files:**
- Modify: `src/content/partnerCases.test.ts`

**Interfaces:**
- Consumes: `getPartnerCases(pathname: string, locale: Locale): PartnerCaseStudy[]`
- Produces: 代表项目 Logo 覆盖、共享资源和三语言引用一致性的回归测试

- [ ] **Step 1: 编写失败的数据测试**

在 `src/content/partnerCases.test.ts` 增加：

```ts
const pathsWithProjects = [
  "/solutions/security/palo-alto-networks",
  "/solutions/security/knowbe4",
  "/solutions/network/extreme-networks",
  "/solutions/security/fortinet",
  "/solutions/network/aruba",
  "/solutions/network/sangfor",
  "/solutions/safeguarding/hikvision",
] as const;

it("uses verified local logos and keeps only unverified clients as text fallbacks", () => {
  const projects = pathsWithProjects.flatMap((path) => getPartnerCases(path, "en"));
  const withoutLogo = projects.filter(({ logo }) => !logo).map(({ client }) => client);

  expect(withoutLogo).toEqual(["Jinnet", "Quasar Medical"]);
  expect(projects.filter(({ logo }) => logo)).toHaveLength(13);
  expect(projects.every(({ logoTreatment }) => logoTreatment !== "brand")).toBe(true);
});

it("reuses shared brand assets and keeps logo references identical across locales", () => {
  const sangfor = getPartnerCases("/solutions/network/sangfor", "en");
  const hikvision = getPartnerCases("/solutions/safeguarding/hikvision", "en");
  const fortinet = getPartnerCases("/solutions/security/fortinet", "en");

  expect(sangfor[0].logo).toBe(sangfor[1].logo);
  expect(hikvision[0].logo).toBe(sangfor[0].logo);
  expect(hikvision[1].logo).toBe(fortinet[0].logo);

  for (const path of pathsWithProjects) {
    expect(getPartnerCases(path, "zh-CN").map(({ logo }) => logo)).toEqual(
      getPartnerCases(path, "en").map(({ logo }) => logo),
    );
    expect(getPartnerCases(path, "fa-IR").map(({ logo }) => logo)).toEqual(
      getPartnerCases(path, "en").map(({ logo }) => logo),
    );
  }
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/partnerCases.test.ts`

Expected: FAIL；缺少 Logo 的客户多于 `Jinnet` 和 `Quasar Medical`，并且 Starbucks 仍使用 `logoTreatment: "brand"`。

- [ ] **Step 3: 提交测试**

```bash
git add src/content/partnerCases.test.ts
git commit -m "test: define partner case logo coverage"
```

### Task 2: 本地化官方素材并接入项目数据

**Files:**
- Create: `src/assets/customer-logos/partner-cases/dulwich-college-international.svg`
- Create: `src/assets/customer-logos/partner-cases/dfx-advance.svg`
- Create: `src/assets/customer-logos/partner-cases/ssis.svg`
- Create: `src/assets/customer-logos/partner-cases/yk-pao-school.png`
- Create: `src/assets/customer-logos/partner-cases/bunge.svg`
- Create: `src/assets/customer-logos/partner-cases/boston-scientific.svg`
- Create: `src/assets/customer-logos/partner-cases/zhongke-chuangwei.png`
- Create: `src/assets/customer-logos/partner-cases/pall.png`
- Create: `docs/content-sources/partner-case-logos.md`
- Modify: `src/content/partnerCases.ts`

**Interfaces:**
- Consumes: 官网原始 SVG/PNG、现有 `starbucks.svg`、现有 `amlogic.png`
- Produces: 13 个带 Logo 的独立项目条目；Quasar Medical 与 Jinnet 保留无 `logo` 数据

- [ ] **Step 1: 下载并验证官方素材**

从以下已核验的官方 URL 获取素材：

```text
https://www.dulwich.org/images/dci-group-logo.svg
https://www.dfx-advance.com/  （页头第一个 91 × 40 内联 SVG）
https://www.ssis.asia/wp-content/uploads/2019/09/logo-full.svg
https://www.ykpaoschool.cn/Public/Uploads/uploadfile2/images/20190807/20190807143513_5d4a71211fb08.png
https://delivery.bunge.com/-/jssmedia/Feature/Components/Basic/Icons/NewLogo.ashx?iar=0&hash=F544E33B7C336344D37599CBB3053C28
https://www.bostonscientific.com/content/dam/logo-bsc.svg
https://omo-oss-image.thefastimg.com/portal-saas/new2023021718032447483/cms/image/ab9f5544-25cd-4a7c-8b08-c3aa03644bf1.png
https://www.pall.com/content/dam/pall/site-wide/navigation/Logo.png
```

Run:

```bash
file src/assets/customer-logos/partner-cases/*
```

Expected: Dulwich、DFX、SSIS、Bunge、Boston Scientific 被识别为 SVG；YK Pao School、中科创威、Pall 被识别为 PNG。

- [ ] **Step 2: 记录来源与回退原因**

创建 `docs/content-sources/partner-case-logos.md`，内容为：

```md
# Partner Case Logo Sources

核验日期：2026-07-24。所有图片均本地化，浏览器运行时不请求第三方资源。

| 品牌 | 复用项目 | 本地文件 | 官方页面 | 原始素材 | 显示处理 |
| --- | --- | --- | --- | --- | --- |
| Starbucks | Starbucks China | `src/assets/customer-logos/starbucks.svg` | `https://about.starbucks.com/multimedia/` | 官方当前 Siren 标识；复用项目既有矢量文件 | CSS 白色单色 |
| Dulwich College International | Dulwich College International Schools | `src/assets/customer-logos/partner-cases/dulwich-college-international.svg` | `https://www.dulwich.org/` | `https://www.dulwich.org/images/dci-group-logo.svg` | CSS 白色单色 |
| DFX Advance | DFX Labs Company Limited | `src/assets/customer-logos/partner-cases/dfx-advance.svg` | `https://www.dfx-advance.com/` | 官网页头第一个 `91 × 40` 内联 SVG | CSS 白色单色 |
| Shanghai Singapore International School | Shanghai Singapore International School (SSIS) | `src/assets/customer-logos/partner-cases/ssis.svg` | `https://www.ssis.asia/` | `https://www.ssis.asia/wp-content/uploads/2019/09/logo-full.svg` | CSS 白色单色 |
| Shanghai YK Pao School | Shanghai YK Pao School | `src/assets/customer-logos/partner-cases/yk-pao-school.png` | `https://www.ykpaoschool.cn/` | `https://www.ykpaoschool.cn/Public/Uploads/uploadfile2/images/20190807/20190807143513_5d4a71211fb08.png` | CSS 白色单色 |
| Bunge | Tianjin Bunge Foods | `src/assets/customer-logos/partner-cases/bunge.svg` | `https://www.bunge.com/` | `https://delivery.bunge.com/-/jssmedia/Feature/Components/Basic/Icons/NewLogo.ashx?iar=0&hash=F544E33B7C336344D37599CBB3053C28` | CSS 白色单色 |
| Amlogic | Amlogic (Shanghai) | `src/assets/customer-logos/amlogic.png` | `https://www.amlogic.com/` | `https://www.amlogic.com/webimages/logo.png` | CSS 白色单色 |
| Boston Scientific | Boston Scientific (Shanghai) | `src/assets/customer-logos/partner-cases/boston-scientific.svg` | `https://www.bostonscientific.com/en-US/home.html` | `https://www.bostonscientific.com/content/dam/logo-bsc.svg` | CSS 白色单色 |
| 中科创威 | Zhongke Chuangwei | `src/assets/customer-logos/partner-cases/zhongke-chuangwei.png` | `https://www.zkcv.com/` | `https://omo-oss-image.thefastimg.com/portal-saas/new2023021718032447483/cms/image/ab9f5544-25cd-4a7c-8b08-c3aa03644bf1.png` | CSS 白色单色 |
| Pall Corporation | Pall Filter (Beijing)、Pall (China) Investment | `src/assets/customer-logos/partner-cases/pall.png` | `https://www.pall.com/en/about-pall.html` | `https://www.pall.com/content/dam/pall/site-wide/navigation/Logo.png` | CSS 白色单色 |

## 文字回退

- Quasar Medical：官网受机器人验证保护，未取得可独立核验的官方 Logo 文件；保留客户名称文字。
- Jinnet / 上海观初网络科技有限公司：未找到可确认属于该客户的官方网站和官方 Logo 文件；保留客户名称文字。
```

- [ ] **Step 3: 接入项目数据**

在 `src/content/partnerCases.ts` 顶部加入：

```ts
import bostonScientificLogo from "../assets/customer-logos/partner-cases/boston-scientific.svg";
import bungeLogo from "../assets/customer-logos/partner-cases/bunge.svg";
import dfxAdvanceLogo from "../assets/customer-logos/partner-cases/dfx-advance.svg";
import dulwichLogo from "../assets/customer-logos/partner-cases/dulwich-college-international.svg";
import pallLogo from "../assets/customer-logos/partner-cases/pall.png";
import ssisLogo from "../assets/customer-logos/partner-cases/ssis.svg";
import ykPaoLogo from "../assets/customer-logos/partner-cases/yk-pao-school.png";
import zhongkeChuangweiLogo from "../assets/customer-logos/partner-cases/zhongke-chuangwei.png";
```

按客户设置：

```ts
// Starbucks China
logo: starbucksLogo,

// Dulwich College International
logo: dulwichLogo,

// DFX Labs Company Limited
logo: dfxAdvanceLogo,

// Shanghai Singapore International School
logo: ssisLogo,

// Shanghai YK Pao School
logo: ykPaoLogo,

// Tianjin Bunge Foods
logo: bungeLogo,

// Amlogic
logo: amlogicLogo,

// Boston Scientific
logo: bostonScientificLogo,

// Zhongke Chuangwei
logo: zhongkeChuangweiLogo,

// both Pall entries
logo: pallLogo,
```

删除 Starbucks 的 `logoTreatment: "brand"`。Quasar Medical 与 Jinnet 不设置 `logo`。

- [ ] **Step 4: 运行数据测试并确认通过**

Run: `npm test -- --run src/content/partnerCases.test.ts`

Expected: 8 tests PASS，且没有资源解析错误。

- [ ] **Step 5: 提交素材与数据**

```bash
git add src/assets/customer-logos/partner-cases docs/content-sources/partner-case-logos.md src/content/partnerCases.ts
git commit -m "feat: add official partner case logos"
```

### Task 3: 统一标准 Logo 槽位

**Files:**
- Modify: `src/pages/PartnerDetailPage.test.tsx`
- Modify: `src/pages/PartnerDetailPage.tsx`

**Interfaces:**
- Consumes: `PartnerCaseStudy.logo`、`PartnerCaseStudy.logoTreatment`
- Produces: `standard` 固定 `150 × 48 px`、`portrait` 固定 `100 × 96 px`、无 Logo 文字回退

- [ ] **Step 1: 编写失败的组件测试**

在 Cisco 测试的 Chewy Logo 断言中加入：

```ts
expect(chewyLogo).toHaveClass("h-12", "w-[150px]", "object-contain", "object-left");
expect(chewyLogo).not.toHaveClass("max-h-12", "w-auto", "max-w-[150px]");
expect(chewyLogo).toHaveAttribute("data-case-logo-size", "standard");
```

在 Palo Alto Networks 测试中加入：

```ts
const starbucksLogo = within(cases as HTMLElement).getByRole("img", {
  name: "Starbucks China logo",
});
expect(starbucksLogo).toHaveClass(
  "h-12",
  "w-[150px]",
  "object-contain",
  "object-left",
  "brightness-0",
  "invert",
);
expect(starbucksLogo).toHaveAttribute("data-logo-treatment", "monochrome");
```

增加文字回退测试：

```ts
it("keeps verified text fallbacks for clients without official logo files", () => {
  const { container } = renderDetail("/solutions/security/palo-alto-networks");
  const cases = container.querySelector("#partner-case-studies") as HTMLElement;

  expect(within(cases).getByText("Jinnet")).toHaveClass("text-sm", "font-semibold");
  expect(within(cases).queryByRole("img", { name: "Jinnet logo" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: FAIL；标准图片仍使用 `max-h-12 w-auto max-w-[150px]`，Starbucks 仍未使用默认单色处理。

- [ ] **Step 3: 实现固定标准槽位**

将 `PartnerDetailPage.tsx` 的标准 Logo 尺寸分支改为：

```tsx
className={`object-contain object-left opacity-90 ${
  isPortraitLogo ? "h-24 w-[100px]" : "h-12 w-[150px]"
} ${caseStudy.logoTreatment === "brand" ? "" : "brightness-0 invert"}`}
```

保留现有 `data-case-logo-size`、`data-logo-treatment`、`loading="lazy"` 和文字回退。

- [ ] **Step 4: 运行组件和数据测试**

Run:

```bash
npm test -- --run src/pages/PartnerDetailPage.test.tsx src/content/partnerCases.test.ts src/i18n/solutionProfiles.test.ts
```

Expected: 全部 PASS。

- [ ] **Step 5: 提交槽位调整**

```bash
git add src/pages/PartnerDetailPage.tsx src/pages/PartnerDetailPage.test.tsx
git commit -m "fix: normalize partner case logo sizing"
```

### Task 4: 完整验证与逐页浏览器验收

**Files:**
- Verify only

**Interfaces:**
- Consumes: 完成后的应用与八个项目路由
- Produces: 自动化、构建、桌面与移动端逐页验收结果

- [ ] **Step 1: 运行完整自动化验证**

Run:

```bash
npm test -- --run
npm run build
git diff --check
```

Expected: Vitest 全部 PASS；TypeScript 与 Vite 生产构建成功；`git diff --check` 无输出。

- [ ] **Step 2: 在 `1440 px` 桌面视口检查 Cisco 与八个路由**

依次检查：

```text
/zh/solutions/network/cisco#partner-case-studies
/zh/solutions/security/palo-alto-networks#partner-case-studies
/zh/solutions/security/knowbe4#partner-case-studies
/zh/solutions/network/extreme-networks#partner-case-studies
/zh/solutions/security/fortinet#partner-case-studies
/zh/solutions/network/aruba#partner-case-studies
/zh/solutions/network/sangfor#partner-case-studies
/zh/solutions/security/sangfor#partner-case-studies
/zh/solutions/safeguarding/hikvision#partner-case-studies
```

每页读取所有 `[data-case-logo-size="standard"]` 的边界，确认元素宽 `150 px`、高 `48 px`；Harrow 为宽 `100 px`、高 `96 px`。确认所有图片 `complete === true`、`naturalWidth > 0`，且控制台无图片加载错误。

- [ ] **Step 3: 在 `390 px` 移动视口检查八个新增路由**

确认：

- `document.documentElement.scrollWidth <= window.innerWidth`；
- 标准 Logo 仍为 `150 × 48 px`；
- 编号、Logo、客户标题和项目范围没有遮挡；
- Jinnet 与 Quasar Medical 显示文字回退。

- [ ] **Step 4: 抽查三语言共享**

检查以下页面：

```text
/solutions/network/extreme-networks#partner-case-studies
/zh/solutions/network/extreme-networks#partner-case-studies
/fa/solutions/network/extreme-networks#partner-case-studies
```

Expected: 三页 Logo 数量、`src` 文件集合和尺寸一致；波斯语 RTL 布局无水平溢出。

- [ ] **Step 5: 记录最终状态**

Run:

```bash
git status --short
git log --oneline -6
```

Expected: 只保留用户原有的无关未提交修改；本任务的设计、测试、素材、数据和组件修改均已提交。
