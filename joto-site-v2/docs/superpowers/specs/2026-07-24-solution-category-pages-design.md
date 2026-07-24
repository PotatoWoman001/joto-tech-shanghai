# Solution 大类详情页设计说明

## 目标

为 Network、Security、Server & Storage、Collaboration、Safeguarding 五个 Solution 大类建立独立详情页。首页 Solution 卡片和导航中的大类标题进入大类页；现有厂商品牌详情页继续作为下一层页面保留。

## 路由

英文页面：

- `/solutions/network`
- `/solutions/security`
- `/solutions/server-storage`
- `/solutions/collaboration`
- `/solutions/safeguarding`

中文和波斯语沿用现有本地化规则，分别增加 `/zh` 和 `/fa` 前缀。页面内部的联系、案例和厂商链接必须保留当前语言。

## 页面结构

五个页面复用一个 `SolutionCategoryPage`：

1. 分类首屏：分类名、业务价值主张、简短说明和当前分类摄影图。
2. 核心能力：六项能力卡，使用编号、标题和一句专业说明。
3. 技术伙伴：复用当前分类中的厂商数据与 Logo；每张卡进入对应厂商详情页。
4. 代表案例：从首页现有案例数据中选择与分类最匹配的一项，不新增未经确认的客户事实。
5. 联系 CTA：进入当前语言的 `/contact`。

内容基于旧版 `joto-website/lib/data.ts`，但删除仅面向在华企业的限制性表达，改写为全球和跨区域交付语境。页面视觉不复制旧站，而是沿用当前站的黑绿、高对比网格和大字号排版。

## 数据边界

新增 `src/content/solutionCategories.ts`，只保存大类详情页需要的数据：

- `id`、`pathname`
- 三语言 `tagline` 与 `summary`
- 三语言六项 `capabilities`
- `featuredCaseClient`

分类标题、主图、厂商列表及厂商描述继续来自 `siteContent.solutions.categories`，避免产生第二套厂商数据。页面组件只负责布局，不内嵌分类文案。

## 入口规则

- 首页五张 Solution 卡的按钮指向对应大类页。
- 桌面端 Solution 下拉菜单中的大类标题指向对应大类页。
- 移动端展开后的大类标题指向对应大类页。
- 菜单中的厂商名称继续指向厂商详情页。
- 大类页中的厂商卡继续指向厂商详情页。

## 容错与回退

- 未识别的大类路径继续回到当前应用的既有页面解析流程，不新增通用 404。
- 如果找不到匹配案例，则不渲染案例区，不显示空卡。
- 厂商 Logo 加载失败时显示厂商名称。
- 页面在波斯语正文中使用 RTL，但 Header 继续保持现有 LTR 布局。

## 验证

- 数据测试覆盖五个唯一路径、每页六项能力和三语言内容。
- 页面测试覆盖首屏、能力、厂商链接、案例和 CTA。
- 路由测试覆盖英文、中文、波斯语路径。
- 首页和 Header 测试确认大类入口不再跳到首个厂商。
- 运行完整 Vitest、TypeScript 检查和生产构建。
- 在桌面与移动视口检查至少中文 Network 页及波斯语 Security 页。
