/* 계절관리제 모션 공통 스타일 (CINE.K)
   밤 네온 대신: 짙은 남색 바탕, 큰 글자, 얇은 선, 강조색 하나(하늘색), 먼지는 모래색.
   장면 파일에서  CINE.story({scenes, header: K.header, wipe: K.wipe, post: K.post})  로 쓴다. */
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, grad, tw} = CINE;
const INK = '#0a0f1a', PAPER = '#eef1f4', SUB = '#9aa7b8', MUTE = '#66758a', SKY = '#6cc4ff', DUST = '#c9a36b', HAIR = 'rgba(238,241,244,.14)';
// 초미세먼지(PM-2.5) 예보 등급: 이름, 상한(㎍/㎥), 색
const AQ = [['좋음', 15, '#4a9df0'], ['보통', 35, '#3fb27f'], ['나쁨', 75, '#e0b13a'], ['매우 나쁨', 100, '#e0564f']];
const pad = n => String(n).padStart(2, '0');
const mix = (a, b, t) => { const p = s => s[0] === '#' ? [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)) : s.match(/\d+/g).map(Number), A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t)))).join(',') + ')' };

// 바탕: clear 1 = 맑은 밤하늘, 0 = 먼지 낀 하늘
function bg(clear = 1) { c.fillStyle = grad(0, 0, 0, H, [[0, mix('#17150f', INK, clear)], [1, mix('#3b3122', '#13203a', clear)]]); c.fillRect(0, 0, W, H) }
function stars(now, a = 1) { for (let i = 0; i < 46; i++) { c.globalAlpha = a * (.25 + .3 * Math.sin(now * 1.2 + i * 2.3)); c.fillStyle = PAPER; c.fillRect(hash(i) * W, 140 + hash(i + 40) * 330, 1.6, 1.6) } c.globalAlpha = 1 }
function dust(now, k, y0 = 140, y1 = 700) { for (let i = 0; i < 150; i++) { if (hash(i * 7.7) > k) continue;
  const x = (hash(i) * W + now * (10 + hash(i + 5) * 24)) % (W + 20) - 10, y = lerp(y0, y1, hash(i + 31)) + Math.sin(now * .7 + i) * 9;
  c.globalAlpha = .18 + hash(i + 3) * .5; c.fillStyle = DUST; c.beginPath(); c.arc(x, y, 1.2 + hash(i + 11) * 3.4, 0, 6.2832); c.fill() } c.globalAlpha = 1 }
function haze(k, y0 = 280) { alpha(k, () => { c.fillStyle = grad(0, y0, 0, H, [[0, 'rgba(201,163,107,0)'], [1, 'rgba(201,163,107,.5)']]); c.fillRect(0, y0, W, H - y0) }) }
// 세 겹으로 천천히 흐르는 도시 윤곽
function skyline(now, clear = 1) { const per = 1500;
  for (let l = 0; l < 3; l++) { const off = (now * (4 + l * 5)) % per, col = mix(mix('#2a2519', '#1b2740', clear), mix('#0f0d09', '#080c15', clear), l / 2);
    c.fillStyle = col; for (let rep = 0; rep < 2; rep++) { let x = -off + rep * per, i = 0;
      while (x < -off + rep * per + per) { const w = 38 + hash(i * 3.1 + l * 17) * 70, h = (40 + hash(i * 1.7 + l * 9) * 120) * (1 - l * .22) + (2 - l) * 26; if (x + w > 0 && x < W) c.fillRect(x, H - h, w + 1, h); x += w; i++ } } } }

// 글자: 줄 단위로 아래에서 올라오며 드러남
function reveal(s, x, y, size, t0, u, o = {}) { const k = eout((u - t0) / .55); if (k <= 0) return 0; const wt = o.weight || 700, w = tw(s, size, wt), X = o.al === 'right' ? x - w : o.al === 'center' ? x - w / 2 : x;
  c.save(); c.beginPath(); c.rect(X - 6, y - size * 1.02, w + 12, size * 1.32); c.clip(); txt(s, X, y + (1 - k) * size * 1.1, size, o.col || PAPER, 'left', wt); c.restore(); return w }
