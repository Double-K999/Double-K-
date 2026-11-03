# 接手现状（2026-10-27）

## 一、工程在哪里

| 项目 | 位置 |
| --- | --- |
| 当前工作目录（唯一维护副本） | `D:\Double K 个人网站` |
| 原始 Codex 产出目录（只作为备份，不再改动） | `D:\kk个人网站` |
| 开发服务器 | http://localhost:5173 （vite 7.3.7，`--strictPort`） |
| 启动方式 | `powershell -ExecutionPolicy Bypass -File scripts/dev.ps1` |

迁移时只带走了源码：`src/`、`public/`、`docs/`、`scripts/`、`index.html`、`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`vite.config.js`、`README.md`。
`node_modules/`、`dist/`、`tmp/`、`logs/`、`artifacts/` 没有迁移——`node_modules` 里的 pnpm 链接是绝对路径，复制过去会指向旧目录，所以在新位置用 `pnpm install --frozen-lockfile` 重装（store 复用 `D:\.pnpm-store\v11`，1.3 秒完成）。

本机 `node` / `pnpm` / `git` 都不在 PATH 上，使用的是 DSH 内置运行时（Node 24.21.0 / pnpm 11.28.5）。**本机没有安装 Git**，工程当前没有版本控制。

## 二、品牌口径

**已确认并执行：全站统一 `Double K`。** `uuni` 只作为历史名称保留在旧备份里，不再出现在页面上。

- 头部 logo、页脚 wordmark、项目详情顶栏、人物卡名牌：`Double K®` / `Double K©`
- 自我介绍英文眉标：`HELLO, I'M DOUBLE K.`
- `<title>`：`Double K — 李旭昆 · 游戏交互设计师`
- `src/content.js` 的 `alias`：`Double K`；`package.json` 的包名：`double-k-portfolio`
- favicon 换成与头部同款的准星标记（`#f47716` 底 + 深色描边）
- 补齐 `og:*` / `twitter:*` 分享卡片元信息（图片暂用 `hero-poster.jpg`，上线后换成绝对地址 + 1200×630 专用图）

## 三、首屏改版（参考用户提供的参考图）

版式由“居中大标题 + 底栏”改为参考图的“左对齐字标 + 签名 + 底部作品胶卷”：

1. 小字眉标：`GAME UX DESIGNER — UX / UI DESIGNER — PORTFOLIO 2026`
2. 主标题 `Double K`：橙色渐变字（`--accent-orange` → `#ffd2a3`）+ 双星芒，字号 `clamp(64px,10.4vw,170px)`
3. 次标题 `PORTFOLIO`：白色、`.3em` 字距，右端叠一只手写签名 `LiXuKun`（Sacramento，`-5°` 倾斜、与 PORTFOLIO 共用基线、向左侧压住最后一个 O）
4. 描述文案：`用交互系统与 AI 工作流，让复杂的系统成为直觉的体验。`（`AI 工作流` 加粗、`直觉的体验` 高亮为橙色）
5. 行动区：`探索我的作品` 胶囊按钮 + 署名 + 背景视频暂停按钮（桌面显示，移动端隐藏）
6. 底部作品胶卷：8 张图 × 2 份无缝 marquee，边缘渐隐、悬停暂停、触屏与 `prefers-reduced-motion` 下静止

配色沿用工程既有橙色体系与腾讯体 W7；唯一新增字体是签名用的 **Sacramento**（SIL OFL 1.1，Latin 子集 woff2 仅 23KB，自托管在 `public/fonts/`，无第三方运行时依赖）。旧的 `hero` 样式（含尾部补丁层与 8 条已无 DOM 的死规则）已整段替换，`styles.css` 的 hero 区块可读、其余保持原样。

## 三·二、个人介绍区块改版（第二张参考图）

`#about` 从「人物卡 + 经历列表 + 数据条」改为参考图的「左标题/左照片 + 右自我介绍 + 全宽时间轴」：

