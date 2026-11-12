// 사이트 미리보기:  node tools/serve.mjs [포트=4195]  →  http://localhost:4195
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
http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
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
