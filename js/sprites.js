// Pixel-art sprites as character maps, rendered to crisp SVG.
// Keys: M main, m shade, k outline/dark, W highlight, e eye glow. '.' = transparent.

const MAPS = {
  knight: [
    '........rrr.........',
    '.......rrrr.........',
    '......gHHHHg........',
    '.....HHHHHHHh.......',
    '.....HvvvvvHh....W..',
    '.....HHHHHHHh....W..',
    '......hhhhhh.....W..',
    '...ggAAAAAAAgg...W..',
    '..ggAAaAsAaAAgg..W..',
    '.CcSSSSAsssAAAa.gWg.',
    '.CcSsssSAsAAAAa..b..',
    '.CcSsssSAAAAAaa..b..',
    '.CcSSsSSbgbbbAa.....',
    '.Cc.SSSAAaAaAa......',
    '..c..AAA.AAA........',
    '..c..LLL.LLL........',
    '.....LlL.LlL........',
    '....gDDD.DDDg.......',
    '....DDDD.DDDD.......',
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
  knight: { r: '#e63946', H: '#e3e8f0', h: '#8a94a6', v: '#0d1018', A: '#b8c2d1', a: '#6c7689', g: '#f2c14e', S: '#2f5bd3', s: '#f2c14e', C: '#6e0f1e', c: '#b81d32', W: '#f4f8ff', b: '#5a3a20', L: '#4a5263', l: '#2e3442', D: '#2c2420' },
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
  // knight armour per level (level = zones cleared + 1): bronze, emerald, royal violet, then gold for the boss
  lv2: { A: '#cf8a4e', a: '#7f4c22', H: '#e9b27a', h: '#94602f', r: '#ff9a3d', S: '#7a2e10', c: '#c2562a', C: '#6b2a10' },
  lv3: { A: '#4fd18b', a: '#1c7a45', H: '#9cf3c4', h: '#2a8f58', r: '#eaff7a', S: '#145a33', c: '#2a8f58', C: '#0f4a2a' },
  lv4: { A: '#a57cff', a: '#5a33b0', H: '#d9c2ff', h: '#7550d0', r: '#7df9ff', S: '#2f1466', c: '#7a3cc2', C: '#3a1670' },
  lv5: { A: '#ffd84a', a: '#b8801f', H: '#fff2b0', h: '#d9a23a', r: '#ffffff', S: '#a8202f', s: '#ffffff', g: '#fff6d0', c: '#d42a3c', C: '#7a0f1c' },
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

// Outdoor scenes for each zone, drawn behind the knight and the monsters (viewBox 1000 x 300)
const STARS = [[60, 40], [140, 90], [210, 30], [300, 70], [380, 25], [450, 95], [520, 50], [610, 30], [690, 80], [760, 20], [930, 60], [980, 110], [40, 130], [250, 120], [570, 115]];
const stars = (fill = '#fff') => STARS.map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${(i % 5) * .6}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.4 : 2.2}" fill="${fill}"/>`).join('');
const pines = (xs, y, h, fill) => xs.map(x => `<path d="M${x} ${y} l${h * .32} 0 l${-h * .32} ${-h} l${-h * .32} ${h}z" fill="${fill}"/><rect x="${x - 2}" y="${y}" width="4" height="${h * .12}" fill="${fill}"/>`).join('');
const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1000" height="300" fill="url(#${id})"/>`;
const cloud = (x, y, s, fill, op) => `<g class="drift" opacity="${op}"><ellipse cx="${x}" cy="${y}" rx="${44 * s}" ry="${14 * s}" fill="${fill}"/><ellipse cx="${x - 26 * s}" cy="${y + 4 * s}" rx="${26 * s}" ry="${10 * s}" fill="${fill}"/><ellipse cx="${x + 28 * s}" cy="${y + 3 * s}" rx="${30 * s}" ry="${11 * s}" fill="${fill}"/></g>`;

const SCENERY = {
  // Zone 1: moonlit graveyard hills
  crypt: `${sky('skC', '#070d24', '#24346a')}${stars()}
    <circle cx="820" cy="88" r="70" fill="#f4f1d0" opacity=".12"/><circle cx="820" cy="88" r="36" fill="#f6f2d6"/><circle cx="808" cy="80" r="6" fill="#ddd8b8"/><circle cx="830" cy="98" r="4" fill="#ddd8b8"/>
    ${cloud(260, 70, 1.4, '#9fb0e0', .25)}${cloud(620, 50, 1, '#9fb0e0', .2)}
    <path d="M0 185 Q140 140 300 172 T620 160 T1000 168 V300 H0z" fill="#1b2650"/>
    <path d="M0 214 Q220 178 440 204 T1000 198 V300 H0z" fill="#111a38"/>
    ${pines([70, 110, 150, 860, 905, 950], 210, 70, '#0b1228')}
    ${[[300, 200], [345, 198], [690, 196]].map(([x, y]) => `<path d="M${x} ${y} v-22 a10 10 0 0 1 20 0 v22z" fill="#3a4470"/><path d="M${x + 7} ${y - 16} h6 M${x + 10} ${y - 20} v10" stroke="#5a6699" stroke-width="2"/>`).join('')}
    <rect class="drift" x="-40" y="196" width="1080" height="26" fill="#cfd8ff" opacity=".07"/>
    <rect y="214" width="1000" height="86" fill="#0b1124"/>`,
  // Zone 2: volcano at dusk with a lava river
  forge: `${sky('skF', '#2a0710', '#ff8a4a')}
    <circle cx="190" cy="170" r="70" fill="#ffd08a" opacity=".2"/><circle cx="190" cy="170" r="34" fill="#ffc27a" opacity=".85"/>
    ${cloud(380, 60, 1.2, '#5a2a2a', .5)}${cloud(820, 80, 1, '#5a2a2a', .45)}
    <path d="M0 200 L120 160 L210 185 L330 150 L460 192 V300 H0z" fill="#4a1c16"/>
    <path d="M520 214 L650 84 L690 84 L830 214z" fill="#2a120e"/><ellipse cx="670" cy="86" rx="22" ry="6" fill="#ff6a1a"/>
    <path d="M664 90 q-10 40 -26 70 q-8 20 -30 54" stroke="#ff7a2a" stroke-width="6" fill="none" opacity=".9"/>
    ${[0, 1, 2].map(i => `<circle class="drift" cx="${672 + i * 14}" cy="${66 - i * 18}" r="${10 + i * 6}" fill="#6b5555" opacity="${.55 - i * .12}"/>`).join('')}
    <path d="M760 214 L860 170 L940 196 L1000 180 V300 H760z" fill="#3a160f"/>
    <rect y="212" width="1000" height="88" fill="#1c0b07"/>
    <path d="M0 252 Q200 238 380 256 T760 250 T1000 258" stroke="#ff7a2a" stroke-width="10" fill="none" opacity=".75"/><path d="M0 252 Q200 238 380 256 T760 250 T1000 258" stroke="#ffd27a" stroke-width="3" fill="none"/>`,
  // Zone 3: pine forest and castle at sunset
  shields: `${sky('skS', '#2c4a7c', '#f6a96b')}
    <circle cx="760" cy="176" r="46" fill="#ffd9a0" opacity=".85"/>
    ${cloud(220, 60, 1.3, '#ffffff', .35)}${cloud(560, 80, 1, '#ffe6cc', .35)}${cloud(900, 50, .9, '#ffffff', .3)}
    <path d="M0 190 Q180 150 360 178 T700 165 T1000 175 V300 H0z" fill="#3e6a52"/>
    <g fill="#283c34"><rect x="430" y="118" width="140" height="70"/><rect x="410" y="96" width="34" height="92"/><rect x="556" y="96" width="34" height="92"/>
      ${[430, 450, 470, 490, 510, 530, 550].map(x => `<rect x="${x}" y="110" width="12" height="10"/>`).join('')}
      <path d="M406 98 l21 -30 l21 30z M552 98 l21 -30 l21 30z" fill="#4a2a2a"/></g>
    <path d="M482 188 v-26 a18 18 0 0 1 36 0 v26z" fill="#121a16"/>
    ${[[424, 128], [570, 128], [470, 140], [520, 140]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="9" fill="#ffd27a"/>`).join('')}
    <path d="M427 68 v-18 l20 6 l-20 6" fill="#3ddc84"/><path d="M573 68 v-18 l20 6 l-20 6" fill="#3ddc84"/>
    ${pines([30, 70, 110, 150, 200, 820, 860, 900, 945, 985], 212, 74, '#1b3a2a')}${pines([250, 300, 700, 750], 212, 54, '#24503a')}
    <rect y="212" width="1000" height="88" fill="#1a3324"/><path d="M380 300 Q470 250 500 212 Q530 250 620 300z" fill="#3a5a40" opacity=".6"/>`,
  // Zone 4: crystal mountains under an aurora
  heart: `${sky('skH', '#06031a', '#2c1456')}${stars('#e8dcff')}
    <path class="drift" d="M-20 70 Q150 30 320 80 T660 60 T1020 90" stroke="#3ddc84" stroke-width="22" fill="none" opacity=".28"/>
    <path class="drift" d="M-20 100 Q180 60 380 105 T720 90 T1020 115" stroke="#c27bff" stroke-width="18" fill="none" opacity=".3"/>
    <path d="M0 214 L140 110 L240 190 L360 90 L470 214z" fill="#3a2a6e"/><path d="M140 110 l26 20 l-14 -2 l-12 10 l-12 -10 l-14 2z M360 90 l28 22 l-15 -2 l-13 12 l-13 -12 l-15 2z" fill="#f1ecff"/>
    <path d="M520 214 L660 100 L760 180 L880 120 L1000 214z" fill="#2e2260"/><path d="M660 100 l26 21 l-13 -2 l-13 11 l-13 -11 l-13 2z M880 120 l22 18 l-12 -2 l-10 9 l-10 -9 l-12 2z" fill="#f1ecff"/>
    <rect y="212" width="1000" height="88" fill="#140a2a"/>
    ${[[90, 236, 34], [140, 240, 22], [610, 232, 40], [660, 240, 24], [900, 236, 30]].map(([x, y, h]) => `<path d="M${x} ${y} l${h / 3} ${-h} l${h / 3} ${h}z" fill="#b07cff"/><path d="M${x + h / 3} ${y - h} l${h / 3} ${h} h-${h / 6}z" fill="#7df9ff" opacity=".7"/>`).join('')}`,
  // Boss: storm, lightning and a red moon
  boss: `${sky('skB', '#0a0210', '#3a0a2a')}
    <circle cx="500" cy="96" r="60" fill="#ff3b5c" opacity=".14"/><circle cx="500" cy="96" r="30" fill="#c42a44"/>
    ${cloud(200, 70, 1.6, '#2a1030', .8)}${cloud(780, 60, 1.5, '#2a1030', .8)}
    <path class="bolt" d="M300 20 l-24 60 h20 l-30 70 l50 -84 h-22 l26 -46z" fill="#fff3c4"/>
    <path class="bolt" style="animation-delay:1.6s" d="M760 30 l-20 50 h16 l-26 60 l42 -70 h-18 l22 -40z" fill="#fff3c4"/>
    <g fill="#1a0a22"><path d="M80 214 l30 -120 l30 120z"/><path d="M860 214 l26 -100 l26 100z"/><path d="M180 214 l18 -70 l18 70z"/><path d="M770 214 l18 -76 l18 76z"/></g>
    <rect y="212" width="1000" height="88" fill="#0e0612"/>`,
};
export const sceneSVG = id => `<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${SCENERY[id] || ''}</svg>`;