1. 左栏：`WORK EXPERIENCE`（带橙色 ↘ 箭头）+ `个人经历`（14px 灰），下方为本人照片 `portrait.webp`（830×1012 / 59KB WebP，圆角 16px，高度跟随右栏内容撑满，`object-fit:cover` 取 `50% 34%`）
2. 右栏：`ABOUT ME` 眉标 → `Hi, I am XuKunLi !` → 一段自我介绍 → 2×2 信息表（当前身份 / 服务方向 / 手机 / 邮箱，邮箱可点击复制）→ 分割线 → 三列数据 `3+ 设计经验 / 3+ 项目落地 / 2+ FPS 游戏方向` → 分割线 → `NOW BUILDING / 进行中的项目` + 四个能力胶囊
3. 底部：`CAREER PATH / 工作经历` 时间轴，一条横线 + 三个橙色四角星节点，每列依次为时间、公司、职位胶囊、职责描述
4. 文案全部收敛到 `src/content.js` 的 `about` / `career` 两个导出；换照片只改 `about.photo`，`about.nowBuilding.tags` 是占位能力标签，有真实在做的项目后直接替换
5. 断点：≤1024 时间轴两列（第三项占满整行）；≤760 全部单列，时间轴每项自带分隔线 + 星标

**左右两栏上下严格对齐**：栅格改用 `grid-template-areas: "head ." / "photo right"`，右栏独占第 2 行，因此顶部与照片上沿齐平；右栏是 flex 纵向布局、`align-self:stretch`，`NOW BUILDING` 块用 `margin-top:auto` 贴住底部，照片 `height:100%` 撑满整行——照片与右栏的上下边界完全重合（1440 下均为 279→787）。≤760 堆叠为单列，照片回到 `aspect-ratio:1.15`。

改版同时清掉了旧区块遗留的 40 条死规则（`.portrait-*`、`.experience-*`、`.metrics*`、`.bio`、`.about-layout`、`.text-link` 等），并从 `ui.css` 的公共控件分组里移除了已不存在的 `.text-link` / `.about-info button`——顺带修掉了邮箱复制按钮被 `ui.css` 撑成 44px 高、字号变 12px 的级联冲突。

## 三·三、二级界面接入作品集 PDF

两个项目都改成了「案例阅读器」，数据来自两套 PDF：

| 项目 | 来源 PDF | 页码 | 页数 | 资产 | 章节胶囊 |
| --- | --- | --- | --- | --- | --- |
| PUBG MOBILE | `2026-游戏交互作品集-1年经验.pdf`（38 页） | 04–37 | 34 | `public/case/pubg/` 2.4MB | 作品目录 / PART 1 局内交互 / PART 2 局外系统 |
| BLOOD STRIKE | `2025-游戏交互作品集-25届毕业生.pdf`（69 页） | 03–33 | 31 | `public/case/blood/` 2.2MB | 01 核心体验 / 02 运营&付费 |
| 进战系统交互研究 | `李旭昆-游戏交互测试.pdf`（14 页） | 01–13 | 13 | `public/case/enter-battle/` 1.35MB | 世界观与需求 / 流程梳理 / 界面说明 |
| 购车链路体验改版 | `2024交互作品集.pdf`（58 页） | 04–24 | 21 | `public/case/yiche/` 2.18MB | 改版背景 / 用户洞察 / 方案设计 / IP 与总结 |
| 终端安全系统升级 | 同上 | 26–40 | 15 | `public/case/anheng/` 1.21MB | 设计目标 / 信息架构 / 设计规范 / 项目总结 |
| 射击游戏小程序设计 | 同上 | 42–55 | 14 | `public/case/netease-fps/` 0.93MB | 场景与定位 / 赛事首页 / 角色详情 / 战绩信息 |

