import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// Publishable key is safe in the browser; all writes go through RPCs guarded in SQL.
export const SUPABASE_URL = 'https://rbaibnntcgpdeybvtool.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_HdiovBpEe3EN29aj1YDsEA_BkdJmMO2';
export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

export const TOTAL_STAGES = 28;   // must match submit_answer in SQL (4 zones x 7, bonus chest at stage % 7 === 6)

// Short progress text used by every screen
export const stageLabel = p => p.finished_at ? fmt(p.total_ms) : p.stage >= TOTAL_STAGES ? `BOSS ${p.boss_hp}HP` : `${p.stage}/${TOTAL_STAGES}`;
export const zoneLabel = p => p.finished_at ? 'Finished' : p.stage >= TOTAL_STAGES ? 'Boss' : `Zone ${Math.floor(p.stage / 7) + 1}`;

// Server clock offset so every PC shows the same countdown
let offset = 0;
export async function syncClock() {
  try {
    const t0 = Date.now();
    const { data } = await sb.rpc('server_now');
    const t1 = Date.now();
    if (data) offset = new Date(data).getTime() - (t0 + t1) / 2;
  } catch { /* keep local clock */ }
}
export const now = () => Date.now() + offset;

export function fmt(ms) {
  ms = Math.max(0, ms);
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// Every player has their own clock: it starts when they join and lasts duration_sec
export function playerEnd(p, ev) {
  return new Date(p.created_at).getTime() + (ev?.duration_sec || 1200) * 1000;
}

// open | ended: the event is open unless the organiser closed it
export const eventPhase = ev => ev?.status === 'ended' ? 'ended' : 'open';

// Finished first by total time (tie: fewer wrong, then earlier finish), then unfinished by progress
export function rank(players) {
  return [...players].sort((a, b) => {
    const fa = a.finished_at != null, fb = b.finished_at != null;
    if (fa !== fb) return fa ? -1 : 1;
    if (fa) return a.total_ms - b.total_ms || b.stars - a.stars || a.wrong - b.wrong || new Date(a.finished_at) - new Date(b.finished_at);
    return b.stage - a.stage || a.boss_hp - b.boss_hp || b.stars - a.stars || (a.penalty_sec - a.bonus_sec) - (b.penalty_sec - b.bonus_sec) || a.wrong - b.wrong;
  });
}

export function progressPct(p) {
  if (p.finished_at) return 100;
  return Math.round(((p.stage + (100 - p.boss_hp) / 100) / (TOTAL_STAGES + 1)) * 100);
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function fetchEvent() {
  const { data } = await sb.from('event_state').select('*').eq('id', 1).single();
  return data;
}
export async function fetchPlayers(cols = '*') {
  const { data } = await sb.from('players').select(cols);
  return data || [];
}

// Fade/slide elements with class "reveal" in as they scroll into view
// A plain position check instead of IntersectionObserver: it can never leave content stuck invisible.
export function revealOnScroll(root = document) {
  const els = [...root.querySelectorAll('.reveal:not(.in)')];
  els.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; });
  const check = () => els.forEach(el => { if (el.getBoundingClientRect().top < innerHeight * 0.92) el.classList.add('in'); });
  document.addEventListener('scroll', check, { capture: true, passive: true });
  addEventListener('resize', check);
  setTimeout(check, 50);
}

// Re-render a keyed list and animate rows sliding to their new rank (FLIP)
export function flipList(ul, items, keyFn, html) {
  const before = new Map();
  const existing = new Map();
  for (const li of ul.children) { before.set(li.dataset.k, li.getBoundingClientRect().top); existing.set(li.dataset.k, li); }
  const rows = items.map((it, i) => {
    const k = keyFn(it);
    let li = existing.get(k);
    if (!li) { li = document.createElement('li'); li.dataset.k = k; }
    const h = html(it, i);
    if (li._h !== h) { li.innerHTML = h; li._h = h; }
    return li;
  });
  ul.replaceChildren(...rows);
  for (const li of rows) {
    const prev = before.get(li.dataset.k);
    if (prev == null) li.animate([{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'ease-out' });
    else {
      const dy = prev - li.getBoundingClientRect().top;
      if (dy) li.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 550, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
  }
}

// Gold confetti burst on a canvas
export function confetti(canvas, seconds = 4) {
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const colors = ['#f2c14e', '#ffdf8a', '#ff8a3d', '#3ddc84', '#5b8def', '#c27bff', '#ff4d5e'];
  const ps = Array.from({ length: 180 }, () => ({
    x: innerWidth / 2, y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 16, vy: Math.random() * -14 - 4,
    s: Math.random() * 6 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  const end = performance.now() + seconds * 1000;
  (function tick(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of ps) {
      p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    }
    if (t < end) requestAnimationFrame(tick); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })(performance.now());
}

// Floating embers on a full-screen canvas behind everything
export function embers(canvas) {
  const ctx = canvas.getContext('2d');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let w, h, parts = [];
  const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
  resize(); addEventListener('resize', resize);
  const spawn = () => ({ x: Math.random() * w, y: h + 10, r: Math.random() * 2 + 0.6, vy: Math.random() * 0.6 + 0.25, vx: (Math.random() - 0.5) * 0.3, life: 1, hue: 20 + Math.random() * 25 });
  for (let i = 0; i < 60; i++) { const p = spawn(); p.y = Math.random() * h; parts.push(p); }
  (function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.vy; p.x += p.vx + Math.sin(p.y / 40) * 0.15; p.life -= 0.0016;
      if (p.y < -10 || p.life <= 0) Object.assign(p, spawn());
      ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.life * 0.8})`;
      ctx.shadowColor = `hsla(${p.hue},100%,55%,1)`; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
}
