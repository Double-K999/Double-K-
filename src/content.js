// Replace image paths here when the final portfolio screenshots are ready.
export const profile = {
  name: '李旭昆', alias: 'Double K', email: '3279186839@qq.com',
  wechat: 'SgrASgr', phone: '13767159084',
};

// 首屏「WORK EXPERIENCE / 个人经历」区块文案
export const about = {
  eyebrow: 'ABOUT ME',
  heading: 'Hi, I am XuKunLi !',
  // 换成本人照片：把图片放进 public/images/，改这里的路径即可（竖版 4:5 左右最合适）
  photo: '/images/portrait.webp',
  intro: '我专注局内交互设计，擅长搭建高沉浸感的操作体系——从主题玩法的机制落地、核心战斗的微动效反馈，到 HUD 战术信息层级的精准排布，让玩家在毫秒间的决策中手眼合一。同时具备局外系统架构能力，确保养成线与局外成长节奏与局内体验同频共振，形成完整的体验闭环。',
  info: [
    { label: '当前身份', value: '交互设计师' },
    { label: '服务方向', value: 'UI / UX / 交互设计' },
    { label: '手机', value: profile.phone, href: `tel:${profile.phone}` },
    { label: '邮箱', value: profile.email, copy: true },
  ],
  stats: [
    { value: '3+', label: '设计经验' },
    { value: '3+', label: '项目落地' },
    { value: '2+', label: 'FPS 游戏方向' },
  ],
  // 进行中的项目：占位文案，有真实内容后直接替换 tags
  nowBuilding: {
    label: 'NOW BUILDING',
    title: '进行中的项目',
    tags: ['交互规范整理', 'HUD 模板库', 'AI 工作流探索', '案例复盘'],
  },
};

// 工作经历时间轴
export const career = [
  {
    period: '2025.08-2026.07', company: '腾娱互动', role: '游戏交互设计师',
    text: '作为设计师，覆盖了局内新玩法、版本迭代、UGC 生态、通用系统等多方向设计工作，完成了需求类工作项的设计落地，有效支撑了多个版本核心内容的按时上线，提升了各模块的用户体验。',
  },
  {
    period: '2024.12-2025.04', company: '网易互娱', role: '游戏交互设计师',
    text: '通过局内核心交互流程优化打造泛用户体验，降低操作层级、降低门槛，增强包容性并提升易用性，提升用户留存率；运营付费优化，活跃营收及节点，商业化转化率提升。',
  },
  {
    period: '2024.08-2024.12', company: '安恒信息', role: 'UX 设计师',
    text: '负责终端安全管理系统客户端 UE 与迭代，为体现产品功能价值、提高客户端拓展性及通用性做交互优化；跟进维护设计组件库以及日常设计文档。',
  },
];

// 案例页：两套作品集 PDF 的页面导出为 1728×972 的 WebP，放在 public/case/<slug>/
//   pubg  ←《2026-游戏交互作品集-1年经验.pdf》第 04–37 页
//   blood ←《2025-游戏交互作品集-25届毕业生.pdf》第 03–33 页
const casePage = (slug, title, n) => ({ n, src: `/case/${slug}/p${String(n).padStart(2, '0')}.webp`, alt: `${title} 案例第 ${n} 页` });

