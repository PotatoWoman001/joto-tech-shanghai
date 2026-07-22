# JOTO TECH V2

JOTO TECH 英文首版单页官网。页面采用统一深色企业技术风格，包含 Hero、Solutions、Services、Case Studies、About、Partners、Global Presence 和 Contact。

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

生产构建与测试：

```bash
npm test -- --run
npm run build
```

## 技术说明

- Vite：本地开发和生产构建工具。
- React 18 + TypeScript：页面组件和类型化内容结构。
- Tailwind CSS 3.4：响应式布局与视觉样式。
- hls.js：播放 Hero 的 Mux HLS 视频，已按要求关闭 Worker。
- Lucide React：导航和按钮图标。

这里的“沿用”只表示继续使用用户资料文件夹里已经配置好的前端开发工具，不代表复制旧网站后台、数据库或页面视觉。

## 内容与结构

- 英文内容入口：`src/content/en.ts`
- 内容类型：`src/content/types.ts`
- 厂商一手来源记录：`docs/content-sources.md`
- Solution 导航：`SOLUTIONS → 分类 → 厂商`
- 厂商锚点规则：`#solution-network-cisco`

手机端 Solution 菜单采用单分类折叠，默认展开 Network；桌面端采用五列下拉菜单。后续 Cisco 详情页完成后，可把 Cisco 节点的锚点直接替换为正式详情页 URL。

## 第一版暂不包含

- Solution 详情页
- 中文、波斯语切换
- 表单后端、邮件和数据库连接
- 正式 SEO 配置
- 线上部署

上线前需要复核合作等级、案例公开授权、办公地址、联系方式和缺失的官方品牌素材。完整记录见 `docs/qa-report.md`。
