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

## 可复用方式

- 合作伙伴内容放在独立数据文件中。
- 页面组件只读取数据，不把 Cisco 文案写死在组件里。
- 后续品牌复用相同路由结构 `/solutions/:solution/:partner`。

## 路由与服务器

- 首个路由：`/solutions/network/cisco`。
- 当前 Vite 单页应用通过 pathname 选择页面，不新增路由依赖。
- 正式服务器需要把未知前端路径回退到 `index.html`，确保直接访问详情页可打开。

