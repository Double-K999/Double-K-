import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, Download, Copy, Check, Plus, Minus, X, Menu, Crosshair, Layers3, Route, Scan, MoveUpRight, Pause, Play } from 'lucide-react';
import { profile, projects, about, career, workGroups } from './content';

const navItems = [{ id: 'about', text: '工作经历' }, { id: 'work', text: '精选作品' }, { id: 'expertise', text: '个人优势' }];

// 首屏底部作品胶卷（占位素材，后续换成真实项目截图即可）
const stripTiles = [
  '/images/strip/enter-battle-p02.webp',
  '/images/strip/pubg-p22.webp',
  '/images/strip/yiche-p19.webp',
  '/images/strip/blood-p30.webp',
  '/images/strip/anheng-p26.webp',
  '/images/strip/netease-p48.webp',
  '/images/strip/enter-battle-p01.webp',
  '/images/strip/yiche-p04.webp',
  '/images/strip/blood-p12.webp',
  '/images/strip/anheng-p30.webp',
];

function SectionLabel({ number, children }) {
  return <div className="section-label"><span className="tiny-cross">+</span><span>{number} / {children}</span></div>;
}

/** 右侧自定义滚动滑块（替代浏览器滚动条）：显示进度，可点击/拖拽定位。 */
function ScrollRail() {
  const [state, setState] = useState({ progress: 0, visible: false });
  const railRef = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 8 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setState({ progress, visible: max > 8 });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const jumpTo = clientY => {
    const el = railRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * max, behavior: 'instant' });
  };

  return <div
    className={`scroll-rail${state.visible ? ' is-visible' : ''}`}
    ref={railRef}
    aria-hidden="true"
    style={{ '--progress': state.progress }}
    onPointerDown={event => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); jumpTo(event.clientY); }}
    onPointerMove={event => { if (dragging.current) jumpTo(event.clientY); }}
    onPointerUp={event => { dragging.current = false; event.currentTarget.releasePointerCapture(event.pointerId); }}
  >
    <span className="scroll-rail-thumb"/>
  </div>;
}