export const projects = [
  {
    id: 'pubg-mobile', number: '01', title: 'PUBG MOBILE', subtitle: '让战场信息，回到玩家的直觉。',
    category: '游戏交互 · 玩法体验 · HUD', period: '2025.08 — 2026.07', company: '腾娱互动科技有限公司',
    role: '游戏交互设计师', image: '/images/cover-pubg.webp',
    // 作品卡片上的一行文案（类型 | 描述）
    card: { type: '射击', desc: '海外排名第一的大逃杀类射击手游' },
    description: '围绕竞技场景中的信息获取与操作效率，参与新玩法、系统功能与商业化活动的交互设计，在多版本迭代中保持清晰、一致的体验。',
    tags: ['FPS / TPS', '玩法交互', '设计规范'],
    focus: '复杂战局中的清晰表达',
    challenge: '射击游戏的注意力始终属于战场。面对不断扩展的玩法与系统，需要在有限的屏幕中梳理信息优先级，让规则可理解、状态可感知、操作有反馈。',
    approach: [
      { title: '梳理完整玩法链路', text: '从规则说明、入口引导到局内状态提示，串联新玩法的关键触点，明确玩家在每一步需要知道什么、完成什么。' },
      { title: '优化局内信息与操作', text: '结合战斗场景调整主界面与 HUD 布局，持续完善基础功能和操作反馈，平衡信息可见性与战场空间。' },
      { title: '沉淀可复用的设计语言', text: '将局内 HUD 布局模板与主题玩法交互规范沉淀为可复用资产，支持后续版本高效迭代。' },
    ],
    result: '80%', resultLabel: '后续版本模板复用率',
    resultText: '局内 HUD 布局模板与主题玩法交互规范，在后续版本中实现 80% 复用。',
    gallery: ['/images/project-pubg.svg', '/images/project-system.svg'],
    // 二级界面直接呈现作品集 PDF 的案例页（第 04 页「作品目录」→ 第 37 页；第 38 页 THANKS 不上站）
    case: {
      pages: Array.from({ length: 34 }, (_, i) => casePage('pubg', 'PUBG MOBILE', 4 + i)),
      sections: [
        { id: 4, label: '作品目录' },
        { id: 5, label: 'PART 1 · 局内交互' },
        { id: 31, label: 'PART 2 · 局外系统' },
      ],
    },
  },
  {
    id: 'blood-strike', number: '02', title: 'BLOOD STRIKE', subtitle: '少一步操作，多一刻投入。',
    category: '游戏交互 · 新手体验 · HUD', period: '2024.12 — 2025.04', company: '网易互娱',
    role: '游戏交互设计师（实习）', image: '/images/cover-blood.webp',
    card: { type: '射击', desc: '少一步操作，多一刻投入。' },
    description: '面向全球玩家的快节奏战术竞技手游，参与核心玩法与 HUD 迭代，通过精简操作路径和优化新手引导，帮助玩家更快进入战斗。',
    tags: ['FPS MOBILE', '新手引导', '体验优化'],
    focus: '让快节奏体验保持流畅',
    challenge: '短局、快速复活的战斗节奏，要求界面以更低的学习成本传达关键信息。多余的点击与分散的引导，会打断新玩家进入核心体验的过程。',
    approach: [
      { title: '降低首次体验的门槛', text: '围绕新玩家的认知过程优化核心流程与引导节奏，让操作学习与实际战斗体验相连接。' },
      { title: '精简路径，聚焦战斗', text: '简化 HUD、缩短操作流程并减少冗余步骤，让玩家能够更快回到战斗。' },
      { title: '让迭代成果持续生效', text: '将简化后的 HUD 沉淀为团队设计规范模板，为后续同类功能的设计提供一致参考。' },
    ],
    result: '18%', resultLabel: '新手引导流失率降低',
    resultText: '首局完成率提升至 78%；简化 HUD 成为团队设计规范模板，后续复用超过 70%。',
    gallery: ['/images/project-blood.svg', '/images/project-system.svg'],
    // 二级界面：2025 届作品集 PDF 第 03–33 页（01 核心体验 + 02 运营&付费）
    case: {
      pages: Array.from({ length: 31 }, (_, i) => casePage('blood', 'BLOOD STRIKE', 3 + i)),
      sections: [
        { id: 3, label: '01 · 核心体验' },
        { id: 23, label: '02 · 运营&付费' },
      ],
    },
  },
  {
    id: 'enter-battle', number: '03', title: '进战系统交互研究', subtitle: '移动端游戏进战系统设计',
    category: '游戏交互 · 进战系统 · FPS', period: '2025.07', company: '腾讯 · 游戏交互测试',
    role: '游戏交互设计师', image: '/images/cover-enter-battle.webp',
    card: { type: 'FPS', desc: '移动端游戏进战系统设计' },
    description: '针对科幻题材团队战术竞技 FPS 手游《星域战纪》，从 4 人小队组队、地图选择、匹配到英雄上场，梳理从大厅到进战的完整体验链路。',
    tags: ['FPS', '进战流程', '组队系统'],
    focus: '把 4 人小队的进战链路理顺',
    challenge: '组队、选图、匹配、选英雄分散在不同入口，玩家在进战前容易迷失；需要在有限的屏幕与节奏里把每一步的目标讲清楚。',
    approach: [
      { title: '拆解进战全流程', text: '从大厅入口到进入对局，逐段梳理玩家要做的事、需要的信息与可能卡住的位置。' },
      { title: '重构组队与匹配动线', text: '把找搭子、地图选择、匹配过程串成连续动作，减少跳转与等待中的不确定感。' },
      { title: '统一界面语言', text: '组队大厅、小队展示、英雄上场沿用同一套卡片与状态表达，降低理解成本。' },
    ],
    result: '13', resultLabel: '页完整流程方案',
    resultText: '输出从世界观、需求拆解到 6 个关键界面的完整进战系统方案。',
    gallery: ['/images/cover-enter-battle.webp', '/images/project-system.svg'],
    // 二级界面：腾讯游戏交互测试 PDF 第 01–13 页（第 14 页「感谢您的观看」不上站）
    case: {
      pages: Array.from({ length: 13 }, (_, i) => casePage('enter-battle', '进战系统交互研究', 1 + i)),
      sections: [
        { id: 2, label: '世界观与需求' },
        { id: 6, label: '流程梳理' },
        { id: 8, label: '界面说明' },
      ],
    },
  },
  {
    id: 'yiche', number: '04', title: '购车链路体验改版', subtitle: '汽车电商购车全链路设计',
    category: 'C 端 UX · 汽车电商 · 购车链路', period: '2024', company: '易车',
    role: 'UX 设计师', image: '/images/cover-yiche.webp',
    card: { type: 'C 端 UX', desc: '汽车电商购车链路设计改版' },
    description: '针对二手车购车链路 1→1.5 的信息架构重构，结合用户需求与业务特性做实用户判断，以「用户体验好、业务提升高」为目标，从浏览体验、搜索效率、驱动决策等方面落地设计方案。',
    tags: ['C 端 UX', '汽车电商', '信息架构'],
    focus: '把购车链路的信息重新架起来',
    challenge: '长链路业务里用户在不同阶段关心的事完全不同，页面既要承载信息又要驱动转化，容易顾此失彼。',
    approach: [
      { title: '重构 1→1.5 信息架构', text: '按购车阶段拆分页面职责，让每屏只回答用户当前最关心的问题。' },
      { title: '优化浏览与搜索', text: '提升信息密度与筛选效率，让用户更快找到想看的车源。' },
      { title: '驱动决策转化', text: '用对比、口碑与价格信息降低决策成本，把浏览行为推向留资。' },
    ],
    result: '2 条', resultLabel: '核心链路改版落地',
    resultText: '浏览与决策两条主链路完成改版，形成可复用的信息架构方案。',
    gallery: ['/images/cover-yiche.webp', '/images/project-system.svg'],
    // 二级界面：2024 交互作品集 PDF 第 04–24 页
    case: {
      pages: Array.from({ length: 21 }, (_, i) => casePage('yiche', '购车链路体验改版', 4 + i)),
      sections: [
        { id: 5, label: '改版背景' },
        { id: 6, label: '用户洞察' },
        { id: 11, label: '方案设计' },
        { id: 23, label: 'IP 与总结' },
      ],
    },
  },
  {
    id: 'anheng', number: '05', title: '终端安全系统升级', subtitle: '安全软件客户端体系设计',
    category: 'B 端 UX · 安全软件 · 设计规范', period: '2024.08 — 2024.12', company: '安恒信息',
    role: 'UX 设计师', image: '/images/cover-anheng.webp',
    card: { type: 'B 端 UX', desc: '安全软件客户端体系升级' },
    description: '终端安全管理系统的客户端升级，围绕首页信息层级、客户端拓展性与通用性做交互优化，并沉淀组件规范与暗色模式适配。',
    tags: ['B 端 UX', '安全软件', '设计规范'],
    focus: '让安全软件也讲得清价值',
    challenge: '安全类客户端信息专业、状态多，用户难以快速判断“我现在安全吗、下一步该做什么”。',
    approach: [
      { title: '重排首页信息层级', text: '把健康状态置顶，异常与待办紧随其后，缩短判断路径。' },
      { title: '提升客户端拓展性', text: '卡片化承载功能模块，支持不同版本按需组合。' },
      { title: '沉淀通用性规范', text: '统一组件尺寸、留白与暗色模式适配规则，支持后续迭代。' },
    ],
    result: '64%', resultLabel: '效率提升',
    resultText: '客户端改版后效率提升 64%，满意度 83%（数据来自项目总结页）。',
    gallery: ['/images/cover-anheng.webp', '/images/project-system.svg'],
    // 二级界面：2024 交互作品集 PDF 第 26–40 页
    case: {
      pages: Array.from({ length: 15 }, (_, i) => casePage('anheng', '终端安全系统升级', 26 + i)),
      sections: [
        { id: 28, label: '设计目标' },
        { id: 30, label: '信息架构' },
        { id: 38, label: '设计规范' },
        { id: 40, label: '项目总结' },
      ],
    },
  },
  {
    id: 'netease-fps', number: '06', title: '射击游戏小程序设计', subtitle: '赛事首页与角色页 UI/UX',
    category: '小程序 · 游戏社区 · UI/UX', period: '2024', company: '网易游戏',
    role: 'UI / UX 设计师', image: '/images/cover-netease-fps.webp',
    card: { type: '小程序', desc: '射击类游戏赛事与角色页设计' },
    description: '面向 FPS/射击类游戏的小程序 UI/UX 设计，覆盖赛事首页、活动 KV、角色详情与战绩信息层级，用现代化风格重塑游戏社区观感。',
    tags: ['小程序', '游戏社区', 'UI/UX'],
    focus: '把战绩数据讲得更好读',
    challenge: '战后数据维度多、密度高，玩家很难快速获取关键信息，也缺少继续浏览的氛围。',
    approach: [
      { title: '重构赛事首页框架', text: '强化赛事氛围与入口层级，让活动与对局信息一眼可辨。' },
      { title: '优化角色详情', text: '用卡片承载属性与装备，配合标签体系提升浏览效率。' },
      { title: '提升战绩信息层级', text: '新增可交互战斗评分与雷达图，用红绿对比营造赛场氛围。' },
    ],
    result: '4 组', resultLabel: '核心页面交互优化',
    resultText: '赛事首页、角色详情、战绩信息与活动链路完成交互与视觉升级。',
    gallery: ['/images/cover-netease-fps.webp', '/images/project-system.svg'],
    // 二级界面：2024 交互作品集 PDF 第 42–55 页
    case: {
      pages: Array.from({ length: 14 }, (_, i) => casePage('netease-fps', '射击游戏小程序设计', 42 + i)),
      sections: [
        { id: 43, label: '场景与定位' },
        { id: 48, label: '赛事首页' },
        { id: 52, label: '角色详情' },
        { id: 55, label: '战绩信息' },
      ],
    },
  },
];

// 精选作品分组：items 引用 projects 的 id，slots 是预留的空位（新作品上传后把 id 加进 items、把 slots 减掉）
export const workGroups = [
  { id: 'game', title: '游戏产品', en: 'GAME PRODUCTS', items: ['pubg-mobile', 'blood-strike', 'enter-battle'], slots: 1 },
  { id: 'product', title: '产品设计', en: 'PRODUCT DESIGN', items: ['yiche', 'anheng', 'netease-fps'], slots: 0 },
];