function rule(x, y, w, k, col = HAIR, lw = 1) { if (k > 0) line(x, y, x + w * eout(k), y, col, lw, 'butt') }
// 예보 등급 눈금. 값 → x 좌표 함수를 돌려준다
function scale(x, y, w, k = 1) { let p = 0; AQ.forEach(([n, to, col], i) => { const x0 = x + w * p / 100 + (i ? 2 : 0), x1 = x + w * to / 100;
  alpha(k, () => { box(x0, y, x1 - x0, 8, col, 2); txt(n, x0, y + 32, 15, SUB, 'left', 500); mono(String(i ? p + 1 : 0), x0, y - 10, 12, MUTE, 'left', 500) }); p = to });
  return v => x + w * clamp(v, 0, 100) / 100 }
function marker(x, y, col, fill = true) { c.beginPath(); c.moveTo(x, y - 4); c.lineTo(x - 9, y - 20); c.lineTo(x + 9, y - 20); c.closePath(); if (fill) { c.fillStyle = col; c.fill() } else { c.strokeStyle = col; c.lineWidth = 2; c.stroke() } }
function puff(x, y, now, a, n = 7) { for (let i = 0; i < n; i++) { const ph = (now * .35 + i / n) % 1; c.globalAlpha = a * .7 * (1 - ph); c.fillStyle = DUST; c.beginPath(); c.arc(x + Math.sin(ph * 5 + i) * 8 + ph * 14, y - ph * 70, 3 + ph * 9, 0, 6.2832); c.fill() } c.globalAlpha = 1 }

// 선으로 그린 그림 기호 (가운데 x,y 기준 약 120×90)
const st = (col, lw = 2.5) => { c.strokeStyle = col; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke() };
const ico = {
  plant(x, y, col = PAPER) { c.beginPath(); c.moveTo(x - 52, y + 40); c.quadraticCurveTo(x - 36, y, x - 44, y - 30); c.lineTo(x - 4, y - 30); c.quadraticCurveTo(x - 12, y, x + 4, y + 40); c.closePath(); st(col);
    c.beginPath(); c.rect(x + 22, y - 44, 16, 84); st(col); line(x - 60, y + 40, x + 56, y + 40, col, 2.5); line(x + 22, y - 30, x + 38, y - 30, col, 2.5) },
  truck(x, y, col = PAPER) { c.beginPath(); c.roundRect(x - 56, y - 26, 68, 50, 4); st(col); c.beginPath(); c.moveTo(x + 12, y - 10); c.lineTo(x + 36, y - 10); c.lineTo(x + 54, y + 8); c.lineTo(x + 54, y + 24); c.lineTo(x + 12, y + 24); c.closePath(); st(col);
    for (const wx of [x - 34, x + 32]) { c.beginPath(); c.arc(wx, y + 30, 11, 0, 6.2832); c.fillStyle = INK; c.fill(); st(col) } },
  factory(x, y, col = PAPER) { c.beginPath(); c.moveTo(x - 56, y + 40); c.lineTo(x - 56, y - 6); c.lineTo(x - 24, y - 26); c.lineTo(x - 24, y - 6); c.lineTo(x + 8, y - 26); c.lineTo(x + 8, y - 6); c.lineTo(x + 30, y - 6); c.lineTo(x + 30, y - 44); c.lineTo(x + 46, y - 44); c.lineTo(x + 46, y + 40); c.closePath(); st(col);
    for (const wx of [x - 40, x - 14, x + 12]) { c.beginPath(); c.rect(wx, y + 10, 12, 12); st(col, 2) } },
  flame(x, y, col = PAPER) { c.beginPath(); c.moveTo(x, y - 44); c.bezierCurveTo(x + 34, y - 14, x + 36, y + 18, x + 14, y + 36); c.bezierCurveTo(x + 20, y + 16, x + 8, y + 6, x, y - 6); c.bezierCurveTo(x - 6, y + 10, x - 18, y + 14, x - 14, y + 36); c.bezierCurveTo(x - 38, y + 16, x - 30, y - 14, x, y - 44); c.closePath(); st(col);
    line(x - 44, y + 40, x + 44, y + 40, col, 2.5) },
};