function ProjectDetail({ project, onClose, onContact }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  const isCase = Boolean(project.case);
  const jumpTo = n => document.getElementById(`case-p${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return <dialog className={`project-dialog${isCase ? ' is-case' : ''}`} ref={dialogRef} aria-labelledby="detail-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <article className={`detail-inner${isCase ? ' case-inner' : ''}`}>
      <header className="detail-top"><a href="#work" onClick={e => { e.preventDefault(); onClose(); }} className="wordmark">Double K<span>®</span></a><span className="mono">{isCase ? `PROJECT ${project.number} / CASE STUDY` : `PROJECT ${project.number} / CASE OVERVIEW`}</span><button className="circle-button" onClick={onClose} aria-label="关闭项目详情"><X size={22}/></button></header>
      {isCase ? <>
        <div className="case-bar">
          <h1 id="detail-title" className="case-heading">{project.title}<span>{project.number} / CASE STUDY</span></h1>
          <nav className="case-chips" aria-label="案例章节">{project.case.sections.map(section => <button key={section.id} onClick={() => jumpTo(section.id)}>{section.label}</button>)}</nav>
          <span className="case-count mono">{String(project.case.pages.length).padStart(2, '0')} PAGES</span>
        </div>
        <p className="case-hint">← 左右滑动查看页面细节 →</p>
        <div className="case-pages">{project.case.pages.map((page, i) => <figure className="case-page" id={`case-p${page.n}`} key={page.src}><img src={page.src} alt={page.alt} width={1728} height={972} loading={i < 2 ? 'eager' : 'lazy'} decoding="async"/></figure>)}</div>
        <footer className="detail-footer case-footer"><div><span className="eyebrow">LET’S TALK DESIGN</span><h2>还有更多，留给我们的对话。</h2></div><button className="button button-light" onClick={onContact}>联系我 <ArrowUpRight size={20}/></button></footer>
      </> : <>
      <div className="detail-heading"><p className="eyebrow">{project.category}</p><h1 id="detail-title">{project.title}</h1><p className="detail-subtitle">{project.subtitle}</p></div>
      <figure className="detail-cover"><img src={project.image} alt={`${project.title} 概念视觉封面`}/><figcaption>VISUAL STUDY / 可替换的概念视觉封面</figcaption></figure>
      <div className="detail-facts"><div><span>ROLE / 项目角色</span><p>{project.role}</p></div><div><span>TEAM / 所在团队</span><p>{project.company}</p></div><div><span>PERIOD / 项目时间</span><p>{project.period}</p></div></div>
      <div className="detail-story"><SectionLabel number="01">项目概览</SectionLabel><div><h2>{project.focus}</h2><p>{project.description}</p><p>{project.challenge}</p></div></div>
      <div className="detail-story"><SectionLabel number="02">设计参与</SectionLabel><div className="approaches">{project.approach.map((item, i) => <div key={item.title}><span className="mono">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></div>
      <figure className="detail-process"><img src={project.gallery[1]} alt="交互流程与界面布局示意，可替换为真实项目过程图"/><figcaption>设计过程展示区域 · 后续可替换为流程、线框图和真实界面</figcaption></figure>
      <div className="detail-result"><SectionLabel number="03">成果与沉淀</SectionLabel><div><strong>{project.result}</strong><span>{project.resultLabel}</span></div><p>{project.resultText}<small>数据来源于个人简历；当前封面与过程图为视觉占位。</small></p></div>
      <footer className="detail-footer"><div><span className="eyebrow">LET’S TALK DESIGN</span><h2>还有更多，留给我们的对话。</h2></div><button className="button button-light" onClick={onContact}>联系我 <ArrowUpRight size={20}/></button></footer>
      </>}
    </article>
  </dialog>;
}

export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerFloating, setHeaderFloating] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState('');
  const [videoPaused, setVideoPaused] = useState(false);
  const [expanded, setExpanded] = useState(0);
  const videoRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    // feed 式入场：区块进入视口时淡入上浮（一次性，不来回闪）
    const targets = [...document.querySelectorAll('[data-reveal]')];
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-in'));
      return undefined;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '-8% 0px -14% 0px' });
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.getElementById('home');
    const boundary = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 100;
    const observer = new IntersectionObserver(([entry]) => {
      setHeaderFloating(entry.boundingClientRect.bottom <= boundary + 1);
    }, { rootMargin: `-${boundary + 1}px 0px 0px 0px`, threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
    setVideoPaused(mediaQuery.matches);
    if (mediaQuery.matches) videoRef.current?.pause();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); clearTimeout(toastTimer.current); };
  }, []);

  async function copyContact(value, label) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label); setToast(`${label}已复制：${value}`);
    } catch {
      setToast(`请手动复制${label}：${value}`);
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(''); setCopied(''); }, 3200);
  }
  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setVideoPaused(false)).catch(() => { setVideoPaused(true); });
    else { video.pause(); setVideoPaused(true); }
  }
  const strengths = [
    { icon: Crosshair, title: '从玩家出发', en: 'PLAYER-FIRST THINKING', text: '用玩家的视角理解问题，关注认知负担、操作成本和每一次反馈，让复杂机制变得自然易懂。', detail: '关注新手引导、局内信息层级与关键操作链路，在竞技节奏中找到体验的平衡点。' },
    { icon: Route, title: '把体验串成系统', en: 'SYSTEMATIC EXPERIENCE', text: '从入口到目标，从规则到反馈，梳理完整路径，让每个触点清晰、连贯，形成一致的体验。', detail: '覆盖核心玩法、基础系统、UGC 生态与商业化活动，将需求转化为可执行的交互方案。' },
    { icon: Layers3, title: '让设计持续生长', en: 'DESIGN THAT SCALES', text: '把有效方案沉淀为组件、模板和规范，平衡产品体验与团队效率，让好设计在迭代中延续。', detail: '参与 HUD 模板与主题玩法交互规范建设，支持多版本复用和跨职能协作落地。' },
  ];

  return <>
    <a className="skip-link" href="#main">跳至主要内容</a>
    <header className={`site-header${headerFloating ? ' is-floating' : ''}`}>
      <a className="header-brand" href="#home" aria-label="Double K 首页" onClick={() => setMenuOpen(false)}><Crosshair size={24} strokeWidth={2.3} aria-hidden="true"/><span className="brand-wordmark">Double K<span className="brand-registration" aria-hidden="true">®</span></span></a>
      <nav aria-label="主导航" className={menuOpen ? 'nav-open' : ''} id="main-navigation">{navItems.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)} aria-current={activeSection === item.id ? 'location' : undefined} className={activeSection === item.id ? 'active' : ''}><span>{item.text}</span></a>)}</nav>
      <a href="#contact" className="header-contact" onClick={() => setMenuOpen(false)}><span>联系我</span></a>
      <button className="menu-toggle circle-button" aria-label={menuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
    </header>
    <main id="main">
      <section className="hero" id="home">
        <div className="hero-media" aria-hidden="true"><div className="hero-reel"><video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/images/hero-reel-poster.webp"><source src="/media/hero.mp4" type="video/mp4"/></video></div></div>
        <div className="container hero-content">
          <p className="hero-meta mono"><span>GAME UX DESIGNER</span><i aria-hidden="true"/><span>UX / UI DESIGNER</span><i aria-hidden="true"/><span>PORTFOLIO 2026</span></p>
          <h1 className="hero-title" aria-label="Double K portfolio">
            <span className="hero-title-main">Double K<span className="hero-spark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 0c.55 6.24 5.76 11.45 12 12-6.24.55-11.45 5.76-12 12-.55-6.24-5.76-11.45-12-12C6.24 11.45 11.45 6.24 12 0Z"/></svg><svg viewBox="0 0 24 24"><path d="M12 0c.55 6.24 5.76 11.45 12 12-6.24.55-11.45 5.76-12 12-.55-6.24-5.76-11.45-12-12C6.24 11.45 11.45 6.24 12 0Z"/></svg></span></span>
            <span className="hero-title-sub"><span className="hero-title-portfolio">PORTFOLIO</span><span className="hero-signature" aria-hidden="true">LiXuKun</span></span>
          </h1>
          <p className="hero-copy">用交互系统与 <strong>AI 工作流</strong>，<br/>让复杂的系统成为<strong className="hero-hl">直觉的体验</strong>。</p>
          <div className="hero-actions"><a href="#work" className="hero-cta">探索我的作品 <ArrowUpRight size={19}/></a><span className="hero-role mono">李旭昆 · 游戏交互设计师</span><button className="video-control" onClick={toggleVideo} aria-label={videoPaused ? '播放背景视频' : '暂停背景视频'}>{videoPaused ? <Play size={12}/> : <Pause size={12}/>}<span className="mono">{videoPaused ? 'PLAY MOTION' : 'PAUSE MOTION'}</span></button></div>
        </div>
        <div className="hero-strip" aria-hidden="true"><div className="hero-strip-track">{stripTiles.map((src, i) => <div className="strip-tile" key={`a-${i}`}><img src={src} alt=""/></div>)}{stripTiles.map((src, i) => <div className="strip-tile" key={`b-${i}`}><img src={src} alt=""/></div>)}</div></div>
      </section>

      <section className="about section-pad" id="about" data-reveal>
        <div className="container">
          <div className="about-grid">
            <div className="about-head">
              <h2 className="about-title">WORK EXPERIENCE<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg></h2>
              <p className="about-sub">个人经历</p>
            </div>
            <figure className="about-photo"><img src={about.photo} alt="李旭昆的个人照片" loading="lazy"/></figure>
            <div className="about-right">
              <p className="eyebrow">{about.eyebrow}</p>
              <h3 className="about-heading">{about.heading}</h3>
              <p className="about-intro">{about.intro}</p>
              <dl className="about-info">{about.info.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.copy ? <button onClick={() => copyContact(item.value, '邮箱')}>{item.value}{copied === '邮箱' ? <Check size={13}/> : <Copy size={13}/>}</button> : item.href ? <a href={item.href}>{item.value}</a> : item.value}</dd></div>)}</dl>
              <div className="about-stats">{about.stats.map(stat => <div key={stat.label}><strong>{stat.value}</strong><p>{stat.label}</p></div>)}</div>
              <div className="about-now"><span className="about-now-label mono">{about.nowBuilding.label}</span><span className="about-now-title">{about.nowBuilding.title}</span><div className="about-now-tags">{about.nowBuilding.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
            </div>
          </div>
          <div className="career">
            <div className="career-head"><span className="mono">CAREER PATH</span><span>工作经历</span></div>
            <div className="career-list">{career.map(item => <article className="career-item" key={item.period}><time>{item.period}</time><h4>{item.company}</h4><span className="career-tag">{item.role}</span><p>{item.text}</p></article>)}</div>
          </div>
        </div>
      </section>

      <section className="work section-pad" id="work" data-reveal>
        <div className="container">
          <div className="section-top"><SectionLabel number="02">SELECTED WORK</SectionLabel><span className="section-note mono">THOUGHTFUL EXPERIENCES. MEANINGFUL IMPACT.</span></div>
          <div className="work-heading"><h2>把思考，<span className="muted">变成体验。</span></h2><p>从核心玩法到每一个细节，<br/>探索设计如何让游戏体验更进一步。</p></div>
          {workGroups.map((group, groupIndex) => <div className="work-group" style={{'--g': groupIndex}} key={group.id}>
            <div className="work-group-head"><h3>{group.title}</h3><span className="work-group-en mono">{group.en}</span><span className="work-group-count mono">{String(group.items.length + group.slots).padStart(2, '0')}</span></div>
            <div className="work-grid">
              {group.items.map(id => projects.find(project => project.id === id)).filter(Boolean).map((project, index) => <button key={project.id} className="work-card" style={{'--i': index}} onClick={() => setSelectedProject(project)} aria-label={`查看 ${project.title} 项目详情`}><span className="work-cover"><img src={project.image} alt={`${project.title} 作品封面`} loading="lazy"/><span className="work-cover-tag mono">CASE / {project.number}</span><span className="work-cover-open" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.6}/></span></span><span className="work-card-title">{project.title}</span><span className="work-card-meta">{project.card?.type ?? project.tags[0]}<i aria-hidden="true"/>{project.card?.desc ?? project.subtitle}</span></button>)}
              {Array.from({ length: group.slots }, (_, index) => <div className="work-card is-empty" style={{'--i': group.items.length + index}} key={`${group.id}-slot-${index}`}><span className="work-cover"><span className="work-empty-plus" aria-hidden="true">+</span><span className="work-empty-label">待上传</span></span><span className="work-card-title">作品占位</span><span className="work-card-meta">TO BE ADDED</span></div>)}
              {group.id === 'product' && <div className="work-more"><span className="work-more-plus" aria-hidden="true">+</span><div><p className="work-more-title"><span className="status-dot"/>更多体验，正在持续探索中。</p><span className="mono">MORE GOOD THINGS IN THE MAKING</span></div></div>}
            </div>
          </div>)}
        </div>
      </section>

      <section className="expertise section-pad" id="expertise" data-reveal><div className="container"><div className="section-top"><SectionLabel number="03">WHAT I BRING</SectionLabel><span className="section-note mono">THE WAY I THINK. THE VALUE I CREATE.</span></div><div className="expertise-heading"><h2>不止于界面。<br/><span className="muted">更在于界面背后。</span></h2><div className="expertise-deco" aria-hidden="true"><Scan size={80} strokeWidth={0.6}/><span className="mono">THINK / CONNECT / CREATE</span></div></div><div className="strength-grid">{strengths.map((item, i) => <article className={`strength-card ${expanded === i ? 'is-expanded' : ''}`} style={{'--i': i}} key={item.title} onMouseEnter={() => setExpanded(i)} onFocus={() => setExpanded(i)}><div className="strength-top"><item.icon size={34} strokeWidth={1}/><span className="mono">0{i + 1}</span></div><p className="strength-en mono">{item.en}</p><h3>{item.title}</h3><p className="strength-description">{item.text}</p><div className={`strength-extra ${expanded === i ? 'is-open' : ''}`} id={`strength-${i}`} aria-hidden={expanded !== i}><div><p>{item.detail}</p></div></div><button className="strength-toggle" aria-expanded={expanded === i} aria-controls={`strength-${i}`} onClick={() => setExpanded(expanded === i ? -1 : i)}><span>{expanded === i ? '收起我的思考' : '了解我的思考'}</span>{expanded === i ? <Minus size={18}/> : <Plus size={18}/>}</button></article>)}</div><div className="design-belief"><span className="mono">MY DESIGN BELIEF</span><p>好的交互，在你意识到之前，<span>就已经发生。</span></p><MoveUpRight size={30} strokeWidth={1}/></div></div></section>

      <section className="contact" id="contact" data-reveal><span className="contact-bg" aria-hidden="true"/><div className="contact-orbit" aria-hidden="true"/><div className="container contact-inner"><div className="section-top"><SectionLabel number="04">LET’S CONNECT</SectionLabel><span className="contact-status"><span className="status-dot"/>期待下一个有趣的机会</span></div><div className="contact-main"><p className="eyebrow">GREAT EXPERIENCES START WITH A CONVERSATION.</p><h2>LET’S MAKE<br/><span>SOMETHING</span> <i>PLAY.</i><ArrowUpRight className="contact-heading-arrow" strokeWidth={0.8}/></h2><div className="contact-description"><p>聊一个机会，碰撞一个想法，<br/>或者，只是聊聊我们热爱的游戏。</p><a href={`mailto:${profile.email}`} className="contact-mail">{profile.email}<ArrowUpRight size={28}/></a></div></div><div className="contact-links"><button onClick={() => copyContact(profile.wechat, '微信')}><span className="mono">01 / WECHAT</span><span>{profile.wechat}</span>{copied === '微信' ? <Check size={18}/> : <Copy size={18}/>}</button><a href={`tel:${profile.phone}`}><span className="mono">02 / PHONE</span><span>{profile.phone}</span><ArrowUpRight size={18}/></a><a href="/resume-li-xukun.pdf" download="李旭昆-游戏交互设计师-简历.pdf"><span className="mono">03 / RESUME</span><span>了解更多关于我</span><Download size={18}/></a></div><div className="contact-sign" aria-hidden="true"><span>Double K</span></div><footer className="site-footer"><a className="wordmark" href="#home">Double K<span>®</span></a><span>© 2026 李旭昆 · 用好奇心设计，用热爱创造。</span><a className="back-top mono" href="#home">BACK TO TOP <ArrowUp size={15}/></a></footer></div></section>
    </main>
    <ScrollRail/>
    {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} onContact={() => { setSelectedProject(null); requestAnimationFrame(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })); }}/>} 
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite"><Check size={17}/>{toast}</div>
  </>;
}
