# Docker Isolation Batch 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `JOTO Cisco Solution - Persian` 的新版主站、合作伙伴站、旧版站和 Python 内容归档工具建立互相独立的容器，固定使用 `3000`、`3001`、`3002`。

**Architecture:** 父仓库用一个 `compose.yaml` 编排三个前端服务与一个按需 Python 工具服务。两个 Next.js 站点保留各自嵌套 Git 仓库，旧版 Vite 站点保留在父仓库；每个 Node 服务使用独立命名卷保存容器依赖。

**Tech Stack:** Docker Compose、Node.js 24.18.0、Next.js 16、Vite、Python 3.12.13、pip 25.0.1、pip-tools 7.5.1、pytest

## Global Constraints

- 不修改或暂存 `joto-website` 中现有 6 个用户改动。
- 不修改或暂存 `joto-site-v2/src/components/Services.tsx`。
- 不把两个嵌套 Git 仓库加入父仓库提交。
- 所有宿主端口仅绑定 `127.0.0.1`。
- 正常停止不删除命名卷。

### Task 1: 写配置契约并创建四服务 Compose

**Files:**
- Create: `tests/test_docker_config.py`
- Create: `compose.yaml`
- Create: `.dockerignore`
- Create: `DOCKER.md`

- [x] 先写入端口、镜像版本、非 host 网络和 profile 的配置契约。
- [x] 创建 `website`、`partner`、`legacy`、`archive` 服务。
- [x] 为三个 Node 服务分别配置命名依赖卷和健康检查。
- [x] 用 `docker compose config --quiet` 验证解析。

### Task 2: 分别创建三个前端镜像

**Files:**
- Create: `joto-website/Dockerfile`
- Create: `joto-website/.dockerignore`
- Modify: `joto-website/README.md`
- Create: `joto-cisco-partner-page/Dockerfile`
- Create: `joto-cisco-partner-page/.dockerignore`
- Modify: `joto-cisco-partner-page/README.md`
- Create: `joto-site-v2/Dockerfile`
- Create: `joto-site-v2/.dockerignore`

- [x] 三个镜像固定为 `node:24.18.0-bookworm-slim`。
- [x] 用 `npm ci` 安装锁定依赖并以非 root 用户运行。
- [x] Next.js 容器监听 `0.0.0.0:3000`，Vite 容器监听 `0.0.0.0:5173`。
- [x] 只提交 Docker 文件和 README 增量。

### Task 3: 锁定 Python 工具镜像

**Files:**
- Create: `requirements.lock`
- Create: `Dockerfile.archive`

- [x] 用 Python 3.12.13、pip 25.0.1 和 pip-tools 7.5.1 生成完整锁文件。
- [x] 镜像复制 `config`、`src`、`tests` 并默认运行原有业务测试。

### Task 4: 全量验证和安全提交

- [x] 构建全部镜像并启动三个前端服务。
- [x] 验证 `3000`、`3001`、`3002` 可访问且容器健康。
- [x] 在容器中运行两个 Next.js 构建/内容校验、Vite 构建/测试和 Python 测试。
- [x] 停止容器但保留命名卷。
- [x] 三个 Git 仓库分别仅提交本批新增文件。
- [x] 更新中央项目目录和计划完成状态。
