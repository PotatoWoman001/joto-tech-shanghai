# Customer Logo Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在独立分支中实现一个默认不出现在正式首页、可单独预览并可通过功能开关接入首页的 42 品牌双行滚动 Logo 墙。

**Architecture:** `CustomerLogoWall` 是无路由、无网络请求的纯展示组件，数据由 `customerLogos.ts` 提供，本地素材由 `customer-logo-wall.md` 记录来源。`App` 负责预览路由和首页功能开关，动画仅由现有 CSS 实现，减少动态效果时切换为静态横向列表。

**Tech Stack:** React 18、TypeScript 5.6、Vite 5、Tailwind CSS 3、Vitest、Testing Library。

## Global Constraints

- 所有实现只进入 `codex/joto-logo-wall`，不得修改当前首页工作分支。
- `featureFlags.customerLogoWall` 默认必须为 `false`。
- 预览路径固定为 `/preview/customer-logo-wall`，不加入主导航。
- 品牌显示名使用 `FORVIA` 和 `Guolian Minsheng Securities`，不使用 `Faurecia` 或旧 `Guolian Securities`。
- 标题固定为 `TRUSTED BY INDUSTRY LEADERS`，不使用未经逐项证明的 `Trusted by Fortune 500`。
- 浏览器运行时不得请求第三方 Logo；所有素材必须位于 `src/assets/customer-logos/`。
- 不增加动画、轮播或图片处理依赖。
- `prefers-reduced-motion: reduce` 下不得持续滚动。
- 单张栅格 Logo 不得超过 250 KB；SVG 不得包含脚本、远程引用或内嵌栅格数据。
- 除 `git add`/`git commit` 外，计划中的 `npm`、`find`、`rg` 和开发服务器命令均从 `joto-site-v2/` 执行；Git 命令从工作树根目录执行。

---

## File Map

- Create `joto-site-v2/src/assets/customer-logos/*`：42 个本地 Logo 文件。
- Create `joto-site-v2/src/content/customerLogos.ts`：唯一品牌数据和两行分组。
- Create `joto-site-v2/src/content/customerLogos.test.ts`：数量、名称、文件本地化约束。
- Create `joto-site-v2/src/components/CustomerLogoWall.tsx`：Logo 墙语义、循环副本和失败降级。
- Create `joto-site-v2/src/components/CustomerLogoWall.test.tsx`：可访问性、唯一品牌和失败降级测试。
- Create `joto-site-v2/src/config/features.ts`：默认关闭的首页功能开关。
- Create `joto-site-v2/src/pages/CustomerLogoWallPreviewPage.tsx`：独立预览页。
- Modify `joto-site-v2/src/App.tsx`：预览路由和功能开关接入。
- Modify `joto-site-v2/src/App.test.tsx`：默认关闭、开启顺序和预览路由测试。
- Modify `joto-site-v2/src/index.css`：双行滚动、边缘渐隐和减少动态效果规则。
- Create `joto-site-v2/docs/content-sources/customer-logo-wall.md`：42 个品牌的素材来源与更名记录。

---

### Task 1: Build the verified local asset set and content contract

**Files:**
- Create: `joto-site-v2/src/assets/customer-logos/*`
- Create: `joto-site-v2/src/content/customerLogos.ts`
- Create: `joto-site-v2/src/content/customerLogos.test.ts`
- Create: `joto-site-v2/docs/content-sources/customer-logo-wall.md`

**Interfaces:**
- Produces: `CustomerLogo { name: string; src: string }`
- Produces: `customerLogoRows: readonly [readonly CustomerLogo[], readonly CustomerLogo[]]`
- Consumes: 本计划 Global Constraints 和已批准设计规格。

- [ ] **Step 1: Copy/download the exact asset inventory into the local folder**

Create `joto-site-v2/src/assets/customer-logos/` and use these exact target filenames:

