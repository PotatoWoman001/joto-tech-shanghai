# JOTO V2 About / Contact 独立页面与询盘表单设计

日期：2026-07-22

## 目标

在 `joto-site-v2` 中新增 `/about` 和 `/contact` 两个独立页面。页面借鉴只读参考项目 `/Users/cuihua/Downloads/joto-website-main/` 的信息结构，但完全沿用现有 JOTO V2 的黑色、JOTO 绿、硬边框网格、大字号编辑式排版与滚动显现动效。

现有 Landing Page 的 About 与 Contact 精简区块继续保留；主导航中的 About 和 Contact 改为进入独立页面。参考项目始终保持只读，不修改、不安装依赖、不生成构建产物。

## 已确认的视觉方向

- 采用独立完整页面方案，不把两个页面继续堆叠到 Landing Page。
- 页面宽度、响应式断点、字体、颜色和边框与现有 `joto-site-v2` 一致。
- About 使用黑色主体、JOTO 绿工作流程区块和黑色收尾 CTA。
- Contact 使用黑色 Hero、黑色询盘表单与联系方式卡片、JOTO 绿办公室区块和深色 Footer。
- 动效复用现有 `Reveal`，并继续遵守 `prefers-reduced-motion`。

## 页面结构

### `/about`

1. 复用全站 Header，About 导航项指向当前独立页面。
2. Hero：`About Us` 眉题、大标题、简介。
3. Who We Are：三段公司叙事、品牌引语、四项数据。
4. How We Work：Plan & Design、Build & Integrate、Run & Improve 三个阶段。
5. Global Presence：复用现有地区数据，以六列响应式网格展示。
6. CTA：进入 `/contact`，同时保留销售邮箱快速入口。
7. 复用全站 Footer。

### `/contact`

1. 复用全站 Header，Contact 导航项指向当前独立页面。
2. Hero：`Contact Us` 眉题、大标题和一个工作日内回复说明。
3. Project Brief 表单：位于 Hero 之后、三张联系方式卡片之前。
4. 联系方式卡片：Service Hotline、Shanghai HQ、Sales & Projects。
5. Our Offices：复用现有五个办公室地址，并增加 Global Delivery 引导卡。
6. 复用全站 Footer。

## 询盘表单

### 字段

- `name`：姓名，必填，最多 100 个字符。
- `company`：企业或组织名称，必填，最多 160 个字符。
- `email`：工作邮箱，必填，使用浏览器和服务端双重邮箱格式校验，最多 254 个字符。
- `phoneOrWechat`：手机号或微信，选填，最多 100 个字符；不假设客户一定来自中国。
- `message`：想要解决的问题，必填，最多 5,000 个字符。
- `website`：隐藏蜜罐字段，正常用户保持为空；机器人填写时服务端拒绝请求。

### 用户状态

- 初始状态：按钮为 `Send project brief`。
- 校验失败：字段旁显示清晰的英文错误信息，并把焦点移到第一个错误字段。
- 提交中：按钮禁用并显示 `Sending…`，避免重复提交。
- 成功：显示确认信息，保留用户已提交内容，按钮改为已完成状态。
- 失败：显示可重试说明，并提供 `sales@jototech.cn` 的 `mailto:` 备用入口。

## 路由与组件边界

项目继续使用当前轻量路径分发方式，不新增 React Router：

- `App.tsx` 根据 `window.location.pathname` 分发 `/about`、`/contact` 和现有 Partner Detail 页面。
- `Header.tsx` 把“是否需要返回首页锚点”的判断从 Solution Detail 扩展到所有非首页路径。
- 内容配置中的 About、Contact 链接改为 `/about`、`/contact`；其他首页区块仍从内页返回 `/#section`。
- 新增独立的 `AboutPage` 与 `ContactPage`，页面布局不塞进 `App.tsx`。
- 从当前 `ContactFooter` 中提取可复用的 `SiteFooter`；Landing Page 继续组合 Contact 区块与 Footer，两个独立页面只复用 Footer。
- 共用页面 Hero、页面外壳和内容网格可以抽成小型展示组件，但不创建与本次需求无关的设计系统。

阿里云 OSS 使用单页应用路由时，需要把未命中的 `/about`、`/contact` 和 `/solutions/...` 请求回退到 `index.html`；部署说明中会明确这项配置。

## 表单数据流

