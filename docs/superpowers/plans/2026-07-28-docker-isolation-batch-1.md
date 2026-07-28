# Docker Isolation Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `Workbuddy 假网站` 和 `Marketing/Brochure` 建立可重复、互不冲突的 Docker 开发环境，并验证两个项目能够同时运行。

**Architecture:** 每个项目拥有独立的 `Dockerfile`、`compose.yaml`、`.dockerignore`、配置测试和使用说明。Workbuddy 使用固定 Node.js 镜像和独立 `node_modules` 卷；宣传册使用固定 Python/Node.js 双运行时镜像并在容器内提供 Chromium、中文字体和 Python 包。

**Tech Stack:** Docker Desktop、Docker Compose、Node.js 24.18.0、npm 11、Vite、Python 3.14.6、Pillow 12.3.0、ReportLab 5.0.0、Debian Bookworm Chromium

## Global Constraints

- 源码目录保持原位，不批量搬家。
- 所有宿主端口只绑定 `127.0.0.1`。
- Workbuddy 固定使用宿主端口 `5174`；宣传册固定使用宿主端口 `4175`。
- 不读取、复制或提交任何现有 `.env` 密钥。
- 不删除现有 `node_modules`、`.venv`、缓存、构建产物或 Docker 数据卷。
- 不修改、暂存或提交用户已有的 Workbuddy `src/App.tsx`、`src/index.css`、`output/` 和 `previews/` 变更。
- Workbuddy 使用 `package-lock.json` 和 `npm ci`；宣传册没有 Node 第三方依赖，但生成 lockfile 以锁定 npm 项目元数据。
- 镜像必须使用支持 Apple 芯片的官方标签：`node:24.18.0-bookworm-slim` 和 `python:3.14.6-slim-bookworm`。
- 正常停止只使用 `docker compose down`，不得使用 `docker compose down -v`。
- 本计划只覆盖第 1 批；其他项目不得在本批中修改。

---

### Task 1: Workbuddy 独立 Node.js 开发容器

**Files:**
- Create: `../Workbuddy 假网站/tests/docker-config.test.mjs`
- Create: `../Workbuddy 假网站/Dockerfile`
- Create: `../Workbuddy 假网站/compose.yaml`
- Create: `../Workbuddy 假网站/.dockerignore`
- Modify: `../Workbuddy 假网站/package.json`
- Modify: `../Workbuddy 假网站/README.md`

**Interfaces:**
- Consumes: `package-lock.json`、现有 `npm run dev` 和 `npm run build`。
- Produces: Compose 项目 `workbuddy-creator`、服务 `web`、容器内端口 `5173`、宿主地址 `http://127.0.0.1:5174`、命名卷 `workbuddy_node_modules`。

- [ ] **Step 1: 检查 Docker 基线和 Workbuddy 工作区保护条件**

Run:

```bash
open -a Docker
/Applications/Docker.app/Contents/Resources/bin/docker info --format 'Server={{.ServerVersion}} Arch={{.Architecture}}'
git -C "../Workbuddy 假网站" status --short --branch
```

Expected:

- Docker Server 能返回版本且架构为 `aarch64`。
- Git 状态仍显示用户已有的 `src/App.tsx`、`src/index.css` 和预览文件变更；这些文件不进入后续暂存列表。

- [ ] **Step 2: 写入会先失败的 Docker 配置契约测试**

Create `../Workbuddy 假网站/tests/docker-config.test.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

const dockerfile = read("Dockerfile");
const compose = read("compose.yaml");
const dockerignore = read(".dockerignore");
const pkg = JSON.parse(read("package.json"));

assert.match(dockerfile, /^FROM node:24\.18\.0-bookworm-slim$/m);
assert.match(dockerfile, /^USER node$/m);
assert.equal(pkg.scripts["test:docker"], "node tests/docker-config.test.mjs");
assert.match(compose, /^name: workbuddy-creator$/m);
assert.match(compose, /127\.0\.0\.1:5174:5173/);
assert.match(compose, /workbuddy_node_modules:\/workspace\/node_modules/);
assert.doesNotMatch(compose, /network_mode:\s*host/);
assert.match(dockerignore, /^\.env$/m);
assert.match(dockerignore, /^node_modules\/$/m);
assert.match(dockerignore, /^output\/$/m);

console.log("Workbuddy Docker config: PASS");
```

