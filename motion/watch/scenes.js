// 첨단감시장비 활용 불법배출 감시 — AI 분석 → 이동측정차량 → 드론 → 현장 점검
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, arrow, tick, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K;

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  // 1 산업단지 감시
  (u, T, now) => {
    const k = eio((u - .3) / 2); K.bg(1 - k * .55); K.stars(now, 1 - k); K.dust(now, .15 + k * .5, 140, 590); K.haze(k * .5, 300);
    K.cue(u, .45, 'low'); K.title('사업장이 밀집한', '산업단지', '불법배출 감시', u);
    [[760, 'factory', 1.5], [930, 'plant', 1.7], [1090, 'factory', 1.3]].forEach(([x, ic, s], i) => { const a = eout((u - .6 - i * .2) / .5); if (a <= 0) return;
      alpha(a, () => { K.puff(x + (ic === 'plant' ? 30 : 38) * s, 500 - 46 * s, now + i * .4, .9, 9); K.icon(ic, x, 500, s, DUST) }) });
    line(660, 500 + 62, 1160, 500 + 62, HAIR, 1, 'butt');
    for (let j = 0; j < 2; j++) if (u > 2 + j * .5) K.ring(930, 440, ((u - 2 - j * .5) % 1.4) / 1.4, SKY, 120, 300, 2);
    K.cue(u, 2, 'rise');
  },
  // 2 AI 분석 — 측정망 자료에서 점검할 지역을 고른다
  (u, T, now) => {
    K.bg(.8); K.stars(now, .5);
    K.chars('도시대기측정망 자료 분석', 64, 226, 32, .3, u, {col: SUB, weight: 500}); K.chars('AI로', 64, 322, 84, .55, u); K.chars('점검 지역 선정', 64, 416, 72, .9, u, {col: SKY});
    const a = eout((u - .5) / .5); if (a <= 0) return;
    alpha(a, () => { box(680, 170, 456, 400, 'rgba(10,15,26,.82)', 16, HAIR, 1);
      for (let i = 1; i < 6; i++) { line(680 + i * 76, 170, 680 + i * 76, 570, 'rgba(238,241,244,.06)', 1, 'butt'); if (i < 5) line(680, 170 + i * 80, 1136, 170 + i * 80, 'rgba(238,241,244,.06)', 1, 'butt') }
      const hot = eout((u - 2) / .5);
      for (let i = 0; i < 14; i++) { const x = 716 + hash(i * 3.3) * 384, y = 204 + hash(i * 5.1 + 2) * 330, near = Math.hypot(x - 946, y - 370) < 90, t = .9 + i * .07, k = eout((u - t) / .3); if (k <= 0) continue;
        circ(x, y, 5 * k, near ? K.mix('#eef1f4', '#c9a36b', hot) : PAPER); K.ring(x, y, ((now * .6 + hash(i)) % 1), near && hot > .5 ? DUST : SKY, 5, 22, 1.5) }
      K.cue(u, .9, 'tick'); K.cue(u, 2, 'chime');
      if (hot > 0) { alpha(hot, () => { box(870, 290, 152, 160, 'rgba(201,163,107,.12)', 10, DUST, 2); K.tag('점검 대상 지역', 870, 276, DUST, 17) }); K.ring(946, 370, (u - 2) / .8, DUST, 60, 180) } });
  },
  // 3 이동측정차량 — 달리면서 실시간 측정, 고농도 구간을 찾는다
  (u, T, now) => {
    K.bg(.7); K.dust(now, .3, 140, 560); K.road(now, 200);
    K.chars('산업단지를 주행하며 실시간 측정', 64, 226, 32, .3, u, {col: SUB, weight: 500}); K.chars('이동측정차량', 64, 322, 80, .55, u);
    const vx = lerp(-200, 330, eout((u - .2) / 1.4)); K.icon('truck', vx, 494, 2, PAPER); line(vx - 70, 442, vx - 70, 396, PAPER, 2.5); line(vx - 84, 396, vx - 56, 396, PAPER, 2.5);
    for (let j = 0; j < 2; j++) K.ring(vx - 70, 392, ((now * .8 + j * .5) % 1), SKY, 6, 46, 2);
    const a = eout((u - .8) / .5), p = clamp((u - 1) / 1.8); if (a <= 0) return;
    alpha(a, () => { box(680, 170, 456, 290, 'rgba(10,15,26,.82)', 16, HAIR, 1); txt('실시간 농도', 704, 208, 17, SUB, 'left', 500);
      for (let i = 1; i < 4; i++) line(704, 220 + i * 52, 1112, 220 + i * 52, 'rgba(238,241,244,.06)', 1, 'butt');
      const f = q => .14 + .04 * Math.sin(q * 38) + .03 * Math.sin(q * 91) + .7 * Math.exp(-Math.pow((q - .68) / .07, 2)), N = 120;
      c.beginPath(); for (let i = 0; i <= N * p; i++) { const q = i / N, x = 704 + 408 * q, y = 430 - 190 * f(q); i ? c.lineTo(x, y) : c.moveTo(x, y) } c.strokeStyle = SKY; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke();
      const hx = 704 + 408 * Math.min(p, 1), hy = 430 - 190 * f(Math.min(p, 1)); circ(hx, hy, 5, PAPER);
      if (p > .68) { const k = eout((u - 2.25) / .4); K.cue(u, 2.25, 'chime'); alpha(k, () => { circ(704 + 408 * .68, 430 - 190 * f(.68), 9, null, DUST, 2.5); K.tag('고농도 구간', 704 + 408 * .68 - 150, 262, DUST, 17) }); K.ring(704 + 408 * .68, 430 - 190 * f(.68), (u - 2.25) / .7, DUST, 10, 90) } });
    K.cue(u, 1, 'rise');
  },
  // 4 드론 — 사업장 상공에서 측정
  (u, T, now) => {
    K.bg(.62); K.dust(now, .3, 140, 590);
    K.chars('이동측정차량과 함께', 64, 226, 32, .3, u, {col: SUB, weight: 500}); K.chars('드론으로', 64, 322, 84, .55, u); K.chars('상공에서 측정', 64, 416, 72, .9, u, {col: SKY});
    alpha(eout((u - .5) / .5), () => { K.puff(952, 372, now, .9, 10); K.icon('plant', 900, 480, 1.9, DUST); line(700, 556, 1140, 556, HAIR, 1, 'butt') });
    const dx = lerp(1260, 950, eout((u - .8) / 1.3)) + Math.sin(now * 1.3) * 10, dy = 232 + Math.sin(now * 2) * 7; K.cue(u, .8, 'rise');
    if (u > 1.9) alpha(.4 + .25 * Math.sin(now * 7), () => { c.beginPath(); c.moveTo(dx, dy + 30); c.lineTo(dx - 70, 380); c.lineTo(dx + 70, 380); c.closePath(); c.fillStyle = 'rgba(108,196,255,.2)'; c.fill() });
    K.icon('drone', dx, dy, 1.9, PAPER); K.cue(u, 2.1, 'chime'); K.ring(dx, 360, (u - 2.1) / .8, SKY, 20, 130);
  },
  // 5 현장 점검 — 선별 → 점검 → 개선
  (u, T, now) => {
    K.bg(.96); K.stars(now, .8); K.sparks(now, .5);
    K.chars('측정 결과는 현장 점검으로 이어집니다', 64, 204, 32, .2, u, {col: SUB, weight: 500});
    [['factory', '의심 사업장 선별', DUST], ['clip', '점검반 현장 점검', PAPER], ['shield', '개선 조치', SKY]].forEach(([ic, s, col], i) => { const x = 64 + i * 368, t = .6 + i * .5, a = eout((u - t) / .5); K.cue(u, t, 'pop'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 32); box(x, 244, 336, 300, 'rgba(17,20,29,.72)', 14, HAIR, 1); mono(K.pad(i + 1), x + 24, 284, 16, SKY, 'left', 600);
        K.icon(ic, x + 168, 372, 1.5, col); if (i === 0) K.ring(x + 168, 372, ((now * .7) % 1), DUST, 40, 110, 2); if (i === 2) tick(x + 168, 374, (u - t - .5) / .4, SKY, 1.5);
        txt(s, x + 168, 492, 26, PAPER, 'center', 700); c.restore() });
      if (i < 2) alpha(eout((u - t - .35) / .3), () => arrow(x + 344, 394, x + 360, 394, SKY, 3, 10, 1)) });
    K.cue(u, 2.6, 'chime'); K.sweep((u - 2.6) / 1.1);
  }
]});
})();
