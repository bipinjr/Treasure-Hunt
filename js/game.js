import { sb, syncClock, now, fmt, eventEnd, eventPhase, rank, progressPct, esc, fetchEvent, fetchPlayers, flipList, confetti, embers, TOTAL_STAGES } from './common.js';
import { ZONES, ENEMIES, BOSS, RUNE_WORD, PRACTICE } from './questions.js';
import { spriteSVG } from './sprites.js';
import { sfx } from './sfx.js';

const $ = id => document.getElementById(id);
const KEY = 'tq_player';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pick = a => a[(Math.random() * a.length) | 0];
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

let me = null;          // my players row (server truth)
let cred = null;        // { id, token }
let ev = null;          // event_state row
let players = [];
let screen = null;
let busy = false;
let hearts = 3;
let current = null;     // { q, choices, diff? }
let usedBoss = new Set();
let shownZone = null;
let bossIntroDone = false;
let results = [];       // per-stage 'ok' | 'miss', kept locally for the rune bar
let endTimer = null;
let streak = 0;
let practice = false;   // local-only warm-up run: no server, not on the leaderboard
let pev = null;         // practice event clock

const enemies = () => practice ? PRACTICE.enemies : ENEMIES;
const stages = () => practice ? PRACTICE.enemies.length : TOTAL_STAGES;
const bossPool = d => practice ? PRACTICE.boss[d] : BOSS.pool[d];
const runeWord = () => practice ? PRACTICE.word : RUNE_WORD;
const curEv = () => practice ? pev : ev;

// ---------- boot ----------
embers($('embers'));
$('hero-art').innerHTML = spriteSVG('knight', null, 'k') + spriteSVG('boss', null, 'b');
$('lobby-art').innerHTML = spriteSVG('skeleton') + spriteSVG('magma') + spriteSVG('ghost', 'shields') + spriteSVG('robot', 'heart');
init();

$('mute').textContent = sfx.isMuted() ? '🔇' : '🔊';
$('mute').onclick = () => { $('mute').textContent = sfx.toggle() ? '🔇' : '🔊'; };
addEventListener('pointerdown', sfx.unlock, { once: true });
addEventListener('keydown', sfx.unlock, { once: true });

async function init() {
  await syncClock();
  [ev, players] = await Promise.all([fetchEvent(), fetchPlayers()]);
  try { cred = JSON.parse(localStorage.getItem(KEY)); } catch { cred = null; }
  if (cred) {
    const { data, error } = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
    if (error || !data?.id) forget(); else { me = data; loadResults(); }
  }
  sb.channel('ev').on('postgres_changes', { event: '*', schema: 'public', table: 'event_state' }, p => { ev = p.new; route(); }).subscribe();
  setInterval(async () => { const e = await fetchEvent(); if (e) { ev = e; route(); } }, 5000);
  setInterval(refreshPlayers, 3000);
  setInterval(tick, 250);
  route();
}

function forget() {
  localStorage.removeItem(KEY);
  cred = null; me = null;
}
function loadResults() {
  try { results = JSON.parse(localStorage.getItem('tq_res_' + cred.id)) || []; } catch { results = []; }
}
function saveResults() {
  if (practice) return;
  try { localStorage.setItem('tq_res_' + cred.id, JSON.stringify(results)); } catch {}
}

async function refreshPlayers() {
  players = await fetchPlayers();
  // admin reset deletes everyone: send this PC back to the name screen
  if (!practice && me && !players.some(p => p.id === me.id) && ev?.status === 'waiting') { forget(); clearInterval(endTimer); route(); return; }
  if (screen === 'lobby') renderLobby();
  if (screen === 'game') renderBoard();
}

function show(name) {
  if (screen === name) return;
  screen = name;
  for (const s of ['name', 'lobby', 'game', 'end']) $('s-' + s).hidden = s !== name;
}

function route() {
  if (practice) return;
  if (!me) { show('name'); setTimeout(() => $('name')?.focus(), 50); return; }
  if (me.finished_at) { if (screen !== 'end') victory(); return; }
  const phase = eventPhase(ev);
  if (phase === 'waiting') { show('lobby'); renderLobby(); }
  else if (phase === 'running') { if (screen !== 'game') startGame(); }
  else if (screen !== 'end') timeUp();
}

