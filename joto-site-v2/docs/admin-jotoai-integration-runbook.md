# admin.jotoai.com 接入运行手册

## 不可变边界

- 后台仓库 `xutomi3-art/jotoai-website-final` 只读。
- 官网留言只写入统一后台一次。
- 后台密钥、管理员令牌和百度访问令牌不写入本仓库。

## 后台站点登记

在 `admin.jotoai.com` 的“站点管理”中新增：

- ID：`jotoglobal`
- 名称：`JOTO TECH`
- URL：`https://jotoglobal.com`
- 描述：`JOTO TECH 全球企业 IT 解决方案官网`
- 图标：留空
- 强调色：`#5ee594`

保存后在“健康巡检”确认站点存在并返回 2xx。

## 百度统计登记

在后台当前使用的同一百度统计账户中新增 `jotoglobal.com`，复制该属性
的公开跟踪 ID。构建时设置：

    VITE_BAIDU_TONGJI_ID="$JOTO_BAIDU_TONGJI_ID" npm run build

跟踪 ID 可出现在前端；账户访问令牌不可进入终端记录或 Git。

## ECS 发布

1. 运行全部测试和生产构建。
2. 上传新的静态发布目录和 `jotoglobal-locations.conf` 候选文件。
3. 备份当前 Nginx 片段和 `current` 软链接目标。
4. 运行 `nginx -t`。
5. 原子切换 `current`，安装新片段，再次运行 `nginx -t`。
6. 平滑重载 Nginx。

## 验收

- `/api/captcha` 返回 200、`Cache-Control: no-store` 和有效图片。
- 用户允许后提交 `JOTO Deployment Check` 测试留言。
- 后台留言列表只出现一条，来源为 `jotoglobal.com`。
- 统一邮件只收到一封，旧服务无第二封通知。
- 百度统计站点列表出现 `jotoglobal.com`。
- 健康巡检出现 `jotoglobal` 且页面内容检查正常。

## 回滚

恢复上一版静态 `current` 软链接和上一版 Nginx 片段，运行 `nginx -t`
后平滑重载。后台已存留言、站点登记和百度属性不删除；删除运行时配置
必须另行确认。