Modify `../Workbuddy 假网站/package.json` scripts to:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test:docker": "node tests/docker-config.test.mjs"
  }
}
```

- [ ] **Step 3: 运行契约测试并确认缺少 Docker 文件**

Run:

```bash
cd "../Workbuddy 假网站"
npm run test:docker
```

Expected: FAIL，错误包含 `ENOENT` 和 `Dockerfile`。

- [ ] **Step 4: 创建 Workbuddy 镜像、Compose 和构建上下文**

Create `../Workbuddy 假网站/Dockerfile`:

```dockerfile
FROM node:24.18.0-bookworm-slim

WORKDIR /workspace
RUN chown node:node /workspace

USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

Create `../Workbuddy 假网站/compose.yaml`:

```yaml
name: workbuddy-creator

services:
  web:
    build:
      context: .
    init: true
    ports:
      - "127.0.0.1:5174:5173"
    volumes:
      - .:/workspace
      - workbuddy_node_modules:/workspace/node_modules
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - "fetch('http://127.0.0.1:5173').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"
      interval: 5s
      timeout: 3s
      retries: 12
      start_period: 10s

volumes:
  workbuddy_node_modules:
```

Create `../Workbuddy 假网站/.dockerignore`:

```gitignore
.git/
.env
.env.*
!.env.example
node_modules/
dist/
output/
previews/rendered/
.playwright-cli/
*.tsbuildinfo
vite.config.js
vite.config.d.ts
.DS_Store
```

- [ ] **Step 5: 写入 Workbuddy Docker 使用说明**

Replace the empty `../Workbuddy 假网站/README.md` with:

````markdown
# Workbuddy Creator Site

## Docker 开发环境

要求：Docker Desktop 已启动。

```bash
docker compose up --build -d
```

打开 `http://127.0.0.1:5174`。源码目录挂载到容器，Vite 会自动热更新；
`node_modules` 保存在项目专属 Docker 卷中，不使用本机依赖目录。

检查状态和日志：

```bash
docker compose ps
docker compose logs -f web
```

在容器内验证生产构建：

```bash
docker compose run --rm web npm run build
```

停止服务并保留依赖卷：

```bash
docker compose down
```

不要使用 `docker compose down -v`，除非明确需要删除项目依赖卷。

## 本机备用方式

迁移验证期间保留现有本机依赖，可继续使用 `npm run dev`。
````

- [ ] **Step 6: 运行静态测试和 Compose 解析**

Run:

```bash
cd "../Workbuddy 假网站"
npm run test:docker
/Applications/Docker.app/Contents/Resources/bin/docker compose config --quiet
```

Expected:

- `Workbuddy Docker config: PASS`
- Compose 解析命令退出码为 `0`。

- [ ] **Step 7: 构建、启动并验证 Workbuddy**

Run:

```bash
cd "../Workbuddy 假网站"
/Applications/Docker.app/Contents/Resources/bin/docker compose build --pull
/Applications/Docker.app/Contents/Resources/bin/docker compose up -d --wait --wait-timeout 120
/Applications/Docker.app/Contents/Resources/bin/docker compose ps
curl --fail --silent --show-error http://127.0.0.1:5174/ >/dev/null
/Applications/Docker.app/Contents/Resources/bin/docker compose run --rm web npm run build
```

Expected:

- `web` 状态最终为 `healthy`。
- `curl` 退出码为 `0`。
- Vite 构建完成且没有 TypeScript 错误。

- [ ] **Step 8: 只提交 Workbuddy Docker 相关文件**

Run:

```bash
git -C "../Workbuddy 假网站" add \
  .dockerignore Dockerfile compose.yaml README.md package.json tests/docker-config.test.mjs
git -C "../Workbuddy 假网站" diff --cached --check
git -C "../Workbuddy 假网站" diff --cached --name-only
git -C "../Workbuddy 假网站" commit -m "build: isolate Workbuddy development with Docker"
```