// ---------- join ----------
$('join').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('name').value.trim();
  if (!name) return;
  $('join-btn').disabled = true; $('join-err').textContent = '';
  const { data, error } = await sb.rpc('join_game', { p_name: name });
  $('join-btn').disabled = false;
  if (error || !data?.[0]) { $('join-err').textContent = error?.message?.includes('closed') ? 'The cavern is closed. Ask the organisers.' : 'Could not join. Check the internet and try again.'; return; }
  cred = { id: data[0].player_id, token: data[0].token };
  localStorage.setItem(KEY, JSON.stringify(cred));
  const r = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
  me = r.data; results = []; hearts = 3; shownZone = null; bossIntroDone = false; usedBoss = new Set();
  players = await fetchPlayers();
  route();
});

function renderLobby() {
  $('lobby-name').textContent = me.name;
  $('lobby-count').textContent = players.length;
  $('lobby-names').innerHTML = players.slice(-40).map(p => `<span class="chip ${p.id === me.id ? 'me' : ''}">${esc(p.name)}</span>`).join('');
}

// ---------- game ----------
function startGame() {
  show('game');
  $('knight').querySelector('.body').innerHTML = spriteSVG('knight');
  $('knight').classList.add('k-enter');
  renderTrack(); renderRunes(); renderHearts(); renderBoard();
  if (me.stage === 0 && !results.length) countdown().then(spawn); else spawn();
}

async function countdown() {
  busy = true;
  $('qcard').innerHTML = '<p class="prompt" style="text-align:center;color:var(--muted)">Get ready…</p>';
  for (const n of ['3', '2', '1', 'FIGHT!']) {
    const c = document.createElement('div');
    c.className = 'count-pop' + (n.length > 1 ? ' go' : '');
    c.textContent = n;
    $('stage').append(c);
    n.length > 1 ? sfx.go() : sfx.count();
    await sleep(n.length > 1 ? 700 : 650);
    c.remove();
  }
}

function zoneOf(stage) { return ZONES.find(z => z.id === enemies()[stage].zone); }
function setAccent(c) { document.documentElement.style.setProperty('--accent', c); }

function renderTrack() {
  let h = '';
  for (let i = 0; i < stages(); i++) {
    const cls = results[i] === 'ok' ? 'done' : results[i] === 'miss' ? 'miss' : i === me.stage ? 'now' : '';
    h += `<span class="pip ${cls} ${i && i % 3 === 0 ? 'gap' : ''}"></span>`;
  }
  h += `<span class="skull ${me.stage >= stages() ? 'now' : ''}">💀</span>`;
  $('track').innerHTML = h;
}
function renderRunes() {
  $('runes').innerHTML = [...runeWord()].map((ch, i) =>
    `<span class="rune ${results[i] === 'ok' ? 'got' : results[i] === 'miss' ? 'lost' : ''} ${!practice && (i === 7 || i === 9) ? 'gap' : ''}" data-i="${i}">${results[i] === 'miss' ? '✕' : ch}</span>`).join('');
}
function renderHearts(refill) {
  $('hearts').innerHTML = [0, 1, 2].map(i => spriteSVG('heart', null, i < hearts ? (refill ? 'refill' : '') : 'lost')).join('');
}

function spawn() {
  busy = false;
  const enemyEl = $('enemy');
  enemyEl.className = 'actor';
  if (me.stage < stages()) {
    const e = enemies()[me.stage], z = zoneOf(me.stage);
    setAccent(z.accent);
    const title = practice ? 'Training Grounds' : z.name;
    const sub = practice ? 'Practice run · does not count' : `Zone ${ZONES.indexOf(z) + 1} · ${z.domain}`;
    $('zone-name').textContent = title; $('zone-domain').textContent = sub;
    if (shownZone !== z.id) { shownZone = z.id; banner(title, sub); sfx.zone(); }
    enemyEl.querySelector('.body').innerHTML = spriteSVG(e.sprite, e.palette);
    $('nameplate').innerHTML = `<div class="n">${esc(e.name)}</div><div class="d ${e.difficulty}">${e.difficulty}</div>`;
    void enemyEl.offsetWidth; enemyEl.classList.add('enter');
    const q = pick(e.variants);
    current = { q, choices: shuffle(q.choices) };
    renderQuestion();
  } else {
    setAccent('#c27bff');
    $('zone-name').textContent = 'The Summarizer'; $('zone-domain').textContent = 'Final boss · all four zones';
    enemyEl.classList.add('boss');
    enemyEl.querySelector('.body').innerHTML = spriteSVG('boss');
    renderBossPlate();
    void enemyEl.offsetWidth; enemyEl.classList.add('enter');
    if (!bossIntroDone) { bossIntroDone = true; banner('THE SUMMARIZER', 'Final boss · 100 HP'); flash('rgba(140,60,230,.6)'); shake($('s-game')); sfx.roar(); }
    renderDiffPicker();
  }
  renderTrack();
}

