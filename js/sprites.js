// Pixel-art sprites as character maps, rendered to crisp SVG.
// Keys: M main, m shade, k outline/dark, W highlight, e eye glow. '.' = transparent.

const MAPS = {
  knight: [
    '......rr........',
    '.....rrHHH......',
    '....rHHHHHh.....',
    '....HHvvvvh.....',
    '....HHHHHHh...W.',
    '.....hhhhh....W.',
    '...AAAAAAAAa.W..',
    '..sSSAAAAAAa.W..',
    '..SSSSAAAAAagW..',
    '..SsSSAAAAAagg..',
    '..SSSSbbbbba....',
    '...SS.AAaAA.....',
    '.....LLL.LLL....',
    '.....LLl.LLl....',
    '....DDDD.DDDD...',
  ],
  skeleton: [
    '....WWWWWW......',
    '...WWWWWWWW.....',
    '...WeeWWeeW.....',
    '...WeeWWeeW.....',
    '...WWWWWWWW.....',
    '....WkWkWk......',
    '......WW........',
    '...MMMMMMMM.....',
    '..W.MWWWWM.W....',
    '..W.MWWWWM.W....',
    '..W..MWWM..W....',
    '......WW........',
    '.....mmmm.......',
    '.....W..W.......',
    '....WW..WW......',
  ],
  bat: [
    '................',
    'M.............M.',
    'MM...M...M...MM.',
    'MMM..MMMMM..MMM.',
    'MMMM.MeMeM.MMMM.',
    'MMMMMMMMMMMMMMM.',
    '.MmMMMMMMMMMmM..',
    '..mM.MWkWM.Mm...',
    '...m..MMM..m....',
    '.......M........',
  ],
  ghost: [
    '.....WWWWW......',
    '...WWMMMMMWW....',
    '..WMMMMMMMMMW...',
    '..MMkkMMMkkMM...',
    '..MMkeMMMkeMM...',
    '..MMMMMMMMMMM...',
    '..MMMMkkkMMMM...',
    '..MMMMkkkMMMM...',
    '..MMMMMMMMMMM...',
    '..mMMMMMMMMMm...',
    '..mMMMMMMMMMm...',
    '..mM.mMM.mMMm...',
    '..m...m...m.....',
  ],
  magma: [
    '.......W........',
    '.....MMMMMM.....',
    '....MMWMMMMM....',
    '...MMWWMMMMMM...',
    '...MMMMMMMMMM...',
    '..MMMkMMMMkMMM..',
    '..MMMeMMMMeMMM..',
    '..MMMMMMMMMMMM..',
    '..MMMMkkkkMMMM..',
    '..mMMMMMMMMMMm..',
    '...mmmmmmmmmm...',
  ],
  golem: [
    '....mmmmmmm.....',
    '...mMMMMMMMm....',
    '...MMeeMeeMM....',
    '...MMMMMMMMM....',
    '...mMkkkkkMm....',
    '.mmMMMMMMMMMmm..',
    'mMMMMWMMMWMMMMm.',
    'MMM.MMMMMMM.MMM.',
    'MMM.MMMeMMM.MMM.',
    'mm..MMMMMMM..mm.',
    '....MMM.MMM.....',
    '....MMM.MMM.....',
    '...mmmm.mmmm....',
  ],
  robot: [
    '.......e........',
    '.......k........',
    '...MMMMMMMMM....',
    '...MkkkkkkkM....',
    '...MkeMMMekM....',
    '...MkkkkkkkM....',
    '...MMMMMMMMM....',
    '.....mmmmm......',
    '..MMMMMMMMMMM...',
    '.M.MWMMMMMWM.M..',
    '.M.MMMMMMMMM.M..',
    '.m.MMMeeeMMM.m..',
    '...MMMMMMMMM....',
    '....MM...MM.....',
    '....mm...mm.....',
  ],
  boss: [
    '..H................H..',
    '..HH..............HH..',
    '...HH...MMMMMM...HH...',
    '....HHMMMMMMMMMMHH....',
    '.....MMMMMMMMMMMM.....',
    '....MMMMMMMMMMMMMM....',
    '....MMeeeMMMMeeeMM....',
    '....MMekkMMMMkkeMM....',
    '....MMMMMMMMMMMMMM....',
    '....MMMMMMkkMMMMMM....',
    '.....MMkWkWkWkMMM.....',
    '.....MMkkkkkkkMM......',
    '......MMMMMMMMMM......',
    '...mmmMMMMMMMMMMmmm...',
    '..mmmMMMgggggMMMMmmm..',
    '.mmm.MMMgWWWgMMM.mmm..',
    '.mm..MMMgggggMMM..mm..',
    '.....MMMMMMMMMMMM.....',
    '......MMMM..MMMM......',
    '......mmmm..mmmm......',
  ],
  chestBody: [
    '.gggggggggggggg.',
    '.bBBBBBggBBBBBb.',
    '.bBBBBgkkgBBBBb.',
    '.bBBBBBggBBBBBb.',
    '.bBBBBBBBBBBBBb.',
    '.gggggggggggggg.',
    '.bbbbbbbbbbbbbb.',
  ],
  chestLid: [
    '...bbbbbbbbbb...',
    '..bBBBBBBBBBBb..',
    '.bBBBBBBBBBBBBb.',
    '.bBBBBBBBBBBBBb.',
  ],
  heart: [
    '.MM.MM.',
    'MWMMMMM',
    'MMMMMMM',
    '.MMMMM.',
    '..MMM..',
    '...M...',
  ],
};