1. 导出：`scripts/build-case.py` 把指定页码渲染成 1728×972 的 WebP（q80），平均 70KB/页，PDF 更新后重跑即可
2. 详情页：`project.case` 存在时渲染「案例阅读器」，否则沿用原来的结构化详情（现在两个项目都走阅读器）
3. 顶栏：吸顶章节条 = 项目名 + 章节跳转胶囊 + 总页数；关闭按钮固定，右侧留 104px 避免压住 `PROJECT 0x / CASE STUDY`
4. 页面：16:9 图纵向平铺，首两页 `eager`、其余 `lazy`；末页后接「还有更多，留给我们的对话」+ 联系我 CTA
5. 移动端：每页可横向滑动（图片按 860px 宽渲染），顶部提示「← 左右滑动查看页面细节 →」，章节条换行

**PUBG 第 38 页「THANKS」已按要求删除**（那页上的微信/电话/邮箱还是 `222 XXXX 2222`、`111XXXX111@qq.com` 占位信息）。`build-case.py` 的默认范围同步改到 37 页，避免重跑时又导回来；页数变化后记得同步 `content.js` 里 `case.pages` 的 `length`。

BLOOD STRIKE 取的 03–33 页正好覆盖该 PDF 的第 01 章（核心体验）与第 02 章（运营&付费），03 页是章节封面、23 页是第二章封面；34 页之后是小程序与 AIGC 章节，未纳入。

还剩一个 PDF 本身的问题：**PART 3 交互指南&规范** 在 PUBG 那份 PDF 的目录里有、正文没有对应页，补进 PDF 后重导即可。

## 三·四、精选作品改为「作品目录式」栅格

按参考图把 `#work` 从「2 张竖排大卡」换成类目列表：封面 + 标题 + 一行 `类型 | 一句话`，点击仍打开二级界面。文案走 `content.js` 里每个项目的 `card: { type, desc }`（PUBG 为 `射击 ｜ 海外排名第一的大逃杀类射击手游`）。

- 封面：1.72 比例 + 1px 描边 + 8px 圆角；左上角 `CASE / 0x` 小字、右下角圆形箭头按钮、顶部黑色渐变；悬停时封面放大 4%、箭头填橙。封面图是官方主视觉（`cover-pubg.webp` / `cover-blood.webp`，840px 宽）
- 栅格：桌面 4 列 → 2 张卡 + 一块跨 2 列的虚线「更多体验，正在持续探索中」占位（`work-more`），正好铺满一行；≤1100 两列、占位块跨整行；≤560 单列
- 排版：标题 `clamp(17px,1.6vw,23px)`、白色 700，悬停变橙；描述 11px 灰、中间 1px 竖线分隔；封面与标题间距 14px
- 悬停：封面缩放 + 标题/箭头变色（**不用位移**——虽然腾讯游戏产品页是整卡上移，但本站卡片更小，位移在 2 卡栅格里显得晃）
- 顺带修掉一个老问题：卡片从「`<button>` 里套 `div/h3/p`」改成只含 `span`，HTML 合法了，读屏不会再把整张卡连读成一个按钮名
- 清掉随旧卡一起失效的 14 条 `.project-*` 规则和 `ui.css` 里的 4 条残留

### 分组（2026-10-28 追加）

按参考图把作品区改成「按标题分组」：`content.js` 里新增 `workGroups`，每组 = 标题 + 英文小标 + 编号 + 卡片列表 + 预留空位。