```text
mcdonalds.svg                 starbucks.svg
booking.svg                   mondelez.png
haday.png                     huawei.svg
saint-gobain.png              ecovacs.svg
cartier.svg                   shanghai-tower.png
delphi.svg                    chewy.svg
huaan-funds.png               fullgoal-fund.png
cicc.svg                      chinaamc.png
xinjiang-bank.png             changshu-bank.png
manulife-sinochem.png         guolian-minsheng.png
orange.png                    bloomage.png
forvia.png                    img-academy.png
yuwell.png                    innovent.png
wuxi-apptec.png               fosun-pharma.png
mevion.png                    by-health.png
jiahua-chemicals.png          amlogic.png
beckman-coulter.svg           cepheid.svg
danaher.svg                   ubs.svg
henlius.png                   gilead.png
sennics.png                   chn-energy.svg
bosch.svg                     bekaert.svg
```

Use the official/current source already verified during research. The provenance document must contain this complete mapping:

```markdown
| Display name | Target file | Source |
|---|---|---|
| McDonald’s | mcdonalds.svg | https://joto.ai/logos/mcdonalds.svg |
| Starbucks | starbucks.svg | Existing project SVG, verified against https://www.starbucks.com/ on 2026-07-22 |
| Booking.com | booking.svg | https://content.presspage.com/templates/50/2962/744836/booking_logo--blue.svg?1 |
| Mondelēz International | mondelez.png | `MDLZ Logo RGB.png` from https://assets.ctfassets.net/zo243s55pyir/6wSqM76m08pK4KW4zYJTfz/45477dedaeb56d38f4f45aee465f8bc1/MDLZ_Logo.zip |
| Haitian / Haday | haday.png | https://joto.ai/logos/haitian.png; checked against https://www.haday.com/ |
| Huawei | huawei.svg | https://joto.ai/logos/huawei.svg; checked against https://www.huawei.com/ |
| Saint-Gobain | saint-gobain.png | Current homepage mark from https://www.saint-gobain.com/ |
| ECOVACS | ecovacs.svg | https://joto.ai/logos/ecovacs.svg |
| Cartier | cartier.svg | https://joto.ai/logos/cartier.svg |
| Shanghai Tower | shanghai-tower.png | https://joto.ai/logos/shanghaitower.png |
| Delphi | delphi.svg | https://www.delphiautoparts.com/ResourcePackages/Delphi/dist/a1d6c1389a3f6b5a43bd.svg |
| Chewy | chewy.svg | Existing project SVG, verified against https://www.chewy.com/ on 2026-07-22 |
| HuaAn Funds | huaan-funds.png | https://www.huaan.com.cn/img/home_nav_logo.png |
| Fullgoal Fund | fullgoal-fund.png | https://joto.ai/logos/fullgoal.png |
| CICC | cicc.svg | https://companieslogo.com/img/orig/601995.SS_BIG-3280fdcd.svg?t=1749312792&download=true; checked against https://www.cicc.com.cn/ |
| ChinaAMC | chinaamc.png | https://joto.ai/logos/chinaamc.png |
| Xinjiang Bank | xinjiang-bank.png | https://www.xjbank.com/statics/img/logo.11a33ed0.png |
| Changshu Rural Commercial Bank | changshu-bank.png | Combined current header mark from https://www.csrcbank.com/ |
| Manulife-Sinochem | manulife-sinochem.png | https://www.manulife-sinochem.com/html/zh/static/image/logo-green_2022.png |
| Guolian Minsheng Securities | guolian-minsheng.png | Current 2025 mark from https://www.glms.com.cn/; cross-check image https://jy.qztc.edu.cn/attachment/qztc/company/202504/25/B0xtE85bqF5l.png |
| Orange | orange.png | https://www.orange.com/themes/theme_boosted/Small_Logo_RGB.png |
| Bloomage | bloomage.png | https://joto.ai/logos/bloomage.png |
| FORVIA | forvia.png | https://joto.ai/logos/forvia.png; checked against https://www.forvia.com/ |
| IMG Academy | img-academy.png | https://www.imgacademy.com/sites/default/files/IMGAplus_Branding2024_Logo_Primary_Blue.png |
| Yuwell | yuwell.png | https://joto.ai/logos/yuwell.png |
| Innovent | innovent.png | https://joto.ai/logos/innovent.png |
| WuXi AppTec | wuxi-apptec.png | https://joto.ai/logos/wuxiapptec.png |
| Fosun Pharma | fosun-pharma.png | https://www.fosunpharma.com/images/logo.png |
| Mevion | mevion.png | https://joto.ai/logos/mevion.png |
| BY-HEALTH | by-health.png | https://joto.ai/logos/byhealth.png |
| Jiahua Chemicals | jiahua-chemicals.png | https://www.jiahua.com/UpLoadFile/20250208/642754ad-67ec-492b-b43c-b235515ec963.png |
| Amlogic | amlogic.png | https://www.amlogic.com/webimages/logo.png |
| Beckman Coulter | beckman-coulter.svg | https://media.beckmancoulter.com/-/media/diagnostics/corporate/logos/beckman-logo-svg.svg?rev=a82dc0186fca49bbab9ea6c0f4baba4c |
| Cepheid | cepheid.svg | https://www.cepheid.com/content/dam/www-cepheid-com/images/logos/logo-light-regular.svg |
| Danaher | danaher.svg | https://www.danaher.com/themes/custom/danaher/logo.svg |
| UBS | ubs.svg | https://www.ubs.com/etc.clientlibs/ubs/fit/design/resources/img/logo/UBS_Logo_Semibold.svg |
| Henlius | henlius.png | https://www.henlius.com/images/logo.png |
| Gilead | gilead.png | https://gilead.stylelabs.cloud/api/public/content/c77b5bddc2524cd1bcfe0d0d1288027f?v=a5ef68f5 |
| Sennics | sennics.png | https://cdn.adsalecdn.com/PUB/AdsaleCPRJ/2024/12/23/cNFYYNAd3KamtTayPaMFQPZp6ue5NVZIrxmd6MpL.jpg; current mark verified against https://www.sennics.com/ and China Sinochem |
| CHN Energy | chn-energy.svg | https://www.chnenergy.com.cn/xhtml/newimages/logo_black.svg |
| Bosch | bosch.svg | Current inline corporate SVG from https://www.bosch.com/ |
| Bekaert | bekaert.svg | https://www.bekaert.com/content/dam/corporate/en/icons/Bekaert-blue-logo.svg |
```

