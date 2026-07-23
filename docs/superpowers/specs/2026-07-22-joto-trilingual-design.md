# JOTO 三语网站设计说明

## 目标与范围

在不改变现有英文站点视觉与默认 URL 的前提下，为首页、About、Contact、联系表单、页脚、解决方案导航及 Cisco 详情页增加简体中文和面向伊朗市场的波斯语版本。英语继续使用现有路径；中文使用 `/zh` 前缀；波斯语使用 `/fa` 前缀。

## 方案比较

1. **URL 前缀 + 强类型内容包（采用）**：内容可索引、链接可分享、刷新后语言稳定，且不引入第三方运行时依赖。
2. 查询参数 `?lang=fa`：实现较快，但链接规范性、刷新与站内跳转处理较弱。
3. 复制三套页面：隔离直观，但后续任何页面修复都要同步三份，容易漂移。

采用方案 1。现有组件只保留一套，通过语言上下文读取 `en`、`zh-CN`、`fa-IR` 内容包。

## 路由与语言切换

- 英文：首页 `/`，About `/about`，Contact `/contact`，Cisco `/solutions/network/cisco`。
- 中文：首页 `/zh`，About `/zh/about`，Contact `/zh/contact`，Cisco `/zh/solutions/network/cisco`。
- 波斯语：首页 `/fa`，About `/fa/about`，Contact `/fa/contact`，Cisco `/fa/solutions/network/cisco`。
- 切换语言时保留当前逻辑页面与锚点；未知路径回落到对应语言首页。
- 语言入口固定显示 `EN / 中文 / فارسی`，三种语言中的排列和物理位置完全一致。

## 文案架构

- `content/en.ts` 继续作为英文基准内容。
- 新增 `content/zh-CN.ts` 与 `content/fa-IR.ts`，结构与英文 `SiteContent` 一致。
- 页面级硬编码文案归入 `UiContent`；Cisco 详情按语言提供 `PartnerDetail`。
- 品牌、产品名称、电子邮件、电话、法规编号和专有型号保持原样；描述性技术文案做本地化表达，不做机械逐字翻译。
- 波斯语面向伊朗商务语境，采用现代伊朗波斯语术语，并保留 Cisco、JOTO、Catalyst、Nexus、Meraki、UCS、SLA、SOC、ITIL 等品牌或行业缩写。

## 方向与排版

- 应用在语言切换时同步设置根元素 `lang` 与 `dir`；`fa-IR` 为 `rtl`，其余为 `ltr`。
- Header 整体、桌面导航、移动导航与语言切换器强制 `dir="ltr"`，确保菜单结构、顺序和入口位置不镜像。
- 波斯语正文、标题、列表、表单和详情页采用 RTL；邮箱、电话、URL、品牌型号及遥测数据使用局部 `dir="ltr"` 或双向隔离。
- 为波斯语加载支持阿拉伯字形的字体，并避免对波斯语大标题使用会破坏可读性的负字距和全大写假设。

## 组件与数据流

- `i18n/routing.ts`：解析/生成带语言前缀的路径与锚点。
- `i18n/I18nProvider.tsx`：根据 URL 提供 `locale`、`direction`、`siteContent`、`uiContent` 和语言链接。
- `content/index.ts`：语言内容注册表。
- Header、各首页区块、About/Contact、表单、页脚、Cisco 详情页改为从上下文取值。

## 错误处理与兼容性

- 不支持的语言前缀不改变英文默认行为。
- 联系表单提交数据结构和后端接口保持不变，只翻译界面、验证与状态提示。
- 所有现有英文锚点 ID、资源路径与 API 路径保持不变。

## 测试与验收

- 单元测试覆盖语言路径解析、语言链接保持当前页面、根元素 `lang/dir`、三套内容结构完整性和 Header LTR 例外。
- 现有测试继续通过，新增中文/波斯语关键文案断言。
- 执行 TypeScript 构建和 Vitest。
- 浏览器逐页验证 3 种语言 × 首页/About/Contact/Cisco，包含桌面和移动导航；确认波斯语正文 RTL、导航仍 LTR、无横向溢出。