function renderBossPlate() {
  $('nameplate').innerHTML = `<div class="n">THE SUMMARIZER</div><div class="hpbar"><i style="transform:scaleX(${me.boss_hp / 100})"></i><b>${me.boss_hp} / 100</b></div>`;
}

function renderDiffPicker() {
  current = null;
  const d = BOSS.damage;
  $('qcard').innerHTML = `
    <p class="prompt">Choose your attack! Harder questions deal more damage. A wrong answer costs +10 sec.</p>
    <div class="diffs">
      ${['easy', 'medium', 'hard'].map((k, i) => `<button class="diff ${k}" data-d="${k}"><div class="dn">${i + 1} · ${k.toUpperCase()}</div><div class="dd">${d[k]}</div><div class="dh">damage</div></button>`).join('')}
    </div>`;
  replay($('qcard'), 'rise');
  $('qcard').querySelectorAll('.diff').forEach(b => b.onclick = () => chooseDiff(b.dataset.d));
}

function chooseDiff(diff) {
  if (busy || current) return;
  const pool = bossPool(diff);
  let avail = pool.filter(q => !usedBoss.has(q.prompt));
  if (!avail.length) avail = pool; // shortcut: pool exhausted, reuse questions
  const q = pick(avail);
  usedBoss.add(q.prompt);
  current = { q, choices: shuffle(q.choices), diff };
  renderQuestion();
}

function renderQuestion() {
  const { q, choices, diff } = current;
  $('qcard').innerHTML = `
    <p class="prompt">${diff ? `<span class="d ${diff}">[${diff} · ${BOSS.damage[diff]} dmg]</span> ` : ''}${esc(q.prompt)}</p>
    <div class="choices">${choices.map((c, i) => `<button class="choice" data-i="${i}"><span class="key">${i + 1}</span><span>${esc(c)}</span></button>`).join('')}</div>
    <p class="explain" id="explain"></p>`;
  replay($('qcard'), 'rise');
  $('qcard').querySelectorAll('.choice').forEach(b => b.onclick = () => answer(+b.dataset.i));
}

addEventListener('keydown', e => {
  if (screen !== 'game' || busy || e.target.tagName === 'INPUT') return;
  const n = parseInt(e.key, 10);
  if (!n) return;
  if (current && n <= current.choices.length) answer(n - 1);
  else if (!current && me.stage >= stages() && n <= 3) chooseDiff(['easy', 'medium', 'hard'][n - 1]);
});

async function answer(i) {
  if (busy || !current) return;
  busy = true;
  const { q, choices, diff } = current;
  const ok = choices[i] === q.answer;
  const btns = [...$('qcard').querySelectorAll('.choice')];
  btns.forEach((b, j) => {
    b.disabled = true;
    if (choices[j] === q.answer) b.classList.add('right');
    else if (j === i) b.classList.add('wrong');
    else b.classList.add('dim');
  });
  const ex = $('explain');
  ex.className = 'explain ' + (ok ? 'ok' : 'bad');
  ex.textContent = (ok ? '✔ Correct! ' : '✘ Not quite. ') + (q.explain || (ok ? '' : `Answer: ${q.answer}`));

  const before = { stage: me.stage, hp: me.boss_hp };
  const req = send(before, ok, diff);
  const boss = before.stage >= stages();

  if (ok) {
    streak++;
    if (streak >= 2) showCombo(streak);
    await heroStrike(boss ? BOSS.damage[diff] : null);
    if (!boss) { results[before.stage] = 'ok'; saveResults(); await killEnemy(before.stage); }
  } else {
    streak = 0; showCombo(0);
    await enemyStrike();
    if (!boss) { results[before.stage] = 'miss'; saveResults(); renderRunes(); }
    await sleep(900); // time to read the right answer
  }

  const res = await req;
  if (res === 'timeup') { timeUp(); return; }
  if (res) me = res;
  if (boss) {
    renderBossPlate();
    if (me.finished_at) {
      await sleep(300);
      $('enemy').classList.add('die');
      sfx.roar();
      burst($('enemy'), 40, ['#c27bff', '#f2c14e', '#fff']);
      flash('rgba(255,240,180,.7)');
      await sleep(900);
      players = await fetchPlayers();
      victory();
      return;
    }
    await sleep(ok ? 500 : 0);
    renderDiffPicker();
    busy = false;
    return;
  }
  await walk();
  spawn();
}