1. 浏览器完成基础校验后，向同源 `/api/contact` 发送 JSON `POST`。
2. 阿里云函数计算中的 Node.js HTTP 函数限制请求方法、请求体大小和 `Content-Type`，再次执行字段校验与蜜罐检查。
3. 函数使用阿里云邮件推送官方 Node.js SDK 调用 `SingleSendMail`。
4. 收件人为 `sales@jototech.cn`；主题包含企业名称和联系人姓名，正文包含所有表单字段。
5. 函数只返回成功或可公开的错误代码，不把阿里云 SDK 错误、AccessKey 或邮件配置返回给浏览器。
6. 页面不建立数据库，不持久化询盘；邮件推送日志由阿里云平台记录。

## 阿里云配置与安全

函数计算环境变量：

- `ALIBABA_CLOUD_ACCESS_KEY_ID`
- `ALIBABA_CLOUD_ACCESS_KEY_SECRET`
- `ALIYUN_DM_ACCOUNT_NAME`：在邮件推送控制台验证的发件地址。
- `ALIYUN_DM_TO_ADDRESS`：设置为 `sales@jototech.cn`。
- `ALIYUN_DM_FROM_ALIAS`：设置为 `JOTO Website`。

使用仅具有 `dm:SingleSendMail` 权限的 RAM 身份，遵循最小权限原则，不使用阿里云主账号 AccessKey。服务端接受同源请求；生产环境通过 `jotoglobal.com/api/contact` 暴露函数，不在前端配置跨域密钥或 SMTP 密码。

首版反滥用措施包括隐藏蜜罐、长度限制、方法限制和提交按钮防重复。上线时在阿里云 API 网关、WAF 或函数触发器层设置按 IP 的速率限制；速率限制属于部署配置，不依赖浏览器实现。

## 错误处理

- `400`：字段缺失、格式错误、请求体过大或蜜罐命中。
- `405`：非 `POST` 请求。
- `415`：不是 `application/json`。
- `500`：邮件接口调用失败；服务端记录请求 ID，前端显示通用错误和邮件备用入口。
- `503`：部署环境变量未配置完整；前端显示通用错误，不暴露缺少的变量名。

## 测试与验收

### 前端自动化测试

- `/about` 和 `/contact` 路径分别渲染正确页面。
- 首页导航进入独立页面，内页的首页区块链接正确返回 `/#section`。
- 表单必填、邮箱格式和可选字段行为正确。
- 提交中、成功、服务器失败和网络失败状态正确。
- 手机号或微信为空时仍可成功提交。
- Header、Footer 和现有 Partner Detail 路由没有回归。

### 服务端自动化测试

- 正确请求生成预期邮件主题和正文。
- 缺少必填字段、非法邮箱、超长字段、蜜罐命中、错误方法和错误内容类型被拒绝。
- SDK 失败时返回安全的通用错误，日志中不包含 AccessKey Secret。
- 环境变量缺失时不尝试发送邮件。

### 视觉与构建验收

- 运行 `npm test -- --run` 与 `npm run build`。
- 在桌面与移动视口检查 About、Contact、导航菜单和表单交互。
- 检查键盘焦点、错误信息关联、按钮状态和减少动态效果设置。
- 不向真实邮箱发送测试询盘；生产发送只在用户完成阿里云邮件推送和函数环境变量配置后验证。

## 部署交付

- 前端构建产物继续由 Vite 生成，可部署到阿里云 OSS 静态网站并绑定 `jotoglobal.com`。
- `/api/contact` 作为独立 Node.js 函数计算代码包交付，包含环境变量清单与部署说明。
- 函数通过 HTTP 触发器或自定义域名暴露，并在 `jotoglobal.com` 下以同源 `/api/contact` 访问。
- 阿里云邮件推送需要先启用服务、验证发送域名和发件地址，再配置 RAM 权限与函数环境变量。

## 非目标

- 不修改只读参考项目。
- 不增加数据库、CRM、文件附件、营销订阅、验证码或后台管理页面。
- 不在这一阶段部署或修改 `jotoglobal.com` 的 DNS、OSS、函数计算、WAF 或邮件推送账号配置。
- 不发送真实询盘邮件，避免在开发和自动化测试中产生外部影响。

## 官方依据

- 阿里云函数计算 Web 函数与 HTTP 调用：<https://help.aliyun.com/en/functioncompute/fc/web-functions>
- 阿里云函数计算 Node.js 代码包部署：<https://help.aliyun.com/en/functioncompute/fc/deploy-a-code-package>
- 阿里云邮件推送 `SingleSendMail`：<https://help.aliyun.com/en/direct-mail/api-dm-2015-11-23-singlesendmail>
- 阿里云邮件推送快速开始：<https://help.aliyun.com/en/direct-mail/getting-started/simplified-procedure-of-sending-by-api-and-smtp>
- 阿里云邮件推送安全与最小权限建议：<https://help.aliyun.com/en/direct-mail/api-dm-2015-11-23-overview>
