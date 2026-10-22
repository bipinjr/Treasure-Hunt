import { sb, syncClock, now, fmt, eventEnd, eventPhase, rank, progressPct, esc, fetchEvent, fetchPlayers, flipList, confetti, embers, stageLabel, TOTAL_STAGES } from './common.js';
import { ZONES, ENEMIES, BOSS, RUNE_WORD, PRACTICE, BOSS_GUIDE, BONUS_GUIDE, BONUS_SEC } from './questions.js';
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
// players' screens only need what ranking and the side board use; keeps traffic low with 120 PCs polling
const BOARD_COLS = 'id,name,stage,boss_hp,finished_at,total_ms,wrong,penalty_sec,bonus_sec,bonus_count';
let streak = 0;
let practice = false;   // local-only warm-up run: no server, not on the leaderboard
let pev = null;         // practice event clock

const enemies = () => practice ? PRACTICE.enemies : ENEMIES;
const stages = () => practice ? PRACTICE.enemies.length : TOTAL_STAGES;
const bossPool = d => practice ? PRACTICE.boss[d] : BOSS.pool[d];
const runeWord = () => practice ? PRACTICE.word : RUNE_WORD;
const curEv = () => practice ? pev : ev;
const isBonus = s => !practice && !!ENEMIES[s]?.bonus;
// Runes belong to monsters only: 6 per zone in the real run, one per monster in practice
const runeStage = i => practice ? i : i + Math.floor(i / 6);
let guidesSeen = new Set();

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
  [ev, players] = await Promise.all([fetchEvent(), fetchPlayers(BOARD_COLS)]);
  try { cred = JSON.parse(localStorage.getItem(KEY)); } catch { cred = null; }
  if (cred) {
    const { data, error } = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
    if (error || !data?.id) forget(); else { me = data; loadResults(); }
  }
  sb.channel('ev').on('postgres_changes', { event: '*', schema: 'public', table: 'event_state' }, p => { ev = p.new; route(); }).subscribe();
  setInterval(async () => { const e = await fetchEvent(); if (e) { ev = e; route(); } }, 5000);
  setInterval(refreshPlayers, 5000);
  setInterval(tick, 250);
  // presence heartbeat for the admin's "online now" view
  const ping = () => { if (cred && !practice && me && !me.finished_at) sb.rpc('ping', { p_id: cred.id, p_token: cred.token }); };
  setInterval(ping, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) ping(); });
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
  players = await fetchPlayers(BOARD_COLS);
  // admin reset deletes everyone: send this PC back to the name screen
  if (!practice && me && !players.some(p => p.id === me.id) && ev?.status === 'waiting') { forget(); clearInterval(endTimer); route(); return; }
  if (screen === 'lobby') renderLobby();
  if (screen === 'game') renderBoard();
}

function show(name) {
  if (screen === name) return;
  screen = name;
  for (const s of ['name', 'rules', 'lobby', 'game', 'end']) $('s-' + s).hidden = s !== name;
}

function route() {
  if (practice) return;
  if (!me) { if (screen !== 'rules') { show('name'); setTimeout(() => $('name')?.focus(), 50); } return; }
  if (me.finished_at) { if (screen !== 'end') victory(); return; }
  const phase = eventPhase(ev);
  if (phase === 'waiting') { show('lobby'); renderLobby(); }
  else if (phase === 'running') { if (screen !== 'game') startGame(); }
  else if (screen !== 'end') timeUp();
}

