# Double K · 李旭昆 · 游戏交互设计作品集

React + Vite 单页作品集，包含全屏动态首页、个人介绍与经历、项目卡片、全屏项目详情、设计能力和联系页。桌面版最大内容宽度为 1700px，并适配平板与手机。

> 本工程由 Codex 产出的半成品承接而来。接手时的现状、已知问题与下一步计划见 [`docs/status.md`](docs/status.md)。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```sh
pnpm install
pnpm dev
```

打开终端显示的本地地址（默认 http://localhost:5173）。

### 在当前这台机器上运行

本机没有把 `node` 加进 PATH，直接用 `pnpm dev` 会报错。请使用 DSH 内置运行时脚本：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/dev.ps1
```

脚本会自动使用 `C:\Users\administered\.dsh\dsh-runtimes\...` 下的 node，以 `--host 0.0.0.0 --port 5173 --strictPort` 启动；构建同理：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

构建产物 `dist/` 是可部署的静态网站。字体、视频、图片和简历均为本地资源，浏览时不依赖第三方素材服务。

## 换电脑继续做

把整个目录打包带走（**排除 
ode_modules / dist / logs / rtifacts**），新电脑上 pnpm install 后 pnpm dev 即可。详细步骤、需要改的几处机器相关路径、常见坑，见 [docs/transfer.md](docs/transfer.md)。

## 目录

```
index.html            入口 HTML（标题 / description / favicon）
src/main.jsx          React 挂载点，先引入 styles.css 再引入 ui.css
src/App.jsx           页面结构、交互状态、项目详情弹窗
src/content.js        个人联系方式与项目文案（改文案优先改这里）
src/styles.css        页面布局、装饰性排版、响应式（压缩写法，单行多规则）
src/ui.css            导航与基础控件的唯一规范入口
docs/ui-guidelines.md UI 规范（间距 / 颜色 / 控件尺寸）
docs/status.md        接手现状、问题清单、下一步
public/               字体、图片、背景视频、简历 PDF
public/case/pubg/     作品集 PDF 导出的案例页（p04–p38.webp，详情页用）
scripts/dev.ps1       本机启动脚本
scripts/build.ps1     本机构建脚本
scripts/build-case.py PDF → 案例页 WebP 的导出脚本（PDF 更新后重跑）
artifacts/            Playwright 回归脚本与截图（不参与构建）
```

## 替换内容

- `src/content.js`：个人联系方式、项目标题、介绍、设计参与、成果、封面和详情图片路径。
- `src/App.jsx`：首页文案、个人经历、能力卡片与页面结构；首屏的「作品胶卷」列表是同文件顶部的 `stripTiles`。
- `src/styles.css`：配色、字体、间距、版心宽度和响应式样式；首屏样式集中在文件开头的 `HERO` 区块。
- `src/ui.css`：导航与基础 UI 组件的唯一规范入口；具体尺寸与对齐规则见 `docs/ui-guidelines.md`。
- `public/images/cover-pubg.webp`、`cover-blood.webp`：作品卡片的官方主视觉封面（840px 宽，1.72 比例）。`project-pubg.svg` / `project-blood.svg` 是最早的概念占位图，仍留在 `stripTiles` 里当首屏胶卷素材。
- `public/images/project-system.svg`：项目详情中的流程示意，后续可替换为真实流程、线框图、界面截图。
- `public/images/study-hud.svg`、`study-flow.svg`、`study-rings.svg`：首屏胶卷用的三张概念视觉，同样是占位素材。
- `public/images/portrait.webp`：个人介绍区块的本人照片（830×1012，59KB）；换照片只改 `src/content.js` 的 `about.photo`。
- `public/images/designer.svg`：早期的人物插画，现在只用在首屏作品胶卷里。
- `public/media/hero.mp4`：首屏右侧的循环动态画面（512×594 / 9.4s / 1.15MB），`public/images/hero-reel-poster.webp` 是它的海报帧。`public/media/orbit.webm` 已不再引用，可删。
- `public/images/strip/*.webp`：首屏底部胶卷的 10 张作品缩略图（560×267），从 `public/case/` 的原页裁切而来。
- `public/resume-li-xukun.pdf`：下载简历文件。
- `public/case/pubg/p04–p37.webp`（34 页）+ `public/case/blood/p03–p33.webp`（31 页）+ `public/case/enter-battle/p01–p13.webp`（13 页）+ `public/case/yiche/p04–p24.webp`（21 页）+ `public/case/anheng/p26–p40.webp`（15 页）+ `public/case/netease-fps/p42–p55.webp`（14 页）：二级界面里两个项目各自的作品集案例页，分别来自两份 PDF。**PDF 更新后**重跑 `python scripts/build-case.py`（用法见脚本头部注释）；若页码范围变了，同步改 `content.js` 里 `case.pages` 的生成范围与 `case.sections` 的跳转页码。

项目介绍与数据基于用户提供的简历。项目封面、流程示意图与首屏胶卷素材均为可替换的占位视觉，并在页面中标识；个人介绍区的照片已换成本人实拍。

## 交互与可访问性

导航锚点、手机菜单、项目详情（原生 dialog，支持 Escape / 焦点恢复）、能力卡片展开、微信与邮箱复制、邮件与电话链接、简历下载、回到顶部、背景视频暂停。首屏作品胶卷悬停暂停、触屏设备不自动滚动；系统选择减少动态效果时，胶卷与星芒动画停止、背景改用静态海报。

## 素材与回归脚本

- `scripts/generate-assets.cjs`：重新生成 SVG 素材。
- `scripts/generate-motion.cjs`：生成 WebM 与海报。
- `scripts/checks/verify.cjs`：六个断点的布局回归（横向溢出、控件对齐、字体加载、控制台报错、详情弹窗）。
- `scripts/checks/interaction-check.cjs`：移动菜单、吸顶导航、导航高亮、详情滚动。
- `scripts/checks/functional-check.cjs`：复制联系方式、简历下载、回到顶部、详情页 CTA。

三个回归脚本用系统 Chrome + DSH 运行时里的 Playwright 运行，普通开发与构建不需要它们。

正文字体使用用户提供的腾讯体 W7，文件为 `public/fonts/tencent-sans-w7.ttf`，通过 `@font-face` 本地加载；当前压缩包仅包含 W7 字重。首屏签名 `LiXuKun` 使用 Sacramento（SIL Open Font License 1.1），Latin 子集 woff2 位于 `public/fonts/sacramento-latin-400.woff2`，同样本地自托管。图标来自 Lucide。
