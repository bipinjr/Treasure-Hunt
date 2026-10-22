// Content must match the stage layout hard-coded in SQL submit_answer: 28 stages, bonus at stage % 7 === 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ENEMIES, ZONES, BOSS, RUNE_WORD, PRACTICE } from '../js/questions.js';

test('stage layout matches the server', () => {
  assert.equal(ENEMIES.length, 28);
  ENEMIES.forEach((e, i) => assert.equal(!!e.bonus, i % 7 === 6, `stage ${i} bonus flag`));
  assert.equal(RUNE_WORD.length, ENEMIES.filter(e => !e.bonus).length);
  ZONES.forEach((z, zi) => ENEMIES.slice(zi * 7, zi * 7 + 7).forEach(e => assert.equal(e.zone, z.id)));
});

test('every answer is one of its choices', () => {
  const qs = [...ENEMIES, ...PRACTICE.enemies].flatMap(e => e.variants)
    .concat(Object.values(BOSS.pool).flat(), Object.values(PRACTICE.boss).flat());
  for (const q of qs) {
    assert.ok(q.choices.includes(q.answer), q.prompt);
    assert.equal(new Set(q.choices).size, q.choices.length, 'duplicate choice: ' + q.prompt);
  }
  ENEMIES.forEach(e => assert.ok(e.variants.length >= 2, e.name + ' needs 2+ variants'));
});