// ---------- join ----------
$('join').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('name').value.trim();
  if (!name) return;
  $('join-err').textContent = ''; $('rules-err').textContent = '';
  $('rules-name').textContent = name;
  $('agree').checked = false; $('rules-go').disabled = true;
  show('rules');
});
$('agree').onchange = () => { $('rules-go').disabled = !$('agree').checked; };
$('rules-back').onclick = () => { show('name'); $('name').focus(); };
$('rules-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!$('agree').checked) return;
  const name = $('name').value.trim();
  $('rules-go').disabled = true; $('rules-err').textContent = '';
  const { data, error } = await sb.rpc('join_game', { p_name: name });
  $('rules-go').disabled = false;
  if (error || !data?.[0]) {
    const m = error?.message || '';
    const text = m.includes('closed') ? 'The cavern is closed. Ask the organisers.'
      : m.includes('taken') || m.includes('duplicate') ? 'That name is already playing. Go back and add your surname or roll number.'
      : 'Could not join. Check the internet and try again.';
    $('rules-err').textContent = text; $('join-err').textContent = text;
    return;
  }
  cred = { id: data[0].player_id, token: data[0].token };
  localStorage.setItem(KEY, JSON.stringify(cred));
  const r = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
  me = r.data; results = []; hearts = 3; shownZone = null; bossIntroDone = false; usedBoss = new Set(); guidesSeen = new Set();
  players = await fetchPlayers(BOARD_COLS);
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
    const cls = results[i] === 'ok' || results[i] === 'bonus' ? 'done' : results[i] === 'miss' || results[i] === 'skip' ? 'miss' : i === me.stage ? 'now' : '';
    const group = practice ? 3 : 7;
    h += `<span class="pip ${cls} ${isBonus(i) ? 'star' : ''} ${i && i % group === 0 ? 'gap' : ''}"></span>`;
  }
  h += `<span class="skull ${me.stage >= stages() ? 'now' : ''}">💀</span>`;
  $('track').innerHTML = h;
}
function renderRunes() {
  $('runes').innerHTML = [...runeWord()].map((ch, i) => {
    const r = results[runeStage(i)];
    return `<span class="rune ${r === 'ok' ? 'got' : r === 'miss' ? 'lost' : ''} ${!practice && i && i % 6 === 0 ? 'gap' : ''}" data-i="${i}">${r === 'miss' ? '✕' : ch}</span>`;
  }).join('');
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
    const newZone = shownZone !== z.id;
    if (newZone) { shownZone = z.id; banner(title, sub); sfx.zone(); }
    enemyEl.querySelector('.body').innerHTML = spriteSVG(e.sprite, e.palette);
    if (e.bonus) enemyEl.classList.add('chest-foe');
    $('nameplate').innerHTML = e.bonus
      ? `<div class="n">⭐ BONUS CHEST</div><div class="d easy">right = −${BONUS_SEC}s · wrong = free</div>`
      : `<div class="n">${e.guardian ? '👑 ' : ''}${esc(e.name)}</div><div class="d ${e.difficulty}">${e.guardian ? 'zone guardian' : e.difficulty}</div>`;
    void enemyEl.offsetWidth; enemyEl.classList.add('enter');
    const q = pick(e.variants);
    const ask = () => { current = { q, choices: shuffle(q.choices), bonus: e.bonus }; renderQuestion(); };
    if (newZone && !practice) guide(`${title} · ${z.domain}`, z.guide, `zone-${z.id}`).then(ask);
    else if (e.bonus) guide('Bonus chest', BONUS_GUIDE, 'bonus').then(ask);
    else ask();
  } else {
    setAccent('#c27bff');
    $('zone-name').textContent = 'The Summarizer'; $('zone-domain').textContent = 'Final boss · all four zones';
    enemyEl.classList.add('boss');
    enemyEl.querySelector('.body').innerHTML = spriteSVG('boss');
    renderBossPlate();
    void enemyEl.offsetWidth; enemyEl.classList.add('enter');
    if (!bossIntroDone) { bossIntroDone = true; banner('THE SUMMARIZER', 'Final boss · 100 HP'); flash('rgba(140,60,230,.6)'); shake($('s-game')); sfx.roar(); }
    guide('The Summarizer', BOSS_GUIDE, 'boss').then(renderDiffPicker);
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
    <div class="q-foot"><p class="explain bad" id="explain">${!diff && !current.bonus && me.attempt ? 'Last try for this monster!' : ''}</p>${current.bonus ? '<button class="btn ghost skip" id="skip-bonus">Skip bonus (S)</button>' : ''}</div>`;
  replay($('qcard'), 'rise');
  $('qcard').querySelectorAll('.choice').forEach(b => b.onclick = () => answer(+b.dataset.i));
  if (current.bonus) $('skip-bonus').onclick = () => answer(-1);
}

addEventListener('keydown', e => {
  if (screen !== 'game' || e.target.tagName === 'INPUT') return;
  if (guideDone && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); guideDone(); return; }
  if (busy) return;
  if (current?.bonus && (e.key === 's' || e.key === 'S')) { answer(-1); return; }
  const n = parseInt(e.key, 10);
  if (!n) return;
  if (current && n <= current.choices.length) answer(n - 1);
  else if (!current && me.stage >= stages() && n <= 3) chooseDiff(['easy', 'medium', 'hard'][n - 1]);
});

async function answer(i) {
  if (busy || !current) return;
  const btns = [...$('qcard').querySelectorAll('.choice')];
  if (i >= 0 && btns[i]?.disabled) return;
  busy = true;
  const { q, choices, diff } = current;
  const ok = i >= 0 && choices[i] === q.answer;
  const boss = me.stage >= stages();
  // monsters give 2 attempts: the first miss keeps the question, the right answer stays hidden
  const retry = !boss && !current.bonus && !ok && !me.attempt;
  btns.forEach((b, j) => {
    b.disabled = true;
    if (retry) { if (j === i) b.classList.add('wrong', 'used'); }
    else if (choices[j] === q.answer) b.classList.add('right');
    else if (j === i) b.classList.add('wrong');
    else b.classList.add('dim');
  });
  const ex = $('explain');
  ex.className = 'explain ' + (ok ? 'ok' : 'bad');
  ex.textContent = retry ? '✘ Not quite: +10 sec. One more try!' : (ok ? '✔ Correct! ' : '✘ Not quite. ') + (q.explain || (ok ? '' : `Answer: ${q.answer}`));

  const before = { stage: me.stage, hp: me.boss_hp, attempt: me.attempt || 0 };
  const req = send(before, ok, diff);

  if (current.bonus) {
    $('skip-bonus').disabled = true;
    ex.textContent = ok ? `⭐ Bonus! ${BONUS_SEC} seconds off your time. ${q.explain || ''}` : `No bonus this time, no penalty either. ${q.explain || `Answer: ${q.answer}`}`;
    results[before.stage] = ok ? 'bonus' : 'skip'; saveResults();
    if (ok) {
      animate($('knight'), 'attack', 450);
      await sleep(250);
      $('enemy').classList.add('die');
      burst($('enemy'), 34, ['#f2c14e', '#ffdf8a', '#fff', '#3ddc84']);
      floatText(`−${BONUS_SEC}s`, $('enemy'));
      sfx.victory();
      await sleep(900);
    } else {
      sfx.click();
      await sleep(1300);
    }
  } else if (ok) {
    streak++;
    if (streak >= 2) showCombo(streak);
    await heroStrike(boss ? BOSS.damage[diff] : null);
    if (!boss) { results[before.stage] = 'ok'; saveResults(); await killEnemy(before.stage - (practice ? 0 : Math.floor(before.stage / 7))); }
  } else {
    streak = 0; showCombo(0);
    await enemyStrike();
    if (!boss && !retry) { results[before.stage] = 'miss'; saveResults(); renderRunes(); }
    await sleep(900); // time to read the right answer, or a short lock before the second try
  }

  const res = await req;
  if (res === 'timeup') { timeUp(); return; }
  if (res) me = res;
  if (!boss && !current.bonus && me.stage === before.stage && !me.finished_at) {
    // second attempt on the same monster
    btns.forEach(b => { if (!b.classList.contains('used')) b.disabled = false; });
    ex.textContent = '✘ +10 sec. Last try for this monster!';
    busy = false;
    return;
  }
  if (boss) {
    renderBossPlate();
    if (me.finished_at) {
      await sleep(300);
      $('enemy').classList.add('die');
      sfx.roar();
      burst($('enemy'), 40, ['#c27bff', '#f2c14e', '#fff']);
      flash('rgba(255,240,180,.7)');
      await sleep(900);
      players = await fetchPlayers(BOARD_COLS);
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
    // a hung request on bad Wi-Fi times out and retries; the server ignores repeats via the stage/attempt guard
    const { data, error } = await sb.rpc('submit_answer', { p_id: cred.id, p_token: cred.token, p_stage: before.stage, p_hp: before.hp, p_attempt: before.attempt, p_correct: ok, p_diff: diff || null })
      .abortSignal(AbortSignal.timeout(8000));
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
  if (p.stage < stages()) {
    if (ok) { p.stage++; p.attempt = 0; p.correct++; }
    else { p.wrong++; p.penalty_sec += 10; if (p.attempt) { p.stage++; p.attempt = 0; } else p.attempt = 1; }
  }
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
  me = { id: 'practice', name: $('name').value.trim() || 'Adventurer', stage: 0, boss_hp: 100, attempt: 0, correct: 0, wrong: 0, penalty_sec: 0, bonus_sec: 0, bonus_count: 0, tab_strikes: 0, restarts: 0, created_at: pev.started_at, finished_at: null, total_ms: null };
  results = []; hearts = 3; shownZone = null; bossIntroDone = false; usedBoss = new Set(); streak = 0; guidesSeen = new Set();
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

// ---------- tab-switch policy ----------
// Hiding the tab during a running round is a strike; the server restarts the run on the 3rd.
let pendingWarn = null;
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) {
    if (practice || !cred || !me || me.finished_at || screen !== 'game' || eventPhase(ev) !== 'running') return;
    const before = me;
    const { data } = await sb.rpc('report_tab_switch', { p_id: cred.id, p_token: cred.token });
    if (!data?.id) return;
    me = data;
    pendingWarn = data.restarts > (before.restarts || 0) ? 'restart' : data.tab_strikes;
  }
  if (!document.hidden && pendingWarn != null) showWarn();
});

function showWarn() {
  const w = pendingWarn; pendingWarn = null;
  if (w == null || document.querySelector('.warn-modal')) return;
  const restart = w === 'restart';
  sfx.hurt();
  const m = document.createElement('div');
  m.className = 'warn-modal';
  m.setAttribute('role', 'alertdialog');
  m.innerHTML = `
    <div class="panel warn-box ${restart ? 'restart' : ''}">
      <div class="warn-icon">${restart ? '💀' : '⚠️'}</div>
      <h2>${restart ? 'Back to checkpoint 1' : `Tab switch: strike ${w} of 3`}</h2>
      <p>${restart
        ? 'You left the game 3 times. Your run restarts from the first monster, your bonuses are gone, and the clock kept running.'
        : `Leaving this tab is against the rules. ${3 - w === 1 ? 'One more' : `${3 - w} more`} and you go back to checkpoint 1.`}</p>
      <button class="btn" id="warn-ok">I understand</button>
    </div>`;
  document.body.append(m);
  $('warn-ok').focus();
  $('warn-ok').onclick = () => {
    m.remove();
    if (restart) {
      results = []; saveResults();
      hearts = 3; streak = 0; showCombo(0); bossIntroDone = false; usedBoss = new Set(); shownZone = null; current = null; busy = false;
      renderRunes(); renderHearts(); renderTrack();
      spawn();
    }
  };
}
$('s-game').addEventListener('contextmenu', e => e.preventDefault());

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
// Tips card shown in the question area; resolves when the player continues
let guideDone = null;
function guide(title, tips, key) {
  if (guidesSeen.has(key)) return Promise.resolve();
  guidesSeen.add(key);
  return new Promise(res => {
    busy = true;
    $('qcard').innerHTML = `
      <div class="guide">
        <h3>📜 ${esc(title)}</h3>
        <ul>${tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <button class="btn" id="guide-go">Got it, fight! (Enter)</button>
      </div>`;
    replay($('qcard'));
    guideDone = () => { guideDone = null; busy = false; res(); };
    $('guide-go').onclick = guideDone;
    $('guide-go').focus();
  });
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

async function killEnemy(rune) {
  const e = $('enemy');
  e.classList.add('die');
  sfx.die();
  burst(e, 26, ['#f2c14e', '#fff', getComputedStyle(document.documentElement).getPropertyValue('--accent')]);
  // the dropped letter flies up into the rune bar
  const slot = $('runes').querySelector(`[data-i="${rune}"]`);
  const from = e.getBoundingClientRect(), to = slot.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'flyer'; f.textContent = runeWord()[rune];
  f.style.left = from.left + from.width / 2 + 'px'; f.style.top = from.top + 'px';
  document.body.append(f);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    f.style.transform = `translate(${to.left - from.left - from.width / 2 + 8}px, ${to.top - from.top}px) scale(.8)`;
  }));
  await sleep(780);
  f.remove();
  sfx.coin();
  renderRunes();
  const s = $('runes').querySelector(`[data-i="${rune}"]`);
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
    <span class="tm ${p.finished_at ? 'fin' : ''}">${p.bonus_count ? `⭐${p.bonus_count} ` : ''}${stageLabel(p)}</span>
    <span class="bar"><i style="width:${progressPct(p)}%"></i></span>`);
  [...$('lb').children].forEach(li => li.classList.toggle('me', li.dataset.k === me?.id));
}

