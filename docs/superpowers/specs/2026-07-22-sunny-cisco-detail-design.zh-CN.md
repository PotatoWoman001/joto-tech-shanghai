# Sunny Try · Cisco 详情页设计说明

## 目标

在 `joto-site-v2` 中新增与 Tommy 版内容一致、但完全遵循 Sunny Try 视觉语言的 Cisco 详情页。该页面作为以后其他解决方案品牌详情页的可复用模板。

## 版本隔离

- Sunny Try 首页继续位于 `codex/joto-visual-revision`。
- Sunny Cisco 详情页位于独立分支 `codex/sunny-cisco-detail`。
- Tommy 版本继续保留在独立工作树 `joto-cisco-partner-page`，不会被修改或复制样式。
- Sunny Cisco 完成后再合并回 Sunny Try，不提前干扰首页调试。

## 页面架构

1. **首屏**：Cisco × JOTO、核心定位、简短合作说明、案例和联系按钮；右侧使用真实 Cisco 网络设备与管理平台组合图。
2. **合作关系与选择 JOTO**：合并介绍 JOTO 如何把 Cisco 技术转化为企业网络，以及企业选择 JOTO 的三个理由。
3. **JOTO Cisco 服务**：咨询与设计、集成与支持、托管服务三块，保留现有服务范围。
4. **Cisco 相关案例**：Harrow、Danaher、Chewy，突出真实部署和持续运维能力。
5. **联系行动**：引导客户联系 `sales@jototech.cn`。

不新增产品目录、不新增交付流程、不加入未经核实的新合作等级或荣誉。

## Sunny 视觉语言

- 背景：`#070b0a` 与 `#090e0d` 交替。
- 强调色：`#5ed29c`。
- 标题：Inter 超大无衬线字配合 Instrument Serif 斜体强调。
- 结构：1440px 内容宽度、细网格线、编号、边框分栏、液态玻璃局部信息卡。
- 主视觉：真实产品图不使用白色卡片边框，直接叠化进深绿色背景。
- 动效：延续现有 Reveal 进入动画和 hover 细节，并遵守 reduced-motion。

### 首屏标题比例微调

- 保持 `Cisco solutions,` 的现有字号和无衬线视觉重量。
- 将绿色斜体 `delivered by JOTO.` 相对当前实现缩小约 20%，桌面端与移动端同步调整。
- 保持 Instrument Serif、JOTO green、现有换行和左对齐关系，不修改其他首屏元素。

### 服务卡片视觉改版

- `Cisco services from JOTO` 保留三列信息架构，但卡片改为截图参考的圆角细边框样式，不再使用无圆角通栏网格。
- 每张卡片顶部使用真实工作场景照片，桌面端比例为 `16:10`，移动端比例为 `4:3`；使用独立 `object-position` 保证人物与关键动作不被严重裁切。
- 照片下缘放置深蓝底、蓝紫描边的悬浮线性图标：Consulting 使用指南针/规划图标，Integration 使用扳手/工具图标，Managed Services 使用耳机/支持图标。
- 三张照片分别表达：企业 IT 咨询会议；工程师现场安装与集成；背对镜头的运维人员在服务器机房操作监控电脑。
- Managed Services 不使用正面商务肖像或抽象 AI 运维界面，画面必须同时呈现真人操作、电脑或监控设备、服务器机柜。
- 卡片继续显示现有标题、说明和能力清单；清单使用蓝紫色勾选标记，照片只增强语义，不替代文字内容。
- 照片下载为本地优化资源，不在生产页面依赖第三方图片 URL；保留素材来源记录。Consulting 与 Integration 使用已确认的 Unsplash 场景，Managed Services 使用 Pexels 数据中心技术人员照片 `37605911`。

## 可复用方式

- 合作伙伴内容放在独立数据文件中。
- 页面组件只读取数据，不把 Cisco 文案写死在组件里。
- 后续品牌复用相同路由结构 `/solutions/:solution/:partner`。

## 路由与服务器

- 首个路由：`/solutions/network/cisco`。
- 当前 Vite 单页应用通过 pathname 选择页面，不新增路由依赖。
- 正式服务器需要把未知前端路径回退到 `index.html`，确保直接访问详情页可打开。
