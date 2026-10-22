// Inline <script type="module"> blocks are not covered by node --check on js/, so syntax-check them here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('inline page scripts parse', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tq-'));
  for (const page of ['index.html', 'leaderboard.html', 'admin.html']) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
    [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)].forEach((m, i) => {
      const file = join(dir, `${page}.${i}.mjs`);
      writeFileSync(file, m[1]);
      assert.doesNotThrow(() => execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }), `${page} script ${i} has a syntax error`);
    });
  }
});

test('js modules parse', () => {
  for (const f of ['game', 'common', 'activities', 'questions', 'sprites', 'sfx']) {
    assert.doesNotThrow(() => execFileSync(process.execPath, ['--check', new URL(`../js/${f}.js`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')], { stdio: 'pipe' }), f);
  }
});