For source files that contain a large white canvas, crop only transparent/blank margins. Preserve original colors and proportions. Do not redraw the mark.

- [ ] **Step 2: Write the failing content-contract test**

Create `joto-site-v2/src/content/customerLogos.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { customerLogoRows } from "./customerLogos";

describe("customer logo content", () => {
  it("contains two balanced rows and 42 unique current brand names", () => {
    const logos = customerLogoRows.flat();
    const names = logos.map((logo) => logo.name);

    expect(customerLogoRows).toHaveLength(2);
    expect(customerLogoRows[0]).toHaveLength(21);
    expect(customerLogoRows[1]).toHaveLength(21);
    expect(logos).toHaveLength(42);
    expect(new Set(names).size).toBe(42);
    expect(names).toContain("FORVIA");
    expect(names).toContain("Guolian Minsheng Securities");
    expect(names).not.toContain("Faurecia");
    expect(names).not.toContain("Guolian Securities");
  });

  it("uses local bundled asset URLs only", () => {
    for (const logo of customerLogoRows.flat()) {
      expect(logo.src).not.toMatch(/^https?:/);
      expect(logo.src).toMatch(/\.(png|svg)$/);
    }
  });
});
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run:

```bash
npm test -- --run src/content/customerLogos.test.ts
```

Expected: FAIL because `./customerLogos` does not exist.

- [ ] **Step 4: Implement the complete content model**

Create `joto-site-v2/src/content/customerLogos.ts` with all 42 imports and exact row membership:

```ts
import amlogic from "../assets/customer-logos/amlogic.png";
import bekaert from "../assets/customer-logos/bekaert.svg";
import beckmanCoulter from "../assets/customer-logos/beckman-coulter.svg";
import bloomage from "../assets/customer-logos/bloomage.png";
import booking from "../assets/customer-logos/booking.svg";
import bosch from "../assets/customer-logos/bosch.svg";
import byHealth from "../assets/customer-logos/by-health.png";
import cartier from "../assets/customer-logos/cartier.svg";
import changshuBank from "../assets/customer-logos/changshu-bank.png";
import chewy from "../assets/customer-logos/chewy.svg";
import chinaamc from "../assets/customer-logos/chinaamc.png";
import chnEnergy from "../assets/customer-logos/chn-energy.svg";
import cicc from "../assets/customer-logos/cicc.svg";
import cepheid from "../assets/customer-logos/cepheid.svg";
import danaher from "../assets/customer-logos/danaher.svg";
import delphi from "../assets/customer-logos/delphi.svg";
import ecovacs from "../assets/customer-logos/ecovacs.svg";
import forvia from "../assets/customer-logos/forvia.png";
import fosunPharma from "../assets/customer-logos/fosun-pharma.png";
import fullgoalFund from "../assets/customer-logos/fullgoal-fund.png";
import gilead from "../assets/customer-logos/gilead.png";
import guolianMinsheng from "../assets/customer-logos/guolian-minsheng.png";
import haday from "../assets/customer-logos/haday.png";
import henlius from "../assets/customer-logos/henlius.png";
import huaanFunds from "../assets/customer-logos/huaan-funds.png";
import huawei from "../assets/customer-logos/huawei.svg";
import imgAcademy from "../assets/customer-logos/img-academy.png";
import innovent from "../assets/customer-logos/innovent.png";
import jiahuaChemicals from "../assets/customer-logos/jiahua-chemicals.png";
import manulifeSinochem from "../assets/customer-logos/manulife-sinochem.png";
import mcdonalds from "../assets/customer-logos/mcdonalds.svg";
import mevion from "../assets/customer-logos/mevion.png";
import mondelez from "../assets/customer-logos/mondelez.png";
import orange from "../assets/customer-logos/orange.png";
import saintGobain from "../assets/customer-logos/saint-gobain.png";
import sennics from "../assets/customer-logos/sennics.png";
import shanghaiTower from "../assets/customer-logos/shanghai-tower.png";
import starbucks from "../assets/customer-logos/starbucks.svg";
import ubs from "../assets/customer-logos/ubs.svg";
import wuxiApptec from "../assets/customer-logos/wuxi-apptec.png";
import xinjiangBank from "../assets/customer-logos/xinjiang-bank.png";
import yuwell from "../assets/customer-logos/yuwell.png";

