/**
 * 功能回归：背景视频暂停/播放、首屏胶卷图片、复制联系方式、简历下载、回到顶部、详情页 CTA。
 * 运行：node scripts/checks/functional-check.cjs
 */
const path = require('node:path');
const { launch } = require('./_pw.cjs');

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const out = {};

  // 首屏：背景视频开关 + 作品胶卷
  out.videoInitial = await page.evaluate(() => {
    const v = document.querySelector('.hero video');
    return { paused: v.paused, readyState: v.readyState };
  });
  await page.click('.video-control');
  await page.waitForTimeout(400);
  out.videoAfterPause = await page.evaluate(() => ({
    paused: document.querySelector('.hero video').paused,
    label: document.querySelector('.video-control').getAttribute('aria-label'),
  }));
  await page.click('.video-control');
  await page.waitForTimeout(500);
  out.videoAfterPlay = await page.evaluate(() => ({
    paused: document.querySelector('.hero video').paused,
    label: document.querySelector('.video-control').getAttribute('aria-label'),
  }));
  out.strip = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.strip-tile img')];
    return { tiles: imgs.length, loaded: imgs.every(i => i.complete && i.naturalWidth > 0) };
  });

  // 邮箱 / 微信复制
  await page.click('.about-info button');
  await page.waitForTimeout(400);
  out.toastAfterEmailCopy = await page.evaluate(() => {
    const t = document.querySelector('.toast');
    return { text: t.textContent.trim(), visible: t.classList.contains('visible') };
  });
  out.clipboard = await page.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e.message));

  await page.evaluate(() => document.querySelector('#contact').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.click('.contact-links > button');
  await page.waitForTimeout(400);
  out.toastAfterWechatCopy = await page.evaluate(() => document.querySelector('.toast').textContent.trim());

  // 简历下载
  out.resume = await page.evaluate(async () => {
    const a = document.querySelector('a[download]');
    const r = await fetch(a.href);
    return { href: a.getAttribute('href'), download: a.getAttribute('download'), status: r.status, bytes: (await r.arrayBuffer()).byteLength };
  });

  // 回到顶部
  await page.click('.back-top');
  await page.waitForTimeout(1200);
  out.scrollAfterBackTop = await page.evaluate(() => Math.round(window.scrollY));

  // 详情页 → 联系我 CTA
  await page.evaluate(() => document.querySelector('#work').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.click('.work-card');
  await page.waitForTimeout(900);
  await page.evaluate(() => { const d = document.querySelector('dialog.project-dialog'); d.scrollTo({ top: d.scrollHeight, behavior: 'instant' }); });
  await page.waitForTimeout(500);
  await page.click('.detail-footer .button');
  await page.waitForTimeout(1200);
  out.afterDialogCta = await page.evaluate(() => ({
    dialogGone: !document.querySelector('dialog.project-dialog'),
    contactTop: Math.round(document.querySelector('#contact').getBoundingClientRect().top),
    bodyOverflow: document.body.style.overflow,
  }));

  out.errors = errors;
  await browser.close();
  console.log(JSON.stringify(out, null, 2));
})();
