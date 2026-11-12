// 1편 · 미세먼지 계절관리제  (제8차 ’26.12~’27.3. 세부 시행계획 발표 전이라 대책별 수치는 넣지 않음)
// 그리는 자리: 위 0~124 머리글, 가운데 140~590 장면, 아래 590~720 자막(자동)
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, arrow, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K;

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  // 1 고농도 시기 — 맑은 밤하늘에 먼지가 차오른다
  (u, T, now) => {
    const k = eio((u - .2) / 2.4);
    K.bg(1 - k * .85); K.stars(now, 1 - k); K.cam(u, () => K.skyline(now, 1 - k * .85), .06, W / 2, H);
    K.streaks(now, k * .9, 150, 560); K.dust(now, .1 + k * .9, 140, 600); K.haze(k, 260);
    K.cue(u, .45, 'low');
    K.chars('겨울철 · 봄철', 64, 232, 38, .3, u, {col: SUB, weight: 500});
    K.chars('초미세먼지', 64, 332, 88, .55, u); K.chars('고농도 시기', 64, 432, 88, .9, u, {col: DUST});
    ['서풍 계열 바람', '대기 정체', '난방 연료 사용 증가'].forEach((s, i) => { const t0 = 1.6 + i * .35, a = eout((u - t0) / .45), y = 196 + i * 124; K.cue(u, t0, 'tick'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate((1 - a) * 48, 0); box(752, y, 384, 104, 'rgba(10,15,26,.72)', 12, HAIR, 1);
        mono(K.pad(i + 1), 776, y + 40, 15, DUST, 'left', 600); txt(s, 776, y + 78, 26, PAPER, 'left', 700);
        const x = 1046, m = y + 52;
        if (i === 0) for (let j = 0; j < 3; j++) { const q = (now * .6 + j * .33) % 1; alpha(1 - Math.abs(q - .5) * 1.6, () => arrow(x - 30 + q * 30, m - 20 + j * 20, x + 20 + q * 30, m - 20 + j * 20, DUST, 2.5, 9, 1)) }
        if (i === 1) { c.beginPath(); c.arc(x + 20, m + 26, 44, Math.PI, 0); c.setLineDash([7, 7]); c.lineDashOffset = -now * 14; c.strokeStyle = DUST; c.lineWidth = 2.5; c.stroke(); c.setLineDash([]);
          for (let j = 0; j < 7; j++) circ(x - 10 + hash(j) * 60 + Math.sin(now + j) * 3, m + hash(j + 4) * 22, 2.4, DUST) }
        if (i === 2) { c.save(); c.translate(x + 20, m + 6); c.scale(.62, .62); K.ico.flame(0, 0, DUST); c.restore(); K.puff(x + 20, m - 24, now, .8, 5) }
        c.restore() }) });
  },
  // 2 시행 기간 — 열두 달 다이얼에서 12~3월이 켜진다
  (u, T, now) => {
    K.bg(.8); K.stars(now, .8); K.dust(now, .12, 140, 600);
    const cx = 900, cy = 366, R = 162, ON = [12, 1, 2, 3];
    for (let m = 1; m <= 12; m++) { const mid = (-90 + (m % 12) * 30) * Math.PI / 180, j = ON.indexOf(m), k = eout((u - .2 - m * .035) / .4), hk = j < 0 ? 0 : eout((u - 1.1 - j * .24) / .4); if (j >= 0) K.cue(u, 1.1 + j * .24, 'pop'); if (k <= 0) continue;
      alpha(k, () => { c.beginPath(); c.arc(cx, cy, R + 6 * hk, mid - .21, mid + .21); c.strokeStyle = K.mix('#232d40', SKY, hk); c.lineWidth = 20 + 16 * hk; c.lineCap = 'butt'; c.stroke();
        mono(String(m), cx + Math.cos(mid) * (R + 50), cy + Math.sin(mid) * (R + 50) + 6, 17, hk > .5 ? PAPER : MUTE, 'center', 600) }) }
    const ck = (u - 2.1) / .5; K.cue(u, 2.1, 'chime'); K.ring(cx, cy, (u - 2.1) / .8, SKY, 60, 150); K.burst(cx, cy, (u - 2.1) / .7, SKY, 18, 70, 130);
    alpha(eout(ck), () => { mono('4', cx - 22, cy + 38, 112, PAPER, 'center', 700); txt('개월', cx + 46, cy + 34, 26, SUB, 'left', 500) });
    K.chars('매년', 64, 214, 36, .3, u, {col: SUB, weight: 500});
    K.chars('12.1', 64, 318, 104, .5, u); K.chars('– 3.31', 64, 426, 104, .8, u, {col: SKY});
    [['제8차  2026. 12. 1. ~ 2027. 3. 31.', 492], ['평소보다 강화된 배출 저감·관리 조치', 544]].forEach(([s, y], i) => { const t0 = 1.7 + i * .3; K.rule(64, y - 32, 560, (u - t0) / .5); K.reveal(s, 64, y, 22, t0 + .1, u, {weight: 500}) });
  },
  // 3 부문별 저감 대책 — 네 부문의 배출이 차례로 멎는다
  (u, T, now) => {
    K.bg(.72); K.dust(now, .35 * (1 - eio((u - 1.2) / 2)), 140, 600);
    const S = [['발전', 'plant', '공공 석탄발전', '가동정지·상한제약'], ['수송', 'truck', '배출가스 5등급 차량', '운행제한'], ['산업', 'factory', '대형사업장', '배출량 추가 감축'], ['생활', 'flame', '영농폐기물 불법소각 방지', '도로 청소 강화']];
    S.forEach(([name, ic, l1, l2], i) => { const x = 64 + i * 272, t0 = .3 + i * .2, a = eout((u - t0) / .5), ts = 1.5 + i * .32, stop = eout((u - ts) / .6); K.cue(u, t0, 'pop'); K.cue(u, ts, 'tick'); if (a <= 0) return;
      alpha(a, () => { c.save(); c.translate(0, (1 - a) * 36);
        line(x, 168, x + 248, 168, HAIR, 1, 'butt'); line(x, 168, x + 248 * stop, 168, SKY, 2, 'butt');
        mono(K.pad(i + 1), x, 204, 15, SKY, 'left', 600); txt(name, x, 256, 40, PAPER, 'left', 700);
        const ix = x + 76, iy = 350; K.puff(ix + (ic === 'plant' ? 30 : ic === 'factory' ? 38 : ic === 'truck' ? -62 : 0), iy - (ic === 'truck' ? -22 : 48), now, 1 - stop, 8);
        K.ico[ic](ix, iy, K.mix('#c9a36b', '#eef1f4', stop));
        K.ring(ix, iy, (u - ts) / .7, SKY, 30, 110);
        txt(l1, x, 462, 21, PAPER, 'left', 700); txt(l2, x, 496, 21, stop > .5 ? SKY : SUB, 'left', 500);
        c.restore() }) });
    K.sweep((u - 2.8) / 1);
  },
  // 4 시행 성과 — 33에서 20으로, 하늘이 걷힌다
  (u, T, now) => {
    const k = eio((u - .6) / 1.8), v = lerp(33, 20, k);
    K.bg(.15 + .85 * k); K.stars(now, k); K.dust(now, (1 - k) * .95, 140, 600); K.haze((1 - k) * .8, 240); K.sparks(now, k * .7);
    K.cue(u, .6, 'rise'); K.cue(u, 2.4, 'chime');
    alpha(eout((u - .2) / .4), () => { txt('계절관리제 기간 초미세먼지(PM-2.5) 평균 농도', 64, 186, 22, SUB, 'left', 500);
      mono(String(Math.round(v)), 52, 420, 250, K.mix('#c9a36b', '#eef1f4', k), 'left', 700); txt('㎍/㎥', 372, 420, 38, SUB, 'left', 500) });
    K.burst(210, 340, (u - 2.4) / .7, SKY, 20, 150, 200); K.ring(210, 340, (u - 2.4) / .9, SKY, 110, 190);
    K.reveal('약 40% 감소', 640, 330, 76, 2.4, u, {col: SKY}); K.reveal('제도 도입 초기 33 → 제6차 20 ㎍/㎥', 644, 380, 22, 2.7, u, {col: SUB, weight: 500});
    const sy = 500, sk = eout((u - .4) / .5), X = K.scale(64, sy, 1072, sk);
    alpha(sk, () => { K.marker(X(33), sy, DUST, false); mono('33', X(33), sy - 34, 15, DUST, 'center', 600);
      K.marker(X(v), sy, PAPER); if (k > .05) mono(String(Math.round(v)), X(v), sy - 34, 15, PAPER, 'center', 600) });
  },
  // 5 국민 참여 — 네 가지 실천
  (u, T, now) => {
    K.bg(1); K.stars(now, 1); K.cam(u, () => K.skyline(now, 1), .05, W / 2, H); K.sparks(now, .6);
    ['대중교통·자전거 이용 생활화', '적정 실내온도 유지', '친환경 운전 실천', '일회용품 사용 줄이기'].forEach((s, i) => { const t0 = .3 + i * .32, y = 222 + i * 88; K.cue(u, t0, 'pop');
      alpha(eout((u - t0) / .3), () => mono(K.pad(i + 1), 64, y - 4, 17, SKY, 'left', 600)); K.chars(s, 116, y, 36, t0, u, {gap: .025}); K.rule(64, y + 30, 580, (u - t0 - .1) / .5) });
    K.cue(u, 2.3, 'chime'); K.burst(948, 330, (u - 2.3) / .7, SKY, 20, 120, 230); K.sweep((u - 2.3) / 1.1);
    K.reveal('미세먼지 계절관리제', 760, 286, 30, 2.2, u); K.chars('12.1 – 3.31', 760, 382, 74, 2.4, u, {col: SKY});
    K.rule(760, 414, 376, (u - 2.7) / .5); K.reveal('실시간 대기질 정보는 에어코리아', 760, 456, 20, 2.8, u, {col: SUB, weight: 500});
  }
]});
})();
