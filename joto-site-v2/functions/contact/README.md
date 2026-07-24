# JOTO Contact Function

> 状态：自 `jotoglobal.com` 接入 `admin.jotoai.com` 后，本目录不再承接
> 生产联系表单，仅保留用于紧急回滚和历史部署复现。生产请求不得同时
> 写入本服务与统一后台。

阿里云函数计算 Web 函数，用于接收 `jotoglobal.com` 的询盘表单并通过阿里云邮件推送发送到销售邮箱。

## 本地运行

```bash
npm install
npm test
npm start
```

前端 Vite 开发服务器会把 `/api/contact` 代理到 `http://localhost:9000`。未配置邮件环境变量时，函数会返回 `503`，不会尝试发送邮件。

默认前端请求同源 `/api/contact`。如果部署架构不提供同源路径转发，可以在构建前设置 `VITE_CONTACT_API_URL` 为函数计算的 HTTPS 地址；函数会对 `ALLOWED_ORIGINS` 中的来源返回 CORS 响应。

## 函数计算配置

- 运行环境：Custom Runtime / Node.js 20
- 启动命令：`npm start`
- 监听端口：`9000`
- HTTP 触发器：允许匿名访问，由表单校验、Origin 白名单和阿里云网关限流共同保护
- 自定义域名路由：`jotoglobal.com/api/contact`

环境变量：

- `ALIBABA_CLOUD_ACCESS_KEY_ID`
- `ALIBABA_CLOUD_ACCESS_KEY_SECRET`
- `ALIYUN_DM_ACCOUNT_NAME`：阿里云邮件推送中已验证的发件地址
- `ALIYUN_DM_TO_ADDRESS=sales@jototech.cn`
- `ALIYUN_DM_FROM_ALIAS=JOTO Website`
- `ALIYUN_DM_ENDPOINT=dm.aliyuncs.com`（可选）
- `ALLOWED_ORIGINS=https://jotoglobal.com,https://www.jotoglobal.com`（可选）

RAM 身份只授予 `dm:SingleSendMail` 权限。不要使用主账号 AccessKey，也不要把环境变量写入前端、Git 或 OSS 文件。

## 部署提醒

1. 在阿里云邮件推送中启用服务并验证发送域名和发件地址。
2. 在函数计算中创建 Web 函数并上传本目录（包含安装后的依赖）作为代码包。
3. 设置启动命令、端口和环境变量。
4. 把 `/api/contact` 路由到该函数，并在 API 网关或 WAF 中设置按 IP 限流。
5. OSS 静态网站需要把 `/about`、`/contact` 和 `/solutions/...` 的未命中请求回退到 `index.html`。

官方说明：

- <https://help.aliyun.com/en/functioncompute/fc/web-functions>
- <https://help.aliyun.com/en/functioncompute/fc/deploy-a-code-package>
- <https://help.aliyun.com/en/direct-mail/api-dm-2015-11-23-singlesendmail>

## ECS + Resend 配置

在 ECS 上，服务通过 Nginx 反向代理并仅监听
`127.0.0.1:9000`。配置以下环境变量时，服务优先使用 Resend：

- `RESEND_API_KEY`
- `RESEND_FROM_ADDRESS`
- `RESEND_TO_ADDRESS`
- `ALLOWED_ORIGINS=https://jotoglobal.com,https://www.jotoglobal.com`
- `PORT=9000`
- `HOST=127.0.0.1`

Resend 和阿里云邮件推送均未完整配置时，接口返回 `503`。不要把上述
变量写入前端、Git 或公开目录。
