# Docker Isolation Batch 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 `SalesFlow` 建立相互隔离的 Web、API 和 PostgreSQL 服务，固定宿主端口 `4173`、`4174`，数据库不暴露宿主端口。

**Architecture:** 一份 Compose 编排两个 Node.js 24.18.0 服务和一个 PostgreSQL 17.9 服务。Web 通过仅服务端可见的代理目标访问 API；API 启动前自动执行现有 Drizzle 迁移；三个服务分别使用独立依赖/数据卷。

**Tech Stack:** Docker Compose、Node.js 24.18.0、pnpm 11.9.0、Vite 8、Fastify 5、PostgreSQL 17.9、Drizzle

## Global Constraints

- 所有宿主端口只绑定 `127.0.0.1`。
- PostgreSQL 不映射宿主端口。
- 不把任何真实集成密钥写入镜像或 Compose。
- 宿主运行时仍默认代理到 `127.0.0.1:4174`。
- 正常停止不删除命名卷。

### Task 1: 配置契约和容器镜像

**Files:**
- Create: `tests/docker-config.test.mjs`
- Create: `Dockerfile`
- Create: `.dockerignore`
- Modify: `package.json`

- [x] 写入端口、镜像版本、非 host 网络、三个命名卷的契约测试。
- [x] 固定 Node.js 24.18.0 和 pnpm 11.9.0，以非 root 用户运行。
- [x] 排除宿主依赖、构建产物、测试产物和环境密钥。

### Task 2: 三服务 Compose 和代理配置

**Files:**
- Create: `compose.yaml`
- Modify: `vite.config.ts`
- Modify: `README.md`

- [x] 创建 `web`、`api`、`db` 服务。
- [x] Web 固定映射 `4173:4173`，API 固定映射 `4174:4174`。
- [x] 数据库仅在项目默认网络中供 API 使用。
- [x] 为三服务配置健康检查和依赖顺序。
- [x] 记录启动、停止、迁移、测试和卷保留方式。

### Task 3: 真实构建和验证

- [x] 运行配置契约和 Compose 解析。
- [x] 构建镜像并启动三服务，验证健康状态和两个宿主端口。
- [x] 验证 API 实际使用 PostgreSQL 并完成迁移。
- [x] 在容器中运行全部单元测试和生产构建。
- [x] 停止容器，保留三个命名卷。
- [x] 提交且更新中央目录。