Expected: 暂存文件列表不包含 `src/App.tsx`、`src/index.css`、`output/` 或 `previews/`。

---

### Task 2: 宣传册 Node/Python/Chromium 隔离环境

**Files:**
- Create: `../Marketing/Brochure/brochure/tests/docker-config.test.mjs`
- Create: `../Marketing/Brochure/brochure/scripts/image-dimensions.py`
- Create: `../Marketing/Brochure/brochure/requirements.lock`
- Create: `../Marketing/Brochure/brochure/package-lock.json`
- Create: `../Marketing/Brochure/brochure/Dockerfile`
- Create: `../Marketing/Brochure/brochure/compose.yaml`
- Create: `../Marketing/Brochure/brochure/.dockerignore`
- Modify: `../Marketing/Brochure/brochure/package.json`
- Modify: `../Marketing/Brochure/brochure/scripts/export-pdf.mjs`
- Modify: `../Marketing/Brochure/brochure/scripts/validate-assets.mjs`
- Modify: `../Marketing/Brochure/brochure/scripts/generate-qrs.py`
- Modify: `../Marketing/Brochure/brochure/scripts/make-contact-sheet.py`
- Modify: `../Marketing/Brochure/brochure/README.md`

**Interfaces:**
- Consumes: 现有宣传册内容、素材、构建脚本和测试。
- Produces: Compose 项目 `joto-ai-brochure`、服务 `brochure`、宿主地址 `http://127.0.0.1:4175/build/brochure.html`、容器内 `CHROME_PATH=/usr/bin/chromium`。

- [ ] **Step 1: 写入会先失败的宣传册容器契约测试**

Create `../Marketing/Brochure/brochure/tests/docker-config.test.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

const dockerfile = read("Dockerfile");
const compose = read("compose.yaml");
const requirements = read("requirements.lock");
const pkg = JSON.parse(read("package.json"));
const exportScript = read("scripts/export-pdf.mjs");
const assetScript = read("scripts/validate-assets.mjs");
const qrScript = read("scripts/generate-qrs.py");
const sheetScript = read("scripts/make-contact-sheet.py");

assert.match(dockerfile, /^FROM node:24\.18\.0-bookworm-slim AS node_runtime$/m);
assert.match(dockerfile, /^FROM python:3\.14\.6-slim-bookworm$/m);
assert.match(dockerfile, /chromium/);
assert.match(dockerfile, /fonts-noto-cjk/);
assert.match(compose, /^name: joto-ai-brochure$/m);
assert.match(compose, /127\.0\.0\.1:4175:4175/);
assert.doesNotMatch(compose, /network_mode:\s*host/);
assert.match(requirements, /^Pillow==12\.3\.0$/m);
assert.match(requirements, /^reportlab==5\.0\.0$/m);
assert.equal(pkg.scripts.preview, "python3 -m http.server 4175 --bind 0.0.0.0 --directory .");
assert.equal(pkg.scripts.test, "npm run test:content && npm run test:assets && npm run validate:assets && npm run generate:qrs && npm run build && npm run test:qrs && npm run test:layout && npm run test:docker");
assert.match(exportScript, /process\.env\.CHROME_PATH/);
assert.match(assetScript, /image-dimensions\.py/);
assert.match(qrScript, /BROCHURE_ZH_FONT_PATH/);
assert.match(sheetScript, /BROCHURE_CONTACT_SHEET_FONT/);

console.log("Brochure Docker config: PASS");
```

- [ ] **Step 2: 运行契约测试并确认缺少 Docker 文件**

Run:

```bash
cd "../Marketing/Brochure/brochure"
node tests/docker-config.test.mjs
```

Expected: FAIL，错误包含 `ENOENT` 和 `Dockerfile`。

- [ ] **Step 3: 固定宣传册运行时依赖和 npm 命令**

Create `../Marketing/Brochure/brochure/requirements.lock`:

```text
Pillow==12.3.0
reportlab==5.0.0
```

