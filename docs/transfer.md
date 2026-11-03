# 换电脑继续做：转移说明

## 一、要带走的文件

整个工程目录 **17.9 MB / 119 个文件**，压缩后约 16 MB。直接打包这个目录，但**排除下面四个文件夹**：

| 排除 | 原因 |
| --- | --- |
| `node_modules/` | pnpm 的依赖链接存的是**绝对路径**，复制到别的盘/别的电脑会全部失效，必须重装 |
| `dist/` | 构建产物，随时可 `pnpm build` 重新生成 |
| `logs/` | 本机 dev server 日志 |
| `artifacts/` | 回归脚本的截图和 JSON 报告，不影响运行（想留证据可以带上） |

必须带上的：`src/ public/ scripts/ docs/ index.html package.json pnpm-lock.yaml pnpm-workspace.yaml vite.config.js README.md .gitignore`。

> `public/` 里包含全部素材：腾讯体字体、Sacramento 签名体、两张封面、三个案例的 WebP（共 5.9MB）、背景视频、简历 PDF。**不依赖任何外网资源**。

## 二、新电脑上的准备

1. 安装 **Node.js 20.19+ 或 22.12+**（Vite 7 的要求）
2. 启用 pnpm：
   ```sh
   corepack enable
   corepack prepare pnpm@11 --activate
   ```
   或者 `npm i -g pnpm`
3. 把工程解压到任意目录（**路径里有中文和空格没问题**，当前工程就在 `D:\Double K 个人网站`）

## 三、跑起来

```sh
cd <解压后的目录>
pnpm install          # 第一次装依赖，约 1 分钟（会复用自己的全局 store，第二次很快）
pnpm dev              # 打开 http://localhost:5173
```

Windows 上也可以直接用脚本（会自动找 node）：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/dev.ps1
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

## 四、换机器后需要改的四处（都只有一行）

| 文件 | 改什么 |
| --- | --- |
| `scripts/dev.ps1`、`scripts/build.ps1` | `$bundled` 指向的是本机 DSH 运行时的 node。新电脑装了 Node 就不用管（脚本优先用 PATH 里的 `node`），否则把它改成新机器的 node 路径，或直接删掉这行 |
| `scripts/build-case.py` | `DEFAULT_PDF` 是原来那台机器上的 PDF 路径。只有**重新导出案例页**时才需要它，平时不用跑；用的时候把 PDF 路径作为参数传进去即可 |
| `scripts/checks/_pw.cjs` | 回归脚本用的 Playwright：优先读环境变量 `PLAYWRIGHT_PATH`，其次读项目里装的 `playwright`，最后才回退到本机 DSH 路径 |
| `scripts/checks/*.cjs` | 会自动找系统 Chrome（`CHROME_PATH` 可覆盖）；找不到就要求装 Playwright 自带的 Chromium |

回归脚本不是日常必需，装一次即可：

```sh
pnpm add -D playwright
npx playwright install chromium
node scripts/checks/verify.cjs         # 六断点布局回归
node scripts/checks/functional-check.cjs
```

## 五、几个容易踩的点

- **别复制 `node_modules`**。哪怕同盘复制、软链还能用，换电脑就必坏；`pnpm install` 30 秒的事。
- **案例页不用重新导出**。`public/case/**` 已经是最新的 WebP；只有你改了 PDF 才需要跑 `scripts/build-case.py`（默认参数导出 PUBG 那份，Blood 与 ENTER BATTLE 用参数指定，见脚本头部注释）。
- **字体别丢**。`public/fonts/tencent-sans-w7.ttf`（8MB）是全站字体的唯一来源，漏了会退回系统字体、字重和排版全变。
- **开发服务器**。`vite config` 里开了轮询监听（`usePolling`）来规避 Windows 下编辑器的 `EBUSY` 崩溃；`scripts/dev.ps1` 还带了一层崩溃后自动重启，换机器后照常用。

## 六、建议顺手做的一件事

工程目前**没有版本控制**（这台机器没装 Git）。到了新电脑后建议：

```sh
git init
git add .
git commit -m "chore: 导入作品集基线"
```

`.gitignore` 已经写好了（排除 `node_modules`、`dist`、`artifacts`、`logs`），直接就能用。之后每次大改前提交一次，来回改样式时就不怕丢东西了。