const BASE = {
  knight: { r: '#e63946', H: '#d8dee9', h: '#8a94a6', v: '#1b1f2a', A: '#b8c2d1', a: '#6c7689', S: '#2f5bd3', s: '#f2c14e', W: '#f1f5ff', g: '#f2c14e', b: '#7a4b2a', L: '#4a5263', l: '#2e3442', D: '#3b2a1e' },
  skeleton: { W: '#efe9d8', M: '#8f8a7a', m: '#5d594d', k: '#1a1a1a', e: '#ff3b3b' },
  bat:      { M: '#5b4b8a', m: '#3a2f5c', W: '#ffffff', k: '#1a1a1a', e: '#ffd23f' },
  ghost:    { W: '#e6f3ff', M: '#a9c8ff', m: '#7894c9', k: '#1b2340', e: '#7df9ff' },
  magma:    { M: '#ff7a1a', m: '#b53d00', W: '#ffd27a', k: '#3a0f00', e: '#fff3a0' },
  golem:    { M: '#8a8f99', m: '#555a63', W: '#c9ced6', k: '#22252b', e: '#ff9b2f' },
  robot:    { M: '#b9c4d6', m: '#6f7b8f', W: '#ffffff', k: '#1e2633', e: '#7df9ff' },
  boss:     { M: '#6b2fb3', m: '#3d1670', H: '#e9d8a6', e: '#ffdf3f', k: '#14051f', W: '#ffffff', g: '#f2c14e' },
  chestBody:{ g: '#f2c14e', b: '#4a2a12', B: '#8b5a2b', k: '#1a0e05' },
  chestLid: { b: '#4a2a12', B: '#a06a35' },
  heart:    { M: '#ff3b5c', W: '#ffd0d8' },
};

// Zone recolors applied on top of the base palette
const ZONE_TINT = {
  forge:   { M: '#ff8a3d', m: '#a84a12', e: '#fff07a' },
  shields: { M: '#3ddc84', m: '#1f8a4f', e: '#eaff7a' },
  heart:   { M: '#c27bff', m: '#7a3cc2', e: '#7df9ff' },
  // knight armour per level (level = zones cleared + 1)
  lv2: { A: '#d08a4c', a: '#8a5528', H: '#e0a868', h: '#9a6232', r: '#ff8a3d', S: '#8a3a12' },
  lv3: { A: '#4fd18b', a: '#1f8a4f', H: '#8ef0b8', h: '#2a9a5a', r: '#eaff7a', S: '#1f6a3c' },
  lv4: { A: '#b07cff', a: '#6a3cc2', H: '#d6b8ff', h: '#7a4ad8', r: '#7df9ff', S: '#3a1670' },
  lv5: { A: '#ffd84a', a: '#c9922a', H: '#fff1a8', h: '#d9a23a', r: '#ff4d5e', S: '#b8283a', s: '#ffffff' },
};

export function spriteSVG(name, tint, cls = '') {
  const map = MAPS[name];
  const pal = { ...BASE[name], ...(tint ? ZONE_TINT[tint] : null) };
  const w = Math.max(...map.map(r => r.length));
  let rects = '';
  map.forEach((row, y) => {
    // merge horizontal runs of the same colour into one rect
    for (let x = 0; x < row.length;) {
      const c = row[x];
      let n = 1;
      while (row[x + n] === c) n++;
      if (c !== '.' && pal[c]) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${pal[c]}"/>`;
      x += n;
    }
  });
  return `<svg class="${cls}" viewBox="0 0 ${w} ${map.length}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${rects}</svg>`;
}