// 엔진 머리글·전환·후처리 대신 쓰는 것 (u는 실제 초)
function header(i, u) { const D = window.STORY, n = D.names.length;
  txt([D.org, D.department].filter(Boolean).join('  ·  '), 48, 56, 15, SUB, 'left', 500); mono(`${pad(i + 1)} / ${pad(n)}`, W - 48, 56, 14, MUTE, 'right', 500);
  alpha(eout((u - .15) / .5), () => { mono(pad(i + 1), 48, 104, 16, SKY, 'left', 600); txt(D.names[i], 82, 105, 23, PAPER, 'left', 700) });
  line(48, 124, W - 48, 124, HAIR, 1, 'butt'); line(48, 124, 48 + (W - 96) * clamp(u / D.sceneSec), 124, SKY, 2, 'butt') }
function wipe(i, u) { if (u > .55) return; const e = eio(u / .55); c.fillStyle = '#0d1422'; c.fillRect(W * e, 0, W * (1 - e) + 1, H); c.fillStyle = SKY; c.fillRect(W * e - 10, 0, 10, H) }
function post() { const D = window.STORY; // 화면 아래 자막 (소리 없이도 내용이 전달되게). 좁은 화면에서는 글자가 너무 작아져 페이지 쪽 자막을 쓴다
  if (c.canvas.clientWidth && c.canvas.clientWidth < 600) return;
  c.fillStyle = grad(0, 590, 0, H, [[0, 'rgba(6,9,16,0)'], [.35, 'rgba(6,9,16,.86)'], [1, 'rgba(6,9,16,.96)']]); c.fillRect(0, 590, W, H - 590);
  const s = D.captions[curScene] || '', k = eout((curU - .25) / .5); if (!s || k <= 0) return;
  const size = 23, max = W - 140, words = s.split(' '), rows = ['']; c.font = `500 ${size}px "IBM Plex Sans KR","Malgun Gothic",sans-serif`;
  for (const w of words) { const t = rows[rows.length - 1] ? rows[rows.length - 1] + ' ' + w : w; if (c.measureText(t).width > max && rows[rows.length - 1]) rows.push(w); else rows[rows.length - 1] = t }
  alpha(k, () => rows.forEach((r, j) => txt(r, W / 2, 668 - (rows.length - 1) * 16 + j * 32 + (1 - k) * 8, size, PAPER, 'center', 500))) }
let curScene = 0, curU = 0;
const header0 = header; header = function (i, u) { curScene = i; curU = u; header0(i, u) };

// ---- 화려한 연출용 ----
// 효과음 신호: 장면 시간 u가 t0을 지나는 순간 한 번 울린다
const seen = {};
function cue(u, t0, name) { const key = t0 + name, p = seen[key]; seen[key] = u; if (p !== undefined && p < t0 && u >= t0 && u - p < .5 && window.PM_SND) window.PM_SND.sfx(name) }
// 천천히 다가가는 카메라
function cam(u, fn, z = .05, ox = W / 2, oy = H / 2) { const s = 1 + z * clamp(u / 4); c.save(); c.translate(ox, oy); c.scale(s, s); c.translate(-ox, -oy); fn(); c.restore() }
// 글자가 하나씩 튀어 오르며 강조색에서 본색으로
function chars(s, x, y, size, t0, u, o = {}) { const wt = o.weight || 700, gap = o.gap ?? .04; c.font = `${wt} ${size}px "IBM Plex Sans KR","Malgun Gothic",sans-serif`; c.textAlign = 'left';
  const total = c.measureText(s).width; let cx = o.al === 'center' ? x - total / 2 : o.al === 'right' ? x - total : x;
  for (let i = 0; i < s.length; i++) { const w = c.measureText(s[i]).width, k = eout((u - t0 - i * gap) / .5); if (k > 0) { c.globalAlpha = clamp(k * 1.6); c.fillStyle = k < .75 ? SKY : (o.col || PAPER); c.fillText(s[i], cx, y + (1 - k) * size * .6) } cx += w }
  c.globalAlpha = 1; return total }
