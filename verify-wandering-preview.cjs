const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(path.dirname(path.dirname(process.execPath)), 'node_modules/playwright'));
(async () => {
 const browser=await chromium.launch({headless:true,executablePath:path.join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe')});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
 await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
 for(const section of await page.locator('main>section').all()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(200);}
 await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(200);
 fs.mkdirSync('artifacts',{recursive:true});await page.screenshot({path:'artifacts/desktop-home.png'});await page.screenshot({path:'artifacts/desktop-full.png',fullPage:true});
 const desktop=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].every(img=>img.complete&&img.naturalWidth>0),video:{ready:document.querySelector('video').readyState,playing:!document.querySelector('video').paused,duration:document.querySelector('video').duration},sections:document.querySelectorAll('main>section').length}));
 await page.getByRole('button',{name:'查看 PUBG MOBILE 项目详情',exact:true}).click();await page.waitForTimeout(250);await page.screenshot({path:'artifacts/project-detail.png'});const dialogOpen=await page.locator('dialog').evaluate(el=>el.open);await page.keyboard.press('Escape');const dialogClosed=await page.locator('dialog').count()===0;
 await page.getByRole('button',{name:'查看 BLOOD STRIKE 项目详情',exact:true}).click();const secondProject=await page.locator('dialog h1').textContent();await page.getByRole('button',{name:'关闭项目详情',exact:true}).click();
 await page.getByRole('navigation').getByRole('link',{name:'工作经历'}).click();await page.waitForTimeout(800);const navWorks=await page.evaluate(()=>location.hash==='#about');
 await page.locator('.contact-links button').click();const copiedWechat=await page.evaluate(()=>navigator.clipboard.readText());await page.screenshot({path:'artifacts/contact.png'});
 const resumeStatus=(await context.request.get('http://localhost:5173/resume-li-xukun.pdf')).status();
 await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:5173/',{waitUntil:'networkidle'});await page.screenshot({path:'artifacts/mobile-home.png'});await page.screenshot({path:'artifacts/mobile-full.png',fullPage:true});
 const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));await page.getByRole('button',{name:'打开菜单',exact:true}).click();await page.getByRole('navigation').getByRole('link',{name:'精选作品'}).click();const mobileNav=await page.evaluate(()=>location.hash==='#work');
 await page.getByRole('button',{name:'查看 PUBG MOBILE 项目详情',exact:true}).click();const mobileDialog=await page.locator('dialog').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));await page.getByRole('button',{name:'关闭项目详情',exact:true}).click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});const reducedMotion=await page.evaluate(()=>getComputedStyle(document.querySelector('video')).visibility==='hidden'&&document.querySelector('video').paused);
 const result={desktop,mobile,dialogOpen,dialogClosed,secondProject,navWorks,mobileNav,mobileDialog,copiedWechat,resumeStatus,reducedMotion,errors};fs.writeFileSync('artifacts/verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
 if(errors.length||desktop.width!==desktop.scrollWidth||mobile.width!==mobile.scrollWidth||!desktop.images||!dialogOpen||!dialogClosed||!navWorks||!mobileNav||copiedWechat!=='SgrASgr'||resumeStatus!==200||!reducedMotion||desktop.video.ready<2)process.exitCode=1;
})().catch(error=>{console.error(error);process.exit(1);});
