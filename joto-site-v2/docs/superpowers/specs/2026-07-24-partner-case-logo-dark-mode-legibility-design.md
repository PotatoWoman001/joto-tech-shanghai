# 代表项目 Logo 深色背景辨识度设计

## 目标

代表项目区继续沿用 Cisco 页面统一的 `150×48px` Logo 槽位，但不再把所有素材统一压成纯白色。每个 Logo 必须在深色背景上保留品牌辨识度、内部负形和文字细节。

## 处理规则

Logo 采用两种显示模式：

- `monochrome`：适用于单一深色的透明底字标。通过 `brightness-0 invert` 转为白色，保持透明背景。
- `brand`：适用于多色标识、包含白色负形的徽章或依赖不同颜色区分内部结构的标识。保留官方原色，不应用统一反白滤镜。

本轮逐项分类如下：

| Logo | 模式 | 理由 |
| --- | --- | --- |
| Starbucks | `brand` | 绿色与白色共同构成海妖图形，纯白处理会变成实心圆 |
| Dulwich College International | `monochrome` | 单一深灰字标，反白后结构完整 |
| DFX Advance | `monochrome` | 单一黑色字标，反白后清晰 |
| SSIS | `brand` | 红、蓝、白共同构成校徽和文字 |
| YK Pao School | `monochrome` | 官方素材本身为透明底白色标识 |
| Bunge | `monochrome` | 单一深蓝字标，反白后清晰 |
| Amlogic | `monochrome` | 官方素材本身为透明底白色标识 |
| Boston Scientific | `monochrome` | 单一深蓝字标，反白后清晰 |
| 中科创威 | `brand` | 蓝、橙及中文文字共同构成品牌识别 |
| Pall | `monochrome` | 原始蓝色图形的负形为透明区域；反白后椭圆和 `PALL` 字样最清晰 |

Jinnet 与 Quasar Medical 继续使用已确认的文字回退，不生成或猜测 Logo。

## 组件行为

`PartnerCaseStudy.logoTreatment` 继续作为数据层的显示契约。`PartnerDetailPage` 根据该字段选择样式：

- `brand`：不应用颜色滤镜，使用完整不透明度。
- `monochrome` 或未指定：应用白色反转滤镜。

所有语言复用同一 Logo 文件与处理模式，避免切换语言后出现不同视觉结果。

## 验收标准

- Starbucks 的绿色海妖与白色区域均可识别，不显示为纯白圆块。
- Pall 以白色反转显示，椭圆轮廓和 `PALL` 字样均可识别。
- SSIS 与中科创威保留品牌色。
- 其余单色 Logo 仍以清晰白色显示。
- 标准 Logo 槽位保持 `150×48px`；Harrow 竖版特例不变。
- 中文、英文、波斯语和移动端无横向溢出。
- Jinnet、Quasar Medical 仍为文字回退。
