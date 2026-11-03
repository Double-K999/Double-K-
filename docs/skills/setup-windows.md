---
name: setup-doublek-windows
description: 在 Windows 电脑上把 Double K 作品集跑起来（装 Node 22 / Git / pnpm、克隆仓库、装依赖、启动本地预览）。当用户说「新电脑要装环境」「帮我把这个项目配好」「localhost:5173 打不开」时使用。
---

# 技能：给 Double K 作品集装开发环境（Windows）

## 你会拿到什么

用户手上可能只有一段话和一个仓库地址。你的任务是**自己动手**把环境装好、把项目跑起来，而不是让用户去敲命令。

- 仓库：`https://github.com/Double-K999/Double-K-.git`
- 线上站：`https://double-k-35s.pages.dev/`
- 目标：本机 `http://localhost:5173` 能打开这个站

## 铁律

1. **命令你来跑**，不要写「请用户执行…」。用户不是程序员。
2. 装软件前**一句话说明**要装什么、为什么，然后直接装；需要 UAC 授权时提醒用户点「是」。
3. 每一步都要**验证**：拿不到版本号就停下，给出可执行的补救，不要假装成功。
4. **不要改项目代码**，这一步只装环境。
5. 不要动用户已有的 Node/Git 安装，缺什么补什么。

## 执行步骤

### 0. 环境体检

在 PowerShell 里依次检查，记下哪些缺失：

```powershell
node -v; git --version; pnpm -v; winget --version
```

判定标准：Node ≥ 20.19（推荐 22），Git 任意，pnpm 10+。

### 1. 装 Node.js 22（缺则装）

```powershell
winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent
```

装完必须有**新开的**终端才能读到 PATH（这是最常见的坑）。如果 `node -v` 依旧找不到，手动刷新当前会话 PATH，或提示用户重开终端。

### 2. 装 Git（缺则装）

```powershell
winget install --id Git.Git --accept-source-agreements --accept-package-agreements --silent
```

### 3. 启用 pnpm

```powershell
corepack enable
pnpm -v
```

如果 `corepack` 不存在（Node 太老），改用 `npm i -g pnpm`。

### 4. 克隆仓库

默认放 `D:\`；如果该盘不存在，用 `C:\Users\<用户名>\`。

```powershell
cd D:\
git clone https://github.com/Double-K999/Double-K-.git
cd Double-K-
```

国内网络如果报 `Connection was reset` / 卡住：先让用户确认本机代理（常见 `127.0.0.1:7890`），然后

```powershell
git config --global http.proxy http://127.0.0.1:7890
```

再重试 clone。

### 5. 装依赖

```powershell
pnpm install
```

约 1–3 分钟。失败就先看最后 20 行报错（多半是网络或 Node 版本）。

### 6. 启动并验证

```powershell
pnpm dev
```

要求：控制台出现 `http://localhost:5173`，且 `Invoke-WebRequest http://localhost:5173/` 返回 200，页面 `<title>` 含 `Double K`。

> 注意：`pnpm dev` 会占住当前终端。验证请另开一个会话，或让 `pnpm dev` 在后台任务里跑。

### 7. 可选：本次要改中文文案才装

```powershell
pip install fonttools brotli
```

## 交付标准（汇报格式）

用这种结构回复用户，不要贴一大堆日志：

```
✅ 环境：Node v22.x / Git x.x / pnpm x.x
✅ 仓库：D:\Double-K-（绝对路径，已装依赖）
✅ 预览：http://localhost:5173 正常打开
⚠️ 遇到：<如果有，一句话说明怎么解决的>
下一步：后续对话请在 D:\Double-K- 这个目录里开，我才能读到 AGENTS.md / docs/
```

**必须把仓库的绝对路径写清楚**，并提醒用户：之后的对话要在这个目录里打开工具，否则读不到 `AGENTS.md`、`docs/`、`src/`。

## 收尾自检（别跳过）

```powershell
cd <仓库路径>
Test-Path AGENTS.md, docs\status.md, docs\skills\publish.md, src\content.js
```

四个都要返回 `True`。只要有一个 False，说明克隆不完整或目录不对，**现在就修**——否则用户下一步说「读 AGENTS.md」时会失败。

## 常见故障对照

| 现象 | 处理 |
| --- | --- |
| `node : 无法将…识别` | PATH 没刷新：重开终端；仍不行就查 `C:\Program Files\nodejs` 是否在 PATH |
| `pnpm : 无法识别` | 漏了 `corepack enable`，或终端没重开 |
| clone 报 `Connection reset` | 配代理（见步骤 4），或换 SSH 方式 |
| `pnpm install` 报 EACCES/EPERM | 文件被占用：关掉编辑器/杀毒扫描后重试 |
| 5173 被占用 | `pnpm dev --port 5174`，或先关掉旧进程 |
| 页面文字明显变细/字形不对 | 没跑字体子集，见 `scripts/subset-font.py` |
| 用户说「读不到 AGENTS.md」 | 工具的工作目录不在仓库根：`cd` 进去重开，或直接用绝对路径 `D:\Double-K-\AGENTS.md` |
