// 사이트 전체 빌드:  node tools/build-all.mjs [편 id ...]
//  motion/<id>/story.json + scenes.js  →  <id>.html (모션그래픽), <id>-m.html (휴대폰 읽기 모드), <id>-poster.jpg (첫 화면용 장면 그림)
//  tools/index.template.html + 모든 story.json  →  index.html (첫 화면)
//  scenes.js 가 없는 편은 '준비 중'으로 첫 화면에만 나온다.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const eng = path.join(root, 'tools', 'engine', 'scripts');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const eps = [];
for (const id of fs.readdirSync(path.join(root, 'motion'))) {
  const dir = path.join(root, 'motion', id), sf = path.join(dir, 'story.json');
  if (!fs.existsSync(sf)) continue;
  const S = JSON.parse(fs.readFileSync(sf, 'utf8'));
  if (S.id !== id) throw new Error(`${id}/story.json: id 는 폴더 이름과 같아야 합니다`);
  const ready = fs.existsSync(path.join(dir, 'scenes.js'));
  let sec = 0, mobile = false, poster = '';
  if (ready) {
    if (!only.length || only.includes(id)) {
      execFileSync(process.execPath, [path.join(eng, 'build.js'), dir], { stdio: 'inherit' });
      for (const f of fs.readdirSync(path.join(dir, 'dist'))) fs.copyFileSync(path.join(dir, 'dist', f), path.join(root, f));
      const th = path.join(dir, 'thumbs', `${S.poster || 1}.jpg`);
      if (fs.existsSync(th)) fs.copyFileSync(th, path.join(root, `${id}-poster.jpg`));
    }
    const html = fs.existsSync(path.join(root, `${id}.html`)) ? fs.readFileSync(path.join(root, `${id}.html`), 'utf8') : '';
    sec = +(html.match(/"sceneSec":([\d.]+)/) || [0, 5])[1] * S.names.length;
    mobile = fs.existsSync(path.join(root, `${id}-m.html`));
    if (fs.existsSync(path.join(root, `${id}-poster.jpg`))) poster = `${id}-poster.jpg`;
  }
  eps.push({ id, no: S.no || 99, title: S.title, desc: S.desc, ready, sec, mobile, poster, names: S.names, captions: S.captions, basis: S.basis || '' });
}
eps.sort((a, b) => a.no - b.no);
const tpl = fs.readFileSync(path.join(root, 'tools', 'index.template.html'), 'utf8');
const stamp = Date.now().toString(36);
fs.writeFileSync(path.join(root, 'index.html'), tpl.replace('/*EPISODES*/[]', JSON.stringify(eps).replace(/<\//g, '<\\/')).replaceAll('{{V}}', stamp));
console.log(`index.html  ${eps.length}편 (완성 ${eps.filter((e) => e.ready).length}, 준비 중 ${eps.filter((e) => !e.ready).length})`);