async function walk() {
  const st = $('stage');
  st.classList.add('walking'); $('knight').classList.add('walking');
  await sleep(600);
  st.classList.remove('walking'); $('knight').classList.remove('walking');
}

function showCombo(n) {
  let c = $('combo');
  if (!n) { if (c) c.remove(); return; }
  if (!c) { c = document.createElement('div'); c.id = 'combo'; c.className = 'combo'; $('stage').append(c); }
  c.innerHTML = `<b>${n}×</b> COMBO`;
  c.animate([{ transform: 'scale(1.6) rotate(-6deg)' }, { transform: 'scale(1) rotate(-3deg)' }], { duration: 350, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  sfx.combo(n);
}

// Retries network failures; returns new player row, 'timeup', or null
async function send(before, ok, diff) {
  if (practice) return practiceAnswer(ok, diff);
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data, error } = await sb.rpc('submit_answer', { p_id: cred.id, p_token: cred.token, p_stage: before.stage, p_hp: before.hp, p_correct: ok, p_diff: diff || null });
    if (!error) return data;
    if (error.message?.includes('Time is up')) return 'timeup';
    await sleep(600 * (attempt + 1));
  }
  toast('Connection trouble: your progress will sync when the internet is back.');
  const r = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
  return r.data || null;
}

// Mirrors submit_answer in SQL for the local practice run
function practiceAnswer(ok, diff) {
  const p = { ...me };
  if (p.stage < stages()) { p.stage++; if (ok) p.correct++; else { p.wrong++; p.penalty_sec += 10; } }
  else if (ok) {
    p.correct++;
    p.boss_hp = Math.max(0, p.boss_hp - BOSS.damage[diff]);
    if (!p.boss_hp) { p.finished_at = new Date(now()).toISOString(); p.total_ms = now() - new Date(pev.started_at).getTime() + p.penalty_sec * 1000; }
  } else { p.wrong++; p.penalty_sec += 10; }
  return p;
}

function startPractice() {
  practice = true;
  pev = { status: 'running', started_at: new Date(now()).toISOString(), duration_sec: 300 };
  me = { id: 'practice', name: $('name').value.trim() || 'Adventurer', stage: 0, boss_hp: 100, correct: 0, wrong: 0, penalty_sec: 0, created_at: pev.started_at, finished_at: null, total_ms: null };
  results = []; hearts = 3; shownZone = null; bossIntroDone = false; usedBoss = new Set(); streak = 0;
  document.body.classList.add('practice');
  screen = null;
  startGame();
}

function exitPractice() {
  practice = false; pev = null; me = null; streak = 0; current = null; busy = false;
  showCombo(0);
  document.body.classList.remove('practice');
  clearInterval(endTimer);
  screen = null;
  route();
}
$('practice-btn').onclick = startPractice;
$('exit-practice').onclick = exitPractice;

// ---------- effects ----------
function replay(el, cls) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
function animate(el, cls, ms) {
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  return sleep(ms).then(() => el.classList.remove(cls));
}
function centerIn(el, host) {
  const a = el.getBoundingClientRect(), b = host.getBoundingClientRect();
  return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
}
function floatText(text, target, bad) {
  const p = centerIn(target, $('stage'));
  const d = document.createElement('div');
  d.className = 'dmg' + (bad ? ' bad' : '');
  d.textContent = text;
  d.style.left = p.x - 30 + 'px'; d.style.top = p.y - 80 + 'px';
  $('fx').append(d);
  setTimeout(() => d.remove(), 1000);
}
function burst(target, n = 18, colors = ['#f2c14e', '#ffdf8a', '#fff']) {
  const p = centerIn(target, $('stage'));
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'spark';
    const a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 110;
    s.style.cssText = `left:${p.x}px;top:${p.y}px;--dx:${Math.cos(a) * r}px;--dy:${Math.sin(a) * r}px;--c:${pick(colors)}`;
    $('fx').append(s);
    setTimeout(() => s.remove(), 700);
  }
}
function flash(color) {
  const f = document.createElement('div');
  f.className = 'flash'; f.style.background = color;
  document.body.append(f);
  setTimeout(() => f.remove(), 400);
}
function shake(el) { animate(el, 'shake', 400); }
function banner(t, s) {
  const b = document.createElement('div');
  b.className = 'banner';
  b.innerHTML = `<div><div class="t">${esc(t)}</div><div class="s">${esc(s)}</div></div>`;
  $('stage').append(b);
  setTimeout(() => b.remove(), 1800);
}
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 4000);
}