export interface CustomerLogo {
  name: string;
  src: string;
}

const firstRow: readonly CustomerLogo[] = [
  { name: "McDonald’s", src: mcdonalds },
  { name: "Booking.com", src: booking },
  { name: "Haday", src: haday },
  { name: "Saint-Gobain", src: saintGobain },
  { name: "Cartier", src: cartier },
  { name: "Delphi", src: delphi },
  { name: "HuaAn Funds", src: huaanFunds },
  { name: "CICC", src: cicc },
  { name: "Xinjiang Bank", src: xinjiangBank },
  { name: "Manulife-Sinochem", src: manulifeSinochem },
  { name: "Orange", src: orange },
  { name: "FORVIA", src: forvia },
  { name: "Yuwell", src: yuwell },
  { name: "WuXi AppTec", src: wuxiApptec },
  { name: "Mevion", src: mevion },
  { name: "Jiahua Chemicals", src: jiahuaChemicals },
  { name: "Beckman Coulter", src: beckmanCoulter },
  { name: "Danaher", src: danaher },
  { name: "Henlius", src: henlius },
  { name: "Sennics", src: sennics },
  { name: "Bosch", src: bosch },
];

const secondRow: readonly CustomerLogo[] = [
  { name: "Starbucks", src: starbucks },
  { name: "Mondelēz International", src: mondelez },
  { name: "Huawei", src: huawei },
  { name: "ECOVACS", src: ecovacs },
  { name: "Shanghai Tower", src: shanghaiTower },
  { name: "Chewy", src: chewy },
  { name: "Fullgoal Fund", src: fullgoalFund },
  { name: "ChinaAMC", src: chinaamc },
  { name: "Changshu Rural Commercial Bank", src: changshuBank },
  { name: "Guolian Minsheng Securities", src: guolianMinsheng },
  { name: "Bloomage", src: bloomage },
  { name: "IMG Academy", src: imgAcademy },
  { name: "Innovent", src: innovent },
  { name: "Fosun Pharma", src: fosunPharma },
  { name: "BY-HEALTH", src: byHealth },
  { name: "Amlogic", src: amlogic },
  { name: "Cepheid", src: cepheid },
  { name: "UBS", src: ubs },
  { name: "Gilead", src: gilead },
  { name: "CHN Energy", src: chnEnergy },
  { name: "Bekaert", src: bekaert },
];

