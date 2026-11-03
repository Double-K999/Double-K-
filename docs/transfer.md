# 换电脑 / 换平台继续改：操作手册

## 核心原则

**GitHub 仓库是唯一源头**：`github.com/Double-K999/Double-K-`（main 分支）

Cloudflare Pages 监听这个仓库的 main 分支，**一切以 push 为准**：

```
改本地文件 → git push → Cloudflare 自动构建（约 20 秒）→ 线上更新
```

所以「换电脑」= 换一台能 push 的机器，其他什么都不用搬。仓库里已经有全部素材（图片、案例页、字体源文件、简历 PDF），clone 下来就是完整工程。

线上地址：**https://double-k-35s.pages.dev/**

---

## 场景 A：新电脑，能装软件（推荐）

### 1. 装三样东西

| 工具 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | **22**（仓库有 `.nvmrc`，nvm 会自动读） | Vite 7 要求 ≥ 20.19 |
| pnpm | 10+ | `corepack enable` 即可，或 `npm i -g pnpm` |
| Git | 任意 | 装 GitHub Desktop 也行，它自带 git |

### 2. 拉代码、装依赖

```sh
git clone https://github.com/Double-K999/Double-K-.git
cd Double-K-
pnpm install
pnpm dev          # 打开 http://localhost:5173
```

`pnpm install` 会复现 `pnpm-lock.yaml` 里的精确版本，几分钟搞定。

### 3. 改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 文案、项目标题、联系方式、经历 | `src/content.js`（几乎所有文字都在这） |
| 版式、颜色、间距 | `src/styles.css`（布局）/ `src/ui.css`（控件） |
| 页面结构 | `src/App.jsx` |
| 作品封面、案例页 | `public/images/`、`public/case/` |

### 4. ⚠️ 新增中文文案后，必须重跑字体子集

字体是裁剪过的（129KB，只含站点用到的 751 个字形）。**新加的字如果不在里面，会掉回系统字体**，字重和字形会突然变得不一样。

```sh
python scripts/subset-font.py     # 需要 Python 3 + fonttools + brotli
```

装依赖：`pip install fonttools brotli`

### 5. 发布

```sh
pnpm build            # 本地自检，有报错先修
git add -A
git commit -m "改了什么"
git push              # Cloudflare 自动构建 + 部署
```

推完等 20 秒左右刷新线上地址即可。

---

## 场景 B：临时电脑，不能装环境（纯浏览器）

适合「只想改几句话」的情况。

### 改文案：GitHub 网页直接改

1. 打开仓库 → `src/content.js` → 右上角铅笔（Edit）
2. 改完拉到底 → **Commit changes**（直接提交到 main）
3. Cloudflare 自动构建，20 秒后线上生效

> 限制：只能改文字和简单代码，跑不了脚本、看不到本地预览。

### 需要跑脚本（字体子集 / 导出案例页）

在仓库页面按 **`.`**（点号）打开 `github.dev`（只能改代码），或点 **Code → Codespaces → Create codespace**（云端 Linux 环境，能跑命令）：

```sh
pip install fonttools brotli
python scripts/subset-font.py
git add -A && git commit -m "重新裁剪字体" && git push
```

---

## 场景 C：换托管平台

站点是纯静态产物（`dist/`），任何静态托管都能放：Vercel / Netlify / Cloudflare Pages / GitHub Pages。

换平台时只要填对三件事：

| 项 | 值 |
| --- | --- |
| 构建命令 | `pnpm build` 或 `npm run build` |
| 输出目录 | `dist` |
| Node 版本 | 22（`.nvmrc` 已声明） |

> 注意：站点用的是绝对路径（`/images/...`）。如果部署到**子路径**（比如 `username.github.io/repo/`），需要在 `vite.config.js` 里加 `base: '/repo/'`，否则图片和字体全部 404。

---

## 三个必须记住的点

1. **别提交 `node_modules` / `dist` / `artifacts`** —— `.gitignore` 已经管住，别手动加回去
2. **改了中文文案就跑一次 `subset-font.py`** —— 这是唯一容易忘、且后果可见的一步
3. **换机器后 GitHub 可能要配代理** —— 国内直连 github.com 常被重置；本机已配 `http.proxy = 127.0.0.1:7890`，新机器按自己的代理改

---

## 出问题先查哪里

| 症状 | 先看 |
| --- | --- |
| push 上去但线上没变 | Cloudflare → Workers & Pages → `double-k` → Deployments，看最新一次构建日志 |
| 构建失败 | 同上，构建日志最后 20 行；多半是依赖或 Node 版本 |
| 页面文字变丑/字重不对 | 忘了跑 `subset-font.py` |
| 图片、字体 404 | 部署路径不对（子路径部署要配 `base`） |
| 需要回退 | Deployments 里任意历史版本 → `⋯` → Rollback |

更多细节：[`deploy.md`](deploy.md)（部署）、[`status.md`](status.md)（改动记录）。
