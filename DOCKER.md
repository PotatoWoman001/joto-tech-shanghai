# JOTO Sunny Docker 开发环境

本仓库的 Web、历史联系服务和 Python 内容归档工具使用相互独立的容器环境，
不依赖 Mac 上的全局 Node.js、Python 包或本机 `node_modules`。

## Web 与联系服务

```bash
docker compose up --build -d
```

- 网站：`http://127.0.0.1:5173`
- 历史联系服务健康检查：`http://127.0.0.1:9000/healthz`

查看状态与日志：

```bash
docker compose ps
docker compose logs -f web contact
```

容器内验证：

```bash
docker compose run --rm web npm run build
docker compose run --rm contact npm test
```

## Python 内容归档工具

归档工具只在 `tools` profile 中按需运行：

```bash
docker compose --profile tools run --rm archive pytest -q --ignore=tests/test_docker_config.py
```

完整依赖固定在 `requirements.lock`，Python 版本固定为 3.12.13。

## 停止

```bash
docker compose down
```

该命令保留两个 Node.js 依赖卷。不要使用 `docker compose down -v`，
除非明确需要删除项目依赖卷。

真实邮件、阿里云、Resend 和统计密钥不得写入镜像或 Compose 文件。
