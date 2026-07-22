# JOTO TECH 深色单页官网设计规格

## 目标

以用户提供的 CodeNest 模板为视觉参考，只保留深色视频、液态玻璃、排版和交互动效；删除模板全部业务内容，制作 JOTO TECH 英文版单页官网。第一版仅本地展示，暂不开发 Solutions 详情页、后台和语言切换。

## 技术与目录

- 将 `/Users/cuihua/Downloads/joto-site-main/` 复制到当前工作区 `joto-site-v2/`。
- 沿用 Vite、React 18、TypeScript、Tailwind CSS 3.4 和 Lucide。
- 新增 `hls.js`，播放指定 Mux HLS 视频并设置 `enableWorker: false`。
- 内容与组件分离，英文作为首个语言数据集，为后续中文及第三语言预留结构。

## 页面结构

1. Header 与移动端全屏菜单
2. 深色视频 Hero 与 Liquid Glass 卡片
3. Solutions 五大分类
4. Services 服务能力
5. Case Studies 客户案例
6. About JOTO 与关键数据
7. Certifications & Partners
8. Global Presence
9. Contact CTA 与 Footer

导航使用：`SOLUTIONS / SERVICES / CASE STUDIES / ABOUT / CONTACT`。

## 视觉规范

- 全站统一深色背景，以 `#070b0a` 和青绿色 `#5ed29c` 为主色。
- Hero 使用指定 HLS 视频，视频透明度 60%，叠加左侧和底部深色渐变。
- 桌面端显示 25%、50%、75% 三条竖向网格线。
- 中上部使用青绿色 SVG 椭圆光晕与 25px 高斯模糊。
- Hero 放置 200×200px Liquid Glass 卡片并上移 50px。
- 字体使用 Inter、Plus Jakarta Sans、Instrument Serif Italic。
- JOTO Logo 使用白色简化显示；移动菜单可打开、关闭并跳转锚点。
- HLS 加载失败时保留深色渐变背景；尊重减少动态效果设置。

## Hero 文案

- Eyebrow：`ENTERPRISE-READY IT SOLUTIONS`
- Headline：`BUILD WHAT'S NEXT.`
- Description：`Design, deploy and operate secure IT infrastructure across China and beyond.`
- Glass Card：`[ SINCE 2010 ]` / `Engineered by Certified Professionals`
- CTA：`EXPLORE SOLUTIONS`

## Solutions 目录

- **Network**：Cisco（Gold）、Extreme Networks（Gold）、Aruba、Sangfor 深信服（Gold）
- **Security**：KnowBe4、Palo Alto Networks（Platinum）、Fortinet（Gold）、Sangfor 深信服、Check Point、OneLogin
- **Server & Storage**：Dell Technologies、Huawei、Inspur 浪潮
- **Collaboration**：AudioCodes、Vodia、CyberData、InformaCast
- **Safeguarding**：Verkada、Hikvision、Keyking

仅显示用户明确提供的合作等级。分类数据需支持后续增加独立详情页，第一版品牌卡片不跳转到空白页面。

## 内容规则

- 优先使用已采集的 JOTO 原站内容和用户提供项目中的可用内容。
- 缺失介绍与 Logo 仅从品牌官网获取，并记录来源。
- 不虚构 JOTO 的认证、合作等级、客户案例或实施经验；待确认项目进入内容问题清单。
- 删除 CodeNest、JOTO AI、Dify、AIGC 及相关案例。
- 第一版只显示英文；中文品牌名可以保留。

## 组件与数据边界

- 页面区块拆分为独立组件，Header、Hero、Solutions、Services、Cases、About、Partners、Global、Footer 各自负责单一功能。
- Solutions、服务、案例、办公室和合作伙伴均由结构化数据驱动。
- 视频播放封装为独立组件，负责 HLS/native fallback、销毁实例和错误状态。
- 语言文案集中存放，组件不得硬编码大段业务内容。

## 验收

- `npm run build` 通过，无 TypeScript 错误。
- 桌面和移动端布局、菜单、锚点及 CTA 正常。
- HLS 视频可播放，失败回退有效。
- 五类 Solutions、品牌和等级与本规格一致。
- 页面不包含 CodeNest、JOTO AI、Dify、AIGC 或旧模板业务文案。
- 使用真实浏览器检查桌面端与移动端，并提供本地预览地址和截图。

## 后续范围

- 从 Cisco 开始逐个开发 Solutions 详情页。
- 增加中文和第三语言切换。
- 补充并复核认证、案例与合作关系。
- 后续再接入运营后台、数据库及新域名 SEO。
