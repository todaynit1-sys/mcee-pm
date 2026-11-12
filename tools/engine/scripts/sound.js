/* 배경음·효과음 모듈 (음성 해설 대신). 음원 파일 없이 Web Audio로 바로 만든다.
   엔진이 쓰는 window.MAMO_VOICE 와 같은 모양(init → {on, scene, stop, resume})이고,
   장면 코드에서는 window.PM_SND.sfx('tick' | 'pop' | 'whoosh' | 'rise' | 'chime' | 'low') 로 효과음을 낸다.
   브라우저 정책상 처음 한 번은 '소리 켜기'를 눌러야 소리가 난다. */
(() => {
'use strict';
const KEY = 'pm-motion-sound';
const read = () => { try { return localStorage.getItem(KEY) === '1' } catch (e) { return false } };
const write = v => { try { localStorage.setItem(KEY, v ? '1' : '0') } catch (e) {} };
const ICON_ON = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 8v4h3l4 3.5V4.5L6 8H3z" fill="currentColor"/><path d="M13 7.2a4 4 0 0 1 0 5.6M15.3 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 8v4h3l4 3.5V4.5L6 8H3z" fill="currentColor"/><path d="M13.5 7.5l4 5m0-5l-4 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
let ctx = null, master = null, bus = null, echo = null, noiseBuf = null, timer = null, nextT = 0, step = 0, on = false, running = false;
const BPM = 92, S16 = 60 / BPM / 4;
// 네 마디 화음 (A단조 → F → C → G), 주파수는 Hz
const hz = n => 440 * Math.pow(2, (n - 69) / 12);
const BARS = [[57, 64, 67, 72, 76], [53, 60, 65, 69, 72], [48, 55, 64, 67, 72], [55, 62, 67, 71, 74]];

function boot() { if (ctx) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC();
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.connect(ctx.destination);
  master = ctx.createGain(); master.gain.value = 0; master.connect(comp);
  bus = ctx.createGain(); bus.gain.value = 1; bus.connect(master);
  echo = ctx.createDelay(1); echo.delayTime.value = S16 * 3; const fb = ctx.createGain(); fb.gain.value = .32; const wet = ctx.createGain(); wet.gain.value = .28;
  echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
function env(g, t, a, peak, dec) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec) }
function tone(type, f, t, a, peak, dec, o = {}) { const osc = ctx.createOscillator(), g = ctx.createGain(); osc.type = type; osc.frequency.setValueAtTime(f, t); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dec));
  if (o.detune) osc.detune.value = o.detune; env(g, t, a, peak, dec); let out = g;
  if (o.lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = o.lp; g.connect(fl); out = fl }
  osc.connect(g); out.connect(o.dry ? master : bus); if (o.echo) out.connect(echo); osc.start(t); osc.stop(t + a + dec + .05) }
function noise(t, dur, peak, f0, f1, q = 1, type = 'bandpass') { const src = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); src.buffer = noiseBuf; src.loop = true; fl.type = type; fl.Q.value = q;
  fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + dur * .35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(fl); fl.connect(g); g.connect(master); src.start(t); src.stop(t + dur + .05) }

// 배경음: 16분음표 단위로 조금 앞서 예약한다
function schedule() { if (!running) return; while (nextT < ctx.currentTime + .25) { const s = step % 64, bar = BARS[(s >> 4) % 4], t = nextT;
    if (s % 16 === 0) { for (const n of [bar[0], bar[1], bar[2]]) for (const dt of [-7, 7]) tone('sawtooth', hz(n), t, .9, .028, S16 * 15, {detune: dt, lp: 900}); tone('sine', hz(bar[0] - 12), t, .02, .2, S16 * 12, {dry: true}) }
    if (s % 4 === 0) tone('sine', 120, t, .004, .16, .16, {to: 46, glide: .12, dry: true});
    if (s % 4 === 2) noise(t, .05, .035, 7000, 9000, 2, 'highpass');
    if (s % 2 === 0) { const arp = [0, 2, 3, 2, 4, 3, 2, 1][(s >> 1) % 8]; tone('triangle', hz(bar[arp] + 12), t, .005, .07, .28, {echo: true}) }
    nextT += S16; step++ } }
function start() { if (!ctx || running) return; running = true; nextT = ctx.currentTime + .06; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(.7, ctx.currentTime, .25); timer = setInterval(schedule, 60); schedule() }
function halt() { if (!ctx) return; running = false; clearInterval(timer); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, .08) }

const FX = {
  tick: t => tone('sine', 1500, t, .002, .12, .07, {dry: true}),
  pop: t => tone('triangle', 520, t, .004, .2, .16, {to: 980, glide: .09, echo: true}),
  whoosh: t => noise(t, .5, .2, 300, 3600, .8),
  rise: t => { tone('sawtooth', 180, t, .5, .05, 1.3, {to: 720, glide: 1.6, lp: 1800}); noise(t, 1.7, .08, 400, 5000, 1.2) },
  chime: t => { for (const [f, p] of [[1318.5, .16], [1975.5, .09], [2637, .05]]) tone('sine', f, t, .004, p, 1.6, {echo: true}) },
  low: t => { tone('sine', 110, t, .01, .4, .5, {to: 52, glide: .4, dry: true}); noise(t, .4, .06, 500, 120, .7, 'lowpass') },
};
window.PM_SND = { sfx(name) { if (on && running && ctx && FX[name]) FX[name](ctx.currentTime + .01) } };
window.MAMO_VOICE = {
  init(o) { const btn = o.button, api = {on: false, scene, stop, resume};
    function paint() { if (!btn) return; btn.hidden = false; btn.setAttribute('aria-pressed', String(on)); btn.innerHTML = (on ? ICON_ON : ICON_OFF) + `<span>${on ? '소리 켜짐' : '소리 켜기'}</span>`; btn.classList.toggle('on', on) }
    function enable() { boot(); if (!ctx) return; on = true; ctx.resume(); start(); paint() }
    function scene() { if (on) window.PM_SND.sfx('whoosh') }
    function stop() { halt() }
    function resume() { if (on && ctx) { ctx.resume(); start() } }
    if (btn) btn.onclick = () => { if (on) { on = false; write(false); halt(); paint() } else { write(true); enable() } };
    // 지난번에 켜 둔 사람은 화면을 처음 누르는 순간 소리가 다시 켜진다
    if (read()) addEventListener('pointerdown', function once(e) { removeEventListener('pointerdown', once); if (!on && e.target !== btn && !btn.contains(e.target)) enable() });
    document.addEventListener('visibilitychange', () => { if (!ctx || !on) return; if (document.hidden) halt(); else start() });
    paint(); return api; }
};
})();
