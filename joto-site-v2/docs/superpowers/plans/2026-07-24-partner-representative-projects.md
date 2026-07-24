# Partner Representative Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为八个厂商 Solution 路由增加来源可靠、三语言完整的代表项目板块，并让没有项目资料的页面继续隐藏该板块。

**Architecture:** 新增一个集中式 `partnerCases` 内容模块，使用逻辑厂商键维护本地化项目，并把八个路由映射到七组内容；两个 Sangfor 路由共享同一组数据。现有 `localizePartnerDetail` 负责将当前语言的项目注入 `PartnerDetail`，页面组件继续按 `cases.length` 使用现有布局和锚点行为。

**Tech Stack:** React 18、TypeScript、Vite、Vitest、Testing Library、现有自定义三语言路由与本地化层。

## Global Constraints

- 只展示用户资料中明确确认的客户、合作状态、产品、时间和数量。
- 不展示包玉刚实验学校采购成本、ECS Computers (HK) 协议归属或内部数据来源名称。
- 不为 Unite、上海东浙、江苏海德医学、晶晨半导体（深圳）、上海长锐或 Verkada 创建项目。
- 英文、中文、波斯语必须拥有相同项目数量和事实范围。
- 两个 Sangfor 路由必须复用同一组项目内容。
- 只复用现有星巴克与晶晨半导体 Logo，其余项目使用文字回退。
- 不修改现有 Cisco 项目数据与版式。
- 不新增运行时依赖，不修改客户 Logo 墙。
- 保留工作区中与本任务无关的现有修改。

---

## 文件结构

- Create: `src/content/partnerCases.ts`
  - 维护七组本地化项目数据、八个路由映射和 `getPartnerCases(pathname, locale)`。
- Create: `src/content/partnerCases.test.ts`
  - 验证数量、语言完整性、共享路由、排除项和敏感信息。
- Modify: `src/i18n/translations.ts`
  - 在三种语言下将集中式项目数据注入 `PartnerDetail`，生成本地化板块标题。
- Modify: `src/i18n/solutionProfiles.test.ts`
  - 移除“所有非 Cisco 页面 cases 必须为空”的旧断言，验证配置页面有项目、未配置页面为空。
- Modify: `src/pages/PartnerDetailPage.test.tsx`
  - 使用与生产一致的本地化详情数据，验证有项目和无项目页面的板块及首屏按钮。

### Task 1: 建立集中式三语言项目数据

**Files:**
- Create: `src/content/partnerCases.ts`
- Create: `src/content/partnerCases.test.ts`

**Interfaces:**
- Consumes: `Locale` from `src/i18n/routing.ts`
- Consumes: `PartnerCaseStudy` from `src/content/partners.ts`
- Produces: `getPartnerCases(pathname: string, locale: Locale): PartnerCaseStudy[]`

- [ ] **Step 1: 编写失败的数据测试**

创建 `src/content/partnerCases.test.ts`：

