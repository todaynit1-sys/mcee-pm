// 5편 · 미세먼지와 초미세먼지
(() => {
const {W, H, c, clamp, lerp, eio, eout, back, hash, box, line, circ, txt, mono, alpha, arrow, dots, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR, AQ} = K;

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  // 1 입자 크기 — 머리카락 단면과 나란히 놓고 본다 (1㎛ = 5px)
  (u, T, now) => {
    K.bg(.8); K.stars(now, .6);
    K.chars('입자 지름', 64, 210, 30, .2, u, {col: SUB, weight: 500});
    alpha(eout((u - 1.2) / .4), () => { mono('PM-10', 60, 296, 64, PAPER, 'left', 700); txt('미세먼지 · 10㎛ 이하', 64, 334, 22, SUB, 'left', 500) });
    alpha(eout((u - 1.9) / .4), () => { mono('PM-2.5', 60, 430, 64, DUST, 'left', 700); txt('초미세먼지 · 2.5㎛ 이하', 64, 468, 22, SUB, 'left', 500) });
    K.reveal('초미세먼지는 머리카락 굵기의 약 1/20 ~ 1/30', 64, 546, 22, 2.7, u, {col: SKY, weight: 500});
    const hk = back((u - .4) / .6); K.cue(u, .4, 'low');
    if (hk > 0) { c.save(); c.beginPath(); c.arc(800, 370, 150 * hk, 0, 6.2832); c.fillStyle = 'rgba(238,241,244,.06)'; c.fill(); c.strokeStyle = SUB; c.lineWidth = 2.5; c.stroke(); c.clip();
      for (let x = 620; x < 1000; x += 18) line(x, 200, x + 80, 540, 'rgba(238,241,244,.07)', 1.5); c.restore();
      alpha(clamp(hk), () => { txt('머리카락 단면', 800, 366, 20, PAPER, 'center', 700); mono('50~70㎛', 800, 396, 17, SUB, 'center', 500) }) }
    const p1 = back((u - 1.2) / .45); K.cue(u, 1.2, 'pop'); if (p1 > 0) { circ(1050, 300, 25 * p1, PAPER); K.ring(1050, 300, (u - 1.2) / .6, PAPER, 25, 70); alpha(clamp(p1), () => mono('PM-10', 1090, 306, 16, PAPER, 'left', 600)) }
    const p2 = back((u - 1.9) / .45); K.cue(u, 1.9, 'pop'); if (p2 > 0) { circ(1050, 420, 6.25 * p2, DUST); K.ring(1050, 420, (u - 1.9) / .6, DUST, 8, 60); alpha(clamp(p2), () => mono('PM-2.5', 1090, 426, 16, DUST, 'left', 600)) }
  },
  // 2 건강 영향 — 코와 기관지를 지나 폐로
  (u, T, now) => {
    K.bg(.5); K.dust(now, .45, 140, 590); K.haze(.35, 300);
    K.cue(u, .45, 'low'); K.title('입자가 작아', '폐 깊숙이', '침투', u, {col2: DUST});
    K.reveal('어린이·어르신·호흡기 질환자는 더 주의', 64, 548, 22, 2.6, u, {col: SKY, weight: 500});
    alpha(eout((u - .5) / .5), () => { circ(900, 204, 36, null, PAPER, 2.5); line(866, 210, 852, 216, PAPER, 2.5); line(900, 240, 900, 320, PAPER, 2.5); K.icon('lungs', 900, 436, 2.5, PAPER) });
    if (u > 1.1) { dots([[690, 214], [852, 214], [896, 236], [900, 330], [862, 440], [822, 500]], now, DUST, 7, 4, .32); dots([[690, 226], [852, 218], [900, 244], [900, 330], [938, 440], [978, 500]], now + .5, DUST, 7, 4, .32) }
    K.cue(u, 2.1, 'low'); for (const d of [-1, 1]) K.ring(900 + d * 78, 470, ((u - 2.1) % 1.3) / 1.3 * (u > 2.1 ? 1 : 0), DUST, 10, 70);
  },
  // 3 주요 발생원
  (u, T, now) => {
    K.bg(.55); K.dust(now, .3, 140, 590);
    K.chars('어디에서 발생하나', 64, 204, 32, .2, u, {col: SUB, weight: 500});
    [['truck', '자동차 배출가스'], ['factory', '사업장'], ['plant', '발전소'], ['flame', '난방·불법소각'], ['crane', '날림먼지']].forEach(([ic, s], i) => { const x = 64 + i * 218, t = .5 + i * .2, a = eout((u - t) / .5); K.cue(u, t, 'pop'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 30); K.puff(x + 100 + (ic === 'truck' ? -62 : ic === 'plant' ? 30 : ic === 'factory' ? 38 : 0), ic === 'truck' ? 356 : 286, now + i * .3, .9, 7); K.icon(ic, x + 100, 330, 1.15, PAPER); txt(s, x + 100, 420, 21, PAPER, 'center', 700); c.restore() }) });
    const b = eout((u - 2) / .5); K.cue(u, 2, 'chime');
    alpha(b, () => { box(64, 462, 1072, 96, 'rgba(10,15,26,.78)', 14, HAIR, 1); txt('2차 생성', 92, 520, 28, DUST, 'left', 700); txt('배출된 가스 상태 물질이 대기 중에서 초미세먼지로 변환', 232, 518, 22, PAPER, 'left', 500);
      dots([[820, 510], [1100, 510]], now, DUST, 5, 3.5, .4) });
  },
  // 4 예보 등급 — 네 등급
  (u, T, now) => {
    K.bg(.88); K.stars(now, .6);
    K.chars('초미세먼지(PM-2.5) 예보 등급', 64, 204, 32, .2, u, {col: SUB, weight: 500});
    alpha(eout((u - .3) / .4), () => txt('단위 ㎍/㎥', 1136, 204, 17, MUTE, 'right', 500));
    const R = ['0 ~ 15', '16 ~ 35', '36 ~ 75', '76 이상'];
    AQ.forEach(([name, , col], i) => { const x = 64 + i * 272, t = .6 + i * .28, a = eout((u - t) / .5); K.cue(u, t, i === 3 ? 'low' : 'pop'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 32); box(x, 236, 248, 210, 'rgba(17,20,29,.72)', 14, HAIR, 1); box(x + 24, 262, 200 * eout((u - t) / .7), 10, col, 3);
        txt(name, x + 24, 342, 42, PAPER, 'left', 700); mono(R[i], x + 24, 404, 30, col, 'left', 600); c.restore() }) });
    [['주의보', '75㎍/㎥ 이상 2시간 지속'], ['경보', '150㎍/㎥ 이상 2시간 지속']].forEach(([a, b2], i) => { const t = 2.3 + i * .3, y = 502 + i * 46; K.rule(64, y - 30, 1072, (u - t) / .5); K.reveal(a, 64, y, 22, t, u); K.reveal(b2, 180, y, 22, t + .05, u, {col: SUB, weight: 500}) });
  },
  // 5 대기질 정보 — 에어코리아
  (u, T, now) => {
    K.bg(1); K.stars(now, 1); K.cam(u, () => K.skyline(now, 1), .05, W / 2, H); K.sparks(now, .6);
    K.title('실시간 대기질과 예보', '에어코리아', '에서 확인', u);
    const a = eout((u - 1) / .6); K.cue(u, 1, 'pop');
    alpha(a, () => { c.save(); c.translate(0, (1 - a) * 40); box(848, 196, 184, 328, '#0d1422', 26, PAPER, 2.5); line(922, 506, 958, 506, PAPER, 2.5);
      txt('초미세먼지 예보 등급', 868, 240, 14, SUB, 'left', 500);
      AQ.forEach(([name, , col], i) => { const k = eout((u - 1.5 - i * .2) / .4); K.cue(u, 1.5 + i * .2, 'tick'); alpha(k, () => { box(868, 262 + i * 56, 144, 44, 'rgba(238,241,244,.05)', 8); circ(890, 284 + i * 56, 7, col); txt(name, 908, 290 + i * 56, 17, PAPER, 'left', 700) }) });
      c.restore() });
    K.cue(u, 2.6, 'chime'); K.burst(940, 360, (u - 2.6) / .7, SKY, 20, 190, 270); K.sweep((u - 2.6) / 1.1);
  }
]});
})();