export const customerLogoRows = [firstRow, secondRow] as const;
```

- [ ] **Step 5: Run the content test and asset safety checks**

Run:

```bash
npm test -- --run src/content/customerLogos.test.ts
find src/assets/customer-logos -type f | wc -l
find src/assets/customer-logos -type f -size +250k -print
rg -n "<script|https?://|data:image" src/assets/customer-logos -g '*.svg'
```

Expected: tests PASS; file count is `42`; the last two commands print nothing.

- [ ] **Step 6: Commit the verified content layer**

```bash
git add joto-site-v2/src/assets/customer-logos joto-site-v2/src/content/customerLogos.ts joto-site-v2/src/content/customerLogos.test.ts joto-site-v2/docs/content-sources/customer-logo-wall.md
git commit -m "feat: add verified customer logo assets"
```

---

### Task 2: Implement the accessible Logo wall with failure fallback

**Files:**
- Create: `joto-site-v2/src/components/CustomerLogoWall.tsx`
- Create: `joto-site-v2/src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `customerLogoRows` and `CustomerLogo` from Task 1.
- Produces: default export `CustomerLogoWall(): JSX.Element`.

- [ ] **Step 1: Write the failing component tests**

Create `joto-site-v2/src/components/CustomerLogoWall.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CustomerLogoWall from "./CustomerLogoWall";

describe("CustomerLogoWall", () => {
  it("exposes one accessible image per unique customer and hides loop copies", () => {
    const { container } = render(<CustomerLogoWall />);

    expect(
      screen.getByRole("heading", { level: 2, name: "TRUSTED BY INDUSTRY LEADERS" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(42);
    expect(container.querySelectorAll('[data-logo-sequence="duplicate"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-logo-sequence="duplicate"][aria-hidden="true"]')).toHaveLength(2);
  });

  it("shows the brand name when an image fails", () => {
    render(<CustomerLogoWall />);
    fireEvent.error(screen.getByRole("img", { name: "McDonald’s logo" }));

    expect(screen.getByText("McDonald’s")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "McDonald’s logo" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the component test and verify the missing component failure**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: FAIL because `./CustomerLogoWall` does not exist.

- [ ] **Step 3: Implement the component**

Create `joto-site-v2/src/components/CustomerLogoWall.tsx`:

```tsx
import { useState, type CSSProperties } from "react";
import { customerLogoRows, type CustomerLogo } from "../content/customerLogos";

interface LogoCardProps {
  decorative: boolean;
  logo: CustomerLogo;
}

function LogoCard({ decorative, logo }: LogoCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <li
      aria-hidden={decorative || undefined}
      className="group flex h-16 w-44 shrink-0 items-center justify-center rounded-sm border border-white/10 bg-white/[0.045] px-5 sm:h-[4.5rem] sm:w-52"
    >
      {failed ? (
        <span className="text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65">
          {logo.name}
        </span>
      ) : (
        <img
          alt={decorative ? "" : `${logo.name} logo`}
          className="max-h-9 w-auto max-w-[9rem] object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-95 group-hover:grayscale-0 sm:max-h-10 sm:max-w-[10.5rem]"
          decoding="async"
          loading="lazy"
          onError={() => setFailed(true)}
          src={logo.src}
        />
      )}
    </li>
  );
}

