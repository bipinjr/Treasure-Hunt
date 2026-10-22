// Hands-on activities. renderActivity draws one into `host` and calls done(ok) once, when the player checks.
// The game engine handles scoring, retries and the answer reveal (activityReveal), exactly like a quiz question.

export const ACTIVITY_LABEL = { bits: '💡 Light the bulbs', order: '🧩 Put it in order', type: '🔐 Crack the code', robot: '🤖 Robot coder', sort: '🛡️ Sort it out', shoot: '🎯 Shooting gallery', drive: '🏎️ Lane racer', catch: '🧺 Catch it', match: '🃏 Memory match' };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const ARROW = { U: '⬆️', D: '⬇️', L: '⬅️', R: '➡️' };
export const DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

// ---------- pure helpers (also used by tests) ----------
export function robotRun(cfg, cmds) {
  const walls = new Set(cfg.walls.map(w => w.join(',')));
  let [x, y] = cfg.start;
  const path = [[x, y]];
  for (const c of cmds) {
    const nx = x + DIRS[c][0], ny = y + DIRS[c][1];
    if (nx < 0 || ny < 0 || nx >= cfg.size || ny >= cfg.size || walls.has(`${nx},${ny}`)) return { path, ok: false, crashed: true };
    x = nx; y = ny; path.push([x, y]);
  }
  return { path, ok: x === cfg.goal[0] && y === cfg.goal[1], crashed: false };
}

// Shortest command list from start to goal (breadth-first search), or null if unreachable
export function robotSolve(cfg) {
  const walls = new Set(cfg.walls.map(w => w.join(',')));
  const key = p => p.join(','), seen = new Map([[key(cfg.start), []]]), queue = [cfg.start];
  while (queue.length) {
    const p = queue.shift(), cmds = seen.get(key(p));
    if (p[0] === cfg.goal[0] && p[1] === cfg.goal[1]) return cmds;
    for (const [c, [dx, dy]] of Object.entries(DIRS)) {
      const n = [p[0] + dx, p[1] + dy];
      if (n[0] < 0 || n[1] < 0 || n[0] >= cfg.size || n[1] >= cfg.size || walls.has(key(n)) || seen.has(key(n))) continue;
      seen.set(key(n), [...cmds, c]);
      queue.push(n);
    }
  }
  return null;
}

export function bitsFor(target, vals) {
  let left = target;
  return vals.filter(v => (left >= v ? (left -= v, true) : false));
}

// Text shown when the player runs out of tries
export function activityReveal(q) {
  switch (q.type) {
    case 'bits': return `${bitsFor(q.target, q.bits).join(' + ')} = ${q.target}`;
    case 'order': return q.items.join(' → ');
    case 'type': return q.answer;
    case 'robot': return `One way: ${robotSolve(q).map(c => ARROW[c]).join(' ')}`;
    case 'sort': return `${q.labels[1]}: ${q.items.filter(i => i[1] === q.labels[1]).map(i => i[0]).join(' · ')}`;
    case 'shoot': return `Targets: ${q.good.join(' · ')}`;
    case 'drive': return q.gates.map(g => `${g.q} ${g.answer}`).join(' · ');
    case 'catch': return `Catch: ${q.good.join(' · ')}`;
    case 'match': return q.pairs.map(p => `${p[0]} = ${p[1]}`).join(' · ');
  }
  return '';
}

// ---------- renderers ----------
export function renderActivity(q, host, done) {
  let finished = false;
  const finish = ok => { if (finished) return; finished = true; host.querySelectorAll('button, input').forEach(b => b.disabled = true); done(ok); };
  RENDER[q.type](q, host, finish);
}