```ts
import { describe, expect, it } from "vitest";
import { getPartnerCases } from "./partnerCases";

const primaryPaths = [
  "/solutions/security/palo-alto-networks",
  "/solutions/security/knowbe4",
  "/solutions/network/extreme-networks",
  "/solutions/security/fortinet",
  "/solutions/network/aruba",
  "/solutions/security/sangfor",
  "/solutions/safeguarding/hikvision",
] as const;

describe("partner representative projects", () => {
  it("contains 15 unique source-backed projects", () => {
    expect(
      primaryPaths.reduce((total, path) => total + getPartnerCases(path, "en").length, 0),
    ).toBe(15);
  });

  it("keeps facts complete in every locale", () => {
    for (const locale of ["en", "zh-CN", "fa-IR"] as const) {
      for (const path of primaryPaths) {
        for (const project of getPartnerCases(path, locale)) {
          expect(project.client).toBeTruthy();
          expect(project.tag).toBeTruthy();
          expect(project.category).toBeTruthy();
          expect(project.brief).toBeTruthy();
          expect(project.scope.length).toBeGreaterThan(0);
          expect(project.scope.every(Boolean)).toBe(true);
        }
      }
    }
  });

  it("preserves confirmed Palo Alto and Extreme facts", () => {
    expect(JSON.stringify(getPartnerCases("/solutions/security/palo-alto-networks", "en")))
      .toContain("PA-5430");
    expect(JSON.stringify(getPartnerCases("/solutions/security/palo-alto-networks", "en")))
      .toContain("2022–2025");
    expect(JSON.stringify(getPartnerCases("/solutions/network/extreme-networks", "zh-CN")))
      .toContain("49 个");
    expect(JSON.stringify(getPartnerCases("/solutions/network/extreme-networks", "en")))
      .toContain("AP410C");
  });

  it("shares Sangfor projects across network and security routes", () => {
    expect(getPartnerCases("/solutions/network/sangfor", "zh-CN")).toEqual(
      getPartnerCases("/solutions/security/sangfor", "zh-CN"),
    );
  });

  it("returns no projects for omitted solutions and normalizes trailing slashes", () => {
    expect(getPartnerCases("/solutions/safeguarding/verkada", "zh-CN")).toEqual([]);
    expect(getPartnerCases("/solutions/server-storage/dell-technologies", "en")).toEqual([]);
    expect(getPartnerCases("/solutions/network/extreme-networks/", "en")).toEqual(
      getPartnerCases("/solutions/network/extreme-networks", "en"),
    );
  });

  it("does not publish internal commercial details or unsupported customers", () => {
    const published = JSON.stringify(
      primaryPaths.flatMap((path) => getPartnerCases(path, "zh-CN")),
    );
    expect(published).not.toMatch(/84|91|ECS|合同库|结构化数据库/);
    expect(published).not.toMatch(/Unite|上海东浙|江苏海德|晶晨半导体（深圳）|上海长锐/);
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/content/partnerCases.test.ts`

Expected: FAIL，错误指出 `./partnerCases` 模块不存在。

- [ ] **Step 3: 实现本地化数据模型和路由映射**

创建 `src/content/partnerCases.ts`，使用以下完整接口和映射：

```ts
import amlogicLogo from "../assets/customer-logos/amlogic.png";
import starbucksLogo from "../assets/customer-logos/starbucks.svg";
import type { Locale } from "../i18n/routing";
import type { PartnerCaseStudy } from "./partners";

type LocalizedText = Record<Locale, string>;

interface LocalizedPartnerCase {
  client: LocalizedText;
  tag: LocalizedText;
  category: LocalizedText;
  brief: LocalizedText;
  scope: LocalizedText[];
  logo?: string;
  logoTreatment?: PartnerCaseStudy["logoTreatment"];
}

type PartnerCaseGroup =
  | "paloAlto"
  | "knowBe4"
  | "extreme"
  | "fortinet"
  | "aruba"
  | "sangfor"
  | "hikvision";

const text = (en: string, zh: string, fa: string): LocalizedText => ({
  en,
  "zh-CN": zh,
  "fa-IR": fa,
});

const groupByPath: Record<string, PartnerCaseGroup> = {
  "/solutions/security/palo-alto-networks": "paloAlto",
  "/solutions/security/knowbe4": "knowBe4",
  "/solutions/network/extreme-networks": "extreme",
  "/solutions/security/fortinet": "fortinet",
  "/solutions/network/aruba": "aruba",
  "/solutions/network/sangfor": "sangfor",
  "/solutions/security/sangfor": "sangfor",
  "/solutions/safeguarding/hikvision": "hikvision",
};

export function getPartnerCases(pathname: string, locale: Locale): PartnerCaseStudy[] {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const group = groupByPath[normalizedPath];
  if (!group) return [];

  return partnerCaseGroups[group].map((project) => ({
    client: project.client[locale],
    tag: project.tag[locale],
    category: project.category[locale],
    brief: project.brief[locale],
    scope: project.scope.map((item) => item[locale]),
    logo: project.logo,
    logoTreatment: project.logoTreatment,
  }));
}
```