interface LogoSequenceProps {
  decorative: boolean;
  logos: readonly CustomerLogo[];
}

function LogoSequence({ decorative, logos }: LogoSequenceProps) {
  return (
    <ul
      aria-hidden={decorative || undefined}
      className="flex shrink-0 gap-3 pr-3"
      data-logo-sequence={decorative ? "duplicate" : "primary"}
    >
      {logos.map((logo) => (
        <LogoCard decorative={decorative} key={logo.name} logo={logo} />
      ))}
    </ul>
  );
}

export default function CustomerLogoWall() {
  return (
    <section
      aria-labelledby="customer-logo-wall-title"
      className="customer-logo-wall relative overflow-hidden bg-[#070b0a] py-16 text-white sm:py-20"
      id="customer-logo-wall"
    >
      <div className="mx-auto mb-9 max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        <h2
          className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-white/48"
          id="customer-logo-wall-title"
        >
          TRUSTED BY INDUSTRY LEADERS
        </h2>
      </div>

      <div className="space-y-3">
        {customerLogoRows.map((logos, rowIndex) => (
          <div
            aria-label={`Customer logos row ${rowIndex + 1}`}
            className="customer-logo-wall__viewport overflow-hidden"
            key={`logo-row-${rowIndex + 1}`}
            role="group"
          >
            <div
              className={`customer-logo-wall__track flex w-max ${
                rowIndex === 1 ? "customer-logo-wall__track--reverse" : ""
              }`}
              style={{ "--logo-wall-duration": rowIndex === 0 ? "46s" : "52s" } as CSSProperties}
            >
              <LogoSequence decorative={false} logos={logos} />
              <LogoSequence decorative logos={logos} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the component tests**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: both tests PASS.

- [ ] **Step 5: Commit the semantic component**

```bash
git add joto-site-v2/src/components/CustomerLogoWall.tsx joto-site-v2/src/components/CustomerLogoWall.test.tsx
git commit -m "feat: add accessible customer logo wall"
```

---

### Task 3: Add continuous motion, edge fades, and reduced-motion behavior

**Files:**
- Modify: `joto-site-v2/src/index.css`
- Modify: `joto-site-v2/src/components/CustomerLogoWall.test.tsx`

**Interfaces:**
- Consumes: `.customer-logo-wall__viewport`, `.customer-logo-wall__track`, and `.customer-logo-wall__track--reverse` from Task 2.
- Produces: CSS-only marquee behavior with no runtime dependency.

- [ ] **Step 1: Add structural class assertions before the CSS exists**

Append to `CustomerLogoWall.test.tsx`:

```tsx
it("marks the second row for reverse motion", () => {
  const { container } = render(<CustomerLogoWall />);
  const tracks = container.querySelectorAll(".customer-logo-wall__track");

  expect(tracks).toHaveLength(2);
  expect(tracks[0]).not.toHaveClass("customer-logo-wall__track--reverse");
  expect(tracks[1]).toHaveClass("customer-logo-wall__track--reverse");
});
```

- [ ] **Step 2: Run the focused test**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
```

Expected: PASS, confirming the component exposes the CSS contract.

- [ ] **Step 3: Append the complete CSS implementation**

Append to `joto-site-v2/src/index.css` after the existing reduced-motion block:

```css
@keyframes customer-logo-wall-scroll {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
}

.customer-logo-wall::before,
.customer-logo-wall::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  height: 4rem;
  pointer-events: none;
}

.customer-logo-wall::before {
  top: 0;
  background: linear-gradient(180deg, #070b0a, transparent);
}

.customer-logo-wall::after {
  bottom: 0;
  background: linear-gradient(0deg, #070b0a, transparent);
}

.customer-logo-wall__viewport {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
}

.customer-logo-wall__track {
  animation: customer-logo-wall-scroll var(--logo-wall-duration, 48s) linear infinite;
  will-change: transform;
}

.customer-logo-wall__track--reverse {
  animation-direction: reverse;
}

@media (prefers-reduced-motion: reduce) {
  .customer-logo-wall__viewport {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .customer-logo-wall__track {
    animation: none !important;
    transform: none !important;
    will-change: auto;
  }

  .customer-logo-wall__track [data-logo-sequence="duplicate"] {
    display: none;
  }
}
```

- [ ] **Step 4: Run the component tests and build**

Run:

```bash
npm test -- --run src/components/CustomerLogoWall.test.tsx
npm run build
```

Expected: tests PASS and Vite build completes without CSS warnings.

- [ ] **Step 5: Commit the motion layer**

```bash
git add joto-site-v2/src/index.css joto-site-v2/src/components/CustomerLogoWall.test.tsx
git commit -m "style: animate customer logo wall"
```

---

### Task 4: Add the default-off feature flag, preview route, and home integration

**Files:**
- Create: `joto-site-v2/src/config/features.ts`
- Create: `joto-site-v2/src/pages/CustomerLogoWallPreviewPage.tsx`
- Modify: `joto-site-v2/src/App.tsx`
- Modify: `joto-site-v2/src/App.test.tsx`

**Interfaces:**
- Consumes: default export `CustomerLogoWall` from Task 2.
- Produces: mutable testable `featureFlags.customerLogoWall: boolean`, default `false`.
- Produces: preview route `/preview/customer-logo-wall`.

- [ ] **Step 1: Write failing App integration tests**

Add this import to `App.test.tsx`:

```ts
import { featureFlags } from "./config/features";
```

Update `afterEach`:

```ts
afterEach(() => {
  featureFlags.customerLogoWall = false;
  window.history.replaceState({}, "", "/");
});
```

Add these tests:

```tsx
it("keeps the customer logo wall off on the public home page by default", () => {
  const { container } = render(<App />);
  expect(container.querySelector("#customer-logo-wall")).not.toBeInTheDocument();
});

it("places the enabled customer logo wall between Hero and Solutions", () => {
  featureFlags.customerLogoWall = true;
  const { container } = render(<App />);
  const hero = container.querySelector('section[aria-labelledby="hero-title"]') as HTMLElement;
  const logoWall = container.querySelector("#customer-logo-wall") as HTMLElement;
  const solutions = container.querySelector("#solutions") as HTMLElement;

  expect(hero.compareDocumentPosition(logoWall)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(logoWall.compareDocumentPosition(solutions)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
});

it("renders the isolated customer logo wall preview route", () => {
  window.history.replaceState({}, "", "/preview/customer-logo-wall");
  const { container } = render(<App />);

  expect(container.querySelector("#customer-logo-wall")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { level: 1, name: "We Make IT Happen." })).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the App tests and verify the missing-module failure**

Run:

```bash
npm test -- --run src/App.test.tsx
```

Expected: FAIL because `./config/features` and the preview route do not exist.

- [ ] **Step 3: Add the feature flag**

Create `joto-site-v2/src/config/features.ts`:

```ts
export const featureFlags: { customerLogoWall: boolean } = {
  customerLogoWall: false,
};
```

- [ ] **Step 4: Add the isolated preview page**

Create `joto-site-v2/src/pages/CustomerLogoWallPreviewPage.tsx`:

```tsx
import CustomerLogoWall from "../components/CustomerLogoWall";

export default function CustomerLogoWallPreviewPage() {
  return (
    <main className="min-h-screen bg-[#070b0a] py-16 text-white antialiased">
      <CustomerLogoWall />
    </main>
  );
}
```

- [ ] **Step 5: Update App routing and guarded home placement**

Add imports to `App.tsx`:

```ts
import CustomerLogoWall from "./components/CustomerLogoWall";
import { featureFlags } from "./config/features";
import CustomerLogoWallPreviewPage from "./pages/CustomerLogoWallPreviewPage";
```

Replace the beginning of `App()` and the Hero/Solutions boundary with:

```tsx
export default function App() {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;

  if (pathname === "/preview/customer-logo-wall") {
    return <CustomerLogoWallPreviewPage />;
  }

  const detail = getPartnerDetail(pathname);

  if (detail) {
    return <PartnerDetailPage detail={detail} />;
  }

  return (
    <main id="top" className="min-h-screen overflow-x-clip bg-[#070b0a] text-white antialiased">
      <Hero />
      {featureFlags.customerLogoWall && <CustomerLogoWall />}
      <Solutions />
      <Services />
      <CaseStudies />
      <About />
      <GlobalPresence />
      <ContactFooter />
    </main>
  );
}
```

- [ ] **Step 6: Run the App test and full test suite**

Run:

```bash
npm test -- --run src/App.test.tsx
npm test -- --run
```

Expected: all App tests and all project tests PASS.

- [ ] **Step 7: Commit the isolated integration**

```bash
git add joto-site-v2/src/config/features.ts joto-site-v2/src/pages/CustomerLogoWallPreviewPage.tsx joto-site-v2/src/App.tsx joto-site-v2/src/App.test.tsx
git commit -m "feat: gate customer logo wall behind preview flag"
```

---

### Task 5: Verify responsive visuals, accessibility, and performance

**Files:**
- Modify: `joto-site-v2/docs/qa-report.md`

**Interfaces:**
- Consumes: preview path from Task 4.
- Produces: verified final branch with the public flag still off.

- [ ] **Step 1: Run the complete automated verification**

```bash
cd joto-site-v2
npm test -- --run
npm run build
```

Expected: every test passes and TypeScript/Vite build succeeds.

- [ ] **Step 2: Start the local preview**

```bash
npm run dev -- --host 127.0.0.1 --port 3010
```

Expected: Vite serves `http://127.0.0.1:3010`.

- [ ] **Step 3: Verify the preview route at required viewport sizes**

Open `http://127.0.0.1:3010/preview/customer-logo-wall` and capture/check:

```text
Desktop wide: 1440 × 1000
Laptop:       1280 × 800
Tablet:        768 × 1024
Mobile:        390 × 844
```

At each size verify: two complete rows, no page-level horizontal overflow, edge fades on normal motion, readable fallback text, and no overlap with adjacent content.

- [ ] **Step 4: Verify reduced motion and image failure**

Emulate `prefers-reduced-motion: reduce` and verify:

```text
animation-name: none
duplicate sequence: display none
viewport: horizontally scrollable when content exceeds width
```

Block one local Logo request and verify its card displays the corresponding brand name without changing row height.

- [ ] **Step 5: Verify the public homepage remains unchanged**

Open `http://127.0.0.1:3010/` with `featureFlags.customerLogoWall === false` and verify:

```text
#customer-logo-wall is absent
#solutions immediately follows the Hero in the rendered page
existing navigation anchors remain functional
```

- [ ] **Step 6: Record QA evidence**

Append to `joto-site-v2/docs/qa-report.md`:

```markdown
## Customer Logo Wall Preview — 2026-07-22

- Branch: `codex/joto-logo-wall`
- Preview: `/preview/customer-logo-wall`
- Public flag: off
- Automated tests: pass
- Production build: pass
- Viewports: 1440×1000, 1280×800, 768×1024, 390×844
- Reduced motion: static horizontal rows; duplicate sequences hidden
- Runtime Logo requests: local assets only
- Rebrands verified: FORVIA; Guolian Minsheng Securities
```

- [ ] **Step 7: Commit QA-only refinements and evidence**

```bash
git add joto-site-v2/src/components/CustomerLogoWall.tsx joto-site-v2/src/index.css joto-site-v2/docs/qa-report.md
git commit -m "test: verify customer logo wall preview"
```

- [ ] **Step 8: Final clean-state check**

```bash
git status --short
git log -5 --oneline
```

Expected: clean working tree; the latest commits correspond to assets, component, motion, guarded integration, and QA.
