// 단일 HTML 빌드: node build.js <프로젝트 폴더>
// 입력: story.json, scenes.js, (선택) voice/<n>.mp3, thumbs/<n>.jpg, logo.png
// 출력: dist/<id>.html (움직이는 영상) + thumbs가 있으면 dist/<id>-m.html (휴대폰 읽기 모드)
// 코드·음성·그림·로고를 모두 파일 안에 넣어, 파일 하나만 보내도 인터넷 글꼴 외에는 그대로 재생된다.
const fs = require('fs'), path = require('path');
const here = __dirname, skill = path.resolve(here, '..');
const dir = path.resolve(process.argv[2] || '.');
const S = JSON.parse(fs.readFileSync(path.join(dir, 'story.json'), 'utf8'));
const N = S.names.length;
if (!S.id || !N || (S.captions || []).length !== N) throw new Error('story.json: id, names[], captions[](같은 개수)가 필요합니다');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const b64 = (f, mime) => `data:${mime};base64,` + fs.readFileSync(f).toString('base64');
const file = (...p) => path.join(dir, ...p);

// 음성: 있으면 넣고, 장면 길이는 가장 긴 해설 + 0.6초(3.5~6초)로 자동 결정
const voice = [], durs = [];
for (let i = 1; i <= N; i++) { const f = file('voice', `${i}.mp3`); if (fs.existsSync(f)) { voice.push(b64(f, 'audio/mpeg')); durs.push(fs.statSync(f).size * 8 / 48000) } else voice.push(null) }
const auto = durs.length ? Math.min(6, Math.max(3.5, Math.ceil((Math.max(...durs) + .6) * 2) / 2)) : 5;
const sceneSec = S.sceneSec || auto;
const kit = fs.readFileSync(path.join(here, 'kit.js'), 'utf8');
const code = kit + ';' + fs.readFileSync(file('scenes.js'), 'utf8');
const glyphs = [...new Set(((code.match(/'[^'\n]*'/g) || []).join('') + S.names.join('')).split('').filter(ch => ch.charCodeAt(0) > 127))].join('');
const story = {id: S.id, org: S.org || '', department: S.department || '', title: S.title, names: S.names, captions: S.captions, accent: S.accent || '#3de0ff', sceneSec, voice: voice.every(Boolean) ? voice : [], glyphs};
const logo = fs.existsSync(file('logo.png')) ? `<img src="${b64(file('logo.png'), 'image/png')}" alt="${esc(S.org)}">` : '';
const plain = String(S.title).replace(/<[^>]*>/g, ' ');
const thumbs = Array.from({length: N}, (_, i) => fs.existsSync(file('thumbs', `${i + 1}.jpg`)) ? b64(file('thumbs', `${i + 1}.jpg`), 'image/jpeg') : null);
const hasMobile = thumbs.some(Boolean);
const source = S.source ? `<a href="${esc(S.source)}" target="_blank" rel="noopener">공식 자료 ↗</a>` : '';
const js = [fs.readFileSync(path.join(here, 'sound.js'), 'utf8'), fs.readFileSync(path.join(here, 'engine.js'), 'utf8'), code].join('\n').replace(/<\/script/gi, '<\\/script');
const fill = (tpl, map) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? '');
fs.mkdirSync(file('dist'), {recursive: true});
const page = fill(fs.readFileSync(path.join(skill, 'assets', 'shell.html'), 'utf8'), {
  TITLE_PLAIN: esc(plain), ORG: esc(S.org), DEPT: esc(S.department), DESC: esc(S.desc), ACCENT: story.accent, LOGO: logo, SOURCE: source, BASIS: esc(S.basis || '화면 속 수치는 예시'),
  MOBILE_LINK: hasMobile ? `<a href="${esc(S.id)}-m.html">휴대폰으로 읽기</a>` : '',
  STORY_JSON: JSON.stringify(story).replace(/<\//g, '<\\/'), CODE: js});
fs.writeFileSync(file('dist', `${S.id}.html`), page);
console.log(`dist/${S.id}.html  ${(page.length / 1024).toFixed(0)}KB  장면 ${N}개 × ${sceneSec}초 = ${(N * sceneSec).toFixed(1)}초`);
if (hasMobile) {
  const m = fill(fs.readFileSync(path.join(skill, 'assets', 'mobile.html'), 'utf8'), {
    TITLE_PLAIN: esc(plain), ORG: esc(S.org), DEPT: esc(S.department), DESC: esc(S.desc), ACCENT_LIGHT: S.accentLight || '#073964', LOGO: logo, BASIS: esc(S.basis || '그림 속 수치는 이해를 돕기 위한 예시입니다'),
    SOURCE: S.source ? ` <a href="${esc(S.source)}" target="_blank" rel="noopener">공식 자료 ↗</a>` : '', VIDEO_LINK: `<a class="btn ghost" href="${esc(S.id)}.html">모션그래픽으로 보기</a>`,
    DATA_JSON: JSON.stringify({names: S.names, captions: S.captions, voice: voice.map(v => v || null), thumbs}).replace(/<\//g, '<\\/')});
  fs.writeFileSync(file('dist', `${S.id}-m.html`), m);
  console.log(`dist/${S.id}-m.html  ${(m.length / 1024).toFixed(0)}KB  (읽기 모드)`);
}
