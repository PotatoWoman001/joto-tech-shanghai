# 全部 Solution 详情页设计说明

## 目标与范围

以现有 `/solutions/network/cisco` 为视觉和交互基线，为首页 Solution 目录中的全部 20 个厂商提供可直接访问的英文详情页。Cisco 保持现有内容；新增 19 个页面，覆盖 Network、Security、Server & Storage、Collaboration、Safeguarding 五类解决方案。

## 页面与路由

- Network：Cisco、Extreme Networks、Aruba、Sangfor 深信服。
- Security：KnowBe4、Palo Alto Networks、Fortinet、Sangfor 深信服、Check Point、OneLogin。
- Server & Storage：Dell Technologies、Huawei、Inspur 浪潮。
- Collaboration：AudioCodes、Vodia、CyberData、InformaCast。
- Safeguarding：Verkada、Hikvision、Keyking。
- 路由统一为 `/solutions/<category>/<vendor-slug>`，尾部斜杠同样可访问。
- 桌面端和移动端导航中的每个厂商名称都直接进入相应详情页，不再跳回首页厂商锚点。

## 信息架构

所有页面继续使用 Cisco 的五段式结构：

1. 厂商 × JOTO 首屏：厂商定位、JOTO 能提供的工作范围、联系入口。
2. 合作价值：三个与企业交付相关的选择理由。
3. JOTO 服务：咨询与设计、部署与集成、运维与生命周期支持。
4. 适用场景：三个常见企业落地场景；只有具备可靠资料时才使用真实客户案例。
5. 联系 CTA：进入现有 `/contact` 页面。

## 内容模型

- `PartnerDetailPage` 只负责布局，所有厂商名称、标题、按钮、板块标题、页脚和图像说明均从 `PartnerDetail` 数据读取。
- 共同服务结构由工厂函数生成，每个厂商提供专属产品能力清单，减少重复同时保留实质差异。
- Cisco 保留现有真实案例和网络遥测叠层；其他厂商使用所属解决方案类别的本地视觉素材，不复用不相关的 Cisco 设备或网络遥测。
- 非 Cisco 页的第四段使用“适用场景”而不是虚构 JOTO 客户案例，保持页面完整且避免未经证实的背书。

## 内容来源与事实边界

- 优先使用 JOTO 老官网公开内容及项目内已记录资料。
- 产品能力使用厂商官方产品页核对；不依据第三方媒体描述技术能力。
- 老官网明确支持 Extreme Networks、KnowBe4、OneLogin 的合作和交付表述；Verkada 可使用老官网公开教育场景，但本批页面仍采用谨慎的适用场景表达。
- 不新增或更新任何未经当前官方渠道确认的 Gold、Diamond、Platinum 等合作等级。
- 不把通用 JOTO 服务经验写成某厂商已完成的客户项目。

## 视觉与响应式

- 完整继承 Cisco 页的深绿背景、JOTO green、编辑式大标题、编号、网格、服务卡片和 CTA。
- 厂商 Logo 保持可读；宽 Logo 使用更宽的最大尺寸，深色 Logo 统一在深色背景上反白处理。
- 分类主视觉来自项目现有本地 WebP 资源，服务卡片复用现有本地服务照片，生产页面不依赖第三方图片 URL。
- 1440×900 与 390×844 为主要浏览器验收尺寸；页面不得出现横向溢出。

## 测试与验收

- 数据测试确认 20 个路由全量存在、路径唯一、每页三项服务和三个适用场景完整。
- 导航测试确认全部厂商链接均为详情页路由。
- 页面测试至少覆盖 Cisco 与一个非 Network 厂商，确保模板无 Cisco 写死文案、无错误遥测叠层。
- 运行全量 Vitest、TypeScript/Vite 生产构建，并在桌面和移动视口抽查五个类别的代表页面。
