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

## 零安装方案（不会写代码、不想装任何软件时用这个）

> 如果已经在自己电脑上装好 Node/Git，**用仓库根目录的两个双击文件更省事**：
> `开始预览.bat`（启动本地预览，自动开浏览器）、`发布上线.bat`（提交并推送，自动上线）。
> 详见文末「附：双击党专用」。

### 方案 1：只改文字 / 换图 → 直接在 GitHub 网页改

1. 浏览器打开 `github.com/Double-K999/Double-K-`
2. 点要改的文件，例如 `src/content.js`（所有文案都在这里）
3. 右上角 **铅笔图标** 进入编辑
4. 改完拉到页面底部 → 点绿色 **Commit changes** → 再点一次确认
5. 等 20 秒，刷新线上地址

换图片同理：进到 `public/images/`，**Add file → Upload files**，把新图拖进去，文件名和原来保持一致，提交即可。

> 唯一的小坑：如果新增了**从没出现过的汉字**，字体文件里没有这个字形，会退回系统字体（能看，但字重略有差别）。彻底解决要跑一次字体脚本，见方案 2。

### 方案 2：需要预览 / 跑脚本 → GitHub Codespaces（浏览器里的完整电脑）

不需要在本机装任何东西，GitHub 给你一台云端的 Linux 开发机：

1. 打开仓库 → 绿色 **Code** 按钮 → **Codespaces** 标签 → **Create codespace on main**
2. 等 1~2 分钟，浏览器里出现一个 VS Code 界面，底部有终端
3. 在终端里粘贴一行：`pnpm install`（装依赖，第一次约 1~3 分钟）
4. 再粘贴：`pnpm dev` → 右下角会弹出「端口 5173 已转发」，点 **Open in Browser** 就能预览
5. 左侧文件树里点 `src/content.js` 改文字，保存后浏览器**自动刷新**
6. 改完：左侧第三个图标（分支图标）→ 填一句说明 → **Commit & Push**
7. 用完点左下角 **Codespaces: 停止**（不点的话会一直占用额度）

免费额度：个人账号每月约 120 核时（2 核机器 ≈ 60 小时），改几次完全够用。

> 如果提示要先开启 Codespaces：Code → Codespaces → 按提示启用即可，免费额度内不产生费用。

### 方案 3：让 AI 工具代劳

把仓库地址交给 Codex / Claude Code / Cursor，用自然语言说改动（例如「把精选作品里第二个项目标题改成 XXX」），它自己改文件、跑命令、推送。仓库根目录的 `AGENTS.md` 就是给它看的说明书。

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

---

## 附：完全新手版（Windows，一步一步）

### 0. 先想清楚你要做什么

| 你要做的 | 要不要装环境 |
| --- | --- |
| 只改文字、链接、联系方式 | **不用装**，用「场景 B」的 GitHub 网页改法，改完自动上线 |
| 换图片、调版式、要本地预览 | 要装，按下面 1–6 步走 |

### 1. 装 Node.js（网页的运行引擎）

打开 **https://nodejs.org** → 下载 **LTS（22.x）** → 双击安装包 → 一路「下一步」。

验证：开始菜单搜 **PowerShell** 打开，输入 `node -v`，显示 `v22.x.x` 就成。

### 2. 装 Git（和 GitHub 同步的工具）

打开 **https://git-scm.com/download/win** → 一路「下一步」（默认选项就行）。

验证：`git --version`

### 3. 启用 pnpm（下载代码依赖的工具）

```powershell
corepack enable
```

验证：`pnpm -v`（显示版本号即可；没装 Node 这步会失败，先做第 1 步）

### 4. 把项目下载到本地

```powershell
cd D:\
git clone https://github.com/Double-K999/Double-K-.git
cd Double-K-
```

第一次会下载约 18MB，等它跑完。

### 5. 装依赖 + 本地预览

```powershell
pnpm install     # 第一次 1~3 分钟
pnpm dev         # 出现 http://localhost:5173 就好了
```

浏览器打开那个地址 = 本地版网站。改代码会自动刷新；要停止按 `Ctrl + C`。

### 6. 改完发布

```powershell
git add -A
git commit -m "改了什么"
git push
```

第一次 push 会弹 GitHub 登录窗口，登录一次即可；之后 20 秒左右线上更新。

### 常见卡点

| 现象 | 原因 / 解决 |
| --- | --- |
| `node : 无法将"node"项识别为…` | Node 没装好，或装完没重开终端 |
| `pnpm : 无法识别` | 没做 `corepack enable`，或终端没重开 |
| `git clone` 卡住 / `Connection reset` | 网络问题，配代理：`git config --global http.proxy http://127.0.0.1:7890` |
| push 时要求登录 | 正常，登录一次 GitHub 账号 |
| 页面文字变细、字形不对 | 忘了跑 `python scripts/subset-font.py` |


更多细节：[`deploy.md`](deploy.md)（部署）、[`status.md`](status.md)（改动记录）。
