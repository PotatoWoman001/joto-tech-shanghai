# JOTO TECH V2

JOTO TECH 英文官网。首页采用统一深色企业技术风格，包含 Hero、Solutions、Services、Case Studies、About、Global Presence 和 Contact，并提供独立的 `/about`、`/contact` 与 Cisco Solution 页面。

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
- 统一管理后台：生产环境的 `/api/captcha` 和 `/api/contact` 由 Nginx
  转发到 `admin.jotoai.com`，留言在统一后台落库并触发邮件/飞书通知。
- 百度统计：设置公开构建变量 `VITE_BAIDU_TONGJI_ID` 后记录页面访问和
  表单转化；未设置时统计静默停用。

Contact 表单固定请求同源 `/api/captcha` 与 `/api/contact`，以保留真实
来源域名并避免浏览器跨域。开发环境可用仅服务端读取的
`ADMIN_API_ORIGIN` 改写代理目标。

这里的“沿用”只表示继续使用用户资料文件夹里已经配置好的前端开发工具，不代表复制旧网站后台、数据库或页面视觉。

## 内容与结构

- 英文内容入口：`src/content/en.ts`
- 内容类型：`src/content/types.ts`
- 厂商一手来源记录：`docs/content-sources.md`
- Solution 导航：`SOLUTIONS → 分类 → 厂商`
- 厂商锚点规则：`#solution-network-cisco`

手机端 Solution 菜单采用单分类折叠，默认展开 Network；桌面端采用五列下拉菜单。后续 Cisco 详情页完成后，可把 Cisco 节点的锚点直接替换为正式详情页 URL。

## 上线前配置

- 中文、波斯语切换
- 正式 SEO 配置
- 阿里云 OSS 的 SPA 路由回退
- 统一后台的站点巡检登记与百度统计属性

上线前需要复核合作等级、案例公开授权、办公地址、联系方式和缺失的官方品牌素材。完整记录见 `docs/qa-report.md`。