// 사방으로 터지는 선
function burst(x, y, k, col = SKY, n = 16, r0 = 20, r1 = 120) { if (k <= 0 || k >= 1) return; const e = eout(k); c.globalAlpha = 1 - k; for (let i = 0; i < n; i++) { const a = i / n * 6.2832 + hash(i) * .3, l = 14 + hash(i + 9) * 26, r = lerp(r0, r1, e) * (.8 + hash(i + 3) * .4);
  line(x + Math.cos(a) * r, y + Math.sin(a) * r, x + Math.cos(a) * (r + l * (1 - k)), y + Math.sin(a) * (r + l * (1 - k)), col, 2.5) } c.globalAlpha = 1 }
function ring(x, y, k, col = SKY, r0 = 10, r1 = 160, lw = 2) { if (k <= 0 || k >= 1) return; c.globalAlpha = 1 - k; circ(x, y, lerp(r0, r1, eout(k)), null, col, lw); c.globalAlpha = 1 }
// 바람 줄기 (오른쪽으로 흐름)
function streaks(now, a, y0, y1, col = DUST, n = 22) { for (let i = 0; i < n; i++) { const sp = 260 + hash(i + 2) * 320, x = (hash(i) * (W + 400) + now * sp) % (W + 400) - 200, y = lerp(y0, y1, hash(i + 13)), l = 60 + hash(i + 5) * 160;
  c.globalAlpha = a * (.15 + hash(i + 7) * .4); line(x - l, y, x, y, col, 1.5 + hash(i + 1) * 1.5) } c.globalAlpha = 1 }
