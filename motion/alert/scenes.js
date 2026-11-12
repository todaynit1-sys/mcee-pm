// 3편 · 고농도 미세먼지 비상저감조치
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K, RED = '#e0564f';

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  // 1 비상저감조치 — 하늘이 짙어지고 경보가 울린다
  (u, T, now) => {
    const k = eio((u - .2) / 2.2); K.bg(1 - k * .9); K.stars(now, 1 - k); K.cam(u, () => K.skyline(now, 1 - k * .9), .06, W / 2, H);
    K.streaks(now, k * .8, 150, 560); K.dust(now, .2 + k * .8, 140, 600); K.haze(k, 220);
    K.cue(u, .45, 'low'); K.cue(u, 1.2, 'rise'); K.cue(u, 1.9, 'low');
    K.title('고농도 초미세먼지', '비상저감조치', '발령', u, {col2: RED});
    alpha(eout((u - 1.6) / .4), () => K.icon('siren', 940, 330, 2.6, RED));
    for (let j = 0; j < 3; j++) if (u > 1.9 + j * .4) K.ring(940, 310, ((u - 1.9 - j * .4) % 1.2) / 1.2, RED, 70, 190, 2.5);
    K.reveal('단기간에 배출을 줄이는 조치', 940, 530, 22, 2.4, u, {al: 'center', col: PAPER, weight: 500});
  },
  // 2 발령 기준 — 세 가지 중 하나
  (u, T, now) => {
    K.bg(.45); K.dust(now, .45, 140, 590); K.haze(.4, 300);
    K.chars('세 가지 기준 중 하나에 해당하면 발령', 64, 200, 30, .2, u, {col: SUB, weight: 500});
    [['50 초과', '0~16시 평균', '50 초과', '예보'], ['주의보·경보', '발령', '50 초과', '예보'], ['', '', '75 초과', '예보']].forEach(([a1, b1, a2, b2], i) => { const x = 64 + i * 368, t = .6 + i * .4, a = eout((u - t) / .5); K.cue(u, t, 'pop'); K.cue(u, t + .5, 'tick'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 32); box(x, 232, 336, 300, 'rgba(10,15,26,.78)', 14, HAIR, 1); mono(K.pad(i + 1), x + 24, 270, 16, RED, 'left', 600);
        txt('당일', x + 24, 312, 17, MUTE, 'left', 500); if (a1) { txt(a1, x + 24, 356, 36, PAPER, 'left', 700); txt(b1, x + 24, 384, 16, SUB, 'left', 500) } else line(x + 24, 344, x + 60, 344, MUTE, 2);
        line(x + 24, 404, x + 312, 404, HAIR, 1, 'butt');
        const k2 = eout((u - t - .5) / .4); alpha(k2, () => { txt('다음 날', x + 24, 436, 17, MUTE, 'left', 500); txt(a2, x + 24, 482, 38, DUST, 'left', 700); txt(b2, x + 24, 510, 16, SUB, 'left', 500) });
        c.restore() }) });
    alpha(eout((u - .4) / .4), () => txt('초미세먼지(PM-2.5) · 단위 ㎍/㎥', 1136, 200, 17, MUTE, 'right', 500));
  },
  // 3 차량·사업장 — 배출이 차례로 멎는다
  (u, T, now) => {
    K.bg(.55); K.dust(now, .4 * (1 - eio((u - 1.2) / 2)), 140, 590);
    const col = [[64, '차량', [['truck', 150]], ['배출가스 5등급 차량 운행제한', '행정·공공기관 차량 2부제']], [640, '사업장·발전', [['factory', 726], ['plant', 906]], ['공공사업장 가동시간 단축', '석탄발전 상한제약']]];
    col.forEach(([x, name, ics, ls], i) => { const t = .3 + i * .3, a = eout((u - t) / .5), ts = 1.5 + i * .4, stop = eout((u - ts) / .7); K.cue(u, t, 'pop'); K.cue(u, ts, 'tick'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 32); line(x, 168, x + 496, 168, HAIR, 1, 'butt'); line(x, 168, x + 496 * stop, 168, SKY, 2, 'butt');
        mono(K.pad(i + 1), x, 204, 15, SKY, 'left', 600); txt(name, x, 256, 40, PAPER, 'left', 700);
        ics.forEach(([ic, ix]) => { K.puff(ix + (ic === 'truck' ? -62 : ic === 'plant' ? 30 : 38), ic === 'truck' ? 378 : 300, now, 1 - stop, 8); K.icon(ic, ix, 350, 1.25, K.mix('#c9a36b', '#eef1f4', stop)); K.ring(ix, 350, (u - ts) / .7, SKY, 30, 120) });
        ls.forEach((s, j) => { txt(s, x, 470 + j * 44, 25, j === 0 ? PAPER : SUB, 'left', j === 0 ? 700 : 500); });
        c.restore() }) });
    line(600, 168, 600, 540, HAIR, 1, 'butt'); K.sweep((u - 2.8) / 1);
  },
  // 4 공사장·도로
  (u, T, now) => {
    K.bg(.62); K.dust(now, .3, 140, 560); K.road(now, 0);
    alpha(eout((u - .2) / .5), () => { mono('01', 64, 204, 15, SKY, 'left', 600); txt('공사장', 64, 256, 40, PAPER, 'left', 700); K.icon('crane', 200, 380, 2, PAPER) });
    K.cue(u, .2, 'pop'); K.reveal('공사시간 조정·변경', 64, 528, 30, 1, u);
    line(600, 168, 600, 540, HAIR, 1, 'butt');
    alpha(eout((u - .6) / .5), () => { mono('02', 640, 204, 15, SKY, 'left', 600); txt('도로', 640, 256, 40, PAPER, 'left', 700) }); K.cue(u, .6, 'pop');
    K.chars('도로 청소차 운영', 640, 318, 30, 1.3, u, {col: SUB, weight: 500});
    K.cue(u, 1.9, 'chime'); K.burst(860, 420, (u - 1.9) / .7, SKY, 20, 130, 220);
    alpha(eout((u - 1.9) / .4), () => { txt('1일', 640, 470, 56, PAPER, 'left', 700); mono('3', 756, 486, 190, SKY, 'left', 700); txt('회 이상', 884, 470, 56, PAPER, 'left', 700) });
    const sx = ((now * 150) % 1500) - 150; K.icon('truck', sx, 540, .85, SUB); for (let j = 0; j < 8; j++) { const q = (now * 1.5 + j / 8) % 1; circ(sx - 60 - q * 40, 556 + q * 12, 2 * (1 - q) + 1, `rgba(108,196,255,${(.7 * (1 - q)).toFixed(2)})`) }
  },
  // 5 취약계층 보호
  (u, T, now) => {
    K.bg(.92); K.stars(now, .9); K.sparks(now, .4);
    K.title('건강 보호 조치', '취약계층', '보호', u);
    alpha(eout((u - 1.4) / .5), () => { K.icon('school', 116, 520, .95, SUB); K.icon('mask', 256, 524, .95, SUB) });
    K.rows(['학교 야외수업 금지', '취약계층 이용시설 마스크 지원', '탄력 근무 권고'], 640, 262, 96, 1.2, u, {size: 30, w: 496, rg: 30});
    K.cue(u, 2.8, 'chime'); K.reveal('실시간 대기질 정보는 에어코리아', 640, 548, 20, 2.8, u, {col: SKY, weight: 500});
  }
]});
})();
