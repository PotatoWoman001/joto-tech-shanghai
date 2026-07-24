# JOTO Global ECS 生产部署设计

日期：2026-07-24

## 目标

把 `joto-site-v2` 部署到用户现有的阿里云上海 ECS，并使用
`jotoglobal.com` 与 `www.jotoglobal.com` 对外提供三语言企业官网。
部署必须与服务器上现有的 `jotoai.com`、`bydata.net` 等站点隔离，
不得覆盖现有目录、Nginx 配置、进程或证书。

## 已确认的服务器条件

- 系统：Ubuntu 24.04 LTS，阿里云上海地域。
- 公网地址：用户指定的现有 ECS 公网地址。
- Web 服务：Nginx 1.24 已运行并监听 80、443。
- 运行时：Node.js 22、npm 10。
- 证书：Certbot 已安装并启用自动续期定时器。
- 进程管理：PM2 已安装；本方案对新服务使用 systemd，避免依赖现有
  PM2 应用清单。
- 资源：磁盘和内存足以承载静态官网及轻量联系表单服务。
- 服务器已配置可用的 Resend 邮件发送能力。

## 选定方案

采用独立的 Nginx 静态站点和独立 Node.js 联系表单服务。新服务复用
服务器现有的 Resend 邮件凭据，但不修改或调用现有强制验证码的联系
表单接口。

未采用的方案：

1. 修改现有 3004 端口后台：该后台服务多个旧站并强制验证码，变更会
   扩大回归范围。
2. 立即接入阿里云邮件推送：需要额外的控制台权限和 AccessKey，可在
   后续作为邮件提供方迁移，不阻塞本次上线。

## 部署结构

前端使用版本化目录和原子软链接：

```text
/var/www/jotoglobal/
├── releases/
│   └── <release-id>/
└── current -> releases/<release-id>
```

联系表单服务使用独立目录：

```text
/opt/jotoglobal-contact/
├── app/
└── current -> app
```

运行配置：

```text
/etc/jotoglobal-contact.env
/etc/systemd/system/jotoglobal-contact.service
/etc/nginx/sites-available/jotoglobal.com
/etc/nginx/sites-enabled/jotoglobal.com
/etc/nginx/conf.d/jotoglobal-rate-limit.conf
```

## 请求数据流

静态页面请求由 Nginx 直接读取
`/var/www/jotoglobal/current`。深层页面使用
`try_files $uri $uri/ /index.html` 回退到 React 入口。

`POST /api/contact` 由 Nginx 转发到
`127.0.0.1:9000/api/contact`。Node.js 服务负责：

1. 校验来源域名、请求方法和 `Content-Type`。
2. 将请求体限制为 16 KB。
3. 校验必填字段、长度、邮箱格式和隐藏蜜罐字段。
4. 通过 Resend 把询盘发送到现有管理员收件地址。
5. 返回前端已有协议：成功为 `{ "ok": true }`，失败使用安全错误码，
   不向客户端泄露提供商或密钥信息。

## 邮件凭据与隔离

Resend API Key、发件地址和收件地址写入
`/etc/jotoglobal-contact.env`，文件权限设为 `0600`。凭据通过服务器
本地脚本从现有配置中读取并写入新服务环境文件，不输出到终端、不下载
到本地、不写入 Git。

新服务仅监听 `127.0.0.1:9000`，公网不能绕过 Nginx 直接访问。
systemd 使用专用低权限用户运行，并启用基础的文件系统与权限隔离。

## Nginx 行为

- `jotoglobal.com` 为 canonical 主域名。
- `www.jotoglobal.com` 在 HTTPS 可用后永久跳转到主域名。
- `/assets/` 使用一年缓存和 `immutable`。
- `index.html`、`robots.txt`、`sitemap.xml` 使用短缓存或不缓存。
- 其他前端路径执行 SPA 回退。
- `/api/contact` 禁止缓存，限制请求体大小，并按 IP 限流。
- 添加 `X-Content-Type-Options`、`Referrer-Policy`、
  `Permissions-Policy` 和 `X-Frame-Options` 等安全响应头。
- 不在首发阶段启用 HSTS；待 HTTPS 稳定并确认全部子域策略后再启用。

## 域名和 HTTPS

首个候选版本先使用公网 IP 和显式 `Host` 请求验证，不依赖 DNS。
生产切换需要为根域名和 `www` 添加指向 ECS 公网地址的 A 记录。

DNS 生效且 80 端口可从公网访问后，使用 Certbot 为
`jotoglobal.com` 和 `www.jotoglobal.com` 申请证书。申请成功后：

- 强制 HTTP 跳转 HTTPS。
- `www` 永久跳转到 `https://jotoglobal.com`。
- TLS 配置复用服务器已有的 Certbot 安全配置和自动续期。

服务器没有阿里云 CLI 或实例 RAM 角色，因此仅凭服务器 root 权限不能
修改云解析记录。若无其他 DNS API 凭据，DNS A 记录是唯一需要用户在
域名控制台完成的操作。

## 错误处理与日志

- Nginx 记录访问与错误日志，不记录请求体。
- Node.js 日志仅记录请求 ID、状态和提供商错误摘要，不记录表单正文、
  邮件凭据或完整个人信息。
- 邮件发送失败时前端收到通用失败信息并显示现有销售邮箱兜底。
- systemd 设置自动重启，健康检查使用本机
  `GET http://127.0.0.1:9000/healthz`。

## 发布与回滚

发布步骤：

1. 上传新的前端发布目录和联系表单应用目录。
2. 安装服务端生产依赖。
3. 验证 systemd 服务健康。
4. 备份当前 Nginx 配置并运行 `nginx -t`。
5. 原子切换 `current` 软链接。
6. 平滑重载 Nginx。
7. 使用显式 Host 请求验收静态页面、SPA 路由和表单 API。

回滚步骤：

1. 把 `current` 软链接切回前一版本。
2. 恢复部署前的 Nginx 配置备份。
3. 将联系表单 systemd 服务切回前一应用目录。
4. 运行 `nginx -t` 后平滑重载。

本次是该域名首次部署，若不存在前一版本，回滚方式是禁用新增站点配置，
不会影响服务器已有虚拟主机。

## 验收标准

- 前端 177 项测试、SEO 文件测试、联系表单测试全部通过。
- `npm run build` 成功并生成 `index.html`、`robots.txt`、
  `sitemap.xml`。
- 英文、中文、波斯语公开路径可直接访问和刷新。
- 波斯语页面保持 RTL，页面无横向溢出。
- 静态资源缓存策略、SPA 回退和安全响应头正确。
- `/healthz` 本机返回 200。
- 合法表单返回成功并收到测试邮件。
- 非法 Origin、错误类型、超限请求和蜜罐请求被拒绝。
- Nginx 配置检查通过，服务器现有站点在部署前后均保持可用。
- DNS 切换后根域名、`www` 跳转、HTTPS、证书续期和搜索引擎文件均正常。
