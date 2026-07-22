# JOTO V2 首页客户 Logo 墙设计规格

日期：2026-07-22  
状态：待用户书面审阅  
开发分支：`codex/joto-logo-wall`

## 1. 目标

在不影响当前首页开发分支和正式首页展示的前提下，制作一个可独立预览、可通过功能开关接入首页的客户 Logo 墙。视觉参考 `https://joto.ai/` 首页 Hero 下方的双行横向滚动 Logo 带，但颜色、间距与动效需要适配 JOTO TECH V2 的深色视觉体系。

成功标准：

- 当前首页分支不包含 Logo 墙开发提交。
- 未开启功能开关时，正式首页 DOM 与当前版本保持一致。
- 可通过独立预览路径检查桌面端、移动端和减少动态效果模式。
- 42 个品牌使用 2026 年当前标识；已更名品牌不继续展示旧标识。
- 页面不会因为 Logo 图片加载产生明显布局跳动，也不会引入第三方运行时请求。

## 2. 方案比较与结论

### 方案 A：独立双行滚动区块（采用）

将 Logo 墙作为 `CustomerLogoWall` 独立组件，视觉上紧接 Hero、代码上与 Hero 解耦。组件拥有自己的内容数据、样式、动效与测试，通过功能开关插入 `Hero` 与 `Solutions` 之间。

优点：对 Hero 布局侵入最小；可单独预览和测试；未来增删 Logo 不需要修改 Hero。缺点：比绝对定位在 Hero 内多一个页面区块。

### 方案 B：Logo 墙绝对定位在 Hero 底部

最接近参考站 DOM 结构，但当前 Hero 的文字和 CTA 已贴近底部。增加两行 Logo 会挤压主视觉，在短屏和移动端上容易重叠，因此不采用。

### 方案 C：完整静态网格

Logo 最易浏览，也没有持续动画，但 42 个卡片会显著拉长首页，与用户确认的参考效果不一致，因此不采用。它只作为 `prefers-reduced-motion` 下的无动画降级表现。

## 3. 页面位置与视觉

Logo 墙位于 `Hero` 与 `Solutions` 之间，背景沿用 `#070b0a`，通过轻微顶部/底部渐变与 Hero、下一节自然衔接。

- 标题：`TRUSTED BY INDUSTRY LEADERS`
- 不使用 `Trusted by Fortune 500`。42 个品牌并非全部属于《财富》世界 500 强，未经逐项证明不应作该声明。
- 桌面端：两行连续滚动，方向相反，速度略有差异，形成自然错位。
- 移动端：仍为两行，卡片缩小、速度减慢，允许看到完整品牌标识。
- 左右边缘：使用遮罩渐隐，避免滚动内容突然出现或消失。
- 卡片：深色半透明底、细边框、低对比默认态；悬停或键盘聚焦时提高 Logo 亮度和颜色饱和度。
- 不采用手写体标题，保持现有首页的字体语言。

## 4. 组件与数据边界

新增模块：

- `src/components/CustomerLogoWall.tsx`：只负责渲染和可访问性。
- `src/content/customerLogos.ts`：42 个品牌的名称、Logo 导入和行分组。
- `src/config/features.ts`：`customerLogoWall` 功能开关，默认关闭。
- `src/pages/CustomerLogoWallPreviewPage.tsx`：独立预览，不依赖首页开关。
- `src/assets/customer-logos/`：本地 Logo 文件。
- `docs/content-sources/customer-logo-wall.md`：品牌名称、当前状态、来源 URL、素材日期和来源类型。

`CustomerLogoWall` 不读取网络、不处理路由、不拥有功能开关。`App` 决定是否挂载；预览页可直接挂载组件。

首页接入方式：

```tsx
<Hero />
{featureFlags.customerLogoWall && <CustomerLogoWall />}
<Solutions />
```

预览路径：`/preview/customer-logo-wall`。该路径只用于开发验收，不加入主导航。

## 5. 品牌清单与最新版处理

共 42 个品牌，按两行各 21 个组织。组件内部为无缝循环复制可视节点，但内容数据只保存一份。