Replace `../Marketing/Brochure/brochure/package.json` with:

```json
{
  "name": "joto-ai-brochure",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "npm run test:content && npm run test:assets && npm run validate:assets && npm run generate:qrs && npm run build && npm run test:qrs && npm run test:layout && npm run test:docker",
    "test:content": "node tests/content.test.mjs",
    "test:assets": "node tests/assets.test.mjs",
    "test:qrs": "node tests/qrs.test.mjs",
    "test:layout": "node tests/layout.test.mjs",
    "test:docker": "node tests/docker-config.test.mjs",
    "validate:assets": "node scripts/validate-assets.mjs",
    "generate:qrs": "python3 scripts/generate-qrs.py",
    "build": "node scripts/build-html.mjs",
    "export": "node scripts/export-pdf.mjs",
    "preview": "python3 -m http.server 4175 --bind 0.0.0.0 --directory ."
  }
}
```

Generate the dependency-free npm lockfile:

```bash
cd "../Marketing/Brochure/brochure"
npm install --package-lock-only --ignore-scripts
```

Expected: `package-lock.json` 使用 lockfile version `3` 且根包名为 `joto-ai-brochure`。

- [ ] **Step 4: 将图片尺寸检查改为跨平台 Python/Pillow 实现**

Create `../Marketing/Brochure/brochure/scripts/image-dimensions.py`:

```python
#!/usr/bin/env python3
import json
import sys

from PIL import Image


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: image-dimensions.py IMAGE")
    with Image.open(sys.argv[1]) as image:
        print(json.dumps({"width": image.width, "height": image.height}))


if __name__ == "__main__":
    main()
```

In `../Marketing/Brochure/brochure/scripts/validate-assets.mjs`, replace the
`sips` call and parsing block with:

```js
const metadataScript = path.join(here, "image-dimensions.py");
const metadata = JSON.parse(execFileSync(
  process.env.PYTHON || "python3",
  [metadataScript, file],
  { encoding: "utf8" },
));
const width = Number(metadata.width);
const height = Number(metadata.height);
```

Expected: `validate-assets.mjs` no longer contains the string `"sips"`。

- [ ] **Step 5: 让 PDF 导出脚本读取容器或 macOS 的 Chrome 路径**

Replace `../Marketing/Brochure/brochure/scripts/export-pdf.mjs` with:

```js
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const input = path.join(root, "build/brochure.html");
const outputDir = path.join(root, "output/pdf");
const output = path.join(outputDir, "joto-ai-brochure-editorial.pdf");
const defaultChrome = process.platform === "darwin"
  ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  : "/usr/bin/chromium";
const chrome = process.env.CHROME_PATH || defaultChrome;

if (!fs.existsSync(input)) throw new Error(`missing brochure HTML: ${input}`);
if (!fs.existsSync(chrome)) throw new Error(`missing Chrome/Chromium: ${chrome}`);

fs.mkdirSync(outputDir, { recursive: true });
const args = [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--print-to-pdf-no-header",
  `--print-to-pdf=${output}`,
  pathToFileURL(input).href,
];
if (process.env.CHROME_NO_SANDBOX === "1") args.unshift("--no-sandbox");

const result = spawnSync(chrome, args, { encoding: "utf8" });

if (result.error) throw result.error;
if (result.status !== 0 || !fs.existsSync(output)) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

console.log(output);
```

- [ ] **Step 6: 为 Python 图形脚本增加 Linux 字体回退**

In `../Marketing/Brochure/brochure/scripts/generate-qrs.py`, add `import os`,
import `UnicodeCIDFont`, and replace the fixed font registration with:

```python
def register_zh_font() -> str:
    configured = os.environ.get("BROCHURE_ZH_FONT_PATH")
    if configured:
        font_name = "BrochureZh"
        pdfmetrics.registerFont(TTFont(font_name, configured))
        return font_name
    font_name = "STSong-Light"
    pdfmetrics.registerFont(UnicodeCIDFont(font_name))
    return font_name


ZH_FONT = register_zh_font()
```

