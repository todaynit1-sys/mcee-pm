// 4편 · 고농도 미세먼지 7가지 대응요령
// 장면 다섯 개에 일곱 가지를 나눠 담는다: ①③ / ② / ④ / ⑤ / ⑥⑦. 하늘은 장면이 갈수록 맑아진다.
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, arrow, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K;

// 왼쪽: 큰 번호 + 제목 + 설명 줄, 오른쪽: 그림(art)
const tip = (num, title, list, clear, art) => (u, T, now) => {
  K.bg(clear); K.stars(now, clear); K.dust(now, (1 - clear) * .85 + .05, 140, 590); K.haze((1 - clear) * .7, 280);
  K.cue(u, .2, 'low'); alpha(eout((u - .2) / .4), () => mono(num, 58, 300, 150, SKY, 'left', 700));
  K.chars(title, 64, 392, 54, .5, u);
  const n = list.length, dy = n > 3 ? 40 : 46;
  K.rows(list, 64, n > 3 ? 448 : 460, dy, 1.2, u, {size: n > 3 ? 21 : 23, w: 600, weight: 500, rg: 14, step: .28, ic: MUTE});
  art(u, now);
};

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  tip('01·03', '외출은 가급적 자제', ['야외 모임·캠프·스포츠 등 실외활동 최소화', '도로변·공사장 등 대기오염이 심한 곳 피하기', '격한 활동 줄이기'], .22, (u, now) => {
    K.streaks(now, .7, 180, 540); alpha(eout((u - .6) / .5), () => K.icon('house', 920, 350, 2.7, PAPER));
    const k = eout((u - 1.6) / .6); K.cue(u, 1.6, 'chime'); if (k > 0) { c.beginPath(); c.arc(920, 350, 196, 0, 6.2832 * k); c.setLineDash([10, 10]); c.lineDashOffset = -now * 16; c.strokeStyle = SKY; c.lineWidth = 3; c.stroke(); c.setLineDash([]) }
    K.ring(920, 350, (u - 1.6) / .8, SKY, 150, 260);
  }),
  tip('02', '보건용 마스크 착용', ['식약처 인증 보건용 마스크', '호흡이 불편하면 벗고 전문가와 상담'], .4, (u, now) => {
    alpha(eout((u - .6) / .5), () => K.icon('mask', 940, 330, 2.9, PAPER));
    for (let i = 0; i < 16; i++) { const q = (now * .5 + hash(i)) % 1; circ(660 + q * 150, 250 + hash(i + 5) * 160 + Math.sin(now + i) * 6, 2 + hash(i + 2) * 3, `rgba(201,163,107,${(.8 * (1 - q)).toFixed(2)})`) }
    ['KF80', 'KF94', 'KF99'].forEach((s, i) => { const t = 1.5 + i * .25; K.cue(u, t, 'pop'); alpha(eout((u - t) / .35), () => K.tag(s, 790 + i * 112, 500 + (1 - eout((u - t) / .35)) * 16, SKY, 22)) });
  }),
  tip('04', '외출 후 깨끗이 씻기', ['손·발·눈·코를 흐르는 물에 씻기', '양치하기'], .6, (u, now) => {
    alpha(eout((u - .6) / .5), () => K.icon('drop', 920, 320, 3, SKY));
    for (let i = 0; i < 9; i++) { const q = (now * .7 + i / 9) % 1, x = 760 + hash(i) * 320; alpha(1 - q, () => { c.save(); c.translate(x, 200 + q * 320); c.scale(.3, .3); K.ico.drop(0, 0, SKY); c.restore() }) }
    for (let j = 0; j < 3; j++) { const y = 520 + j * 14; c.beginPath(); for (let x = 760; x <= 1090; x += 10) { const yy = y + Math.sin(x / 26 + now * 2 + j) * 4; x === 760 ? c.moveTo(x, yy) : c.lineTo(x, yy) } c.strokeStyle = `rgba(108,196,255,${.5 - j * .14})`; c.lineWidth = 2; c.stroke() }
    K.cue(u, 1.6, 'chime'); K.ring(920, 330, (u - 1.6) / .8, SKY, 110, 220);
  }),
  tip('05', '물과 과일·야채 섭취', ['물을 충분히 마시기', '비타민C가 풍부한 과일·야채 섭취'], .8, (u, now) => {
    const lv = eio((u - 1) / 1.4); alpha(eout((u - .6) / .5), () => { c.save(); c.translate(830, 340); c.scale(2.4, 2.4); c.beginPath(); c.moveTo(-28, -38); c.lineTo(-20, 38); c.lineTo(20, 38); c.lineTo(28, -38); c.closePath(); c.save(); c.clip(); c.fillStyle = 'rgba(108,196,255,.35)'; c.fillRect(-30, 38 - 62 * lv, 60, 62 * lv); c.restore(); K.ico.cup(0, 0, PAPER); c.restore() });
    K.cue(u, 1, 'rise'); alpha(eout((u - 1.2) / .5), () => K.icon('apple', 1030, 372, 2, PAPER)); K.cue(u, 2.3, 'chime'); K.burst(1030, 360, (u - 2.3) / .7, SKY, 16, 110, 170);
  }),
  tip('06·07', '실내 공기질 관리', ['조리할 때 주방 후드 가동과 환기', '실내 물청소', '공기청정기 필터 점검', '대기오염 유발 행위 자제 · 대중교통 이용'], 1, (u, now) => {
    K.sparks(now, .5); alpha(eout((u - .6) / .5), () => K.icon('window', 930, 340, 2.7, PAPER));
    if (u > 1.2) for (let j = 0; j < 3; j++) { const q = (now * .5 + j * .33) % 1; alpha(1 - Math.abs(q - .5) * 1.7, () => arrow(770 + q * 220, 290 + j * 50, 860 + q * 220, 290 + j * 50, SKY, 3, 11, 1)) }
    K.cue(u, 2.6, 'chime'); K.sweep((u - 2.6) / 1.1);
  }),
]});
})();
