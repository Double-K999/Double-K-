const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(path.dirname(path.dirname(process.execPath)), 'node_modules/playwright'));

(async () => {
  const installedChrome = path.join(process.env.ProgramFiles || '', 'Google/Chrome/Application/chrome.exe');
  const browser = await chromium.launch({ headless: true, executablePath: fs.existsSync(installedChrome) ? installedChrome : chromium.executablePath() });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.setContent('<html><body style="margin:0"><canvas width="1600" height="1000"></canvas></body></html>');
  const result = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
    let seed = 43;
    const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    const stars = Array.from({ length: 125 }, () => ({ x: random() * 1600, y: random() * 1000, r: random(), p: random() * 6 }));
    function draw(t) {
      ctx.fillStyle = '#141210'; ctx.fillRect(0, 0, 1600, 1000);
      const ambient = ctx.createRadialGradient(1220, 470, 20, 1160, 470, 700);
      ambient.addColorStop(0, '#473529'); ambient.addColorStop(.5, '#25211f'); ambient.addColorStop(1, '#141210');
      ctx.fillStyle = ambient; ctx.fillRect(0, 0, 1600, 1000);
      ctx.strokeStyle = '#b99a8408'; ctx.lineWidth = 1;
      for(let x=0;x<1600;x+=100){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1000);ctx.stroke();}
      for(let y=0;y<1000;y+=100){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1600,y);ctx.stroke();}
      for (const s of stars) { ctx.fillStyle = `rgba(213,180,157,${.12 + .13 * Math.sin(s.p+t)})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill(); }
      const cx = 1190, cy = 480, r = 292;
      ctx.save(); ctx.translate(cx,cy);ctx.rotate(-.48);
      [1,1.025,1.13].forEach((n,i)=>{ctx.beginPath();ctx.ellipse(0,0,470*n,158*n,0,0,Math.PI*2);ctx.strokeStyle=`rgba(220,174,141,${i===0?.17:.045})`;ctx.lineWidth=i===0?1.1:.8;ctx.stroke();});
      for(let i=0;i<100;i++){const a=i*Math.PI*2/100;ctx.beginPath();ctx.moveTo(Math.cos(a)*470,Math.sin(a)*158);ctx.lineTo(Math.cos(a)*(i%5===0?482:475),Math.sin(a)*(i%5===0?163:160));ctx.strokeStyle='#cba08227';ctx.stroke();}
      const dot = t * Math.PI / 4;ctx.beginPath();ctx.arc(Math.cos(dot)*470,Math.sin(dot)*158,3,0,Math.PI*2);ctx.fillStyle='#f4ac78';ctx.shadowColor='#f4ac78';ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.restore();
      const glow = ctx.createRadialGradient(cx,cy,240,cx,cy,380);glow.addColorStop(0,'#ecb58d0a');glow.addColorStop(.65,'#db9a6b08');glow.addColorStop(1,'#c2875c00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,380,0,Math.PI*2);ctx.fill();
      const sphere = ctx.createRadialGradient(cx-120,cy-160,10,cx,cy,r);sphere.addColorStop(0,'#695547');sphere.addColorStop(.4,'#49392e');sphere.addColorStop(.8,'#231f1c');sphere.addColorStop(1,'#161412');ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      function point(lat, lon) { const y = Math.sin(lat), s = Math.cos(lat);let x=s*Math.sin(lon+t*.09),z=s*Math.cos(lon+t*.09);const ty=y*.962-x*.272; x=x*.962+y*.272;return {x:cx+x*r,y:cy+ty*r,z}; }
      for(let lat=-Math.PI/2+.07;lat<Math.PI/2;lat+=Math.PI/54){let started=false;ctx.beginPath();for(let lon=0;lon<=Math.PI*2+.04;lon+=.045){const p=point(lat,lon);if(p.z<0){started=false;continue;}if(!started){ctx.moveTo(p.x,p.y);started=true;}else ctx.lineTo(p.x,p.y);}ctx.strokeStyle=`rgba(225,187,160,${.13+Math.cos(lat)*.12})`;ctx.lineWidth=.65;ctx.stroke();}
      for(let lon=0;lon<Math.PI*2;lon+=Math.PI/48){let started=false;ctx.beginPath();for(let lat=-Math.PI/2;lat<=Math.PI/2+.01;lat+=.045){const p=point(lat,lon);if(p.z<0){started=false;continue;}if(!started){ctx.moveTo(p.x,p.y);started=true;}else ctx.lineTo(p.x,p.y);}ctx.strokeStyle='#e4bb9d33';ctx.lineWidth=.65;ctx.stroke();}
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#e6bb9d44';ctx.lineWidth=1;ctx.stroke();
      // A moving latitude accent gives the otherwise quiet composition a sense of life.
      const scanLat=Math.sin(t*Math.PI/4)*.85;ctx.beginPath();let started=false;for(let lon=0;lon<=Math.PI*2+.02;lon+=.025){const p=point(scanLat,lon);if(p.z<0){started=false;continue;}if(!started){ctx.moveTo(p.x,p.y);started=true;}else ctx.lineTo(p.x,p.y);}ctx.strokeStyle='#f9cdad70';ctx.lineWidth=1.2;ctx.stroke();
      ctx.fillStyle='#bd987d';ctx.font='9px monospace';ctx.fillText('UX / HUMAN-CENTERED SYSTEM',990,858);ctx.fillStyle='#bd987d66';ctx.fillText('01.6384 N / 26.4800 E',990,879);
      ctx.strokeStyle='#dcb19344';ctx.lineWidth=1;[[820,220],[1490,225],[820,760],[1490,760]].forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+8,y);ctx.moveTo(x,y-8);ctx.lineTo(x,y+8);ctx.stroke();});
    }
    draw(0);
    const poster = canvas.toDataURL('image/jpeg', .9).split(',')[1];
    const stream = canvas.captureStream(30), chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 1600000 });
    const finished = new Promise(resolve => { recorder.onstop = async () => { const buf=await new Blob(chunks,{type:'video/webm'}).arrayBuffer();let binary='';const bytes=new Uint8Array(buf);for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));resolve(btoa(binary)); }; });
    recorder.ondataavailable = event => { if(event.data.size)chunks.push(event.data); };
    recorder.start();
    const start=performance.now();await new Promise(resolve=>{const tick=()=>{const t=(performance.now()-start)/1000;draw(t);if(t<8)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
    recorder.stop();stream.getTracks().forEach(track=>track.stop());
    return { poster, video: await finished };
  });
  fs.writeFileSync('public/images/hero-poster.jpg', Buffer.from(result.poster, 'base64'));
  fs.writeFileSync('public/media/orbit.webm', Buffer.from(result.video, 'base64'));
  console.log('Local hero video generated:', fs.statSync('public/media/orbit.webm').size, 'bytes');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