In `../Marketing/Brochure/brochure/scripts/make-contact-sheet.py`, add
`import os` and replace the fixed font line with:

```python
default_font = (
    "/System/Library/Fonts/Supplemental/Arial.ttf"
    if Path("/System/Library/Fonts/Supplemental/Arial.ttf").exists()
    else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
)
font = ImageFont.truetype(
    os.environ.get("BROCHURE_CONTACT_SHEET_FONT", default_font),
    16,
)
```

- [ ] **Step 7: 创建宣传册多运行时镜像和 Compose**

Create `../Marketing/Brochure/brochure/Dockerfile`:

```dockerfile
FROM node:24.18.0-bookworm-slim AS node_runtime

FROM python:3.14.6-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PATH="/opt/venv/bin:${PATH}"
ENV CHROME_PATH=/usr/bin/chromium

COPY --from=node_runtime /usr/local/ /usr/local/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        chromium \
        fonts-dejavu-core \
        fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv

WORKDIR /workspace
COPY requirements.lock ./
RUN pip install --no-cache-dir -r requirements.lock

RUN groupadd --gid 1000 app \
    && useradd --uid 1000 --gid 1000 --create-home app \
    && chown app:app /workspace

USER app
COPY --chown=app:app . .
RUN npm test

EXPOSE 4175

CMD ["sh", "-c", "npm run build && npm run preview"]
```

Create `../Marketing/Brochure/brochure/compose.yaml`:

```yaml
name: joto-ai-brochure

services:
  brochure:
    build:
      context: .
    init: true
    environment:
      CHROME_PATH: /usr/bin/chromium
    ports:
      - "127.0.0.1:4175:4175"
    volumes:
      - .:/workspace
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - "fetch('http://127.0.0.1:4175/build/brochure.html').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"
      interval: 5s
      timeout: 3s
      retries: 12
      start_period: 15s
```

Create `../Marketing/Brochure/brochure/.dockerignore`:

```gitignore
.git/
.env
.env.*
!.env.example
node_modules/
.venv/
build/
output/
.playwright-cli/
__pycache__/
*.pyc
.DS_Store
```

- [ ] **Step 8: 更新宣传册 Docker 使用说明**

Append to `../Marketing/Brochure/brochure/README.md`:

````markdown

## Docker 隔离环境

容器固定使用 Node.js 24.18.0、Python 3.14.6、Pillow 12.3.0、
ReportLab 5.0.0 和 Debian Chromium，不依赖 Mac 上的全局包。

```bash
docker compose up --build -d
```

打开 `http://127.0.0.1:4175/build/brochure.html`。

运行完整内容、素材、二维码、构建、布局和容器配置测试：

```bash
docker compose run --rm brochure npm test
```

导出 PDF：

```bash
docker compose run --rm -e CHROME_NO_SANDBOX=1 brochure npm run export
```

输出仍写入本机 `build/` 和 `output/`。停止服务时保留所有输出：

```bash
docker compose down
```
````

- [ ] **Step 9: 运行静态测试和 Compose 解析**

Run:

```bash
cd "../Marketing/Brochure/brochure"
node tests/docker-config.test.mjs
/Applications/Docker.app/Contents/Resources/bin/docker compose config --quiet
```

Expected:

- `Brochure Docker config: PASS`
- Compose 解析命令退出码为 `0`。

- [ ] **Step 10: 构建、启动并验证宣传册完整工具链**

Run:

```bash
cd "../Marketing/Brochure/brochure"
/Applications/Docker.app/Contents/Resources/bin/docker compose build --pull
/Applications/Docker.app/Contents/Resources/bin/docker compose up -d --wait --wait-timeout 180
/Applications/Docker.app/Contents/Resources/bin/docker compose ps
curl --fail --silent --show-error http://127.0.0.1:4175/build/brochure.html >/dev/null
/Applications/Docker.app/Contents/Resources/bin/docker compose run --rm brochure npm test
/Applications/Docker.app/Contents/Resources/bin/docker compose run --rm \
  -e CHROME_NO_SANDBOX=1 brochure npm run export
test -s output/pdf/joto-ai-brochure-editorial.pdf
```

