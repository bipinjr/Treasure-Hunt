// Chiptune sound effects synthesized with WebAudio: no audio files to load.
let ctx = null;
let muted = false;
try { muted = localStorage.getItem('tq_mute') === '1'; } catch {}

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = 'square', vol = 0.12, at = 0, slide = 0 } = {}) {
  if (muted) return;
  const a = ac(), t = a.currentTime + at;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

function noise(dur, vol = 0.15, at = 0) {
  if (muted) return;
  const a = ac(), t = a.currentTime + at;
  const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = a.createBufferSource(), g = a.createGain();
  s.buffer = buf; g.gain.value = vol;
  s.connect(g).connect(a.destination);
  s.start(t);
}

const seq = (notes, step, opts) => notes.forEach((f, i) => f && tone(f, step * 1.6, { ...opts, at: i * step }));

export const sfx = {
  click: () => tone(660, 0.05, { vol: 0.06 }),
  slash: () => { noise(0.12, 0.12); tone(900, 0.12, { type: 'sawtooth', vol: 0.06, slide: -600 }); },
  coin: () => seq([988, 1319], 0.07, { vol: 0.09 }),
  combo: n => seq([660, 880, 1100, 1320].slice(0, Math.min(4, n)), 0.05, { vol: 0.08 }),
  hurt: () => { tone(220, 0.25, { type: 'sawtooth', vol: 0.12, slide: -150 }); noise(0.18, 0.1); },
  die: () => { tone(400, 0.3, { vol: 0.08, slide: -320 }); noise(0.25, 0.08, 0.05); },
  zone: () => seq([392, 523, 659, 784], 0.09, { vol: 0.08, type: 'triangle' }),
  roar: () => { tone(110, 0.9, { type: 'sawtooth', vol: 0.16, slide: -60 }); tone(147, 0.9, { type: 'square', vol: 0.08, slide: -70 }); noise(0.8, 0.12); },
  bossHit: () => { noise(0.2, 0.18); tone(160, 0.25, { type: 'square', vol: 0.12, slide: -80 }); },
  count: () => tone(523, 0.12, { vol: 0.1 }),
  go: () => seq([523, 784, 1047], 0.08, { vol: 0.11 }),
  victory: () => seq([523, 659, 784, 1047, 0, 784, 1047, 1319], 0.12, { vol: 0.1, type: 'square' }),
  lose: () => seq([392, 330, 262, 196], 0.18, { vol: 0.1, type: 'triangle' }),
  isMuted: () => muted,
  toggle() { muted = !muted; try { localStorage.setItem('tq_mute', muted ? '1' : '0'); } catch {} if (!muted) this.click(); return muted; },
  unlock: () => { try { ac(); } catch {} },
};
