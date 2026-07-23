# 首页 Partner Logo 墙设计

## 背景与目标

当前首页 Partners 区块使用较高的内容卡片，每张卡片除 Logo 外还显示合作等级、品牌名称和说明文字。19 个品牌在四列布局中占用较高的页面空间，而且“Partner”“Gold Partner”“Platinum Partner”混合出现时视觉不统一。

本次调整把该区块改为紧凑的静态 Logo 墙：完整保留合作品牌，但每张卡片只显示 Logo，通过排序体现合作优先级，不再显示任何合作等级或说明文字。

## 品牌顺序

前八个品牌固定按以下顺序展示：

1. Cisco
2. Extreme Networks
3. Sangfor
4. Fortinet
5. Palo Alto Networks
6. KnowBe4
7. Verkada
8. Hikvision

其中 Cisco、Extreme Networks、Sangfor、Fortinet 是现有数据中的 Gold Partner，统一排在最前。其余未指定品牌继续保留，并按现有技术组合进行稳定排序：Aruba、Check Point、OneLogin、Dell Technologies、Huawei、Inspur、AudioCodes、Vodia、CyberData、InformaCast、Keyking。

## 布局与视觉

- 保留现有区块标题、眉题和说明文字，但压缩标题与 Logo 墙之间的距离及区块上下留白。
- Logo 墙使用静态响应式网格：手机和平板 3 列、普通桌面 4 列、宽桌面 5 列。
- 每张卡片高度约 96–112px，使用细边框、深色半透明底和轻微悬停反馈。
- 卡片内只显示居中的 Logo；不显示等级徽章、品牌名称、说明文字或通用 “Partner” 标签。
- 所有 Logo 使用有限的视觉尺寸档位控制最大高度和宽度，避免宽字标、方形标志和小图标视觉重量失衡。
- 默认状态保持低饱和浅色效果；悬停时提高亮度与不透明度，不恢复等级标签。

## 素材迁移

当前项目已包含 Cisco、Extreme Networks、Aruba、Sangfor、Palo Alto Networks、Fortinet、Check Point、Dell Technologies、Huawei、AudioCodes、Verkada、Hikvision 的 Logo。

从原始 `joto-website/public/logos/` 迁入当前缺失的正式素材：KnowBe4、OneLogin、Inspur、Vodia、CyberData、Singlewire InformaCast、Keyking。迁入后首页 Logo 墙不再使用纯文字回退；文件保存在当前项目的 `src/assets/logos/` 并通过 Vite 静态导入。

## 数据与组件边界

- `src/content/en.ts` 负责每个 Partner 的 Logo 引用和最终稳定顺序。
- `src/content/types.ts` 中现有 `Vendor` 结构继续复用；如需视觉尺寸档位，只增加可选的展示字段，不改变解决方案分类数据的业务含义。
- `src/components/Partners.tsx` 仅负责紧凑网格和 Logo 展示，不再渲染等级与说明。
- 不修改解决方案菜单或解决方案区块中的合作等级显示；本次移除只针对首页 Partners Logo 墙。

## 无障碍与异常处理

- 每张 Logo 图片保留 `${partner.name} logo` 替代文本。
- 若单张图片加载失败，则在卡片中显示品牌名称作为回退，避免空卡片。
- 网格保持 DOM 顺序与视觉顺序一致，键盘和读屏顺序遵循已确认的优先级。

## 验证

1. 单元测试确认前八个品牌顺序完全匹配已确认列表。
2. 组件测试确认 19 张卡片全部存在，且不出现 “Partner”“Gold Partner”“Platinum Partner” 和品牌说明。
3. 检查所有 19 个 Partner 都使用 Logo 图片，不依赖正常状态下的文字回退。
4. 运行完整 Vitest 测试与 Vite 生产构建。
5. 通过浏览器在 1440px 桌面和 390px 手机宽度截图，检查桌面 5 列、手机 3 列、区块高度、Logo 视觉大小和图片加载状态。
