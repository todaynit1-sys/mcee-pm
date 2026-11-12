// 부문별 저감 대책 — 발전·산업·수송·생활·건강 보호. 장면마다 배출이 멎고 하늘이 조금씩 맑아진다.
(() => {
const {W, H, c, clamp, lerp, eio, eout, hash, box, line, circ, txt, mono, alpha, tick, K} = CINE;
const {INK, PAPER, SUB, MUTE, SKY, DUST, HAIR} = K;
// 그림 기호에서 나오던 연기가 1.6초쯤 멎고 색이 밝아진다
const stopAt = (u) => eout((u - 1.6) / .7), tone = (s) => K.mix('#c9a36b', '#eef1f4', s);
const done = (u, x, y) => { K.cue(u, 1.6, 'tick'); K.ring(x, y, (u - 1.6) / .8, SKY, 60, 220); K.cue(u, 2.5, 'chime') };

CINE.story({header: K.header, wipe: K.wipe, post: K.post, scenes: [
  K.tip('01', '발전 부문', ['공공 석탄발전 가동정지', '상한제약 (출력 제한)'], .3, (u, now) => { const s = stopAt(u);
    K.puff(1002, 190, now, 1 - s, 10); K.puff(880, 250, now + .4, (1 - s) * .8, 8); alpha(eout((u - .6) / .5), () => K.icon('plant', 920, 350, 2.8, tone(s))); done(u, 920, 350) }),
  K.tip('02', '산업 부문', ['대형사업장 배출량 추가 감축', '첨단장비·AI 활용 불법배출 감시'], .45, (u, now) => { const s = stopAt(u);
    K.puff(1026, 226, now, 1 - s, 10); alpha(eout((u - .6) / .5), () => K.icon('factory', 920, 350, 2.8, tone(s)));
    alpha(eout((u - 2) / .4), () => K.icon('drone', 800, 220 + Math.sin(now * 2) * 6, 1.1, SKY)); done(u, 920, 350) }),
  K.tip('03', '수송 부문', ['배출가스 5등급 차량 운행제한', '운행차 배출가스·공회전 단속'], .6, (u, now) => { const s = stopAt(u); K.road(now, 160 * (1 - s));
    const tx = lerp(1420, 930, eout((u - .4) / 1.3)); K.puff(tx + 150, 500, now, 1 - s, 10); K.icon('truck', tx, 478, 2.4, tone(s), true); done(u, 930, 440) }),
  K.tip('04', '생활 부문', ['영농폐기물 수거, 불법소각 방지', '도로 청소 강화', '공사장 날림먼지 관리'], .75, (u, now) => { const s = stopAt(u);
    K.puff(860, 250, now, 1 - s, 9); K.puff(1040, 300, now + .3, (1 - s) * .8, 7); alpha(eout((u - .6) / .5), () => { K.icon('flame', 860, 360, 2.2, tone(s)); K.icon('crane', 1040, 390, 1.5, tone(s)) }); done(u, 930, 360) }),
  K.tip('05', '건강 보호', ['어린이집·학교·요양시설 실내공기질 점검', '옥외근로자 보호'], .95, (u, now) => {
    K.sparks(now, .5); alpha(eout((u - .6) / .5), () => { K.icon('school', 880, 340, 2.4, PAPER); K.icon('mask', 1050, 470, 1.3, SKY) });
    tick(1010, 250, (u - 1.6) / .4, SKY, 1.6); done(u, 900, 340); K.sweep((u - 2.6) / 1.1) }),
]});
})();
