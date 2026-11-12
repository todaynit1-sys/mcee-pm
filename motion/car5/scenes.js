// 2편 · 배출가스 5등급 차량 운행제한  (제8차 ’26.12~’27.3)
(() => {
const {W, H, c, clamp, lerp, eio, eout, box, line, circ, txt, mono, alpha, tick, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K;

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  // 1 운행제한 대상 — 매연을 뿜는 5등급 차량이 들어온다
  (u, T, now) => {
    const k = eio((u - .3) / 2); K.bg(1 - k * .6); K.stars(now, 1 - k); K.dust(now, k * .6, 140, 560); K.haze(k * .6, 300); K.road(now, 160);
    const tx = lerp(1420, 900, eout((u - .2) / 1.5)); K.puff(tx + 138, 512, now, 1, 10); K.puff(tx + 160, 520, now + .4, .8, 8); K.icon('truck', tx, 494, 2.2, DUST, true);
    K.cue(u, .45, 'low'); K.title('저공해조치 미이행', '배출가스', '5등급 차량', u, {col2: DUST});
    alpha(eout((u - 1.5) / .4), () => txt('배출가스 등급', 64, 494, 17, MUTE, 'left', 500));
    for (let i = 0; i < 5; i++) { const t = 1.6 + i * .16, a = eout((u - t) / .3); K.cue(u, t, i === 4 ? 'low' : 'tick'); if (a <= 0) continue;
      alpha(a, () => { box(64 + i * 84, 510, 76, 10, i === 4 ? DUST : '#33405a', 3); mono(String(i + 1), 64 + i * 84, 546, i === 4 ? 22 : 16, i === 4 ? DUST : MUTE, 'left', 600) }) }
  },
  // 2 시행 지역·시간 — 24시간 다이얼에서 06~21시가 켜진다
  (u, T, now) => {
    K.bg(.8); K.stars(now, .8);
    const cx = 270, cy = 366, R = 150, ang = h => (-90 + h * 15) * Math.PI / 180, p = eio((u - .8) / 1.3);
    c.beginPath(); c.arc(cx, cy, R, 0, 6.2832); c.strokeStyle = '#232d40'; c.lineWidth = 18; c.stroke();
    for (const h of [0, 6, 12, 18]) mono(String(h), cx + Math.cos(ang(h)) * (R + 36), cy + Math.sin(ang(h)) * (R + 36) + 6, 16, MUTE, 'center', 600);
    K.cue(u, .8, 'rise'); K.cue(u, 2.1, 'chime');
    if (p > 0) { c.beginPath(); c.arc(cx, cy, R, ang(6), ang(6 + 15 * p)); c.strokeStyle = SKY; c.lineWidth = 26; c.stroke() }
    K.ring(cx, cy, (u - 2.1) / .8, SKY, 150, 210);
    alpha(eout((u - .4) / .4), () => { txt('평일', cx, cy - 30, 26, SUB, 'center', 500); mono('06–21', cx, cy + 30, 52, PAPER, 'center', 700); txt('오전 6시 ~ 오후 9시', cx, cy + 66, 16, SUB, 'center', 500) });
    K.chars('시행 지역', 580, 206, 30, .3, u, {col: SUB, weight: 500});
    K.rows(['수도권', '6대 특·광역시'], 580, 290, 118, 1.2, u, {size: 48, w: 556, rg: 74, step: .5});
    alpha(eout((u - 1.5) / .4), () => txt('서울 · 인천 · 경기', 624, 336, 22, SUB, 'left', 500));
    alpha(eout((u - 2) / .4), () => txt('부산 · 대구 · 광주 · 대전 · 울산 · 세종', 624, 454, 22, SUB, 'left', 500));
    K.reveal('토·일요일과 공휴일은 제외', 580, 540, 22, 2.6, u, {col: SKY, weight: 500});
  },
  // 3 단속과 과태료 — 무인단속카메라 아래를 지나는 순간
  (u, T, now) => {
    K.bg(.75); K.dust(now, .25, 140, 560); K.road(now, 0);
    line(110, 572, 110, 196, '#3a4760', 6, 'butt'); line(110, 200, 600, 200, '#3a4760', 6, 'butt');
    box(330, 206, 64, 36, '#141b2a', 6, PAPER, 2); circ(362, 246, 10, INK, PAPER, 2); circ(380, 216, 3, u > 1.2 && Math.sin(now * 10) > 0 ? '#e0564f' : '#4a2020');
    const tx = lerp(-220, 380, eout((u - .2) / 1.5)); K.puff(tx - 138, 512, now, 1, 8); K.icon('truck', tx, 494, 2.1, DUST);
    if (u > 1.1) alpha(.5 + .3 * Math.sin(now * 8), () => { c.beginPath(); c.moveTo(362, 256); c.lineTo(tx - 130, 440); c.lineTo(tx + 130, 440); c.closePath(); c.fillStyle = 'rgba(108,196,255,.14)'; c.fill() });
    K.cue(u, 1.7, 'tick'); const f = u > 1.7 ? clamp(1 - (u - 1.7) / .25) : 0; if (f > 0) alpha(f * .5, () => { c.fillStyle = '#fff'; c.fillRect(0, 0, W, H) });
    K.ring(362, 246, (u - 1.7) / .6, SKY, 10, 130);
    alpha(eout((u - 1.9) / .3), () => K.tag('5등급 차량 확인', tx - 96, 404, SKY, 20));
    K.chars('무인단속카메라 단속', 680, 226, 34, .8, u, {col: SUB, weight: 500});
    K.chars('위반 시 1일', 680, 312, 44, 2, u);
    K.cue(u, 2.4, 'chime'); K.burst(860, 420, (u - 2.4) / .7, SKY, 20, 150, 240);
    alpha(eout((u - 2.4) / .4), () => { mono('10', 672, 480, 170, SKY, 'left', 700); txt('만 원', 890, 478, 60, PAPER, 'left', 700) });
    K.rule(680, 510, 456, (u - 2.7) / .5); K.reveal('과태료 부과', 680, 550, 22, 2.8, u, {col: SUB, weight: 500});
  },
  // 4 단속 제외 차량
  (u, T, now) => {
    K.bg(.88); K.stars(now, .6);
    K.chars('운행제한 단속에서 제외되는 차량', 64, 204, 32, .2, u, {col: SUB, weight: 500});
    [['filter', '저공해조치 차량', '매연저감장치 부착 등'], ['siren', '긴급자동차', ''], ['car', '장애인 차량', ''], ['shield', '국가유공자 차량', '']].forEach(([ic, name, sub], i) => { const x = 64 + i * 272, t = .6 + i * .25, a = eout((u - t) / .5), tk = t + .9; K.cue(u, t, 'pop'); K.cue(u, tk, 'tick'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 32); box(x, 244, 248, 304, 'rgba(17,20,29,.72)', 14, HAIR, 1);
        K.icon(ic, x + 124, 356, 1.45, PAPER); tick(x + 210, 280, (u - tk) / .35, SKY, 1); K.ring(x + 210, 280, (u - tk) / .6, SKY, 6, 44);
        txt(name, x + 124, 472, 25, PAPER, 'center', 700); if (sub) txt(sub, x + 124, 506, 17, SUB, 'center', 500); c.restore() }) });
    K.sweep((u - 2.6) / 1.1);
  },
  // 5 등급 확인·저공해조치
  (u, T, now) => {
    K.bg(1); K.stars(now, 1); K.sparks(now, .5); K.road(now, 160);
    K.title('내 차 등급 확인', '자동차 배출가스', '등급제 누리집', u, {size: 64});
    const cx2 = lerp(-160, 300, eout((u - 1) / 1.6)); K.icon('car', cx2, 520, 1.5, PAPER);
    alpha(eout((u - 1.5) / .4), () => txt('저공해조치', 700, 214, 22, MUTE, 'left', 500));
    [['filter', '매연저감장치(DPF) 부착'], ['car', '조기폐차']].forEach(([ic, s], i) => { const t = 1.7 + i * .35, a = eout((u - t) / .45), y = 240 + i * 150; K.cue(u, t, 'pop'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate((1 - a) * 48, 0); box(700, y, 436, 126, 'rgba(17,20,29,.72)', 14, HAIR, 1); K.icon(ic, 782, y + 64, 1, SKY); txt(s, 866, y + 73, 26, PAPER, 'left', 700); c.restore() }) });
    K.cue(u, 2.7, 'chime'); K.sweep((u - 2.7) / 1.1);
  }
]});
})();