在同一文件的 `getPartnerCases` 之前定义 `partnerCaseGroups`。每条记录必须按下表使用完全一致的已确认事实：

| Group | Client | Tag | Category | Brief and scope facts |
| --- | --- | --- | --- | --- |
| paloAlto | Starbucks China / 星巴克（中国）有限公司 / استارباکس چین | Ongoing procurement & support / 持续采购与支持 / تأمین و پشتیبانی مستمر | Firewall Procurement & Lifecycle / 防火墙采购与生命周期 / تأمین و چرخه عمر فایروال | PA firewall procurement, maintenance renewals, XDR support, hardware replacement; PA-5430/5250/5220/3250; optical modules |
| paloAlto | Dulwich College International Schools / 德威国际学校系 / مدارس بین‌المللی کالج دالویچ | Pudong · Suzhou · Puxi / 浦东 · 苏州 · 浦西 / پودونگ · سوژو · پوشی | Firewall Renewal & Cloud Security / 防火墙续订与云安全 / تمدید فایروال و امنیت ابری | Firewall renewals and system modernization; Azure PA VM-100; PA-1410 |
| paloAlto | Jinnet / Jinnet 今网 / جین‌نت | Annual renewals, 2022–2025 / 2022–2025 每年续约 / تمدید سالانه، ۲۰۲۲ تا ۲۰۲۵ | Subscription Renewal / 订阅许可续保 / تمدید اشتراک | Palo Alto Networks support and license renewals; annual renewal continuity from 2022 through 2025 |
| knowBe4 | Quasar Medical / Quasar Medical（科凯生命科学） / کوآزار مدیکال | Ongoing cooperation / 持续合作 / همکاری مستمر | Human-Risk Security Program / 人因安全项目 / برنامه امنیت ریسک انسانی | Ongoing KnowBe4-related cooperation; continuing JOTO support |
| knowBe4 | DFX Labs Company Limited / DFX Labs Company Limited / شرکت DFX Labs | Active engagement / 活跃合作 / همکاری فعال | Human-Risk Security Program / 人因安全项目 / برنامه امنیت ریسک انسانی | Active KnowBe4-related engagement; current cooperation record |
| extreme | Shanghai Singapore International School (SSIS) / 上海新加坡外籍人员子女学校（SSIS） / مدرسه بین‌المللی سنگاپور شانگهای (SSIS) | 49 cloud subscriptions / 49 个云订阅许可 / ۴۹ اشتراک ابری | Cloud-Managed Campus Network / 云管理园区网络 / شبکه پردیس با مدیریت ابری | 49 XIQ-PIL-S-C-PWP cloud subscription licenses; JOTO reseller delivery; ExtremeCloud IQ subscription |
| extreme | Shanghai YK Pao School / 上海包玉刚实验学校 / مدرسه وای‌کی پائو شانگهای | Wired & wireless campus / 有线与无线园区 / پردیس سیمی و بی‌سیم | Campus Network Modernization / 园区网络升级 / نوسازی شبکه پردیس | AP410C, AP305C and AP-7612 access points; ERS 4950GTS-PWR+ switches; XIQ cloud subscriptions |
| fortinet | Tianjin Bunge Foods / 天津邦士食品有限公司 / صنایع غذایی بانج تیانجین | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Fortinet Security Project / Fortinet 安全项目 / پروژه امنیتی Fortinet | Confirmed Fortinet-related security cooperation |
| fortinet | Amlogic (Shanghai) / 晶晨半导体（上海）股份有限公司 / آملوجیک (شانگهای) | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Fortinet Security Project / Fortinet 安全项目 / پروژه امنیتی Fortinet | Confirmed Fortinet-related security cooperation; use `amlogicLogo` |
| aruba | Boston Scientific (Shanghai) / 波士顿科学（上海）有限公司 / بوستون ساینتیفیک (شانگهای) | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Aruba Network Project / Aruba 网络项目 / پروژه شبکه Aruba | Confirmed Aruba-related network cooperation |
| aruba | Zhongke Chuangwei / 中科创威 / ژونگ‌که چوانگ‌وی | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Aruba Network Project / Aruba 网络项目 / پروژه شبکه Aruba | Confirmed Aruba-related network cooperation |
| sangfor | Pall Filter (Beijing) / 颇尔过滤器（北京）有限公司 / پال فیلتر (پکن) | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Sangfor Technology Project / 深信服技术项目 / پروژه فناوری Sangfor | Confirmed Sangfor-related technology cooperation |
| sangfor | Pall (China) Investment / 颇尔（中国）投资有限公司 / سرمایه‌گذاری پال (چین) | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Sangfor Technology Project / 深信服技术项目 / پروژه فناوری Sangfor | Confirmed Sangfor-related technology cooperation |
| hikvision | Pall (China) Investment / 颇尔（中国）投资有限公司 / سرمایه‌گذاری پال (چین) | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Hikvision Physical Security Project / 海康威视物理安防项目 / پروژه امنیت فیزیکی Hikvision | Confirmed Hikvision-related physical-security cooperation |
| hikvision | Tianjin Bunge Foods / 天津邦士食品有限公司 / صنایع غذایی بانج تیانجین | Confirmed cooperation / 已确认合作 / همکاری تأییدشده | Hikvision Physical Security Project / 海康威视物理安防项目 / پروژه امنیت فیزیکی Hikvision | Confirmed Hikvision-related physical-security cooperation |

