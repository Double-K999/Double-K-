# AGENTS.md

> 给接手这个项目的 AI 工具（Codex / Claude Code / Cursor / Copilot 等）和人看的交接说明。先读这一页再动手。

## 一句话

Double K（李旭昆）的游戏交互设计作品集。React 19 + Vite 7 单页站，纯静态，已上线。

## 线上与仓库

| | |
| --- | --- |
| 生产地址 | https://double-k-35s.pages.dev/ |
| 代码仓库 | https://github.com/Double-K999/Double-K-（main） |
| 托管 | Cloudflare Pages，项目名 `double-k` |
| 部署链路 | `git push` main → Cloudflare 自动 `npm run build` → 发布 `dist`，约 20 秒 |

**部署不需要本地 Cloudflare 凭证**，push 即可。本地预览只有自己能看（localhost）。

## 常用命令

```sh
pnpm install      # 首次
pnpm dev          # http://localhost:5173
pnpm build        # 产出 dist/
```

Node 版本 22（`.nvmrc`），Vite 7 要求 ≥ 20.19。

## 目录

| 路径 | 作用 |
| --- | --- |
| `src/content.js` | **所有文案与数据**：profile / about / career / projects / workGroups。改文字先看这里 |
| `src/App.jsx` | 页面结构；案例阅读器是原生 `<dialog>`；首屏胶卷 `stripTiles` 在文件顶部 |
| `src/styles.css` | 布局与区块（hero / about / work / expertise / contact 分段，行号靠前是首屏） |
| `src/ui.css` | 控件样式。**后引入**，同等特异性会覆盖 `styles.css` |
| `public/` | 字体、封面、案例页、视频、简历 PDF，原样拷进 `dist` |
| `scripts/` | `dev.ps1`/`build.ps1`、`build-case.py`（PDF→WebP）、`subset-font.py`、`checks/*.cjs` |
| `docs/` | `status.md` 改动史 / `deploy.md` 部署 / `transfer.md` 换机手册 |

## 硬约束（改之前必读）

1. **改中文文案后必须重跑字体子集**：`python scripts/subset-font.py`
   字体已从 7.8MB 裁到 129KB（751 个字形）。新字不在子集里会回退系统字体，字重和字形会突变。
   源文件在 `assets/fonts-src/tencent-sans-w7.ttf`，产物在 `public/fonts/tencent-sans-w7.woff2`。
2. **不要改 `public/case/**` 的文件命名**：`content.js` 里的 `casePage(slug, title, n)` 依赖 `pNN.webp` 的编号与页码。
3. **`styles.css` 与 `ui.css` 会互相覆盖**（历史坑）。改尺寸、边框、间距前，先 `grep` 两个文件里有没有同名选择器。
4. 站点用**绝对路径**（`/images/...`）。若要部署到子路径，得在 `vite.config.js` 加 `base`。
5. `node_modules` / `dist` / `artifacts` / `logs` 已在 `.gitignore`，不要提交。

## 设计约定

- 品牌 **Double K**；主色橙 `#f47716` / `#ff9a3d`；背景纯黑 `#000`；正文 `#edeceb`
- 首屏：左侧大字标题 + 手写签名，右侧竖版循环视频（`.hero-reel`），底部作品胶卷
- 作品区按 **游戏产品 / 产品设计** 两组，4 列栅格，缺的用虚线占位卡
- 案例详情是 `<dialog>` 里的长图阅读器，页面来自 PDF 截图导出（1728px 宽 WebP）
- feed 式节奏：区块 `min-height:100svh` + 进入视口淡入，卡片按 `--i`/`--g` 逐张错峰

## 验证（改完至少跑一次）

```sh
node scripts/checks/verify.cjs          # 六断点：溢出、对齐、字体、弹窗
node scripts/checks/functional-check.cjs # 视频播放/暂停、复制、简历下载、CTA 跳转
```

首次运行需要 Playwright：`pnpm add -D playwright && npx playwright install chromium`
（脚本会优先用系统 Chrome，见 `scripts/checks/_pw.cjs`）

## 当前待办

1. 「游戏产品」组还留 1 个占位，等新作品（改 `workGroups[].items` + 对应 `projects`）
2. 简历 PDF 2.09MB，可压缩（比所有图片都大）
3. OG 分享图仍是 `hero-poster.jpg`（1600×1000），理想是 1200×630 并把 `og:url` / `og:image` 换成绝对地址
4. 项目卡片把 `<button>` 内嵌块级元素，语义可优化（`article` + 单一链接）
5. 移动端首屏在 568/640 高的机型上胶卷会落到折线以下

## 交接历史

`docs/status.md` 按时间记录了每一轮改动**和反转的决定**（比如作品区样式改过三轮）。改版前值得扫一眼，能少走回头路。