async function heroStrike(dmg) {
  const k = $('knight'), e = $('enemy');
  animate(k, 'attack', 450);
  await sleep(180);
  dmg ? sfx.bossHit() : sfx.slash();
  const sl = document.createElement('div');
  const p = centerIn(e, $('stage'));
  sl.className = 'slash'; sl.style.left = p.x - 90 + 'px'; sl.style.top = p.y - 90 + 'px';
  $('fx').append(sl); setTimeout(() => sl.remove(), 400);
  animate(e, 'hit', 700);
  burst(e, 14);
  floatText(dmg ? `-${dmg}` : 'CRIT!', e);
  if (dmg) shake($('stage'));
  await sleep(450);
}

async function killEnemy(stage) {
  const e = $('enemy');
  e.classList.add('die');
  sfx.die();
  burst(e, 26, ['#f2c14e', '#fff', getComputedStyle(document.documentElement).getPropertyValue('--accent')]);
  // the dropped letter flies up into the rune bar
  const slot = $('runes').querySelector(`[data-i="${stage}"]`);
  const from = e.getBoundingClientRect(), to = slot.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'flyer'; f.textContent = runeWord()[stage];
  f.style.left = from.left + from.width / 2 + 'px'; f.style.top = from.top + 'px';
  document.body.append(f);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    f.style.transform = `translate(${to.left - from.left - from.width / 2 + 8}px, ${to.top - from.top}px) scale(.8)`;
  }));
  await sleep(780);
  f.remove();
  sfx.coin();
  renderRunes();
  const s = $('runes').querySelector(`[data-i="${stage}"]`);
  s.animate([{ transform: 'scale(1.5)' }, { transform: 'translateY(-2px)' }], { duration: 350, easing: 'ease-out' });
}

async function enemyStrike() {
  const k = $('knight'), e = $('enemy');
  animate(e, 'e-attack', 450);
  await sleep(200);
  animate(k, 'hurt', 700);
  sfx.hurt();
  flash('rgba(255,40,60,.45)');
  shake($('s-game'));
  floatText('+10s', k, true);
  hearts--;
  renderHearts();
  if (hearts <= 0) { await sleep(500); hearts = 3; renderHearts(true); floatText('Knight recovers!', k); }
  await sleep(450);
}

// ---------- leaderboard + timers ----------
function renderBoard() {
  const ranked = rank(players);
  const myIdx = ranked.findIndex(p => p.id === me?.id);
  $('my-rank').textContent = practice ? 'Practice' : myIdx >= 0 ? `#${myIdx + 1} / ${ranked.length}` : '–';
  flipList($('lb'), ranked.slice(0, 10), p => p.id, (p, i) => `
    <span class="r">${i + 1}</span>
    <span class="nm">${esc(p.name)}</span>
    <span class="tm ${p.finished_at ? 'fin' : ''}">${p.finished_at ? fmt(p.total_ms) : p.stage >= TOTAL_STAGES ? 'BOSS' : `${p.stage}/12`}</span>
    <span class="bar"><i style="width:${progressPct(p)}%"></i></span>`);
  [...$('lb').children].forEach(li => li.classList.toggle('me', li.dataset.k === me?.id));
}

function myElapsed() {
  const e = curEv();
  if (!me || !e?.started_at) return 0;
  if (me.finished_at) return me.total_ms;
  const start = Math.max(new Date(me.created_at).getTime(), new Date(e.started_at).getTime());
  return now() - start + me.penalty_sec * 1000;
}

