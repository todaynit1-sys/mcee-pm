// 미리보기·장면 캡처용 로컬 서버: node serve.js <프로젝트 폴더> [포트=8790]
//  http://localhost:<포트>/dist/<id>.html?t=7.5  → 7.5초 장면에서 멈춘 화면(검수용)
//  http://localhost:<포트>/__sheet               → 모든 장면을 한 화면에 모은 검수 시트
//  http://localhost:<포트>/__capture             → 장면별 그림을 thumbs/<n>.jpg 로 저장(읽기 모드용)
// 브라우저는 file:// 로 열면 일부 기능이 막히므로 꼭 이 서버(localhost)로 연다.
const http = require('http'), fs = require('fs'), path = require('path');
const dir = path.resolve(process.argv[2] || '.'), port = +process.argv[3] || 8790;
const story = () => JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const T = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml'};
const page = (mode) => `<!doctype html><meta charset="utf-8"><title>${mode}</title><body style="margin:0;background:#000;color:#fff;font:13px sans-serif">
<div id="g" style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px"></div><pre id="log"></pre><script>
(async()=>{const id=${JSON.stringify(story().id)};const f=document.createElement('iframe');f.style.cssText='position:absolute;left:-3000px;width:1200px;height:1000px';f.src='/dist/'+id+'.html';document.body.append(f);
await new Promise(r=>f.onload=r);await f.contentDocument.fonts.ready;await new Promise(r=>setTimeout(r,800));
const S=f.contentWindow.STORY,n=S.names.length,sec=S.sceneSec;
for(let i=0;i<n;i++){const t=i*sec+sec*.72;f.contentWindow.CINE_seek(t);await new Promise(r=>setTimeout(r,150));const url=f.contentWindow.CINE_seek(t);
 const im=new Image();await new Promise(r=>{im.onload=r;im.src=url});
 if(${mode === 'capture'}){const c=document.createElement('canvas');c.width=720;c.height=Math.round(720*im.height/im.width);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
  const res=await fetch('/__save/'+(i+1)+'.jpg',{method:'POST',body:c.toDataURL('image/jpeg',.82)});document.getElementById('log').textContent+='scene '+(i+1)+' '+res.status+'\\n'}
 im.style.width='100%';document.getElementById('g').append(im)}
document.title='done';document.getElementById('log').textContent+='done';})();</script>`;
http.createServer((q, r) => {
  const url = q.url.split('?')[0];
  if (url === '/__sheet' || url === '/__capture') { r.writeHead(200, {'Content-Type': T['.html']}); r.end(page(url.slice(3))); return }
  if (q.method === 'POST' && url.startsWith('/__save/')) { const name = path.basename(url); if (!/^\d+\.jpg$/.test(name)) { r.writeHead(400); r.end(); return }
    let b = ''; q.on('data', d => b += d); q.on('end', () => { const m = b.match(/^data:image\/jpeg;base64,(.+)$/); if (!m) { r.writeHead(400); r.end(); return }
      fs.mkdirSync(path.join(dir, 'thumbs'), {recursive: true}); fs.writeFileSync(path.join(dir, 'thumbs', name), Buffer.from(m[1], 'base64')); r.writeHead(200); r.end('ok') }); return }
  const f = path.join(dir, decodeURIComponent(url === '/' ? '/story.json' : url)); if (!f.startsWith(dir)) { r.writeHead(403); r.end(); return }
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end('not found'); return } r.writeHead(200, {'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store'}); r.end(d) });
}).listen(port, () => console.log(`http://localhost:${port}/dist/${story().id}.html`));