// 비스듬히 지나가는 빛줄기
function sweep(k, col = '238,241,244') { if (k <= 0 || k >= 1) return; const x = lerp(-300, W + 300, eio(k)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = grad(x - 160, 0, x + 160, 0, [[0, `rgba(${col},0)`], [.5, `rgba(${col},.16)`], [1, `rgba(${col},0)`]]);
  c.beginPath(); c.moveTo(x - 60, 0); c.lineTo(x + 260, 0); c.lineTo(x + 60, H); c.lineTo(x - 260, H); c.closePath(); c.fill(); c.restore() }
// 맑은 하늘로 올라가는 빛 알갱이
function sparks(now, a, n = 40, col = SKY) { for (let i = 0; i < n; i++) { const ph = (now * (.08 + hash(i + 4) * .1) + hash(i)) % 1; c.globalAlpha = a * (1 - ph) * .8; c.fillStyle = col; c.beginPath(); c.arc(hash(i + 8) * W + Math.sin(ph * 6 + i) * 20, 620 - ph * 480, 1.4 + hash(i + 2) * 2.2, 0, 6.2832); c.fill() } c.globalAlpha = 1 }

// ---- 그림 기호 추가 (모두 가운데 기준, 선 굵기 2.5) ----
const ln = (x1, y1, x2, y2, col) => line(x1, y1, x2, y2, col, 2.5);
const path = (col, fn) => { c.beginPath(); fn(); st(col) };
Object.assign(ico, {
  car(x, y, col = PAPER) { path(col, () => { c.moveTo(x - 56, y + 20); c.lineTo(x - 56, y + 2); c.quadraticCurveTo(x - 54, y - 6, x - 44, y - 6); c.lineTo(x - 30, y - 6); c.lineTo(x - 14, y - 28); c.lineTo(x + 18, y - 28); c.lineTo(x + 34, y - 6); c.lineTo(x + 50, y - 2); c.quadraticCurveTo(x + 58, y, x + 58, y + 10); c.lineTo(x + 58, y + 20); c.closePath() });
    for (const wx of [x - 30, x + 32]) { c.beginPath(); c.arc(wx, y + 22, 10, 0, 6.2832); c.fillStyle = INK; c.fill(); st(col) } },
  mask(x, y, col = PAPER) { path(col, () => c.roundRect(x - 40, y - 24, 80, 48, 14)); ln(x - 26, y - 8, x + 26, y - 8, col); ln(x - 26, y + 8, x + 26, y + 8, col);
    path(col, () => c.arc(x - 40, y, 16, Math.PI * .5, Math.PI * 1.5)); path(col, () => c.arc(x + 40, y, 16, -Math.PI * .5, Math.PI * .5)) },
  drop(x, y, col = PAPER) { path(col, () => { c.moveTo(x, y - 40); c.bezierCurveTo(x + 32, y - 2, x + 30, y + 36, x, y + 36); c.bezierCurveTo(x - 30, y + 36, x - 32, y - 2, x, y - 40) }) },
  apple(x, y, col = PAPER) { path(col, () => { c.moveTo(x, y - 18); c.bezierCurveTo(x + 42, y - 40, x + 50, y + 30, x + 10, y + 38); c.quadraticCurveTo(x, y + 32, x - 10, y + 38); c.bezierCurveTo(x - 50, y + 30, x - 42, y - 40, x, y - 18) }); ln(x, y - 18, x + 8, y - 38, col) },
  cup(x, y, col = PAPER) { path(col, () => { c.moveTo(x - 28, y - 38); c.lineTo(x - 20, y + 38); c.lineTo(x + 20, y + 38); c.lineTo(x + 28, y - 38); c.closePath() }) },
  window(x, y, col = PAPER) { path(col, () => c.rect(x - 44, y - 40, 88, 80)); ln(x, y - 40, x, y + 40, col); ln(x - 44, y, x + 44, y, col) },
  house(x, y, col = PAPER) { path(col, () => { c.moveTo(x - 52, y - 4); c.lineTo(x, y - 44); c.lineTo(x + 52, y - 4) }); path(col, () => c.rect(x - 38, y - 4, 76, 44)); path(col, () => c.rect(x - 10, y + 12, 20, 28)) },
  shield(x, y, col = PAPER) { path(col, () => { c.moveTo(x, y - 42); c.lineTo(x + 36, y - 28); c.lineTo(x + 36, y + 2); c.quadraticCurveTo(x + 34, y + 28, x, y + 42); c.quadraticCurveTo(x - 34, y + 28, x - 36, y + 2); c.lineTo(x - 36, y - 28); c.closePath() }) },
  siren(x, y, col = PAPER) { path(col, () => { c.moveTo(x - 26, y + 26); c.lineTo(x - 26, y - 4); c.arc(x, y - 4, 26, Math.PI, 0); c.lineTo(x + 26, y + 26) }); path(col, () => c.rect(x - 38, y + 26, 76, 14));
    ln(x, y - 42, x, y - 54, col); ln(x - 36, y - 30, x - 46, y - 40, col); ln(x + 36, y - 30, x + 46, y - 40, col) },
  crane(x, y, col = PAPER) { ln(x - 20, y + 40, x - 20, y - 46, col); ln(x - 50, y - 34, x + 52, y - 34, col); ln(x - 20, y - 46, x + 52, y - 34, col); ln(x - 20, y - 46, x - 50, y - 34, col); ln(x + 34, y - 34, x + 34, y - 6, col); path(col, () => c.rect(x + 24, y - 6, 20, 16)); ln(x - 44, y + 40, x + 4, y + 40, col) },
  school(x, y, col = PAPER) { path(col, () => c.rect(x - 50, y - 12, 100, 52)); path(col, () => { c.moveTo(x - 24, y - 12); c.lineTo(x, y - 32); c.lineTo(x + 24, y - 12) }); ln(x, y - 32, x, y - 50, col); path(col, () => { c.moveTo(x, y - 50); c.lineTo(x + 16, y - 45); c.lineTo(x, y - 40) }); path(col, () => c.rect(x - 9, y + 16, 18, 24)) },
  phone(x, y, col = PAPER) { path(col, () => c.roundRect(x - 28, y - 48, 56, 96, 9)); ln(x - 7, y + 40, x + 7, y + 40, col) },
  filter(x, y, col = PAPER) { path(col, () => c.roundRect(x - 40, y - 20, 80, 40, 16)); ln(x - 60, y, x - 40, y, col); ln(x + 40, y, x + 60, y, col); for (let j = -1; j <= 1; j++) ln(x + j * 18, y - 20, x + j * 18, y + 20, col) },
  lungs(x, y, col = PAPER) { ln(x, y - 48, x, y - 14, col); for (const d of [-1, 1]) { path(col, () => { c.moveTo(x, y - 14); c.quadraticCurveTo(x + d * 10, y - 10, x + d * 14, y) });
    path(col, () => { c.moveTo(x + d * 10, y - 24); c.bezierCurveTo(x + d * 50, y - 22, x + d * 58, y + 28, x + d * 46, y + 42); c.bezierCurveTo(x + d * 30, y + 46, x + d * 10, y + 34, x + d * 10, y + 8); c.closePath() }) } },
});
// 그림 기호를 크게·뒤집어 그리기
function icon(name, x, y, s = 1, col = PAPER, flip = false) { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); ico[name](0, 0, col); c.restore() }
// 번호가 붙은 목록: 한 줄씩 차례로 등장
function rows(list, x, y, dy, t0, u, o = {}) { const size = o.size || 30, step = o.step ?? .3; list.forEach((s, i) => { const t = t0 + i * step, yy = y + i * dy; cue(u, t, 'pop');
  alpha(eout((u - t) / .3), () => mono(pad(i + 1), x, yy - 3, 15, o.ic || SKY, 'left', 600)); chars(s, x + 44, yy, size, t, u, {gap: .02, weight: o.weight || 700, col: o.col}); rule(x, yy + (o.rg ?? 24), o.w || 560, (u - t - .1) / .5) }) }