- **游戏产品 / GAME PRODUCTS（04）**：PUBG MOBILE、BLOOD STRIKE、ENTER BATTLE + 1 个空位
- **产品设计 / PRODUCT DESIGN（03）**：购车链路体验改版、终端安全系统升级、射击游戏小程序设计（2024 交互作品集 PDF 的三个项目），第 4 格放「更多体验，正在持续探索中」
- 组间有分隔线，组标题行右侧是对应数量；栅格 4 列（两行都刚好铺满），≤1100 两列、≤560 单列（空位在移动端压到 92px 高省空间）
- 空位样式：虚线框 + 空心 `+` + 「待上传」+「作品占位 / TO BE ADDED」，不可点击
- 加新作品：往 `projects` 里加一条，再把它的 `id` 加进对应组的 `items` 并把 `slots` 减 1
> 历史上这段在 2026-10-28 有一轮反复：曾按腾讯产品页改成「无覆盖层 + 1.94 比例 + 整卡上移」，随后按用户要求整体回退到上面的形态（封面与文案的替换保留）。

## 三·五、头图换视频 + 全站纯黑

1. 首屏视频换成 `public/media/hero.mp4`（512×594 竖版、9.4 秒循环，H.264）。因为原素材是竖版且只有 512px 宽，**没有拉满整屏**——拉满会放大 2.8 倍糊掉、也会压住标题；改成右侧一块 `.hero-reel`：**无边框、无圆角、无底板**，宽 `clamp(320px,42vw,680px)`（≤1100 收窄到 29vw 避免压住标题），用 `radial-gradient(ellipse 50% 50%, #000 56%, transparent 100%)` 遮罩把画面边缘融进纯黑，再加 `brightness(.72) contrast(1.14)` 把浅灰底压下去。手机端退成整屏 13% 透明度的环境层 + 上下渐隐遮罩。
2. 海报帧由视频第 2.8 秒截取，存为 `hero-reel-poster.webp`（512×594 / 11KB）。
3. 背景统一 `#000000`：`:root`、`.hero`、`.about`、`.work`、`.expertise`、`.project-dialog`（含 case 模式）、`.case-bar` 全部改黑；卡片/照片/胶卷的底改 `#0a0a0a`；删掉了 about 区块原来的橙色径向光晕。联系区仍是品牌橙，未动。
## 三·六、自定义侧边滚动滑块

浏览器原生滚动条已隐藏（`html{scrollbar-width:none}` + `html::-webkit-scrollbar{width:0}`），页面右侧换成站内自己的定位滑块：

- 结构：`ScrollRail` 组件（`App.jsx`）+ `.scroll-rail` / `.scroll-rail-thumb`（`styles.css` 末尾）
- 轨道：宽 2px、高 `clamp(140px,26vh,240px)`，固定在右侧 `clamp(8px,1.4vw,22px)`，垂直居中；轨道底色 `#ffffff1f`，滑块 46px 橙色 + 12px 光晕
- 进度：滚动时用 `requestAnimationFrame` 节流计算 `scrollY / (scrollHeight - innerHeight)`，写进 CSS 变量 `--progress`，滑块 `top: calc(var(--progress) * (100% - 46px))`
- 交互：轨道可点击跳转、可按住拖拽（`pointerdown` + `setPointerCapture`，用 `behavior:'instant'` 避免平滑滚动打架）；左右各留 9px 透明热区，2px 的轨道也好点
- ≤760 隐藏（触屏不需要），`aria-hidden` 不干扰读屏
## 三·七、feed 式浏览（整屏区块 + 入场 + 吸附）

原来是「所有内容常驻、一路平铺」，按参考视频改成 feed 的节奏：

1. **整屏区块**：`.about/.work/.expertise` 加 `min-height:100svh` + `display:flex;flex-direction:column;justify-content:center`，每块至少占满一屏，短内容垂直居中。
2. **入场动画**：section 上挂 `data-reveal`，`IntersectionObserver`（threshold .12、上下各留 8%/14% 余量）触发 `.is-in`，`opacity 0→1` + `translateY(36px)→0`，0.85s 缓动；只触发一次，来回滚不闪。
3. **区块吸附**：`html{scroll-snap-type:y proximity}` + 各 section `scroll-snap-align:start`。用 proximity 不用 mandatory——工作经历/精选作品都高于一屏，mandatory 会把人卡在区块里。
4. `scroll-padding-top` 从 100px 改为 0：锚点跳转和吸附都让区块顶对齐视口顶；移动端 `.section-pad` 上内边距加到 104px，保证标题不被悬浮导航遮住。
5. `prefers-reduced-motion` 下关闭吸附和位移，只保留内容可见。
## 三·八、卡片逐个刷出 + 联系区软化

