# “What We Deliver” 大图卡片改版实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页五项解决方案改为三列大图卡片，并实现参考图中的桌面悬停展开、触屏常显和统一现场摄影视觉。

**Architecture:** 保留现有 `Solutions` 数据源与多语言结构，将单张卡片拆为可测试的 `SolutionCard`。布局和交互由 Tailwind 响应式、`group-hover`、`group-focus-within` 与 `motion-reduce` 状态完成，不增加运行时状态；五张新摄影图作为本地静态资源由现有内容模型引用。

**Tech Stack:** React 18、TypeScript、Tailwind CSS、Vitest、Testing Library、Vite、Sites。

## Global Constraints

- 桌面端三列 3 + 2 排列，平板两列，手机单列。
- 默认态为大图标题加图片外黑底按钮；悬停/键盘聚焦时图片纵向展开，说明进入图片，按钮切换为白底绿色文字。
- 每张卡片只保留一句说明。
- 触屏不依赖悬停，内容常显。
- 遵循 `prefers-reduced-motion`。
- 五张图片必须统一为明亮、自然、真实企业项目现场摄影，不含文字、品牌标识或水印。
- 保持英文、简体中文和波斯语可用。

---

### Task 1: 生成并接入五张统一解决方案摄影图

**Files:**
- Create: `src/assets/solutions/network-field-v3.png`
- Create: `src/assets/solutions/security-field-v3.png`
- Create: `src/assets/solutions/server-storage-field-v3.png`
- Create: `src/assets/solutions/collaboration-field-v3.png`
- Create: `src/assets/solutions/safeguarding-field-v3.png`
- Modify: `src/content/en.ts`

**Interfaces:**
- Consumes: `SolutionCategory.image: string`
- Produces: 五个可由 Vite 静态导入的新图片模块

- [ ] **Step 1: 按设计说明分别生成五张竖向企业现场摄影图**

每张图使用 `photorealistic-natural`，构图为竖向网站卡片，统一自然建筑光、中性色和轻微绿色调；分别覆盖网络基础设施、安全运营中心、数据中心通道、会议协作空间、园区门禁与监控。

- [ ] **Step 2: 检查图像**

逐张确认无文字、无品牌、水印或概念化霓虹特效，主体在中央至下半部裁切后仍可读。

- [ ] **Step 3: 接入内容数据**

将 `src/content/en.ts` 顶部五个 `*-v2.jpg` 导入替换为对应 `*-field-v3.png`，保持 `SolutionCategory` 接口和现有替代文本不变。

```ts
import collaborationVisual from "../assets/solutions/collaboration-field-v3.png";
import networkVisual from "../assets/solutions/network-field-v3.png";
import safeguardingVisual from "../assets/solutions/safeguarding-field-v3.png";
import securityVisual from "../assets/solutions/security-field-v3.png";
import serverStorageVisual from "../assets/solutions/server-storage-field-v3.png";
```

- [ ] **Step 4: 验证静态导入**

Run: `npm run build`

Expected: TypeScript 和 Vite 构建成功，新图片出现在 `dist/assets/`。

### Task 2: 以测试驱动重做解决方案卡片

**Files:**
- Create: `src/components/SolutionCard.tsx`
- Create: `src/components/SolutionCard.test.tsx`
- Modify: `src/components/Solutions.tsx`
- Modify: `src/i18n/translations.ts`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `category: SolutionCategory`、`index: number`、`locale: Locale`、`learnMoreLabel: string`
- Produces: `SolutionCard`，包含 `data-solution-card`、`data-solution-visual`、标题、说明与本地化入口链接

- [ ] **Step 1: 写失败测试**

测试单张卡片含一张图片、三级标题、一句说明和唯一链接；英文按钮为 `Learn more`，中文首页为 `了解更多`，链接指向该分类首个厂商的本地化详情入口。

```tsx
expect(screen.getByRole("heading", { level: 3, name: "Network" })).toBeInTheDocument();
expect(screen.getByText(category.description)).toBeInTheDocument();
expect(screen.getByRole("link", { name: "Learn more about Network" })).toHaveAttribute(
  "href",
  "/solutions/network/cisco",
);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/SolutionCard.test.tsx src/App.test.tsx`

Expected: FAIL，原因是 `SolutionCard` 尚不存在且旧区域没有链接。

- [ ] **Step 3: 实现 `SolutionCard`**

使用 `vendorAnchor(category.id, category.vendors[0].name)` 与 `localizedHref(...)` 生成入口。卡片结构为一个相对定位的图片舞台、底部渐变、标题、说明和胶囊按钮；箭头使用 `ArrowRight`。

