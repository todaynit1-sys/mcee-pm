// 국민 참여 행동 — 계절관리제 기간 생활 속 실천 네 가지와 신고·확인
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, arrow, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR, AQ} = K;
const show = (u, fn) => alpha(eout((u - .6) / .5), fn);
const fin = (u, x, y) => { K.cue(u, 2.3, 'chime'); K.burst(x, y, (u - 2.3) / .7, SKY, 18, 170, 250) };

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  K.tip('01', '걷기·자전거·대중교통', ['가까운 거리는 걷기', '자전거와 대중교통 이용 생활화'], .7, (u, now) => {
    K.road(now, 160); const bx = lerp(1420, 930, eout((u - .5) / 1.4)); K.icon('bus', bx, 470, 2.4, PAPER, true); fin(u, 930, 400) }),
  K.tip('02', '적정 실내온도 유지', ['겨울철 적정 실내온도 지키기', '낭비되는 대기전력 줄이기'], .78, (u, now) => {
    show(u, () => { K.icon('house', 900, 360, 2.7, PAPER); K.icon('thermo', 1076, 300, 1.5, SKY) }); fin(u, 920, 360) }),
  K.tip('03', '친환경 운전', ['차량을 바꿀 때는 전기차 선택', '친환경 운전 실천'], .86, (u, now) => {
    K.road(now, 120); show(u, () => { K.icon('car', 900, 440, 2.6, PAPER); K.icon('bolt', 1050, 250, 1.5, SKY) }); K.sparks(now, .4); fin(u, 920, 400) }),
  K.tip('04', '일회용품 줄이기', ['다회용 컵 사용', '장바구니 사용'], .93, (u, now) => {
    show(u, () => { K.icon('cup', 900, 350, 2.8, PAPER); line(820, 300, 980, 300, SKY, 3) }); K.sparks(now, .5); fin(u, 900, 350) }),
  K.tip('05', '신고와 대기질 확인', ['불법소각·매연 차량·공회전은 지방자치단체에 신고', '실시간 대기질과 예보는 에어코리아'], 1, (u, now) => {
    K.sparks(now, .6); const a = eout((u - .6) / .6);
    alpha(a, () => { c.save(); c.translate(0, (1 - a) * 40); box(848, 196, 184, 328, '#0d1422', 26, PAPER, 2.5); line(922, 506, 958, 506, PAPER, 2.5);
      txt('초미세먼지 예보 등급', 868, 240, 14, SUB, 'left', 500);
      AQ.forEach(([name, , col], i) => { const k = eout((u - 1.3 - i * .2) / .4); alpha(k, () => { box(868, 262 + i * 56, 144, 44, 'rgba(238,241,244,.05)', 8); circ(890, 284 + i * 56, 7, col); txt(name, 908, 290 + i * 56, 17, PAPER, 'left', 700) }) });
      c.restore() });
    K.cue(u, 2.6, 'chime'); K.sweep((u - 2.6) / 1.1) }),
]});
})();