// Background drawings for each zone, layered behind the knight and the monsters
const SCENERY = {
  crypt: `<circle cx="860" cy="112" r="26" fill="#dfe8ff" opacity=".85"/><circle cx="851" cy="106" r="26" fill="#141024"/>
    <path d="M0 0 L120 0 M0 0 L90 70 M0 0 L30 110 M20 15 Q45 30 60 12 M12 40 Q40 52 70 35 M8 70 Q30 80 56 62" stroke="#9aa6c8" stroke-width="2" fill="none" opacity=".6"/>
    ${[[90, 'M90 186 v-50 a26 26 0 0 1 52 0 v50z'], [300, 'M300 186 v-38 a20 20 0 0 1 40 0 v38z'], [640, 'M640 186 v-46 a24 24 0 0 1 48 0 v46z'], [880, 'M880 186 v-36 a18 18 0 0 1 36 0 v36z']].map(([x, d]) => `<path d="${d}" fill="#3b3f57"/><path d="M${x + 14} ${150} h${x > 800 ? 8 : 24} M${x + (x > 800 ? 18 : 26)} 140 v24" stroke="#6b7194" stroke-width="4"/>`).join('')}
    <path d="M520 110 l12 6 l-12 6 l4 -6z M560 128 l10 5 l-10 5 l3 -5z" fill="#5b4b8a"/>`,
  forge: `<ellipse cx="500" cy="190" rx="520" ry="50" fill="#ff6a1a" opacity=".25"/>
    <g fill="#2e2a33"><path d="M120 186 h120 l-20 -16 h-80 z"/><rect x="150" y="146" width="60" height="24"/><path d="M110 146 h140 l-10 -14 h-120 z"/></g>
    ${[[760, 140, 34], [850, 150, 24], [690, 158, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#5a4a3a" stroke-width="${r / 3}" stroke-dasharray="${r / 4} ${r / 5}"/><circle cx="${x}" cy="${y}" r="${r / 3}" fill="#5a4a3a"/>`).join('')}
    <rect x="420" y="0" width="70" height="120" fill="#24202a"/><path d="M430 120 q25 -30 50 0" fill="#ff8a3d" opacity=".7"/>
    ${[460, 445, 475, 452].map((x, i) => `<circle cx="${x}" cy="${100 - i * 22}" r="3" fill="#ffd27a" opacity="${.9 - i * .2}"/>`).join('')}`,
  shields: `<g fill="#232b2a"><rect x="0" y="80" width="1000" height="106"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 50}" y="62" width="30" height="20"/>`).join('')}</g>
    <path d="M430 186 v-70 a70 70 0 0 1 140 0 v70z" fill="#121614"/><path d="M445 186 v-66 a55 55 0 0 1 110 0 v66" fill="none" stroke="#3ddc84" stroke-width="3" opacity=".5"/>
    ${[150, 300, 700, 850].map(x => `<rect x="${x}" y="90" width="4" height="70" fill="#4a4a4a"/><path d="M${x + 4} 92 h44 l-10 14 l10 14 h-44z" fill="#1f8a4f"/>`).join('')}
    ${[230, 780].map(x => `<path d="M${x} 110 h40 v22 q0 22 -20 30 q-20 -8 -20 -30z" fill="#2f6f4a" stroke="#eaff7a" stroke-width="2"/>`).join('')}`,
  heart: `${[[120, 186, 50], [190, 186, 34], [820, 186, 58], [900, 186, 38], [560, 186, 26]].map(([x, y, h]) => `<path d="M${x} ${y} l${h / 3} ${-h} l${h / 3} ${h}z" fill="#7a3cc2" opacity=".75"/><path d="M${x + h / 3} ${y - h} l${h / 6} ${h}" stroke="#d6b8ff" stroke-width="2" opacity=".6"/>`).join('')}
    <circle cx="500" cy="132" r="38" fill="#c27bff" opacity=".2"/><path d="M500 156 c-30 -22 -40 -36 -40 -50 a20 20 0 0 1 40 -6 a20 20 0 0 1 40 6 c0 14 -10 28 -40 50z" fill="#ff7ab8" opacity=".6"/>
    ${[300, 380, 650, 720].map((x, i) => `<circle cx="${x}" cy="${110 + i * 12}" r="3" fill="#7df9ff" opacity=".8"/>`).join('')}`,
  boss: `<g fill="none" stroke="#c27bff" opacity=".45"><circle cx="500" cy="140" r="56" stroke-width="3" stroke-dasharray="12 8"/><circle cx="500" cy="140" r="40" stroke-width="2"/><path d="M500 100 l36 62 h-72z" stroke-width="2"/></g>
    ${[200, 800].map(x => `<rect x="${x - 10}" y="110" width="20" height="76" fill="#2a1a40"/><path d="M${x} 104 q-10 -16 0 -30 q10 14 0 30" fill="#c27bff"/>`).join('')}`,
};
export const sceneSVG = id => `<svg viewBox="0 0 1000 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${SCENERY[id] || ''}</svg>`;