1. McDonald’s
2. Starbucks
3. Booking.com
4. Mondelēz International
5. Haitian / Haday
6. Huawei
7. Saint-Gobain
8. ECOVACS
9. Cartier
10. Shanghai Tower
11. Delphi
12. Chewy
13. HuaAn Funds
14. Fullgoal Fund
15. CICC
16. ChinaAMC
17. Xinjiang Bank
18. Changshu Rural Commercial Bank
19. Manulife-Sinochem
20. Guolian Minsheng Securities
21. Orange
22. Bloomage
23. FORVIA
24. IMG Academy
25. Yuwell
26. Innovent
27. WuXi AppTec
28. Fosun Pharma
29. Mevion
30. BY-HEALTH
31. Jiahua Chemicals
32. Amlogic
33. Beckman Coulter
34. Cepheid
35. Danaher
36. UBS
37. Henlius
38. Gilead
39. Sennics
40. CHN Energy
41. Bosch
42. Bekaert

必须执行的品牌更新：

- `Faurecia` 更新为 `FORVIA`。Faurecia 与 HELLA 在 2022 年组成 FORVIA 集团品牌。
- `国联证券 / Guolian Securities` 更新为 `国联民生证券 / Guolian Minsheng Securities`。公司在 2025 年完成更名。
- `Delphi` 继续保留 Delphi 标识，但来源记录注明其当前为 PHINIA 旗下品牌。
- `Haitian` 的中英文展示名称与官网当前 `Haday / 海天` 标识保持一致，以最终下载素材为准。

## 6. 素材来源与处理规则

来源优先级：

1. 品牌官网或官方媒体资料库。
2. 品牌当前官网页面中实际使用的 Logo 文件。
3. 无法从官网直接获取时，使用可信矢量资料源，并通过品牌官网、最近报告或官方应用交叉核对。

所有文件下载后转为本地静态资源，不在访客浏览首页时连接第三方服务器。SVG 保留矢量；只有栅格源时使用透明 PNG/WebP。不得拉伸、重绘、改变品牌比例或把截图白底带入深色卡片。

来源文档必须记录：显示名称、旧名称、源 URL、来源类型、获取日期、文件格式和是否经过裁切。Logo 仅用于表达客户/合作关系，最终上线前由 JOTO 确认这些关系和商标展示授权。

## 7. 动效与可访问性

- 两行轨道使用纯 CSS `transform` 动画，不增加动画依赖。
- 每条轨道包含两份相同序列，第二份设置 `aria-hidden="true"`。
- 图片的可访问名称使用品牌名，不使用文件名。
- `prefers-reduced-motion: reduce` 时停止滚动，改为可横向浏览的静态行，不隐藏任何品牌。
- 动画不响应鼠标位置，不制造视差，不阻塞页面滚动。
- 所有卡片固定尺寸，图片提供宽高约束，避免累计布局偏移。

## 8. 性能与失败处理

- 42 个源文件只加载一次；循环复制节点复用相同 URL，由浏览器缓存。
- 对栅格文件进行尺寸与体积检查，避免导入印刷级超大图片。
- 图片使用 `loading="lazy"` 和 `decoding="async"`，组件保留稳定占位尺寸。
- 单个素材加载失败时卡片显示品牌文字，不影响整条轨道。
- 构建时检查所有导入文件存在；缺失素材不能以远程 URL 临时替代。

## 9. 测试与验收

自动化测试：

- 功能开关关闭时，首页不存在 Logo 墙。
- 功能开关开启时，Logo 墙位于 Hero 与 Solutions 之间。
- 预览路径始终可渲染 Logo 墙。
- 42 个唯一品牌全部存在，循环副本不重复暴露给辅助技术。
- `FORVIA` 和 `Guolian Minsheng Securities` 存在；`Faurecia` 和旧 `Guolian Securities` 不作为显示名称出现。
- 素材失败时出现文字降级。

视觉验收：

- 桌面宽屏、标准笔记本、平板和手机宽度下均无横向页面溢出。
- Hero、Solutions 及现有导航锚点不发生回归。
- 两行循环衔接处无跳帧或明显空白。
- 减少动态效果模式下没有持续动画。
- 深色背景下各品牌可辨识，且 Logo 墙不会抢过 Hero 主标题。

## 10. 发布流程

1. 在独立工作树 `codex/joto-logo-wall` 完成素材、组件、预览页和测试。
2. 保持 `customerLogoWall` 默认关闭，提交验收版本。
3. 本地构建、测试和浏览器视觉验收全部通过后，再由用户决定是否开启首页开关或将分支合并到首页主线。
4. 开启前再次确认客户关系、商标使用授权与标题措辞。