```tsx
export default function SolutionCard({
  category,
  index,
  learnMoreLabel,
  locale,
}: SolutionCardProps) {
  const href = localizedHref(
    vendorAnchor(category.id, category.vendors[0].name),
    locale,
  );

  return (
    <article className="group" data-solution-card={category.id}>
      <div className="relative overflow-hidden rounded-[1.5rem]" data-solution-visual>
        <img alt={category.imageAlt} className="h-full w-full object-cover" src={category.image} />
        <div className="absolute inset-x-0 bottom-0">
          <h3>{category.title}</h3>
          <p>{category.description}</p>
        </div>
      </div>
      <a aria-label={`${learnMoreLabel} about ${category.title}`} href={href}>
        <span>{learnMoreLabel}</span>
        <ArrowRight aria-hidden="true" />
      </a>
    </article>
  );
}
```

- [ ] **Step 4: 重构 `Solutions` 布局**

从 `useI18n()` 读取 `locale` 与 `t`，渲染 `md:grid-cols-2 xl:grid-cols-3` 网格；保留所有 `vendorId` 锚点，将卡片委托给 `SolutionCard`。在翻译字典加入 `Learn more` 的中文与波斯语。

```tsx
const { locale, siteContent, t } = useI18n();

<div className="mt-16 grid gap-x-5 gap-y-10 md:mt-24 md:grid-cols-2 xl:grid-cols-3">
  {solutions.categories.map((category, index) => (
    <SolutionCard
      category={category}
      index={index}
      key={category.id}
      learnMoreLabel={t("Learn more")}
      locale={locale}
    />
  ))}
</div>
```

```ts
export const zh = {
  "Learn more": "了解更多",
};

export const fa = {
  "Learn more": "بیشتر بدانید",
};
```

- [ ] **Step 5: 更新首页集成测试**

将旧的“零链接”断言改为五张图片、五个三级标题、五个 `Learn more` 入口，并检查 `data-solution-card` 数量为 5。

```tsx
expect(solutions?.querySelectorAll("[data-solution-card]")).toHaveLength(5);
expect(region.getAllByRole("link")).toHaveLength(5);
expect(region.getAllByText("Learn more")).toHaveLength(5);
```

- [ ] **Step 6: 运行测试确认通过**

Run: `npm test -- --run src/components/SolutionCard.test.tsx src/App.test.tsx`

Expected: PASS。

### Task 3: 完成参考图动效和响应式行为

**Files:**
- Modify: `src/components/SolutionCard.tsx`
- Modify: `src/components/SolutionCard.test.tsx`

**Interfaces:**
- Consumes: Task 2 的卡片 DOM 结构
- Produces: 无 JavaScript 状态的悬停、焦点、触屏和减少动态样式

- [ ] **Step 1: 为交互契约补充失败测试**

断言卡片包含 `group`、桌面图片高度过渡、`group-hover`/`group-focus-within` 状态、`motion-reduce` 关闭过渡，以及触屏下说明和按钮可见的基础样式。

```tsx
expect(card).toHaveClass("group");
expect(visual.className).toContain("xl:group-hover:");
expect(visual.className).toContain("group-focus-within:");
expect(visual.className).toContain("motion-reduce:");
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/components/SolutionCard.test.tsx`

Expected: FAIL，缺少最终交互类名。

- [ ] **Step 3: 实现最终动效**

默认图片舞台使用固定竖向比例；在 `xl:hover` 与 `focus-within` 时增加舞台高度，图片缩放约 1.03，说明从透明向上淡入，外部黑底按钮以视觉位移收进舞台并切换为白底绿色文字，箭头右移。手机和平板保持说明与按钮常显。

```tsx
<div className="relative h-[34rem] overflow-hidden rounded-[1.5rem] transition-[height] duration-500 ease-out xl:h-[32rem] xl:group-hover:h-[39rem] group-focus-within:h-[39rem] motion-reduce:transition-none">
  <img className="h-full w-full object-cover transition-transform duration-700 xl:group-hover:scale-[1.03] group-focus-within:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none" />
</div>
```

- [ ] **Step 4: 运行组件与完整测试**

Run: `npm test -- --run`

Expected: 全部测试通过。

### Task 4: 构建并在实时预览中验收

**Files:**
- Modify only if validation finds a defect in Task 1–3 files.

**Interfaces:**
- Consumes: 完成的首页解决方案区域
- Produces: 可部署的 Sites 构建与保持打开的本地实时预览

- [ ] **Step 1: 构建 Sites 产物**

Run: `npm run build:sites`

Expected: 成功生成包含 `dist/server/index.js` 与托管元数据的构建。

- [ ] **Step 2: 刷新应用内预览**

在 `http://127.0.0.1:5173/` 刷新现有标签，检查英文默认态、第一张卡片悬停态、中文按钮文案和手机单列布局。

- [ ] **Step 3: 检查控制台**

确认页面没有新增 error 级别日志。

- [ ] **Step 4: 提交实现**

仅暂存本计划涉及的组件、测试、翻译、内容文件和五张图片；保留工作树中与本任务无关的用户改动。

Commit: `feat: redesign solution cards with field imagery`
