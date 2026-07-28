# Docker 项目清单

更新日期：2026-07-28

## 已完成

| 分类 | 项目 | 启动目录 | 本机地址 | 状态 |
| --- | --- | --- | --- | --- |
| Web | Workbuddy 假网站 | `../Workbuddy 假网站` | `http://127.0.0.1:5174` | 第 1 批已验证 |
| 构建工具 | Marketing/Brochure | `../Marketing/Brochure/brochure` | `http://127.0.0.1:4175/build/brochure.html` | 第 1 批已验证 |
| Web + 工具 | JOTO Sunny Try | `.` | `http://127.0.0.1:5173`、`http://127.0.0.1:9000/healthz` | 第 2 批已验证 |

每个项目在自己的启动目录运行：

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f
docker compose down
```

`docker compose down` 会保留命名卷；不要随意使用 `docker compose down -v`。

## 后续批次

| 批次 | 项目 | 计划端口 |
| --- | --- | --- |
| 3 | JOTO Cisco Solution - Persian | `3000`、`3001`、`3002` |
| 4 | SalesFlow | `4173`、`4174` |
| 5 | AI 解读 | `8888` |
| 5 | JargonLens | `8080` |
| 5 | 销售电话和话术沟通智能助手 | `8765`、`8766` |

## 原生或资料项目

- `提词器`：仅使用 Xcode，不强行容器化。
- `Obsidian`、`场景思考`：纯资料目录，不创建运行容器。
