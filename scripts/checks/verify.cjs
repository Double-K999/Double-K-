/**
 * 布局回归：六个断点检查横向溢出、控件对齐、字体加载、控制台报错，并验证项目详情弹窗。
 * 运行：node scripts/checks/verify.cjs [url]
 * 依赖：DSH 运行时里的 playwright + 系统 Chrome（普通开发不需要）
 */
const path = require('node:path');
const fs = require('node:fs');
const { launch } = require('./_pw.cjs');

const URL = process.argv[2] || 'http://localhost:5173/';
const OUT = path.join(__dirname, '..', '..', 'artifacts');
const VIEWPORTS = [
  { w: 1920, h: 1000 },
  { w: 1440, h: 1000 },
  { w: 1024, h: 1000 },
  { w: 768, h: 1000 },
  { w: 390, h: 844 },
  { w: 320, h: 800 },
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await launch();
  const report = { url: URL, startedAt: new Date().toISOString(), viewports: [], dialogs: [] };

  for (const { w, h } of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const messages = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') messages.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => messages.push(`pageerror: ${e.message}`));
    page.on('requestfailed', r => messages.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      await new Promise(r => setTimeout(r, 300));
    });

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll('body *')]
        .filter(el => {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) return false;
          if (getComputedStyle(el).position === 'fixed') return false;
          if (b.right <= innerWidth + 2 && b.left >= -2) return false;
          // 被 overflow:hidden 的祖先裁掉的元素（胶卷、装饰圆环）不算横向溢出
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const pcs = getComputedStyle(p);
            if (pcs.overflowX !== 'visible' || pcs.overflowY !== 'visible') return false;
          }
          return true;
        })
        .slice(0, 12)
        .map(el => ({ tag: el.tagName, cls: el.className?.toString().slice(0, 40), text: (el.textContent || '').trim().slice(0, 30), right: Math.round(el.getBoundingClientRect().right) }));

      const controls = ['.header-brand', '.site-header nav a', '.header-contact', '.menu-toggle']
        .flatMap(s => [...document.querySelectorAll(s)])
        .filter(el => el.getBoundingClientRect().height > 0)
        .map(el => {
          const b = el.getBoundingClientRect();
          return { h: Math.round(b.height), cy: b.y + b.height / 2 };
        });
      const header = document.querySelector('.site-header').getBoundingClientRect();
      const centerError = controls.length ? Math.max(...controls.map(c => Math.abs(c.cy - (header.y + header.height / 2)))) : 0;

      return {
        innerWidth,
        scrollWidth: de.scrollWidth,
        overflowX: de.scrollWidth > innerWidth,
        overflowing: over,
        controlHeights: [...new Set(controls.map(c => c.h))],
        controlCenterError: Math.round(centerError * 10) / 10,
        fontLoaded: document.fonts.check('700 24px "Tencent Sans"'),
      };
    });

    await page.screenshot({
      path: path.join(OUT, `baseline-${w}.png`),
      fullPage: w === 1440 || w === 390,
    });
    report.viewports.push({ ...metrics, viewport: `${w}x${h}`, console: messages.slice(0, 8) });

    if (w === 1440) {
      await page.evaluate(() => document.querySelector('#work').scrollIntoView({ behavior: 'instant' }));
      await page.click('.work-card');
      await page.waitForTimeout(900);
      const dialog = await page.evaluate(() => {
        const d = document.querySelector('dialog.project-dialog');
        if (!d) return { open: false };
        return {
          open: d.open,
          mode: d.classList.contains('is-case') ? 'case' : 'structured',
          scrollHeight: d.scrollHeight,
          pages: d.querySelectorAll('.case-page').length,
          title: d.querySelector('#detail-title')?.textContent,
          bodyOverflow: getComputedStyle(document.body).overflow,
        };
      });
      await page.screenshot({ path: path.join(OUT, 'baseline-dialog.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      dialog.closedByEscape = await page.evaluate(() => !document.querySelector('dialog.project-dialog'));
      report.dialogs.push(dialog);
    }
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'baseline-report.json'), JSON.stringify(report, null, 2));
  for (const v of report.viewports) {
    console.log(`${v.viewport.padEnd(10)} scroll=${v.scrollWidth} overflowX=${v.overflowX} controls=${v.controlHeights} centerErr=${v.controlCenterError} font=${v.fontLoaded} console=${v.console.length}`);
    if (v.overflowing.length) for (const o of v.overflowing) console.log(`   OVERFLOW ${o.tag}.${o.cls} "${o.text}" right=${o.right}`);
  }
  console.log('dialogs:', JSON.stringify(report.dialogs));
  if (report.viewports.some(v => v.overflowX || !v.fontLoaded || v.console.length)) process.exitCode = 1;
})();