1. **逐卡错峰**：`.work-card` / `.strength-card` 自带 `opacity 0 → 1` + `translateY(26px) → 0`，延迟 `calc((var(--g,0)*4 + var(--i,0)) * 85ms)`——`--i` 是组内序号，`--g` 是分组序号，所以「游戏产品」4 张刷完才轮到「产品设计」3 张。实测 180ms 时只有第 1 张半亮，900ms 全部到位。
2. **联系区不再砸下来**：
   - 底色从 `.contact` 挪到内层 `.contact-bg`，随入场 `translateY(56px) → 0` + `opacity 0 → 1`（1s），是「橙色底板从下往上推入」而不是整块闪现
   - 顶部加 96px 渐变遮罩（`mask-image`），橙黑交界不再是硬边；桌面端才启用，手机端标题会落进暗区
   - 从 `scroll-snap-align` 里摘掉 `.contact`——滚到底不再被整屏吸附，改成自然进入
   - 联系区高度仍为 900（内容+页脚一屏放得下）
## 三·九、首屏胶卷换成真实作品

- 首屏底部 10 张胶卷缩略图全部换成作品页截图：`public/images/strip/*.webp`（560×267，2.1 比例，共 167KB）
- 来源：ENTER BATTLE p02/p01、PUBG p22、YI CHE p19/p04、BLOOD STRIKE p30/p12、ANHENG p26/p30、FPS p48——优先挑视觉信息密度高的页面（角色群像、蓝白系统图、橙色 HUD、机器人形象），并按明暗交替排序，滚动时不会一片黑
- 生成逻辑：从 `public/case/*` 的 1728px 原图按 2.1 居中裁切再缩到 560px，避免首屏加载十几张整页大图
- 原来那批 `project-*.svg` / `study-*.svg` / `designer.svg` 不再出现在首屏，但文件仍留着（项目的 `gallery` 字段还引用着）
## 三·十、能力卡改为悬浮即展开

原来是「悬浮只给淡边框，点击下方文字才展开」。现在：

- `.strength-card` 加 `onMouseEnter` / `onFocus`，悬浮或键盘聚焦即把该卡设为展开态（同一时间只展开一张，默认第一张）
- 展开态边框 `#f4771678`、悬浮再加到 `#f47716a6`，亮框比原来明显
- `.strength-extra` 从 `hidden` 改成 `grid-template-rows: 0fr → 1fr` 的高度动画（0.34s），文字淡入，避免点了就"啪"一下跳出来
- 高度实测：1440/1024/768 三档悬浮前后 `strength-grid` 与下方 `design-belief` 的位置完全不动（多出来的 40-56px 正好落在卡片原有的空白里），所以没有跳动
- 点击按钮仍是收起/展开，且收起后鼠标不动不会立刻被 hover 重新打开（`mouseenter` 只在进入时触发）；触屏没有 hover，靠点击
## 三·十一、能力卡切换不再跳动

问题：`align-items:start` 时每张卡各自定高，鼠标从 A 移到 B，A 缩、B 长，左右两张的高度跟着变，视觉上"跳"。

改法：**展开区永远占位，只做透明度动画**。

- `.strength-grid` 改 `align-items:stretch`，三张卡永远等高
- `.strength-extra` 不再用 `grid-template-rows:0fr→1fr`（会改高度），改成常驻占位 + `>div` 的 `opacity`/`translateY` 动画，边框颜色只在展开时点亮
- 实测 1440/1024/768/390 四档：三张卡的 top 与 height 在反复切换后**完全一致**（1440 下 401:377 不变）