Expected:

- `brochure` 状态最终为 `healthy`。
- 所有 Node/Python 测试输出 `PASS`。
- `output/pdf/joto-ai-brochure-editorial.pdf` 存在且大小大于零。

该目录不是 Git 仓库，因此不创建提交。

---

### Task 3: 跨项目并行验证和总项目清单

**Files:**
- Create: `docs/docker-projects.md`

**Interfaces:**
- Consumes: Task 1 的 `workbuddy-creator` 和 Task 2 的 `joto-ai-brochure`。
- Produces: 第 1 批可复查的项目分类、端口、状态和命令清单。

- [ ] **Step 1: 同时启动两个项目并验证端口隔离**

Run:

```bash
/Applications/Docker.app/Contents/Resources/bin/docker compose \
  -f "../Workbuddy 假网站/compose.yaml" up -d --wait --wait-timeout 120
/Applications/Docker.app/Contents/Resources/bin/docker compose \
  -f "../Marketing/Brochure/brochure/compose.yaml" up -d --wait --wait-timeout 180
curl --fail --silent --show-error http://127.0.0.1:5174/ >/dev/null
curl --fail --silent --show-error \
  http://127.0.0.1:4175/build/brochure.html >/dev/null
/Applications/Docker.app/Contents/Resources/bin/docker ps \
  --format 'table {{.Names}}\t{{.Ports}}\t{{.Status}}'
```

Expected:

- 两个 `curl` 均退出 `0`。
- Workbuddy 只暴露 `127.0.0.1:5174`。
- 宣传册只暴露 `127.0.0.1:4175`。
- 两个服务均为 `healthy`，没有共享容器名或宿主端口。

- [ ] **Step 2: 创建总项目 Docker 清单**

Create `docs/docker-projects.md`:

````markdown
# Docker 项目清单

更新日期：2026-07-28

## 已完成

| 分类 | 项目 | 启动目录 | 本机地址 | 状态 |
| --- | --- | --- | --- | --- |
| Web | Workbuddy 假网站 | `../Workbuddy 假网站` | `http://127.0.0.1:5174` | 第 1 批已验证 |
| 构建工具 | Marketing/Brochure | `../Marketing/Brochure/brochure` | `http://127.0.0.1:4175/build/brochure.html` | 第 1 批已验证 |

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
| 2 | JOTO Sunny Try | `5173`、`9000` |
| 3 | JOTO Cisco Solution - Persian | `3000`、`3001`、`3002` |
| 4 | SalesFlow | `4173`、`4174` |
| 5 | AI 解读 | `8888` |
| 5 | JargonLens | `8080` |
| 5 | 销售电话和话术沟通智能助手 | `8765`、`8766` |

## 原生或资料项目

- `提词器`：仅使用 Xcode，不强行容器化。
- `Obsidian`、`场景思考`：纯资料目录，不创建运行容器。
````

- [ ] **Step 3: 提交总项目清单**

Run:

```bash
git add docs/docker-projects.md
git diff --cached --check
git commit -m "docs: add Docker project catalog"
```

Expected: 提交只包含 `docs/docker-projects.md`。

- [ ] **Step 4: 停止第 1 批服务并确认数据未被删除**

Run:

```bash
/Applications/Docker.app/Contents/Resources/bin/docker compose \
  -f "../Workbuddy 假网站/compose.yaml" down
/Applications/Docker.app/Contents/Resources/bin/docker compose \
  -f "../Marketing/Brochure/brochure/compose.yaml" down
/Applications/Docker.app/Contents/Resources/bin/docker volume ls \
  --format '{{.Name}}' | grep '^workbuddy-creator_workbuddy_node_modules$'
git -C "../Workbuddy 假网站" status --short --branch
git status --short --branch
```

Expected:

- 两个项目容器已停止。
- `workbuddy-creator_workbuddy_node_modules` 仍存在。
- Workbuddy 用户原有未提交文件仍在。
- 当前仓库原有未跟踪目录仍在且未被提交。
