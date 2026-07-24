# Solution 代表项目 Logo 规范化设计

## 目标

修正新增 Solution 代表项目板块中缺少官方 Logo、使用文字替代或显示尺寸不一致的问题。所有可核验的客户标识改为本地官方素材，并与 Cisco 代表项目的标准 Logo 槽位保持一致。

本次调整覆盖已有代表项目数据的八个 Solution 路由，不改变项目文案、项目归属、三语言内容或没有项目资料页面的隐藏逻辑。

## 已确认方案

采用本地官方素材方案：

- 从客户官方网站或品牌官方媒体资源页取得 Logo。
- 素材保存到 `src/assets/customer-logos/partner-cases/`，由 Vite 静态导入。
- 页面运行时不请求第三方 Logo URL，避免跨域、失效和官网改版造成缺图。
- 所有标准 Logo 使用 `150 × 48 px` 固定显示槽位，保持原始比例并左对齐。
- 标准 Logo 统一用 CSS 转为白色单色，与 Cisco 页面现有视觉一致。
- Cisco 页面 Harrow International School 的竖版校徽继续使用现有 `100 × 96 px` 特例。
- 无法从官方渠道核验的品牌保留客户名称文字回退，不使用第三方 Logo 库，也不自行重绘。

不采用运行时引用官网图片的方案，因为官网资产路径可能变化，且会引入额外网络请求。不采用第三方 Logo 库或人工临摹方案，因为无法保证标识版本、比例和来源准确。

## 页面与品牌范围

| Solution 路由 | 客户 Logo |
| --- | --- |
| `/solutions/security/palo-alto-networks` | Starbucks China、Dulwich College International；Jinnet 仅在官方素材可验证时使用图片 |
| `/solutions/security/knowbe4` | Quasar Medical、DFX Labs Company Limited |
| `/solutions/network/extreme-networks` | Shanghai Singapore International School、Shanghai YK Pao School |
| `/solutions/security/fortinet` | Tianjin Bunge Foods、Amlogic |
| `/solutions/network/aruba` | Boston Scientific、Zhongke Chuangwei 仅在官方素材可验证时使用图片 |
| `/solutions/network/sangfor` | Pall Corporation |
| `/solutions/security/sangfor` | 与网络路由复用相同 Pall Corporation 素材 |
| `/solutions/safeguarding/hikvision` | Pall Corporation、Tianjin Bunge Foods |

同一客户在不同 Solution 页面或同一页面的多个法人条目中复用同一个 Logo 文件，避免出现视觉版本不一致。

## 官方来源规则

素材来源优先级为：

1. 品牌官网的媒体资源、品牌资源或新闻中心下载页。
2. 品牌官网当前页头、页脚实际使用的 SVG 或透明 PNG。
3. 客户所属集团官方网站实际使用的集团 Logo，前提是项目资料中的客户法人明确属于该集团。

每个新增素材必须在 `docs/content-sources/partner-case-logos.md` 中记录：

- 页面显示名称；
- 复用该素材的客户条目；
- 官方页面 URL；
- 原始素材 URL；
- 获取日期；
- 文件格式；
- 是否只通过 CSS 做单色显示。

搜索结果页、百科、Logo 聚合站、社交媒体头像和无法确认归属的网站均不能作为图片来源。找不到官方素材时，使用现有文字回退，并在来源文档中记录未采用图片的原因。

## 数据与组件设计

### 内容数据

`src/content/partnerCases.ts` 继续作为唯一项目数据源。为每个已核验客户导入对应 Logo，并设置到 `LocalizedPartnerCase.logo`。

本次统一删除代表项目中为星巴克设置的彩色 `logoTreatment: "brand"`，让全部标准客户 Logo 使用默认单色反白处理。三种语言通过同一条项目记录共享同一个图片引用，因此切换语言不会改变 Logo。

### 页面组件

`PartnerDetailPage` 使用明确的两种槽位：

- `standard`：外层和图片均限制在 `h-12 w-[150px]`，内部 `object-contain object-left`。
- `portrait`：仅保留 Harrow 的 `h-24 w-[100px]`。

标准槽位必须有固定宽高，即使不同图片的可见图形长宽比不同，项目内容列的起始位置仍保持稳定。图片不裁切、不拉伸、不放大到超出原始比例。

缺少 `logo` 时继续显示客户名称文字，保持可访问性和信息完整性。图片替代文本继续使用 `${caseStudy.client} logo`。

## 测试与验收

自动化测试覆盖：

- 所有已核验的项目条目拥有本地 Logo。
- 同一品牌在多个页面或多个客户法人条目中复用同一个资源。
- 标准 Logo 使用 `data-case-logo-size="standard"`、固定 `150 × 48 px` 槽位和默认单色处理。
- Harrow 仍使用 `data-case-logo-size="portrait"`。
- 无法核验官方素材的客户继续使用文字回退。
- 三种语言返回相同 Logo 引用。

浏览器验收覆盖：

- Cisco 对照页；
- 八个新增代表项目路由；
- `1440 px` 桌面视口和 `390 px` 移动视口；
- 中文页面为主，并抽查英文与波斯语，确认三种语言不会因 Logo 数据变化而缺失。

每个页面检查 Logo 是否加载、是否被拉伸、是否超出 `150 × 48 px` 槽位、左侧编号与 Logo 是否对齐，以及移动端是否出现水平溢出。控制台不得出现图片加载错误。

## 非目标

- 不修改 Cisco 既有客户 Logo 素材。
- 不调整代表项目文字、顺序、数量或所属 Solution。
- 不修改首页客户 Logo 墙或合作伙伴 Logo。
- 不为没有代表项目资料的 Solution 增加板块。
- 不通过 AI 生成、人工描摹或第三方素材替代无法验证的官方 Logo。