为每条英文、中文和波斯语 `brief` 写成完整自然句，`scope` 只拆分上表列出的事实。星巴克记录使用 `starbucksLogo`，晶晨半导体记录使用 `amlogicLogo`；两者不设置 `logoTreatment: "brand"`，继续使用现有单色反白处理。

- [ ] **Step 4: 运行数据测试并确认通过**

Run: `npm test -- --run src/content/partnerCases.test.ts`

Expected: 6 tests PASS。

- [ ] **Step 5: 提交数据模块**

```bash
git add src/content/partnerCases.ts src/content/partnerCases.test.ts
git commit -m "feat: add localized partner project data"
```

### Task 2: 将代表项目接入三语言厂商详情

**Files:**
- Modify: `src/i18n/translations.ts:194-267`
- Modify: `src/i18n/solutionProfiles.test.ts`

**Interfaces:**
- Consumes: `getPartnerCases(pathname: string, locale: Locale): PartnerCaseStudy[]`
- Produces: `localizePartnerDetail(locale, detail)` 在三个 locale 下返回正确 `cases`

- [ ] **Step 1: 更新失败的本地化测试**

在 `src/i18n/solutionProfiles.test.ts` 中删除 `expect(detail.cases).toEqual([])`，并增加：

```ts
const projectPaths = new Set([
  "/solutions/network/extreme-networks",
  "/solutions/network/aruba",
  "/solutions/network/sangfor",
  "/solutions/security/knowbe4",
  "/solutions/security/palo-alto-networks",
  "/solutions/security/fortinet",
  "/solutions/security/sangfor",
  "/solutions/safeguarding/hikvision",
]);

it.each(["en", "zh-CN", "fa-IR"] as const)(
  "keeps representative projects available in %s",
  (locale) => {
    for (const detail of nonCiscoDetails) {
      const localized = localizePartnerDetail(locale, detail)!;
      if (projectPaths.has(detail.pathname)) {
        expect(localized.cases.length).toBeGreaterThan(0);
        expect(localized.casesTitle).toContain(detail.partnerName.split(" ")[0]);
      } else {
        expect(localized.cases).toEqual([]);
      }
    }
  },
);
```

在原有中文与波斯语完整性循环中，将空数组断言替换为：

```ts
expect(detail.cases.length > 0).toBe(projectPaths.has(detail.pathname));
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/i18n/solutionProfiles.test.ts`

Expected: FAIL，因为英文仍直接返回基础数据，中文与波斯语仍强制清空 `cases`。

- [ ] **Step 3: 接入集中式项目数据**

在 `src/i18n/translations.ts` 顶部加入：

