# Docker Isolation Batch 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 隔离 `AI 解读`、`JargonLens` 的 SearXNG 调研服务，以及销售电话助手的两个 Python 后端，同时保留必须使用 macOS 权限与 Apple 本地模型的原生部分。

**Architecture:** 两个翻译助手各自使用独立、摘要锁定的 SearXNG 容器和缓存卷；销售电话助手使用两个独立 Python 3.12.13 镜像，macOS App 通过固定 loopback 端口连接，模型目录放入项目专属命名卷。

**Tech Stack:** Docker Compose、SearXNG、Python 3.12.13、FastAPI、Uvicorn、pytest

## Global Constraints

- Swift/macOS GUI、系统音频、ScreenCaptureKit、Accessibility 和 MLX 模型留在宿主机。
- 不读取、复制或删除宿主现有 `.local`、`.venv`、模型、截图、通话资料。
- 所有端口只绑定 `127.0.0.1`。
- SearXNG 使用注册表摘要固定的 arm64 Linux 镜像，不再使用 `latest`。
- 正常停止不删除命名卷。

### Task 1: AI 解读和 JargonLens 调研服务

**Files:**
- Modify: `AI 解读/infra/searxng/compose.yaml`
- Create: `AI 解读/infra/searxng/image.lock`
- Modify: `AI 解读/README.md`
- Modify: `JargonLens/infra/searxng/compose.yaml`
- Create: `JargonLens/infra/searxng/image.lock`
- Modify: `JargonLens/README.md`

- [ ] 固定 SearXNG 镜像摘要并记录 arm64 验证结果。
- [ ] 分别固定使用 `8888`、`8080`，且仅监听 loopback。
- [ ] 分别设置 Compose 项目名、健康检查和缓存命名卷。
- [ ] 启动并验证 HTML/JSON 搜索端点后停止，保留卷。

### Task 2: 销售电话助手双后端

**Files:**
- Create: `.dockerignore`
- Create: `compose.yaml`
- Create: `tests/docker-config.contract.py`
- Create: `services/assistant-core/.dockerignore`
- Create: `services/assistant-core/Dockerfile`
- Create: `services/assistant-core/requirements.lock`
- Modify: `services/assistant-core/pyproject.toml`
- Create: `services/knowledge-hub/.dockerignore`
- Create: `services/knowledge-hub/Dockerfile`
- Create: `services/knowledge-hub/requirements.lock`
- Modify: `README.md`

- [ ] 修正测试依赖名称并生成两个完整 Python 锁文件。
- [ ] 两个镜像固定 Python 3.12.13，安装各自依赖并运行各自测试。
- [ ] 固定映射 `8765`、`8766`，分别配置健康检查。
- [ ] Assistant Core 用独立命名卷保存容器内模型，不挂载宿主模型目录。
- [ ] 验证 HTTP、WebSocket 回放和两组完整测试。

### Task 3: 完成记录与跨项目复核

- [ ] 清理容器和网络，保留依赖/缓存/数据卷。
- [ ] Git 项目只提交本批文件，保留用户未跟踪资料。
- [ ] 更新中央项目目录和计划状态。
- [ ] 复核所有 Compose 项目名、端口、健康检查和停止状态。
