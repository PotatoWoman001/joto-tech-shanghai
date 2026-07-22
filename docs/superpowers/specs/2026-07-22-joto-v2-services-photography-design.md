# JOTO V2 服务卡真实摄影与案例 Logo 设计

日期：2026-07-22

## 目标

为 `END-TO-END DELIVERY` 的四张服务卡加入真实摄影图片，缓解纯文字构图，同时保持页面克制、紧凑；修复 Starbucks 案例卡中变成白色空心圆的 Logo。

## 已确认的图片

图片全部来自普通 Unsplash 摄影页面，不使用 AI 生成界面，也不采用带 Unsplash+ 水印的预览图。

1. `Advisory & Planning`
   - 场景：团队围绕电脑协作与讨论。
   - 摄影：Annie Spratt。
   - 页面：https://unsplash.com/photos/group-of-people-using-laptop-computer-QckxruozjRg
   - Alt：`Technology team collaborating around laptops during a planning workshop`
2. `Design & Integration`
   - 场景：真实服务器机柜与网络布线。
   - 摄影：Taylor Vick。
   - 页面：https://unsplash.com/photos/cable-network-M5tzZtFCOfs
   - Alt：`Network cabling and active equipment inside enterprise server racks`
3. `Security & Compliance`
   - 场景：真实安全监控中心与多屏操作台。
   - 摄影：Tasha Kostyuk。
   - 页面：https://unsplash.com/photos/a-man-sitting-in-front-of-multiple-monitors-TtMKq3lJm-U
   - Alt：`Security operator monitoring multiple live systems in a control center`
4. `Managed Services & Support`
   - 场景：真实 IT 团队在多显示器办公环境中工作。
   - 摄影：Compagnons。
   - 页面：https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-monitor-Fa9b57hffnM
   - Alt：`IT support team working across multiple desktop systems in an office`

最终资源下载到项目本地并转换为 WebP，不使用远程热链。每张目标体积控制在约 120KB 以内，最长边保留约 1200px。

## 服务卡布局

采用右侧小型内嵌图片方案，不使用整卡背景图。

- PC 卡片最小高度从约 400px 增至约 440px。
- 每张卡上半部分由文字区和右侧图片区组成；图片约占可用宽度的 34%，最大宽度约 220px，使用约 3:2 横向裁切。
- 编号、标题和说明保持左对齐；功能点列表继续位于卡片下部，并使用剩余完整宽度。
- 图片增加轻微暗化、降饱和与绿色调遮罩，四张图保持一致的 JOTO 视觉语言，但人物和设备仍清楚可辨。
- 图片边缘使用现有细线边框，不增加圆角或大面积装饰。

### 响应式行为

- 1024px 及以上：文字在左、图片在右，功能点列表横跨底部。
- 1024px 以下：图片移到说明文案之后、功能点之前，使用约 96–120px 的浅横向画幅，避免左右栏过窄。
- 卡片仍保持现有两列/单列断点，不改变服务区整体网格逻辑。
- 图片使用 `loading="lazy"` 和明确的 Alt 文本。

## Starbucks Logo 修复

当前 Starbucks SVG 本身包含白色圆底和绿色图形。案例组件统一应用 `brightness-0 invert` 后，绿色细节被压成白色，因此只剩白圆。

采用内容模型驱动的 Logo 显示方式：

- `CaseStudy` 增加可选字段 `logoTreatment: "light" | "original"`。
- 默认值为 `light`，继续适配 Harrow、Danaher、JD 等现有 Logo。
- Starbucks 设置为 `original`，移除反色滤镜，显示原始绿白标志。
- 不按客户名称在组件内写条件判断。

## 测试与验收

- 内容测试确认四项服务都有本地图片和准确 Alt 文本。
- 案例测试确认 Starbucks 使用 `original` Logo 处理方式。
- 视觉验证覆盖 375×812、768×900、1024×768 和 1440×900。
- 四张服务图片真实可辨，卡片高度仅适度增加，文字与功能点不被遮挡。
- Starbucks Logo 显示绿色细节，不再呈现空白白圆。
- 页面无横向溢出，完整测试和生产构建通过。

