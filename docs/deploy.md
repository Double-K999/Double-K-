# 部署到 Cloudflare Pages

## 线上地址

**https://double-k-35s.pages.dev/**

项目名 `double-k`，账号下唯一的 Pages 项目。

## 当前是怎么发上去的

仓库当时是空的（只有 `.gitattributes`），Cloudflare 的 Git 构建跑不起来，所以先用 **wrangler 直传**把 `dist/` 推上去：

```sh
pnpm build
pnpm dlx wrangler pages deploy dist --project-name=double-k
```

第一次要先登录：`pnpm dlx wrangler login`（浏览器里点 Allow，token 会存在 `~/.wrangler`）。

> 本机没有全局 node/npm，用 DSH 自带的：
> `C:\Users\administered\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe`
> 和 `...\dependencies\pnpm\bin\pnpm.mjs`，运行时把 node 目录加进 PATH。

## 以后更新，两条路

### A. 直传（最短路径，不依赖 Git）

```sh
pnpm build
pnpm dlx wrangler pages deploy dist --project-name=double-k
```

约 1 分钟出新版本，`double-k-35s.pages.dev` 立刻生效。

### B. 走 Git 自动构建（推荐长期用，已打通）

仓库 `github.com/Double-K999/Double-K-` 已经推上去了（HEAD `c0cec4f`，189 个文件），Cloudflare 每次收到 `main` 的新提交会自动构建 + 部署，实测一次约 20 秒。

日常流程就三步：

```sh
git add -A
git commit -m "update"
git push        # Cloudflare 自动构建
```

> 本机 git 在 `C:\Users\administered\AppData\Local\GitHubDesktop\app-3.6.10\resources\app\git\cmd\git.exe`，
> 并且已经配好 `http.proxy = 127.0.0.1:7890`（直连 github.com 会被重置）。

构建配置（已核对，无需改动）：

| 项 | 值 |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node 版本 | 22（仓库里已有 `.nvmrc`，Cloudflare 会读） |

## 踩过的坑

| 现象 | 原因 |
| --- | --- |
| 构建日志 `ENOENT ... /repo/package.json` | 仓库根目录没有项目文件——git 是在一个空的嵌套目录里初始化的 |
| 大屏上联系区页脚看不到 | `@media(min-width:1800px)` 把 `min-height` 写成了 1050px，比视口还高（已修） |

## 回滚

Cloudflare 控制台 → Workers & Pages → `double-k` → Deployments，任何一次历史部署右侧的 `⋯` 里有 **Rollback**。