// 작은 설명 + 큰 두 줄 제목
function title(sub, l1, l2, u, o = {}) { const x = o.x ?? 64, sz = o.size || 84, t = o.t0 ?? .3; chars(sub, x, 226, 34, t, u, {col: SUB, weight: 500}); chars(l1, x, 226 + sz + 12, sz, t + .25, u); if (l2) chars(l2, x, 226 + sz * 2 + 26, sz, t + .6, u, {col: o.col2 || SKY}) }
// 테두리 꼬리표
function tag(s, x, y, col = SKY, size = 20) { const w = tw(s, size, 700) + 28; box(x, y - size - 8, w, size + 20, 'rgba(10,15,26,.8)', 8, col, 1.5); txt(s, x + 14, y + 2, size, col, 'left', 700); return w }
// 아래쪽 도로
function road(now, speed = 120, y = 572) { line(0, y, W, y, HAIR, 1, 'butt'); for (let i = 0; i < 14; i++) { const x = ((i * 100 - now * speed) % 1400 + 1400) % 1400 - 100; line(x, y + 12, x + 44, y + 12, 'rgba(238,241,244,.16)', 2, 'butt') } }

CINE.K = {icon, rows, title, tag, road, cue, cam, chars, burst, ring, streaks, sweep, sparks,INK, PAPER, SUB, MUTE, SKY, DUST, HAIR, AQ, pad, mix, bg, stars, dust, haze, skyline, reveal, rule, scale, marker, puff, ico, header, wipe, post};
})();
