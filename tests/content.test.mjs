// Content must match the stage layout hard-coded in SQL submit_answer (28 stages, bonus at stage % 7 === 6)
// and every activity must be solvable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENEMIES, ZONES, BOSS, RUNE_WORD, PRACTICE } from '../js/questions.js';
import { robotRun, robotSolve, bitsFor, activityReveal, ACTIVITY_LABEL } from '../js/activities.js';

test('stage layout matches the server', () => {
  assert.equal(ENEMIES.length, 28);
  ENEMIES.forEach((e, i) => assert.equal(!!e.bonus, i % 7 === 6, `stage ${i} bonus flag`));
  assert.equal(RUNE_WORD.length, ENEMIES.filter(e => !e.bonus).length);
  ZONES.forEach((z, zi) => ENEMIES.slice(zi * 7, zi * 7 + 7).forEach(e => assert.equal(e.zone, z.id)));
  ENEMIES.forEach(e => assert.ok(e.variants.length >= 2, e.name + ' needs 2+ variants'));
});

const all = [...ENEMIES, ...PRACTICE.enemies].flatMap(e => e.variants).concat(Object.values(BOSS.pool).flat(), Object.values(PRACTICE.boss).flat());

test('quiz answers are among their choices', () => {
  for (const q of all.filter(q => !q.type)) {
    assert.ok(q.choices.includes(q.answer), q.prompt);
    assert.equal(new Set(q.choices).size, q.choices.length, 'duplicate choice: ' + q.prompt);
  }
});

test('every activity is solvable', () => {
  for (const q of all.filter(q => q.type)) {
    assert.ok(ACTIVITY_LABEL[q.type], 'unknown type ' + q.type);
    assert.ok(activityReveal(q), 'no reveal for ' + q.prompt);
    switch (q.type) {
      case 'bits': assert.equal(bitsFor(q.target, q.bits).reduce((a, b) => a + b, 0), q.target, q.prompt); break;
      case 'order': assert.ok(q.items.length >= 3 && new Set(q.items).size === q.items.length, q.prompt); break;
      case 'type': assert.match(q.answer, /^[A-Z]+$/, q.prompt); break;
      case 'robot': {
        const path = robotSolve(q);
        assert.ok(path, 'maze unsolvable: ' + q.prompt);
        assert.ok(path.length <= q.max, `maze needs ${path.length} moves, limit ${q.max}`);
        assert.ok(robotRun(q, path).ok);
        break;
      }
      case 'sort': assert.ok(q.items.every(i => q.labels.includes(i[1])) && q.labels.length === 2, q.prompt); break;
      case 'shoot': assert.ok(q.good.length >= 2 && q.bad.length >= 2 && !q.good.some(g => q.bad.includes(g)), q.prompt); break;
      case 'drive': q.gates.forEach(g => assert.ok(g.lanes.length === 3 && g.lanes.includes(g.answer), g.q)); break;
      // catch needs good.length - 1 caught, so at least 3 good items keep it fair
      case 'catch': assert.ok(q.good.length >= 3 && q.bad.length >= 2 && !q.good.some(g => q.bad.includes(g)), q.prompt); break;
      case 'match': assert.ok(q.pairs.length >= 3 && new Set(q.pairs.flat()).size === q.pairs.length * 2, q.prompt); break;
    }
  }
});
