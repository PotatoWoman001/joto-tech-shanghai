# Docker 项目清单

更新日期：2026-07-28

## 已完成

| 分类 | 项目 | 启动目录 | 本机地址 | 状态 |
| --- | --- | --- | --- | --- |
| Web | Workbuddy 假网站 | `../Workbuddy 假网站` | `http://127.0.0.1:5174` | 第 1 批已验证 |
| 构建工具 | Marketing/Brochure | `../Marketing/Brochure/brochure` | `http://127.0.0.1:4175/build/brochure.html` | 第 1 批已验证 |
| Web + 工具 | JOTO Sunny Try | `.` | `http://127.0.0.1:5173`、`http://127.0.0.1:9000/healthz` | 第 2 批已验证 |
| 多站点 + 工具 | JOTO Cisco Solution - Persian | `../JOTO Cisco Solution - Persian` | `http://127.0.0.1:3000`、`http://127.0.0.1:3001`、`http://127.0.0.1:3002` | 第 3 批已验证 |
| Web + API + PostgreSQL | SalesFlow | `../SalesFlow` | `http://127.0.0.1:4173/calendar`、`http://127.0.0.1:4174/api/health` | 第 4 批已验证 |
| macOS + 调研服务 | AI 解读 | `../AI 解读/infra/searxng` | `http://127.0.0.1:8888` | 第 5 批已验证 |
| macOS + 调研服务 | JargonLens | `../JargonLens/infra/searxng` | `http://127.0.0.1:8080` | 第 5 批已验证 |
| macOS + 双后端 | 销售电话和话术沟通智能助手 | `../销售电话和话术沟通智能助手` | `http://127.0.0.1:8765/health`、`http://127.0.0.1:8766/health` | 第 5 批已验证 |

每个项目在自己的启动目录运行：

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f
docker compose down
```

`docker compose down` 会保留命名卷；不要随意使用 `docker compose down -v`。

## 实施状态

全部 5 批均已完成真实构建、端口访问和项目测试。交付时所有容器及项目网络
均已停止，命名卷保留；宿主原有 `node_modules`、`.venv`、模型与构建目录未删除。

## 原生或资料项目

- `提词器`：仅使用 Xcode，不强行容器化。
- `AI 解读`、`JargonLens`：Swift 界面、macOS 权限和 Apple 本地模型留在宿主机，SearXNG 已隔离。
- `销售电话和话术沟通智能助手`：macOS 音频界面留在宿主机，两个 Python 后端已隔离。
- `Obsidian`、`场景思考`：纯资料目录，不创建运行容器。
