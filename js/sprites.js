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