function tick() {
  if (screen !== 'game') return;
  const left = eventEnd(curEv()) - now();
  $('ev-time').textContent = fmt(left);
  $('ev-timer').classList.toggle('low', left < 60000);
  $('my-time').textContent = fmt(myElapsed());
  $('my-pen').textContent = me.penalty_sec ? `incl. +${me.penalty_sec}s penalty` : '';
  if (left <= 0 && !me.finished_at) timeUp();
}

// ---------- end screens ----------
function stats() {
  if (practice) return `<div class="stats">
    <div class="stat"><div class="v">${me.finished_at ? fmt(me.total_ms) : `${me.stage}/${stages()}`}</div><div class="l">${me.finished_at ? 'Practice time' : 'Monsters slain'}</div></div>
    <div class="stat"><div class="v">${me.boss_hp}</div><div class="l">Boss HP left</div></div>
    <div class="stat"><div class="v">${me.correct}</div><div class="l">Correct</div></div>
    <div class="stat"><div class="v">${me.wrong}</div><div class="l">Wrong (+${me.penalty_sec}s)</div></div>
  </div>`;
  const ranked = rank(players);
  const r = ranked.findIndex(p => p.id === me.id) + 1;
  return `<div class="stats">
    <div class="stat"><div class="v">${me.finished_at ? fmt(me.total_ms) : `${me.stage}/12`}</div><div class="l">${me.finished_at ? 'Final time' : 'Monsters slain'}</div></div>
    <div class="stat"><div class="v">#${r || '–'}</div><div class="l">Rank of ${ranked.length}</div></div>
    <div class="stat"><div class="v">${me.correct}</div><div class="l">Correct</div></div>
    <div class="stat"><div class="v">${me.wrong}</div><div class="l">Wrong (+${me.penalty_sec}s)</div></div>
  </div>`;
}

function practiceEnd(won) {
  show('end');
  setAccent(won ? '#3ddc84' : '#ff4d5e');
  if (won) { confetti($('confetti'), 2); sfx.victory(); } else sfx.lose();
  $('end').innerHTML = `
    <div class="kicker">Practice ${won ? 'complete' : 'over'}</div>
    <h2 class="title">${won ? 'YOU ARE READY!' : 'TIME IS UP'}</h2>
    <p class="sub" style="color:var(--muted);font-size:20px">Practice runs don't count. The real cavern has 12 monsters and new questions.</p>
    ${stats()}
    <div class="row" style="justify-content:center;margin-top:22px"><button class="btn" id="exit-practice-end">⚔ BACK TO THE GATE</button></div>`;
  $('exit-practice-end').onclick = exitPractice;
}

function victory() {
  if (practice) return practiceEnd(true);
  show('end');
  setAccent('#f2c14e');
  $('end').innerHTML = `
    <div class="kicker">The Summarizer has fallen</div>
    <h2 class="title">VICTORY, ${esc(me.name.toUpperCase())}!</h2>
    <div class="chest" id="chest">
      <div class="rays"></div><div class="glow"></div>
      ${spriteSVG('chestBody', null, 'cbody')}${spriteSVG('chestLid', null, 'clid')}
    </div>
    <div class="clue"><small>YOUR NEXT CLUE</small>${esc(ev?.clue || '')}</div>
    ${stats()}`;
  setTimeout(() => { $('chest')?.classList.add('open'); confetti($('confetti')); sfx.victory(); }, 700);
  // keep rank fresh while they celebrate
  clearInterval(endTimer);
  endTimer = setInterval(async () => { players = await fetchPlayers(); const s = $('end').querySelector('.stats'); if (s && me) s.outerHTML = stats(); }, 5000);
}

function timeUp() {
  if (screen === 'end') return;
  if (practice) return practiceEnd(false);
  show('end');
  setAccent('#ff4d5e');
  sfx.lose();
  $('end').innerHTML = `
    <div class="kicker">Time is up</div>
    <h2 class="title">THE CAVERN SEALS SHUT</h2>
    <p class="sub" style="color:var(--muted);font-size:20px">You fought bravely, ${esc(me.name)}. Here is how far you got:</p>
    ${stats()}`;
  clearInterval(endTimer);
  endTimer = setInterval(async () => {
    if (!cred) return;
    players = await fetchPlayers();
    const r = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
    if (r.data?.id) me = r.data;
    const s = $('end').querySelector('.stats');
    if (s && me) s.outerHTML = stats();
  }, 5000);
}