```ts
import { getPartnerCases } from "../content/partnerCases";
```

将 `localizePartnerDetail` 开头改为：

```ts
export function localizePartnerDetail(
  locale: Locale,
  detail: PartnerDetail | undefined,
): PartnerDetail | undefined {
  if (!detail) return detail;
  const partnerCases = getPartnerCases(detail.pathname, locale);

  if (locale === "en") {
    if (partnerCases.length === 0) return detail;
    return {
      ...detail,
      casesEyebrow: "Representative Projects",
      casesTitle: `${detail.partnerName} capabilities, proven through real projects.`,
      casesDescription:
        "Selected customer environments where JOTO has delivered or supported the partner technology.",
      cases: partnerCases,
    };
  }

  const translated = translateObject(locale, detail);
  if (detail.pathname === "/solutions/network/cisco") return translated;
```

在非 Cisco 返回对象中将项目字段改为：

```ts
casesEyebrow: zhLocale ? "代表项目" : "پروژه‌های منتخب",
casesTitle: zhLocale
  ? `经过实际项目验证的 ${partner} 能力。`
  : `توانمندی‌های ${partner}، اثبات‌شده در پروژه‌های واقعی.`,
casesDescription:
  partnerCases.length === 0
    ? ""
    : zhLocale
      ? `以下客户项目展示 JOTO 在 ${partner} 技术交付与支持方面的实践。`
      : `این پروژه‌های مشتری، تجربه JOTO در تحویل و پشتیبانی فناوری ${partner} را نشان می‌دهند.`,
cases: partnerCases,
```

- [ ] **Step 4: 运行数据与本地化测试**

Run: `npm test -- --run src/content/partnerCases.test.ts src/i18n/solutionProfiles.test.ts src/i18n/I18nProvider.test.ts`

Expected: 全部 PASS。

- [ ] **Step 5: 提交本地化接入**

```bash
git add src/i18n/translations.ts src/i18n/solutionProfiles.test.ts
git commit -m "feat: localize partner project sections"
```

### Task 3: 验证页面板块与首屏跳转

**Files:**
- Modify: `src/pages/PartnerDetailPage.test.tsx`

**Interfaces:**
- Consumes: `localizePartnerDetail(locale, getPartnerDetail(pathname))`
- Verifies: 现有 `PartnerDetailPage` 对有项目和无项目详情的条件渲染

- [ ] **Step 1: 让页面测试使用生产数据路径**

导入 `localizePartnerDetail`：

```ts
import { localizePartnerDetail } from "../i18n/translations";
```

将测试助手改为：

```ts
function renderDetail(pathname: string, locale: "en" | "zh-CN" | "fa-IR" = "en") {
  const detail = localizePartnerDetail(locale, getPartnerDetail(pathname));
  expect(detail).toBeDefined();

  return {
    detail: detail!,
    ...render(
      <I18nProvider>
        <PartnerDetailPage detail={detail!} />
      </I18nProvider>,
    ),
  };
}
```

- [ ] **Step 2: 更新 Palo Alto 旧断言并增加项目断言**

在 Palo Alto 测试中把：

```ts
expect(
  screen.getByRole("link", { name: /Explore Palo Alto Networks services/i }),
).toHaveAttribute("href", "#partner-services");
expect(container.querySelector("#partner-case-studies")).not.toBeInTheDocument();
```

替换为：

```ts
expect(
  screen.getByRole("link", { name: /View Palo Alto Networks case studies/i }),
).toHaveAttribute("href", "#partner-case-studies");
const cases = container.querySelector("#partner-case-studies");
expect(cases).toBeInTheDocument();
expect(within(cases as HTMLElement).getAllByRole("article")).toHaveLength(3);
expect(within(cases as HTMLElement).getByText("PA-5430 / PA-5250 / PA-5220 / PA-3250"))
  .toBeInTheDocument();
expect(within(cases as HTMLElement).getByText(/2022–2025/)).toBeInTheDocument();
```