function myElapsed() {
  const e = curEv();
  if (!me || !e?.started_at) return 0;
  if (me.finished_at) return me.total_ms;
  const start = Math.max(new Date(me.created_at).getTime(), new Date(e.started_at).getTime());
  return Math.max(0, now() - start + (me.penalty_sec - (me.bonus_sec || 0)) * 1000);
}

function tick() {
  if (screen !== 'game') return;
  const left = eventEnd(curEv()) - now();
  $('ev-time').textContent = fmt(left);
  $('ev-timer').classList.toggle('low', left < 60000);
  $('my-time').textContent = fmt(myElapsed());
  $('strikes').textContent = `👁 ${me.tab_strikes || 0}/3`;
  $('strikes').classList.toggle('hot', (me.tab_strikes || 0) >= 2);
  $('my-pen').innerHTML = [me.penalty_sec ? `<span class="bad">+${me.penalty_sec}s</span>` : '', me.bonus_sec ? `<span class="good">−${me.bonus_sec}s ⭐</span>` : ''].join(' ');
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
    <div class="stat"><div class="v">${me.finished_at ? fmt(me.total_ms) : `${me.stage}/${TOTAL_STAGES}`}</div><div class="l">${me.finished_at ? 'Final time' : 'Checkpoints'}</div></div>
    <div class="stat"><div class="v">#${r || '–'}</div><div class="l">Rank of ${ranked.length}</div></div>
    <div class="stat"><div class="v">⭐${me.bonus_count}</div><div class="l">Bonus (−${me.bonus_sec}s)</div></div>
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
    <p class="sub" style="color:var(--muted);font-size:20px">Practice runs don't count. The real cavern has 4 zones, 24 monsters, bonus chests and new questions.</p>
    ${stats()}
    <div class="row" style="justify-content:center;margin-top:22px"><button class="btn" id="exit-practice-end">⚔ BACK TO THE GATE</button></div>`;
  $('exit-practice-end').onclick = exitPractice;
}

// ---------- feedback (real runs only) ----------
const FB_STARS = [
  ['overall', 'How is the overall experience?', true],
  ['event', 'How was the BCA Tech Quest event overall?', true],
  ['organisation', 'How well was the event organised (timing, venue, instructions)?'],
  ['organisers', 'How helpful and friendly were the organisers and volunteers?'],
];
const fbKey = () => 'tq_fb_' + cred?.id;
function feedbackForm() {
  let sent = false;
  try { sent = !!localStorage.getItem(fbKey()); } catch {}
  if (sent) return '<div class="feedback done"><p>✔ Thanks for your feedback!</p></div>';
  const chips = (k, label, opts) => `
    <fieldset class="fb-q"><legend>${label}</legend>
      <div class="chips">${opts.map(v => `<label><input type="radio" name="${k}" value="${esc(v)}"><span>${esc(v)}</span></label>`).join('')}</div>
    </fieldset>`;
  const stars = (k, label, req) => `
    <fieldset class="fb-q"><legend>${label}${req ? ' <span class="req">*</span>' : ''}</legend>
      <div class="stars" role="radiogroup">${[5, 4, 3, 2, 1].map(n => `<label><input type="radio" name="${k}" value="${n}" ${req ? 'required' : ''}><span aria-hidden="true">★</span><span class="sr">${n} out of 5</span></label>`).join('')}</div>
    </fieldset>`;
  return `
    <form class="feedback" id="feedback">
      <h3>Help us make the next Tech Quest better</h3>
      ${FB_STARS.map(([k, l, r]) => stars(k, l, r)).join('')}
      <fieldset class="fb-q"><legend>Would you consider studying BCA at our college?</legend>
        <div class="chips">${['Yes', 'Maybe', 'No'].map(v => `<label><input type="radio" name="interest" value="${v}"><span>${v}</span></label>`).join('')}</div>
      </fieldset>
      <h4 class="fb-sub">About you</h4>
      ${chips('stream', 'Which stream are you in?', ['Science', 'Commerce', 'Arts', 'Other'])}
      ${chips('pu_year', 'Which year are you in?', ['1st PU', '2nd PU'])}
      ${chips('plan', 'What do you plan to study after PU?', ['BCA', 'BCom / BBA', 'BSc', 'Engineering', 'Other', 'Not decided'])}
      <fieldset class="fb-q"><legend>Your college name <span class="opt">(optional)</span></legend>
        <input class="fb-text" name="college" maxlength="120" autocomplete="off" placeholder="e.g. KLE PU College">
      </fieldset>
      <fieldset class="fb-q"><legend>Any suggestions for the organisers or the college? <span class="opt">(optional)</span></legend>
        <textarea name="comment" maxlength="500" rows="2" placeholder="What did you like? What should we do better next time?"></textarea>
      </fieldset>
      <button class="btn" type="submit">Send feedback</button>
      <p class="fb-msg" role="status"></p>
    </form>`;
}
function bindFeedback() {
  const f = $('feedback');
  if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault();
    const d = new FormData(f), msg = f.querySelector('.fb-msg');
    if (!d.get('overall') || !d.get('event')) { msg.textContent = 'Please rate the overall experience and the BCA event.'; return; }
    f.querySelector('button').disabled = true; msg.textContent = 'Sending…';
    const num = k => d.get(k) ? +d.get(k) : null;
    const { error } = await sb.rpc('submit_feedback', { p_id: cred.id, p_token: cred.token, p_overall: num('overall'), p_event: num('event'), p_organisation: num('organisation'), p_organisers: num('organisers'), p_interest: d.get('interest') || '', p_comment: d.get('comment') || '',
      p_stream: d.get('stream') || '', p_pu_year: d.get('pu_year') || '', p_plan: d.get('plan') || '', p_college: d.get('college') || '' });
    if (error) { f.querySelector('button').disabled = false; msg.textContent = 'Could not send. Check the internet and try again.'; return; }
    try { localStorage.setItem(fbKey(), '1'); } catch {}
    f.outerHTML = '<div class="feedback done"><p>✔ Thanks for your feedback!</p></div>';
    sfx.coin();
  };
}

// Shared PCs: hand the computer to the next student (their score stays saved on the server)
const nextPlayerBtn = () => '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn" id="next-player">🏠 Back to home · next player</button></div>';
function bindNextPlayer() {
  $('next-player').onclick = () => {
    if (!confirm('Finish and hand this PC to the next player? Your score is already saved.')) return;
    localStorage.removeItem(KEY);
    location.reload();
  };
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
    ${stats()}
    ${feedbackForm()}
    ${nextPlayerBtn()}`;
  bindFeedback(); bindNextPlayer();
  setTimeout(() => { $('chest')?.classList.add('open'); confetti($('confetti')); sfx.victory(); }, 700);
  // keep rank fresh while they celebrate
  clearInterval(endTimer);
  endTimer = setInterval(async () => { players = await fetchPlayers(BOARD_COLS); const s = $('end').querySelector('.stats'); if (s && me) s.outerHTML = stats(); }, 5000);
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
    ${stats()}
    ${feedbackForm()}
    ${nextPlayerBtn()}`;
  bindFeedback(); bindNextPlayer();
  clearInterval(endTimer);
  endTimer = setInterval(async () => {
    if (!cred) return;
    players = await fetchPlayers(BOARD_COLS);
    const r = await sb.rpc('get_player', { p_id: cred.id, p_token: cred.token });
    if (r.data?.id) me = r.data;
    const s = $('end').querySelector('.stats');
    if (s && me) s.outerHTML = stats();
  }, 5000);
}
