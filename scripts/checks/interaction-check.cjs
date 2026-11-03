/**
 * 交互回归：移动端菜单 / 首屏结构、吸顶导航、导航高亮、项目详情滚动。
 * 运行：node scripts/checks/interaction-check.cjs
 */
const path = require('node:path');
const { launch } = require('./_pw.cjs');

(async () => {
  const browser = await launch();
  const out = {};
  const outDir = path.join(__dirname, '..', '..', 'artifacts');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  out.mobileVideoControlDisplay = await mobile.evaluate(() => getComputedStyle(document.querySelector('.video-control')).display);
  out.mobileHero = await mobile.evaluate(() => {
    const r = s => { const b = document.querySelector(s).getBoundingClientRect(); return { y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom) }; };
    return { hero: r('.hero'), title: r('.hero-title'), cta: r('.hero-cta'), strip: r('.hero-strip'), tile: r('.strip-tile'), tileCount: document.querySelectorAll('.strip-tile').length };
  });
  await mobile.click('.menu-toggle');
  await mobile.waitForTimeout(350);
  out.mobileNavOpen = await mobile.evaluate(() => {
    const nav = document.querySelector('#main-navigation');
    return { display: getComputedStyle(nav).display, height: nav.getBoundingClientRect().height, expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded') };
  });
  await mobile.screenshot({ path: path.join(outDir, 'baseline-mobile-menu.png') });
  await mobile.keyboard.press('Escape');
  await mobile.close();

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await desktop.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  out.headerBefore = await desktop.evaluate(() => ({ pos: getComputedStyle(document.querySelector('.site-header')).position }));
  await desktop.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
  await desktop.waitForTimeout(600);
  out.headerAfter = await desktop.evaluate(() => ({ pos: getComputedStyle(document.querySelector('.site-header')).position, top: Math.round(document.querySelector('.site-header').getBoundingClientRect().top) }));
  await desktop.evaluate(() => document.querySelector('#work').scrollIntoView({ behavior: 'instant' }));
  await desktop.waitForTimeout(800);
  out.activeNav = await desktop.evaluate(() => [...document.querySelectorAll('.site-header nav a')].map(a => ({ t: a.textContent, cur: a.getAttribute('aria-current') })));

  await desktop.click('.work-card');
  await desktop.waitForTimeout(900);
  out.dialogTop = await desktop.evaluate(() => {
    const d = document.querySelector('dialog.project-dialog');
    const bar = d.querySelector('.case-bar');
    return { case: d.classList.contains('is-case'), pages: d.querySelectorAll('.case-page').length, chips: [...d.querySelectorAll('.case-chips button')].map(b => b.textContent), barSticky: bar ? getComputedStyle(bar).position : null };
  });
  await desktop.screenshot({ path: path.join(outDir, 'baseline-dialog-top.png') });
  await desktop.evaluate(() => { const d = document.querySelector('dialog.project-dialog'); d.scrollTo({ top: d.scrollHeight, behavior: 'instant' }); });
  await desktop.waitForTimeout(500);
  out.dialogBottom = await desktop.evaluate(() => {
    const d = document.querySelector('dialog.project-dialog');
    const pages = [...d.querySelectorAll('.case-page')];
    return { scrollTop: Math.round(d.scrollTop), lastPage: pages.length ? pages[pages.length - 1].id : null, footerVisible: !!d.querySelector('.detail-footer') };
  });
  await desktop.screenshot({ path: path.join(outDir, 'baseline-dialog-bottom.png') });

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
})();