const RENDER = {
  bits(q, host, finish) {
    const on = q.bits.map(() => false);
    host.innerHTML = `
      <div class="bulbs">${q.bits.map((v, i) => `<button class="bulb" data-i="${i}" aria-pressed="false" aria-label="Bulb worth ${v}"><span class="glass"></span><b>${v}</b></button>`).join('')}</div>
      <div class="act-row"><span class="act-total">Lit total: <b id="bits-total">0</b> · Target: <b>${q.target}</b></span><button class="btn act-check" id="act-check">Check</button></div>`;
    const total = () => q.bits.reduce((a, v, i) => a + (on[i] ? v : 0), 0);
    host.querySelectorAll('.bulb').forEach(b => b.onclick = () => {
      const i = +b.dataset.i; on[i] = !on[i];
      b.classList.toggle('on', on[i]); b.setAttribute('aria-pressed', on[i]);
      host.querySelector('#bits-total').textContent = total();
    });
    host.querySelector('#act-check').onclick = () => finish(total() === q.target);
  },

  order(q, host, finish) {
    const pool = shuffle(q.items.map((t, i) => ({ t, i })));
    const picked = [];
    const draw = () => {
      host.innerHTML = `
        <div class="order-slots">${q.items.map((_, k) => picked[k]
          ? `<button class="slot filled" data-k="${k}" aria-label="Remove step ${k + 1}"><i>${k + 1}</i>${esc(picked[k].t)}</button>`
          : `<div class="slot"><i>${k + 1}</i></div>`).join('')}</div>
        <div class="order-pool">${pool.filter(p => !picked.includes(p)).map(p => `<button class="tile" data-i="${p.i}">${esc(p.t)}</button>`).join('')}</div>
        <div class="act-row"><span class="act-hint">Tap the steps in order. Tap a placed step to take it back.</span><button class="btn act-check" id="act-check" ${picked.length < q.items.length ? 'disabled' : ''}>Check</button></div>`;
      host.querySelectorAll('.tile').forEach(b => b.onclick = () => { picked.push(pool.find(p => p.i === +b.dataset.i)); draw(); });
      host.querySelectorAll('.slot.filled').forEach(b => b.onclick = () => { picked.splice(+b.dataset.k); draw(); });
      host.querySelector('#act-check').onclick = () => finish(picked.every((p, k) => p.i === k));
    };
    draw();
  },

  type(q, host, finish) {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    host.innerHTML = `
      ${q.alphabet ? `<div class="abc" aria-hidden="true">${[...abc].map(c => `<span>${c}</span>`).join('')}</div>` : ''}
      <form class="act-type" autocomplete="off">
        <input class="field act-input" maxlength="20" spellcheck="false" autocapitalize="characters" aria-label="Your answer" placeholder="Type the word">
        <button class="btn act-check" id="act-check">Check</button>
      </form>`;
    const input = host.querySelector('input');
    host.querySelector('form').onsubmit = e => {
      e.preventDefault();
      const v = input.value.trim().toUpperCase();
      if (v) finish(v === q.answer.toUpperCase());
    };
    setTimeout(() => input.focus(), 50);
  },

  robot(q, host, finish) {
    const cmds = [];
    const max = q.max || 12;
    const cell = (x, y) => {
      if (x === q.goal[0] && y === q.goal[1]) return '⭐';
      if (q.walls.some(w => w[0] === x && w[1] === y)) return '🧱';
      return '';
    };
    host.innerHTML = `
      <div class="robot-wrap">
        <div class="grid" style="--n:${q.size}">${Array.from({ length: q.size * q.size }, (_, k) => {
          const x = k % q.size, y = Math.floor(k / q.size);
          return `<div class="cell ${cell(x, y) === '🧱' ? 'wall' : ''}" data-xy="${x},${y}">${cell(x, y)}</div>`;
        }).join('')}<div class="bot" id="bot">🤖</div></div>
        <div class="robot-ctl">
          <div class="pad">${['U', 'L', 'R', 'D'].map(c => `<button class="pad-btn pad-${c}" data-c="${c}" aria-label="Move ${{ U: 'up', D: 'down', L: 'left', R: 'right' }[c]}">${ARROW[c]}</button>`).join('')}</div>
          <div class="program" id="program" aria-live="polite"></div>
          <div class="row"><button class="btn ghost" id="undo">Undo</button><button class="btn act-check" id="act-check" disabled>▶ Run</button></div>
        </div>
      </div>`;
    const bot = host.querySelector('#bot');
    const place = ([x, y]) => { bot.style.transform = `translate(calc(${x} * var(--c)), calc(${y} * var(--c)))`; };
    place(q.start);
    const draw = () => {
      host.querySelector('#program').innerHTML = cmds.length ? cmds.map(c => `<span>${ARROW[c]}</span>`).join('') : `<em>Add up to ${max} moves</em>`;
      host.querySelector('#act-check').disabled = !cmds.length;
    };
    host.querySelectorAll('.pad-btn').forEach(b => b.onclick = () => { if (cmds.length < max) { cmds.push(b.dataset.c); draw(); } });
    host.querySelector('#undo').onclick = () => { cmds.pop(); draw(); };
    host.querySelector('#act-check').onclick = async () => {
      host.querySelectorAll('button').forEach(b => b.disabled = true);
      const res = robotRun(q, cmds);
      for (const p of res.path.slice(1)) { place(p); await new Promise(r => setTimeout(r, 260)); }
      if (res.crashed) bot.classList.add('crash');
      await new Promise(r => setTimeout(r, 250));
      finish(res.ok);
    };
    draw();
  },

  sort(q, host, finish) {
    const items = shuffle(q.items);
    const picks = items.map(() => null);
    host.innerHTML = `
      <div class="sort-list">${items.map(([t], i) => `
        <div class="sort-row"><span>${esc(t)}</span>
          <div class="sort-btns">${q.labels.map((l, j) => `<button class="sort-btn s${j}" data-i="${i}" data-l="${esc(l)}" aria-pressed="false">${esc(l)}</button>`).join('')}</div>
        </div>`).join('')}</div>
      <div class="act-row"><span class="act-hint">Choose for every line, then check.</span><button class="btn act-check" id="act-check" disabled>Check</button></div>`;
    host.querySelectorAll('.sort-btn').forEach(b => b.onclick = () => {
      const i = +b.dataset.i; picks[i] = b.dataset.l;
      b.parentElement.querySelectorAll('.sort-btn').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      host.querySelector('#act-check').disabled = picks.includes(null);
    });
    host.querySelector('#act-check').onclick = () => finish(items.every((it, i) => it[1] === picks[i]));
  },

  // Targets drift across the range; hit every good one, at most one wrong hit allowed
  shoot(q, host, finish) {
    const secs = q.seconds || 14;
    host.innerHTML = `
      <div class="range" id="range" aria-label="Shooting range"><div class="range-hud"><span>🎯 <b id="hits">0</b> / ${q.good.length}</span><span>❌ <b id="miss">0</b> / 1</span><span>⏱ <b id="secs">${secs}</b>s</span></div></div>
      <div class="act-row"><span class="act-hint">Get ready… click to shoot only the right targets!</span></div>`;
    const range = host.querySelector('#range');
    let hits = 0, miss = 0, over = false;
    const end = ok => { if (over) return; over = true; range.querySelectorAll('.target').forEach(t => t.disabled = true); setTimeout(() => finish(ok), 500); };
    setTimeout(() => {   // starts by itself a moment after it appears
      const all = shuffle([...q.good.map(t => [t, true]), ...q.bad.map(t => [t, false])]);
      all.forEach(([text, good], k) => setTimeout(() => {
        if (over) return;
        const b = document.createElement('button');
        b.className = 'target';
        b.textContent = text;
        b.style.top = `${14 + Math.random() * 64}%`;
        b.style.animationDuration = `${5 + Math.random() * 2}s`;
        b.classList.add(k % 2 ? 'ltr' : 'rtl');
        b.onclick = () => {
          b.disabled = true; b.classList.add(good ? 'hit' : 'bad');
          if (good) { hits++; host.querySelector('#hits').textContent = hits; if (hits === q.good.length) end(true); }
          else { miss++; host.querySelector('#miss').textContent = miss; if (miss > 1) end(false); }
        };
        b.onanimationend = () => b.remove();
        range.append(b);
      }, k * ((secs - 6) * 1000 / all.length)));
      let left = secs;
      const t = setInterval(() => {
        if (over) return clearInterval(t);
        host.querySelector('#secs').textContent = --left;
        if (left <= 0) { clearInterval(t); end(hits === q.good.length); }
      }, 1000);
    }, 1000);
  },

  // Answer gates roll toward the car; steer into the right lane before each gate arrives
  drive(q, host, finish) {
    let lane = 1, g = 0, over = false;
    host.innerHTML = `
      <div class="road" id="road" tabindex="0" aria-label="Race track: use left and right arrow keys">
        <div class="lanes">${[0, 1, 2].map(i => `<div class="lane" data-l="${i}"></div>`).join('')}</div>
        <div class="gate" id="gate"></div>
        <div class="car" id="car"><svg viewBox="0 0 40 64" aria-hidden="true"><rect x="3" y="10" width="6" height="12" rx="2" fill="#111"/><rect x="31" y="10" width="6" height="12" rx="2" fill="#111"/><rect x="3" y="42" width="6" height="12" rx="2" fill="#111"/><rect x="31" y="42" width="6" height="12" rx="2" fill="#111"/><rect x="7" y="4" width="26" height="56" rx="11" fill="var(--accent)"/><rect x="11" y="16" width="18" height="12" rx="4" fill="#bfe9ff"/><rect x="11" y="40" width="18" height="8" rx="3" fill="#8fc7e6"/><rect x="18" y="4" width="4" height="56" fill="rgba(255,255,255,.55)"/></svg></div>
        <div class="road-q" id="road-q"></div>
      </div>
      <div class="act-row"><span class="act-hint">⬅️ ➡️ arrow keys (or click a lane) to steer into the right answer</span></div>`;
    const road = host.querySelector('#road'), car = host.querySelector('#car'), gate = host.querySelector('#gate');
    const steer = l => { if (over) return; lane = Math.max(0, Math.min(2, l)); car.style.left = `${lane * 33.33 + 16.66}%`; };
    steer(1);
    road.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); steer(lane - 1); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); steer(lane + 1); }
    });
    host.querySelectorAll('.lane').forEach(l => l.onclick = () => steer(+l.dataset.l));
    const nextGate = () => {
      const G = q.gates[g];
      host.querySelector('#road-q').textContent = `${g + 1}/${q.gates.length}  ${G.q}`;
      gate.innerHTML = G.lanes.map(t => `<span>${esc(t)}</span>`).join('');
      gate.classList.remove('roll'); void gate.offsetWidth; gate.classList.add('roll');
    };
    gate.onanimationend = () => {
      const G = q.gates[g];
      const ok = G.lanes[lane] === G.answer;
      gate.children[lane]?.classList.add(ok ? 'pass' : 'crash');
      if (!ok) { over = true; car.classList.add('crash'); setTimeout(() => finish(false), 700); return; }
      car.classList.add('boost'); setTimeout(() => car.classList.remove('boost'), 400);
      if (++g === q.gates.length) { over = true; setTimeout(() => finish(true), 600); return; }
      setTimeout(nextGate, 450);
    };
    road.focus();
    setTimeout(nextGate, 1200);   // engine starts by itself
  },

  // Items fall; move the basket (mouse or arrow keys) to catch the right ones. Allowed: miss 1 good, catch 1 bad.
  catch(q, host, finish) {
    const need = q.good.length - 1;
    host.innerHTML = `
      <div class="sky" id="sky" tabindex="0" aria-label="Catch game: move with mouse or arrow keys">
        <div class="range-hud"><span>🧺 <b id="got">0</b> / ${need}</span><span>❌ <b id="bad">0</b> / 1</span></div>
        <div class="basket" id="basket">🧺</div>
      </div>
      <div class="act-row"><span class="act-hint">Move the mouse or use ⬅️ ➡️ to catch the right ones!</span></div>`;
    const sky = host.querySelector('#sky'), basket = host.querySelector('#basket');
    let x = 0.5, got = 0, bad = 0, over = false;
    const place = () => { basket.style.left = `${x * 100}%`; };
    place();
    sky.addEventListener('mousemove', e => { const r = sky.getBoundingClientRect(); x = Math.min(.95, Math.max(.05, (e.clientX - r.left) / r.width)); place(); });
    sky.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); x = Math.max(.05, x - .12); place(); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); x = Math.min(.95, x + .12); place(); }
    });
    sky.focus();
    const end = ok => { if (over) return; over = true; setTimeout(() => finish(ok), 500); };
    const items = shuffle([...q.good.map(t => [t, true]), ...q.bad.map(t => [t, false])]);
    let left = items.length;
    items.forEach(([text, good], k) => setTimeout(() => {
      if (over) return;
      const el = document.createElement('div');
      el.className = 'drop';
      el.textContent = text;
      const ix = .1 + Math.random() * .8;
      el.style.left = `${ix * 100}%`;
      sky.append(el);
      const t0 = performance.now(), dur = 3200;
      const step = now => {
        if (over) return el.remove();
        const p = (now - t0) / dur;
        el.style.top = `${p * 82}%`;
        if (p < 1) return requestAnimationFrame(step);
        const caught = Math.abs(ix - x) < .13;   // basket half-width as a share of the sky
        el.classList.add(caught ? (good ? 'yum' : 'yuck') : 'gone');
        setTimeout(() => el.remove(), 400);
        if (caught && good) host.querySelector('#got').textContent = ++got;
        if (caught && !good) { host.querySelector('#bad').textContent = ++bad; if (bad > 1) return end(false); }
        if (got >= need) return end(true);
        if (--left === 0) end(got >= need);
      };
      requestAnimationFrame(step);
    }, 900 + k * 1300));
  },

  // Flip two cards at a time to find matching pairs; a few wrong flips are allowed
  match(q, host, finish) {
    const cards = shuffle(q.pairs.flatMap((p, i) => [{ t: p[0], i }, { t: p[1], i }]));
    let lives = q.pairs.length + 2, open = [], found = 0, lock = true;
    host.innerHTML = `
      <div class="mem-hud">❤️ Wrong flips left: <b id="lives">${lives}</b></div>
      <div class="memory">${cards.map((c, k) => `<button class="mcard up" data-k="${k}"><span>${esc(c.t)}</span></button>`).join('')}</div>
      <div class="act-row"><span class="act-hint">Remember them! Then find the pairs.</span></div>`;
    const btns = [...host.querySelectorAll('.mcard')];
    setTimeout(() => { btns.forEach(b => b.classList.remove('up')); lock = false; host.querySelector('.act-hint').textContent = 'Flip two cards to find a matching pair.'; }, 2500);
    btns.forEach(b => b.onclick = () => {
      if (lock || b.classList.contains('up')) return;
      b.classList.add('up'); open.push(b);
      if (open.length < 2) return;
      const [a, c] = open; open = [];
      if (cards[a.dataset.k].i === cards[c.dataset.k].i) {
        a.classList.add('done'); c.classList.add('done');
        if (++found === q.pairs.length) setTimeout(() => finish(true), 500);
      } else {
        lock = true;
        host.querySelector('#lives').textContent = --lives;
        setTimeout(() => { a.classList.remove('up'); c.classList.remove('up'); lock = false; if (lives <= 0) finish(false); }, 800);
      }
    });
  },
};