顺带修掉一个隐藏 bug：`ui.css` 里有一条 `.strength-card:hover, .strength-extra{border-color:var(--accent-border)}`，因为 `ui.css` 在 `styles.css` 之后引入，把展开区的左边框**永久**染成橙色——收起状态也会留一根 20px 的小橙线。已把 `.strength-extra` 从该选择器里去掉。
## 三·十二、联系区版式重排（去掉底部空洞）

问题：标题占满上半屏，联系方式一行后到页脚之间空了 200px，视觉上头重脚轻。

改法：

- `.contact-inner` 改 `display:flex` + 显式间距（不再 `margin-top:auto` 把页脚顶到底部留一个大洞）
- 标题字号从 `clamp(90px,10.6vw,184px)` 收到 `clamp(72px,8.4vw,140px)`，上半屏不那么压
- 联系方式行上移到标题下方（间距 `clamp(20px,3.2vh,40px)`），整行铺满
- 新增 `.contact-sign`：页脚上方一整块「Double K」大字水印（`flex:1` 吃掉剩余高度，字号 `clamp(72px,9vw,176px)`、`#321a0d1c`），把下半屏填满，读作签名而不是空白
- 顶栏遮挡问题一并修掉：`padding-top` 提到 `clamp(92px,11vh,120px)`
- `@media(min-width:1800px)` 里 `min-height:max(1050px,100svh)` 改成 `100svh`——之前在大屏上这一段比视口还高，页脚永远在折线以下

实测 1912×956 / 1440×900 两种尺寸：整段正好一屏、页脚可见、无横向溢出。
## 四、本轮修复

1. **移动端视频按钮与「关于我」打架**：`ui.css` 同权重规则盖掉了 `styles.css` 的 `display:none` —— 改 `.hero .video-control` 提权重；按钮随后移入首屏行动区。
2. **移动端幽灵字与标题重叠**：幽灵字 36px/`top:0` 与 18px 标题共用 40px 行框 —— 已随首屏改版整体移除。
3. **dev server 反复自崩（已彻底处理）**：原子保存留下的 `.App.jsx.*.tmpdir`、以及刚下载还在被占用的 woff2，都会让 chokidar 抛 `EBUSY: watch`，而 Vite 没兜住这个 error，进程直接退出。仅靠 `ignored` 挡不住"文件被占用"这一类，所以在 `vite.config.js` 改用 `usePolling: true`（不再对文件句柄加 watch），并保留 `*.tmpdir / *.tmp / *.swp / *~` 忽略；`scripts/dev.ps1` 再加一层退出后 2 秒自动重启。
4. **首屏 CTA 图标换行**：`<a>` 在 flex 容器里被 blockify 后 `svg{display:block}` 换行 —— 补 `display:inline-flex` + `white-space:nowrap`。
5. **人物卡名牌换成 Double K 后溢出/折行**：`Double K©` 比 `uuni©` 长，768 宽时溢出卡片 24px、390 宽时折成两行 —— 名牌加 `white-space:nowrap`，`≤1000px` 收敛到 40px / 字距 -2px。
6. **字母 K 右上角被裁**：`Double K` 用了 `background-clip:text` 渐变字，渐变只画在元素盒内，而这套字体的 K 斜臂会溢出到文字宽度之外，溢出部分拿不到填充，看起来像被竖切一刀。给 `.hero-title-main` 加 `padding-right:.14em`（配 `margin-right:-.14em` 保持版心）后盒子包住字形，裁剪消失。
7. **签名换字体**：原先用腾讯体写中文名 + 手绘 SVG 下划线，观感生硬。改为 Sacramento 手写体英文 `LiXuKun`，用 `inline-flex + align-items:baseline` 与 `PORTFOLIO` 共用基线，负左边距压住最后一个 O，`-5°` 旋转。

## 五、验证结果

