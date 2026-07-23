# Cisco 网络动画与 Chewy Logo 修正设计

## 目标

让 Cisco 详情页首屏动画直接表达 Cisco 企业园区网络的设备关系与管理方式，同时修正案例区 Chewy 品牌标识不可辨认的问题。

## 设计依据

- Cisco Catalyst 9300 是 24/48 端口企业园区接入交换机，适合表现端口、上联和 PoE 接入状态。
- Cisco Catalyst 9166 是圆角方形无线接入点，适合表现无线覆盖和客户端连接。
- Cisco Catalyst Center 的核心视觉语义是拓扑、设备健康、客户端体验、告警和自动化，而不是连续示波器波形。
- Chewy 的标准字标是透明背景上的蓝色小写圆体 `chewy`；现有蓝底白字 SVG 与页面反色滤镜叠加后失去辨识度。

参考：

- https://www.cisco.com/site/uk/en/products/networking/switches/catalyst-9300-series-switches/index.html
- https://www.cisco.com/c/en/us/products/collateral/wireless/catalyst-9166-series-access-points/catalyst-9166-series-access-points-ds.html
- https://www.cisco.com/site/us/en/products/networking/catalyst-center/index.html
- https://investor.chewy.com/news-and-events/news/news-details/2022/Chewy-Launches-Letters-to-Chewy-Claus-to-Grant-Wishes-and-Bring-Joy-to-Thousands-of-Pets-Across-the-Country/default.aspx

## 首屏视觉

保留现有真实设备合成图，包括两台无线接入点、Catalyst 交换机组和运行管理界面的笔记本。移除叠加在笔记本上的通用三色波形和快速闪烁读数，改为一套与硬件位置对应的网络拓扑动画。

动画分为四层：

1. 交换机端口以低频、错峰方式点亮，模拟链路建立和 PoE 端口活动。
2. 两条细线从交换机上联端口连接到两台 AP，数据脉冲沿线向 AP 移动。
3. AP 周围出现两到三圈低透明度无线波纹，在线时缓慢扩散，避免雷达或声呐感。
4. 笔记本屏幕显示简化 Catalyst Center 风格拓扑：核心交换机、两个 AP、客户端节点和健康状态环。节点状态随链路脉冲轻微响应，但不使用虚假的连续生理波形。

上方读数区改为 `NETWORK HEALTH`、`CONNECTED DEVICES`、`ACCESS POINTS`、`UPLINK` 等与网络运营相关的稳定指标。数值只做低频更新，状态文案使用 `CATALYST CENTER / SITE-01`、`ASSURANCE ACTIVE` 和 `NO CRITICAL ISSUES`。

## 动效节奏

- 完整循环为 6–8 秒，交换机端口、链路脉冲和 AP 波纹错峰运行。
- 位移不超过 4px，发光范围有限，保持企业级技术感。
- 悬停首屏设备区域时提高链路与拓扑节点亮度，但不改变内容布局。
- `prefers-reduced-motion: reduce` 下停止位移、脉冲和数值切换，仅保留稳定在线状态。

## Chewy Logo

- 将现有 SVG 改为透明背景、官方蓝色字标，不重绘字形路径。
- 案例数据增加明确的 Logo 显示模式，使 Chewy 使用品牌原色，其他适合单色展示的 Logo 继续使用白色处理。
- 避免把同一张 Logo 同时作为品牌图和纯文字标题重复强调；Logo 负责品牌识别，标题继续承担无障碍和信息层级。

## 组件边界

- `NetworkTelemetryScreen.tsx` 负责 Cisco 拓扑和笔记本屏幕动画。
- 新增或重构小型设备连接图层时，其输入保持静态，不引入网络请求和第三方动画库。
- `PartnerDetailPage.tsx` 只负责把 Cisco 专属动画放入首屏，以及根据案例数据选择 Logo 显示模式。
- `partners.ts` 为案例 Logo 增加可选显示模式，不把 Chewy 判断硬编码进通用页面组件。

## 测试与验收

- 组件测试确认 Cisco 页面存在拓扑图层、交换机端口、两个 AP 节点和 Catalyst Center 状态文案。
- 组件测试确认 Chewy 使用品牌色模式，且 Logo 不再应用 `brightness-0 invert`。
- 英文、中文和波斯语页面均保持结构和动画一致。
- 桌面端重点验收首屏设备与动画位置；手机端允许简化连线，但不得横向溢出。
- 浏览器控制台不得出现错误；完整测试与生产构建通过。

## 非目标

- 不复制 Cisco Catalyst Center 的完整界面或专有交互。
- 不新增视频、WebGL 或重量级动画依赖。
- 不更改 Cisco 页面正文、案例事实和整体版式。