- [ ] **Step 3: 增加 Extreme、Sangfor、多语言和空板块测试**

```ts
it("renders confirmed Extreme products without commercial amounts", () => {
  const { container } = renderDetail("/solutions/network/extreme-networks", "zh-CN");
  const cases = container.querySelector("#partner-case-studies");
  expect(within(cases as HTMLElement).getByText(/49 个 XIQ-PIL-S-C-PWP/)).toBeInTheDocument();
  expect(within(cases as HTMLElement).getByText(/AP410C、AP305C/)).toBeInTheDocument();
  expect(cases).not.toHaveTextContent(/84|91|ECS/);
});

it("reuses the same customers on both Sangfor solution routes", () => {
  const network = localizePartnerDetail(
    "zh-CN",
    getPartnerDetail("/solutions/network/sangfor"),
  )!;
  const security = localizePartnerDetail(
    "zh-CN",
    getPartnerDetail("/solutions/security/sangfor"),
  )!;
  expect(network.cases.map(({ client }) => client)).toEqual(
    security.cases.map(({ client }) => client),
  );
});

it.each(["en", "zh-CN", "fa-IR"] as const)(
  "keeps Palo Alto projects visible in %s",
  (locale) => {
    const detail = localizePartnerDetail(
      locale,
      getPartnerDetail("/solutions/security/palo-alto-networks"),
    )!;
    expect(detail.cases).toHaveLength(3);
    expect(detail.cases.every((project) => project.brief && project.scope.length > 0)).toBe(true);
  },
);

it("keeps project-free solution pages focused on services", () => {
  const { container } = renderDetail("/solutions/safeguarding/verkada");
  expect(container.querySelector("#partner-case-studies")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Explore Verkada services/i })).toHaveAttribute(
    "href",
    "#partner-services",
  );
});
```

- [ ] **Step 4: 运行页面测试**

Run: `npm test -- --run src/pages/PartnerDetailPage.test.tsx`

Expected: 全部 PASS；如果确切 scope 文本因自然标点不同导致查询失败，使用与最终公开文案完全一致的字符串更新断言，不降低事实断言范围。

- [ ] **Step 5: 提交页面测试**

```bash
git add src/pages/PartnerDetailPage.test.tsx
git commit -m "test: cover partner project sections"
```

### Task 4: 完整验证与浏览器检查

**Files:**
- Verify: `src/content/partnerCases.ts`
- Verify: `src/i18n/translations.ts`
- Verify: `src/pages/PartnerDetailPage.tsx`

**Interfaces:**
- Consumes: 完成后的数据、本地化和页面条件渲染
- Produces: 可交付的三语言代表项目体验

- [ ] **Step 1: 运行完整自动化测试**

Run: `npm test -- --run`

Expected: 所有测试文件 PASS。

- [ ] **Step 2: 运行 TypeScript 检查**

Run: `npx tsc --noEmit`

Expected: exit 0。

- [ ] **Step 3: 运行生产构建**

Run: `npm run build`

Expected: Vite production build succeeds。

- [ ] **Step 4: 启动或复用本地开发服务**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite 输出可访问的本地 URL。

- [ ] **Step 5: 浏览器检查关键页面**

检查以下页面的桌面视口与移动视口：

- `/zh/solutions/security/palo-alto-networks`
- `/solutions/network/extreme-networks`
- `/fa/solutions/security/sangfor`
- `/zh/solutions/safeguarding/verkada`

确认：

- 有数据页面出现代表项目标题、正确客户数和首屏案例锚点。
- Palo Alto 型号、Extreme 许可数量和产品型号不溢出。
- 波斯语项目内容保持 RTL，编号、Logo/文字回退和项目列对齐。
- Verkada 不出现代表项目标题或空白区，首屏按钮指向服务区。
- 页面没有横向滚动条。

- [ ] **Step 6: 检查最终差异**

Run: `git diff --check`

Expected: 无空白错误。

Run: `git status --short`

Expected: 只看到用户原有未提交文件和本任务明确产生的文件；没有截图或构建产物被暂存。