全部通过（脚本在 `scripts/checks/`，结果见 `artifacts/baseline-report.json`）：

- 1920 / 1440 / 1024 / 768 / 390 / 320 六个断点：文档无横向溢出（胶卷、装饰圆环均在 `overflow:hidden` 容器内被忽略），导航控件统一 40px、居中对齐误差 0，腾讯体 W7 正常加载，控制台 0 报错。
- 项目详情：可打开、3250px 可滚动、Escape 关闭、关闭后 `body` overflow 正确还原。
- 功能：背景视频暂停/播放、胶卷 16 张图全部加载、邮箱/微信复制写剪贴板并弹 toast、简历 200（2.1MB）、回到顶部、详情页 CTA 正常。
- 动效降级：`prefers-reduced-motion: reduce` 下背景视频隐藏、胶卷与星芒动画停止、`scroll-behavior` 回退为 auto。
- `vite build` 通过：CSS 38.9KB（gzip 8.9KB）、JS 249KB（gzip 78.7KB）。

## 六、已知问题（按优先级）

### P1 — 影响观感或上线

1. **素材仍是占位**：项目封面 2 张、流程示意 1 张、新增的 `study-hud.svg` / `study-flow.svg` / `study-rings.svg` 3 张，以及首屏胶卷里的 `designer.svg` / `hero-poster.jpg`，都是概念视觉。真实项目截图到位后，改 `src/content.js` 与 `src/App.jsx` 顶部的 `stripTiles` 即可。（个人介绍区的照片已换成本人实拍。）
2. **字体 7.96MB 未子集化**：首屏要下近 8MB TTF（`font-display:swap` 会先闪系统字体）。建议子集化成 woff2，通常能压到 200–400KB。
3. **背景视频自带角标文字被裁掉半截**：`orbit.webm` 右下角烘焙了 `UX / HUMAN-CENTERED SYSTEM` 字样，`object-fit:cover` 后在首屏底缘露出半行。需要重新导出视频或加更强的底部渐隐。
4. **分享图不是标准比例**：现在用 `hero-poster.jpg`（1600×1000）充当 OG 图，理想是单独做一张 1200×630，并把 `og:url` / `og:image` 换成线上绝对地址。
5. **项目卡片里 `<button>` 套了 `<div>/<h3>/<p>`**：`button` 只允许 phrasing content，这是无效嵌套，读屏会把整张卡片连读成一个按钮名。建议改 `article` + 卡内单一链接/按钮。

### P2 — 维护性

6. **CSS 仍是两套来源**：`styles.css` 负责布局（hero 区块已可读，其余仍是压缩单行），`ui.css` 负责组件；两者会互相覆盖，改控件尺寸前先确认改在哪个文件。
7. **无版本控制**：本机没有 Git。建议装 Git 后 `git init`，或每次改版前压一份快照。
8. **简历 PDF 2.1MB**：可压缩图片或降采样。
9. **旧文件**：`verify-wandering-preview.cjs` 是上一个项目遗留，可删；`artifacts/*.png` 可随时重生成。
10. **短屏机型**：首页 `min-height:770px`（≤1100）/`700px`（≤760），在 568/640 高的机型上会高于视口，胶卷落到折线以下（无重叠、CTA 仍可见）。

## 七、建议的下一步

1. 换真实素材：项目封面、过程图、本人照片、简历压缩 → 顺带删掉胶卷里的占位图。
2. 字体子集化 + 视频角标处理，把首屏资源从 ~9MB 降到 1MB 级别。
3. 做 1200×630 分享图，补 `og:url`，上线前跑一次社交预览调试。
4. 项目卡片语义化改造（`button` → `article` + 链接）。
5. `styles.css` 剩余压缩块按区块展开，删掉确认无用的死规则。
6. 装 Git，之后每次改版一个提交；上线前跑 `artifacts/` 下三个回归脚本。
