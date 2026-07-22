# JOTO TECH 深色单页官网实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to execute this plan task-by-task.

**目标：** 在当前工作区建立独立的 `joto-site-v2/`，以现有 React 项目为技术起点，仅复用用户指定模板的视觉结构与动效，交付可本地运行、响应式、英文首版的 JOTO TECH 深色单页官网。

**架构：** 使用 Vite + React 18 + TypeScript + Tailwind CSS 构建静态单页。页面内容统一由类型化英文内容数据驱动；展示组件不写死厂商清单。HLS 视频封装为独立组件，桌面与移动导航共享同一内容源。第一版不接后端、不做 Solution 详情页、不暴露未完成的语言切换。

**技术栈：** Vite、React 18、TypeScript、Tailwind CSS 3.4、hls.js、Lucide React、Vitest、Testing Library、Playwright 浏览器验收。

## 全局约束

- 不修改原网站、不修改 `/Users/cuihua/Downloads/joto-site-main/`，只复制到当前工作区。
- 全部 CodeNest、JOTO AI、Dify、AIGC 及相关模板业务文案必须从新站代码和页面中移除。
- 只展示用户明确给出的合作等级；不得推测或虚构认证、伙伴级别、项目数据。
- 厂商补充介绍只使用厂商官网等一手来源，并记录来源链接与待用户核实项。
- 原项目仅作为内容参考；视觉统一改为深色、绿色强调、高端企业技术风格。
- 每个阶段完成后运行相应测试并创建 Git 检查点；不提交工作区内与本项目无关的未跟踪文件。
- 最终必须通过桌面与移动端真实浏览器检查、截图核对、构建检查和禁用内容扫描。

---

## 任务 1：复制项目并建立干净基线

**文件：**
- 创建：`joto-site-v2/`（从 `/Users/cuihua/Downloads/joto-site-main/` 复制，排除 `node_modules`、`dist`、嵌套 Git 元数据）
- 修改：`joto-site-v2/package.json`
- 修改：`joto-site-v2/package-lock.json`
- 修改：`joto-site-v2/vite.config.ts`
- 创建：`joto-site-v2/src/test/setup.ts`
- 修改：`joto-site-v2/tsconfig.json`（仅在测试类型需要时）

- [ ] 1.1 检查源目录大小、文件结构和当前 Git 状态，确认目标目录不存在或为空。
- [ ] 1.2 复制源项目到 `joto-site-v2/`，排除构建产物和依赖目录。
- [ ] 1.3 安装 `hls.js`，添加 Vitest、jsdom、Testing Library 测试依赖；移除新页面不再使用的 shader 依赖。
- [ ] 1.4 将 Vite 基础路径设置为适合本地和未来独立域名的根路径；增加 `test` 脚本。
- [ ] 1.5 运行 `npm install`、`npm run build`，记录原始可构建基线。
- [ ] 1.6 提交：`chore: scaffold JOTO v2 website`。

## 任务 2：建立内容模型、来源记录和品牌资源

**文件：**
- 创建：`joto-site-v2/src/content/types.ts`
- 创建：`joto-site-v2/src/content/en.ts`
- 创建：`joto-site-v2/src/content/en.test.ts`
- 创建：`joto-site-v2/docs/content-sources.md`
- 创建：`joto-site-v2/src/assets/brand/joto-logo.png`
- 创建/整理：`joto-site-v2/src/assets/logos/*`

- [ ] 2.1 先写内容结构测试：导航顺序、五个 Solution 分类、精确厂商名单、合作等级和禁用关键词。
- [ ] 2.2 从已抓取内容和用户资料目录提取 JOTO 公司介绍、服务能力、案例摘要、全球覆盖与联系方式。
- [ ] 2.3 对缺失厂商简介和 Logo 只查询官网一手来源；在 `content-sources.md` 记录链接、用途和待核实项。
- [ ] 2.4 建立可扩展到 `zh-CN`、`fa-IR` 的类型化英文内容对象，但第一版界面只加载英文。
- [ ] 2.5 整理 JOTO Logo 与厂商 Logo；SVG/原图优先，不放大低清位图，不远程依赖旧 CDN。
- [ ] 2.6 运行 `npm test -- --run src/content/en.test.ts`，确认先失败后通过。
- [ ] 2.7 提交：`feat: add verified JOTO website content model`。

## 任务 3：实现全局基础样式、导航和 HLS Hero

**文件：**
- 修改：`joto-site-v2/tailwind.config.js`
- 修改：`joto-site-v2/src/index.css`
- 创建：`joto-site-v2/src/components/Header.tsx`
- 创建：`joto-site-v2/src/components/Header.test.tsx`
- 创建：`joto-site-v2/src/components/HlsBackgroundVideo.tsx`
- 创建：`joto-site-v2/src/components/HlsBackgroundVideo.test.tsx`
- 修改：`joto-site-v2/src/components/Hero.tsx`

