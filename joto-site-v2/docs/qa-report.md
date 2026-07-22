# JOTO TECH V2 验收记录

验收日期：2026-07-22

## 自动检查

- 单元与集成测试：15 项全部通过。
- TypeScript 类型检查：通过。
- Vite 生产构建：通过。
- 旧模板、已排除业务、废弃视频效果包和旧 CDN 引用扫描：无残留。
- 五个 Solution 分类、19 个厂商、5 个明确合作等级与确认清单一致。

## 浏览器检查

- 桌面端：1440 × 1000。
- 手机端：390 × 844。
- HLS 视频状态：已加载、自动播放、静音，实际使用指定 Mux 地址。
- 页面宽度：桌面和手机均无横向溢出。
- 桌面菜单：五列 `SOLUTIONS → 分类 → 厂商` 下拉正常。
- 手机菜单：五个分类手风琴正常，默认仅展开 Network；切换分类时上一项收起。
- 页面区块：Hero、Solutions、Services、Case Studies、About、Partners、Global Presence、Contact 全部可见。
- 控制台：无页面错误。
- 减少动态效果模式：停止 HLS 初始化并保留深色静态背景。

## 截图

- `docs/screenshots/desktop-home.png`
- `docs/screenshots/desktop-solutions-menu.png`
- `docs/screenshots/desktop-full.png`
- `docs/screenshots/mobile-home.png`
- `docs/screenshots/mobile-solutions-menu.png`

## 上线前待确认

- 核对 Cisco、Extreme Networks、Sangfor、Palo Alto Networks、Fortinet 合作等级的当前有效性和正式英文称谓。
- 核对案例公开授权和最终项目范围文案。
- 核对办公地址、全球服务覆盖、电话和销售邮箱。
- 补充当前使用文字回退的官方 Logo 原文件。
- 完成新域名 SEO：标题策略、描述、结构化数据、站点地图、跳转规则和搜索引擎提交。
- 后续接入三语言、Solution 详情页、联系表单数据库与邮件服务。

本版本保持本地运行，未修改原网站，未部署到线上环境。

## Customer Logo Wall Preview — 2026-07-22

- 分支：`codex/joto-logo-wall`
- 独立预览：`/preview/customer-logo-wall`
- 正式首页开关：关闭；`#solutions` 仍直接跟在 Hero 后面
- 加载隔离：首页网络记录中无 `CustomerLogoWall` 模块和客户 Logo 请求；预览/开启时才按需加载独立代码块
- 素材：42 个品牌、两行各 21 个，运行时全部使用本地资源
- 更名核验：FORVIA；Guolian Minsheng Securities
- 自动测试与生产构建：通过
- 浏览器尺寸：1440×1000、390×844；均无页面级横向溢出
- 图片加载：84 个 DOM 图片节点（含无障碍隐藏的循环副本），0 个损坏、0 个外站请求
- 动效：两行连续滚动且方向相反；悬停暂停
- 减少动态效果：动画为 `none`，循环副本隐藏，原始列表可横向滚动
- 控制台：无页面错误
- 截图：`docs/screenshots/customer-logo-wall-desktop.png`、`docs/screenshots/customer-logo-wall-mobile.png`
