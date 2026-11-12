// 사이트 미리보기:  node tools/serve.mjs [포트=4195]  →  http://localhost:4195
//  /__og            : 카톡·SNS 공유용 그림(1200×630)을 그려 og.jpg 로 저장
//  /__capture/<id>  : 빌드된 <id>.html 의 장면 그림을 motion/<id>/thumbs/<n>.jpg 로 저장 (읽기 모드·첫 화면용)
//                     저장한 뒤 node tools/build-all.mjs <id> 를 한 번 더 돌린다.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), port = +process.argv[2] || 4195;
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml' };
const capture = (id) => `<!doctype html><meta charset="utf-8"><title>capture</title><body style="margin:0;background:#000;color:#fff;font:13px sans-serif">
<div id="g" style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px"></div><pre id="log"></pre><script>
(async()=>{const id=${JSON.stringify(id)};const f=document.createElement('iframe');f.style.cssText='position:absolute;left:-3000px;width:1200px;height:1000px';f.src='/'+id+'.html?c='+Date.now();document.body.append(f);
await new Promise(r=>f.onload=r);await f.contentDocument.fonts.ready;await new Promise(r=>setTimeout(r,800));
const S=f.contentWindow.STORY,n=S.names.length,sec=S.sceneSec;
for(let i=0;i<n;i++){const t=i*sec+sec*.8;f.contentWindow.CINE_seek(t);await new Promise(r=>setTimeout(r,150));const url=f.contentWindow.CINE_seek(t);
 const im=new Image();await new Promise(r=>{im.onload=r;im.src=url});
 const c=document.createElement('canvas');c.width=720;c.height=Math.round(720*im.height/im.width);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
 const res=await fetch('/__save/'+id+'/'+(i+1)+'.jpg',{method:'POST',body:c.toDataURL('image/jpeg',.82)});document.getElementById('log').textContent+='scene '+(i+1)+' '+res.status+'\\n';
 im.style.width='100%';document.getElementById('g').append(im)}
document.title='done';})();</script>`;
const og = () => `<!doctype html><meta charset="utf-8"><title>og</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@500;700&display=swap">
<body style="margin:0;background:#888"><canvas id="c" width="1200" height="630" style="width:100%"></canvas><pre id="log"></pre><script>
(async()=>{const c=document.getElementById('c'),x=c.getContext('2d'),F='"IBM Plex Sans KR","Malgun Gothic",sans-serif';
const T1='미세먼지',T2='계절관리제',P='제8차 · 2026. 12. 1. ~ 2027. 3. 31.',D='초미세먼지 고농도 시기 배출 저감·관리';
await Promise.all([document.fonts.load('700 100px '+F,T1+T2),document.fonts.load('500 30px '+F,P+D)]);
const img=s=>new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=j;i.src=s});
const logo=await img('/assets/logo.png'),still=await img('/motion/season/thumbs/1.jpg');
x.fillStyle='#ffffff';x.fillRect(0,0,1200,630);x.fillStyle='#f6f8fb';x.fillRect(0,150,1200,480);
x.imageSmoothingQuality='high';x.drawImage(logo,64,39,230,72);
x.fillStyle='#0f172a';x.font='700 100px '+F;x.textBaseline='alphabetic';x.fillText(T1,60,300);x.fillText(T2,60,416);
x.fillStyle='#073964';x.font='500 31px '+F;x.fillText(P,64,480);
x.fillStyle='#475569';x.font='500 25px '+F;x.fillText(D,64,522);
const seg=[[15,'#4a9df0'],[20,'#3fb27f'],[40,'#e0b13a'],[25,'#e0564f']];let sx=64;for(const [w,col] of seg){const ww=5.1*w-4;x.fillStyle=col;x.beginPath();x.roundRect(sx,558,ww,10,3);x.fill();sx+=5.1*w}
x.save();x.shadowColor='rgba(15,23,42,.18)';x.shadowBlur=36;x.shadowOffsetY=12;x.beginPath();x.roundRect(626,206,510,306,18);x.fillStyle='#0a0f1a';x.fill();x.restore();
x.save();x.beginPath();x.roundRect(626,206,510,306,18);x.clip();x.drawImage(still,626,206,510,306);x.restore();
const res=await fetch('/__saveog',{method:'POST',body:c.toDataURL('image/jpeg',.9)});document.getElementById('log').textContent='og '+res.status;document.title='done'})();</script>`;
http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/__og') { r.writeHead(200, { 'Content-Type': T['.html'] }); r.end(og()); return; }
  if (q.method === 'POST' && u === '/__saveog') { let b = ''; q.on('data', (d) => (b += d)); q.on('end', () => { const d = b.match(/^data:image\/jpeg;base64,(.+)$/); if (!d) { r.writeHead(400); r.end(); return; } fs.writeFileSync(path.join(root, 'og.jpg'), Buffer.from(d[1], 'base64')); r.writeHead(200); r.end('ok'); }); return; }
  let m = u.match(/^\/__capture\/([a-z0-9-]+)$/);
  if (m) { r.writeHead(200, { 'Content-Type': T['.html'] }); r.end(capture(m[1])); return; }
  m = u.match(/^\/__save\/([a-z0-9-]+)\/(\d+)\.jpg$/);
  if (q.method === 'POST' && m) { let b = ''; q.on('data', (d) => (b += d)); q.on('end', () => { const d = b.match(/^data:image\/jpeg;base64,(.+)$/), dir = path.join(root, 'motion', m[1]); if (!d || !fs.existsSync(dir)) { r.writeHead(400); r.end(); return; }
    fs.mkdirSync(path.join(dir, 'thumbs'), { recursive: true }); fs.writeFileSync(path.join(dir, 'thumbs', m[2] + '.jpg'), Buffer.from(d[1], 'base64')); r.writeHead(200); r.end('ok'); }); return; }
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(root, u);
  if (!f.startsWith(root)) { r.writeHead(403); r.end(); return; }
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end('not found'); return; } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(d); });
}).listen(port, () => console.log(`http://localhost:${port}`));