- [ ] 3.1 先写测试：移动菜单开关与键盘关闭、HLS `enableWorker: false`、原生 HLS 回退、卸载销毁。
- [ ] 3.2 配置 Inter、Plus Jakarta Sans、Instrument Serif italic 字体和深色设计变量。
- [ ] 3.3 实现绝对定位导航、桌面链接、移动端全屏菜单、滚动锁定与可访问性属性。
- [ ] 3.4 实现 HLS 背景视频；自动播放、静音、循环、60% 透明度，并提供加载失败与减少动态效果的静态渐变回退。
- [ ] 3.5 按确认规格实现三条竖向网格线、双层渐变、中心椭圆光晕、200×200 Liquid Glass 卡片、Hero 字体层级与 CTA。
- [ ] 3.6 运行相关单元测试和 `npm run build`。
- [ ] 3.7 提交：`feat: build dark navigation and video hero`。

## 任务 4：实现完整单页业务区块

**文件：**
- 创建：`joto-site-v2/src/components/SectionHeading.tsx`
- 修改：`joto-site-v2/src/components/Solutions.tsx`
- 修改：`joto-site-v2/src/components/Services.tsx`
- 创建/修改：`joto-site-v2/src/components/CaseStudies.tsx`
- 修改：`joto-site-v2/src/components/About.tsx`
- 修改：`joto-site-v2/src/components/Partners.tsx`
- 创建/修改：`joto-site-v2/src/components/GlobalPresence.tsx`
- 创建/修改：`joto-site-v2/src/components/ContactFooter.tsx`
- 修改：`joto-site-v2/src/App.tsx`
- 创建：`joto-site-v2/src/App.test.tsx`

- [ ] 4.1 先写页面集成测试：所有导航锚点存在、五个 Solution 区块和关键业务区块完整、无 AI/Dify/AIGC 文案。
- [ ] 4.2 实现 Solutions 总览卡片与厂商标签；仅有明确等级的厂商显示 Gold/Platinum。
- [ ] 4.3 实现 Services、Case Studies、About、Partners & Certifications、Global Presence、Contact/Footer。
- [ ] 4.4 案例只使用现有资料能支持的传统 IT 项目摘要；不写虚构数字，不展示 AI 案例。
- [ ] 4.5 所有区块统一深色视觉、细网格/边框、绿色强调、留白与滚动进入动效，并支持 `prefers-reduced-motion`。
- [ ] 4.6 组合 App，校正锚点滚动、移动端间距、可读性和键盘焦点。
- [ ] 4.7 运行 `npm test -- --run` 和 `npm run build`。
- [ ] 4.8 提交：`feat: complete JOTO single-page website`。

## 任务 5：内容扫描、浏览器验收和交付说明

**文件：**
- 创建：`joto-site-v2/docs/qa-report.md`
- 创建：`joto-site-v2/docs/screenshots/desktop-home.png`
- 创建：`joto-site-v2/docs/screenshots/mobile-home.png`
- 修改：`joto-site-v2/README.md`

- [ ] 5.1 运行源码扫描，确认不存在 `CodeNest`、`JOTO AI`、`Dify`、`AIGC`、模板旧导航和废弃远程 CDN 引用。
- [ ] 5.2 启动本地开发服务器，用真实浏览器验收 1440px 桌面版和 390px 移动版。
- [ ] 5.3 检查 HLS 请求与回退、导航锚点、移动菜单、CTA、水平溢出、Logo 清晰度和控制台错误。
- [ ] 5.4 保存桌面/移动截图，逐区块核对内容与层级；问题修复后重新截图。
- [ ] 5.5 完成 README：安装、运行、构建、内容更新、未来增加语言和 Solution 详情页的方法。
- [ ] 5.6 在 `qa-report.md` 记录测试结果、浏览器结果、已知的待用户补充项（认证证明、伙伴关系、最终联系方式、SEO）。
- [ ] 5.7 最终运行：`npm test -- --run`、`npm run build`。
- [ ] 5.8 提交：`docs: finalize JOTO v2 QA and handoff`。

## 最终自检

- [ ] 计划中没有 TBD、TODO 或未决实现选择。
- [ ] 文件路径、组件名称和内容类型在各任务中一致。
- [ ] 每个实现任务都包含测试、构建或浏览器验证。
- [ ] 新站没有修改原网站或源资料目录。
- [ ] 页面内容与用户确认的 Solution 名单和等级逐项一致。
- [ ] 第一版为英文单页，且为未来三语言和详情页保留清晰扩展边界。
