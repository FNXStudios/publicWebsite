/*
 * VISUAL FIXTURES — symbol library.
 * Every symbol is drawn in a 200×200 box and returned as an SVG <g> string with its own
 * gradients (ids are unique per call). Used by scenes.js to build key art, screenshots and
 * production material. Development artwork only: none of this is FNX product IP.
 */
var FX = (window.FX = window.FX || {});

(function () {
  let u = 0;
  const uid = (p = 'g') => `${p}${++u}`;
  FX.uid = uid;

  // Seeded RNG so every render is identical.
  FX.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const stops = (s) => s.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  FX.lin = (id, s, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`;
  FX.rad = (id, s, cx = 0.5, cy = 0.5, r = 0.5, fx = cx, fy = cy) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" fx="${fx}" fy="${fy}">${stops(s)}</radialGradient>`;
  FX.blur = (id, sd) =>
    `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  const { lin, rad, blur } = FX;

  FX.GOLD = [
    [0, '#fff7d6'],
    [0.3, '#f7d58a'],
    [0.62, '#d1953a'],
    [1, '#7c4512'],
  ];
  const GOLD = FX.GOLD;

  function glow(color, r = 92, a = 0.45) {
    const g = uid('gl');
    return `<defs>${rad(g, [[0, color, a], [0.55, color, a * 0.35], [1, color, 0]])}</defs><circle cx="100" cy="100" r="${r}" fill="url(#${g})"/>`;
  }

  function sparkle(x, y, s = 1, c = '#fff6d8', a = 0.95) {
    return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -12 C1.2 -2 2 -1.2 12 0 C2 1.2 1.2 2 0 12 C-1.2 2 -2 1.2 -12 0 C-2 -1.2 -1.2 -2 0 -12Z" fill="${c}" opacity="${a}"/>`;
  }
  FX.sparkle = sparkle;

  const S = {};

  /* ---------------- Dragon's Fortune: red / amber / gold ---------------- */
  S.lantern = function () {
    const body = uid('lb'), gold = uid('lg'), hi = uid('lh'), bl = uid('bl');
    let ribs = '';
    for (const k of [0.22, 0.5, 0.78]) ribs += `<ellipse cx="100" cy="102" rx="${62 * k}" ry="57" fill="none" stroke="#5a0410" stroke-opacity=".55" stroke-width="2.2"/>`;
    return `<g><defs>${rad(body, [[0, '#ff8a4c'], [0.35, '#ee3a2a'], [0.8, '#a90d1f'], [1, '#56040f']], 0.38, 0.36, 0.72)}${lin(gold, GOLD)}${lin(hi, [[0, '#fff', 0.55], [1, '#fff', 0]])}${blur(bl, 5)}</defs>
      ${glow('#ff6a2a', 96, 0.5)}
      <line x1="100" y1="6" x2="100" y2="34" stroke="url(#${gold})" stroke-width="4"/>
      <rect x="68" y="30" width="64" height="16" rx="5" fill="url(#${gold})"/>
      <ellipse cx="100" cy="102" rx="64" ry="58" fill="url(#${body})"/>
      ${ribs}
      <path d="M40 80 Q100 70 160 80" stroke="#ffcf7a" stroke-opacity=".5" stroke-width="2" fill="none"/>
      <path d="M40 124 Q100 134 160 124" stroke="#ffcf7a" stroke-opacity=".5" stroke-width="2" fill="none"/>
      <circle cx="100" cy="102" r="19" fill="url(#${gold})"/>
      <rect x="92" y="94" width="16" height="16" fill="#6b0a12" transform="rotate(45 100 102)"/>
      <ellipse cx="76" cy="80" rx="14" ry="26" fill="url(#${hi})" filter="url(#${bl})" transform="rotate(20 76 80)"/>
      <rect x="70" y="156" width="60" height="14" rx="5" fill="url(#${gold})"/>
      <path d="M100 170 L100 188" stroke="#c9142a" stroke-width="7" stroke-linecap="round"/>
      <circle cx="100" cy="176" r="5" fill="url(#${gold})"/>
      <path d="M94 186 L100 198 L106 186Z" fill="#c9142a"/>
    </g>`;
  };

  S.ingot = function () {
    const g = uid('ig'), g2 = uid('ig2'), d = uid('id');
    return `<g><defs>${lin(g, GOLD)}${lin(g2, [[0, '#ffe7a6'], [1, '#b67424']])}${lin(d, [[0, '#9a5a17'], [1, '#4a2507']])}</defs>
      ${glow('#ffc04a', 94, 0.4)}
      <path d="M12 102 C22 80 44 82 54 98 C70 108 130 108 146 98 C156 82 178 80 188 102 C178 126 150 136 100 136 C50 136 22 126 12 102Z" fill="url(#${d})"/>
      <ellipse cx="100" cy="98" rx="42" ry="36" fill="url(#${g2})"/>
      <ellipse cx="88" cy="84" rx="14" ry="10" fill="#fff" opacity=".45"/>
      <path d="M20 112 C40 138 66 148 100 148 C134 148 160 138 180 112 C178 146 148 172 100 172 C52 172 22 146 20 112Z" fill="url(#${g})"/>
      <path d="M40 140 C70 156 130 156 160 140" stroke="#fff4c9" stroke-opacity=".55" stroke-width="3" fill="none"/>
      ${sparkle(150, 70, 1.1)}${sparkle(48, 150, 0.7)}
    </g>`;
  };

  S.coin = function () {
    const g = uid('cg'), r = uid('cr');
    let marks = '';
    for (let i = 0; i < 4; i++) marks += `<rect x="94" y="40" width="12" height="18" rx="2" fill="#9a5a17" transform="rotate(${i * 90} 100 100)"/>`;
    return `<g><defs>${lin(g, GOLD, 0, 0, 1, 1)}${lin(r, [[0, '#8a4f14'], [1, '#e5ad55']], 0, 0, 1, 1)}</defs>
      ${glow('#ffb33a', 96, 0.38)}
      <circle cx="100" cy="100" r="80" fill="url(#${r})"/>
      <circle cx="100" cy="100" r="72" fill="url(#${g})"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#a1631c" stroke-width="3"/>
      ${marks}
      <rect x="80" y="80" width="40" height="40" rx="3" fill="#3a1206" stroke="#f5d07f" stroke-width="4"/>
      <path d="M44 70 A62 62 0 0 1 90 40" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${sparkle(160, 50, 1)}
    </g>`;
  };

  S.pearl = function () {
    const o = uid('po'), f = uid('pf'), bl = uid('pb');
    let flames = '';
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const x1 = 100 + Math.cos(a) * 56, y1 = 100 + Math.sin(a) * 56;
      const x2 = 100 + Math.cos(a + 0.5) * 86, y2 = 100 + Math.sin(a + 0.5) * 86;
      const cx = 100 + Math.cos(a + 0.1) * 84, cy = 100 + Math.sin(a + 0.1) * 84;
      flames += `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="url(#${f})" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    }
    return `<g><defs>${rad(o, [[0, '#fff5d1'], [0.25, '#ffc15a'], [0.65, '#ea4a1c'], [1, '#6e0d09']], 0.4, 0.38, 0.62)}${lin(f, [[0, '#ffd27a'], [1, '#ff5a1f', 0.2]])}${blur(bl, 4)}</defs>
      ${glow('#ff7a26', 100, 0.55)}
      <g filter="url(#${bl})" opacity=".85">${flames}</g>
      ${flames}
      <circle cx="100" cy="100" r="56" fill="url(#${o})"/>
      <ellipse cx="82" cy="78" rx="18" ry="11" fill="#fff" opacity=".6" transform="rotate(-30 82 78)"/>
    </g>`;
  };

  S.wildDragon = function () {
    const r = uid('wr'), g = uid('wg');
    return `<g><defs>${lin(r, [[0, '#e8303a'], [1, '#6c0714']])}${lin(g, GOLD)}</defs>
      ${glow('#ff4a2a', 100, 0.5)}
      <rect x="10" y="52" width="180" height="96" rx="20" fill="url(#${r})" stroke="url(#${g})" stroke-width="7"/>
      <rect x="22" y="64" width="156" height="72" rx="12" fill="none" stroke="#ffcf7a" stroke-opacity=".35" stroke-width="2"/>
      <text x="100" y="119" text-anchor="middle" font-family="Caladea, 'DejaVu Serif', serif" font-weight="700" font-size="60" letter-spacing="2" fill="url(#${g})" stroke="#4a0509" stroke-width="2">WILD</text>
      ${sparkle(176, 50, 1.1)}
    </g>`;
  };

  /* ---------------- Mystic Tides: indigo / blue / violet ---------------- */
  S.jelly = function () {
    const d = uid('jd'), t = uid('jt'), bl = uid('jb');
    let tent = '';
    const xs = [56, 74, 92, 108, 126, 144];
    xs.forEach((x, i) => {
      const w = i % 2 ? 10 : -10;
      tent += `<path d="M${x} 104 C${x + w} 128 ${x - w} 150 ${x + w * 0.6} 172 S${x - w * 0.4} 190 ${x} 198" stroke="url(#${t})" stroke-width="${i % 2 ? 3 : 5}" fill="none" stroke-linecap="round"/>`;
    });
    return `<g><defs>${rad(d, [[0, '#f4ecff'], [0.35, '#b996ff'], [0.75, '#6a3fe0'], [1, '#2a1b8a']], 0.45, 0.35, 0.7)}${lin(t, [[0, '#b99bff'], [0.6, '#56c8ff', 0.8], [1, '#56c8ff', 0]])}${blur(bl, 6)}</defs>
      ${glow('#8a5cff', 100, 0.55)}
      <g filter="url(#${bl})">${tent}</g>${tent}
      <path d="M36 104 C34 44 166 44 164 104 C154 112 144 100 132 108 C120 116 110 102 100 110 C90 102 80 116 68 108 C56 100 46 112 36 104Z" fill="url(#${d})" opacity=".95"/>
      <path d="M58 84 C62 60 96 50 118 56" stroke="#fff" stroke-opacity=".6" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="84" cy="90" r="4" fill="#e6f7ff"/><circle cx="118" cy="84" r="3" fill="#e6f7ff"/><circle cx="104" cy="96" r="2.5" fill="#e6f7ff"/>
    </g>`;
  };

  S.shell = function () {
    const s = uid('ss'), p = uid('sp');
    let ribs = '', edge = 'M100 170 ';
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const a = (-160 + (i / n) * 140) * (Math.PI / 180);
      const x = 100 + Math.cos(a) * 88, y = 170 + Math.sin(a) * 88;
      ribs += `<line x1="100" y1="170" x2="${x}" y2="${y}" stroke="#2b2f86" stroke-opacity=".5" stroke-width="2.5"/>`;
      if (i > 0) {
        const pa = (-160 + ((i - 0.5) / n) * 140) * (Math.PI / 180);
        edge += `Q${100 + Math.cos(pa) * 100} ${170 + Math.sin(pa) * 100} ${x} ${y} `;
      } else edge += `L${x} ${y} `;
    }
    edge += 'Z';
    return `<g><defs>${lin(s, [[0, '#dfe6ff'], [0.45, '#8a95f0'], [1, '#2c2f8c']])}${rad(p, [[0, '#ffffff'], [0.6, '#e4dcff'], [1, '#9b86e6']], 0.35, 0.35, 0.7)}</defs>
      ${glow('#7aa2ff', 96, 0.4)}
      <path d="${edge}" fill="url(#${s})"/>${ribs}
      <path d="M58 176 L142 176 L130 190 L70 190Z" fill="#3a3f9e"/>
      <circle cx="100" cy="136" r="28" fill="url(#${p})"/>
      <circle cx="90" cy="126" r="7" fill="#fff" opacity=".85"/>
      ${sparkle(150, 60, 0.9, '#e6f0ff')}
    </g>`;
  };

  S.crystal = function () {
    const a = uid('ca'), b = uid('cb'), c = uid('cc');
    return `<g><defs>${lin(a, [[0, '#e9dcff'], [1, '#7b4cf0']])}${lin(b, [[0, '#8f63ff'], [1, '#2b1a86']])}${lin(c, [[0, '#8fe3ff'], [1, '#3a58d8']])}</defs>
      ${glow('#7e5bff', 100, 0.5)}
      <polygon points="100,14 162,58 162,142 100,186 38,142 38,58" fill="url(#${b})"/>
      <polygon points="100,14 162,58 100,84 38,58" fill="url(#${a})"/>
      <polygon points="100,84 162,58 162,142 100,116" fill="url(#${c})" opacity=".9"/>
      <polygon points="100,84 100,116 38,142 38,58" fill="#4c2fc2"/>
      <polygon points="100,116 162,142 100,186 38,142" fill="#1f1470"/>
      <polyline points="100,14 100,84 100,116 100,186" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>
      <path d="M58 60 L96 34" stroke="#fff" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"/>
      ${sparkle(160, 40, 1.1, '#f0e8ff')}
    </g>`;
  };

  S.star = function () {
    const g = uid('st');
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 36 : 80;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      pts.push(`${100 + Math.cos(a) * r},${104 + Math.sin(a) * r}`);
    }
    let dots = '';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      for (const r of [22, 40, 56]) dots += `<circle cx="${100 + Math.cos(a) * r}" cy="${104 + Math.sin(a) * r}" r="${5 - r / 18}" fill="#fff3e0" opacity=".7"/>`;
    }
    return `<g><defs>${rad(g, [[0, '#ffd9a8'], [0.5, '#ff8f7a'], [1, '#b8406a']], 0.5, 0.5, 0.6)}</defs>
      ${glow('#ff8fb0', 94, 0.3)}
      <polygon points="${pts.join(' ')}" fill="url(#${g})" stroke="url(#${g})" stroke-width="16" stroke-linejoin="round"/>
      ${dots}
    </g>`;
  };

  S.wildTide = function () {
    const r = uid('wr'), g = uid('wg');
    return `<g><defs>${lin(r, [[0, '#5b3df0'], [1, '#1a1470']])}${lin(g, [[0, '#ffffff'], [0.5, '#bfe6ff'], [1, '#8f7bff']])}</defs>
      ${glow('#7a5cff', 100, 0.55)}
      <rect x="10" y="52" width="180" height="96" rx="48" fill="url(#${r})" stroke="url(#${g})" stroke-width="6"/>
      <text x="100" y="119" text-anchor="middle" font-family="Caladea, 'DejaVu Serif', serif" font-weight="700" font-size="60" letter-spacing="2" fill="url(#${g})">WILD</text>
      ${sparkle(30, 56, 1, '#e6f0ff')}
    </g>`;
  };

  /* ---------------- Temple of Valor: emerald / jungle / gold ---------------- */
  S.mask = function () {
    const g = uid('mg'), e = uid('me'), d = uid('md');
    return `<g><defs>${lin(g, GOLD, 0, 0, 1, 1)}${rad(e, [[0, '#d7ffe9'], [0.5, '#34e39a'], [1, '#0b6b42']])}${lin(d, [[0, '#2a1a06'], [1, '#120a02']])}</defs>
      ${glow('#3cf0a0', 100, 0.35)}
      <path d="M24 70 L6 92 L28 104Z M176 70 L194 92 L172 104Z" fill="url(#${g})"/>
      <path d="M100 18 C142 18 170 36 174 70 C178 122 146 164 100 186 C54 164 22 122 26 70 C30 36 58 18 100 18Z" fill="url(#${g})"/>
      <path d="M100 30 C136 30 160 44 162 72 C164 116 138 152 100 172 C62 152 36 116 38 72 C40 44 64 30 100 30Z" fill="none" stroke="#8a5212" stroke-width="3"/>
      <path d="M46 82 L88 88 L84 102 L50 98Z M154 82 L112 88 L116 102 L150 98Z" fill="url(#${d})"/>
      <path d="M54 90 L82 93 M146 90 L118 93" stroke="#46ffb0" stroke-width="4" stroke-linecap="round"/>
      <path d="M100 96 L90 132 L110 132Z" fill="#b87a26"/>
      <rect x="74" y="144" width="52" height="12" rx="3" fill="url(#${d})"/>
      <path d="M78 150 H122" stroke="#d7a54c" stroke-width="2" stroke-dasharray="6 4"/>
      <polygon points="100,38 112,50 112,62 100,72 88,62 88,50" fill="url(#${e})" stroke="#fff3c4" stroke-width="2"/>
      <path d="M60 50 C74 40 90 36 100 36" stroke="#fff" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  };

  S.emerald = function () {
    const a = uid('ea'), b = uid('eb');
    const o = [];
    for (let i = 0; i < 8; i++) {
      const ang = Math.PI / 8 + (i * Math.PI) / 4;
      o.push([100 + Math.cos(ang) * 84, 100 + Math.sin(ang) * 84]);
    }
    const inner = o.map(([x, y]) => [100 + (x - 100) * 0.55, 100 + (y - 100) * 0.55]);
    let facets = '';
    const shades = ['#1fa56a', '#0e7a4b', '#095a37', '#0b6b42', '#18c47e', '#3be39a', '#2fd08a', '#139a5d'];
    for (let i = 0; i < 8; i++) {
      const j = (i + 1) % 8;
      facets += `<polygon points="${o[i]} ${o[j]} ${inner[j]} ${inner[i]}" fill="${shades[i]}"/>`;
    }
    return `<g><defs>${lin(a, [[0, '#c9ffe6'], [0.5, '#3ee0a0'], [1, '#0a6a40']], 0, 0, 1, 1)}${lin(b, GOLD)}</defs>
      ${glow('#2cf09a', 100, 0.5)}
      <polygon points="${o.map((p) => p.join(',')).join(' ')}" fill="none" stroke="url(#${b})" stroke-width="8" stroke-linejoin="round"/>
      ${facets}
      <polygon points="${inner.map((p) => p.join(',')).join(' ')}" fill="url(#${a})"/>
      <path d="M72 76 L100 62" stroke="#fff" stroke-opacity=".85" stroke-width="5" stroke-linecap="round"/>
      ${sparkle(164, 40, 1.1, '#eafff4')}
    </g>`;
  };

  S.sun = function () {
    const g = uid('sg'), f = uid('sf'), e = uid('se');
    let rays = '';
    for (let i = 0; i < 16; i++) {
      const long = i % 2 === 0;
      rays += `<polygon points="94,${long ? 8 : 20} 106,${long ? 8 : 20} 100,44" fill="url(#${g})" transform="rotate(${i * 22.5} 100 100)"/>`;
    }
    return `<g><defs>${lin(g, GOLD)}${rad(f, [[0, '#ffe7a2'], [0.7, '#d99a3a'], [1, '#8a5212']])}${rad(e, [[0, '#caffe6'], [0.6, '#2fd08a'], [1, '#07502f']])}</defs>
      ${glow('#ffc452', 100, 0.45)}
      ${rays}
      <circle cx="100" cy="100" r="58" fill="url(#${g})"/>
      <circle cx="100" cy="100" r="48" fill="url(#${f})" stroke="#8a5212" stroke-width="2"/>
      <circle cx="100" cy="100" r="36" fill="none" stroke="#8a5212" stroke-width="2" stroke-dasharray="4 5"/>
      <circle cx="100" cy="100" r="18" fill="url(#${e})" stroke="#fff3c4" stroke-width="3"/>
      <path d="M66 74 A42 42 0 0 1 96 58" stroke="#fff" stroke-opacity=".6" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  };

  S.shield = function () {
    const j = uid('sj'), g = uid('sg');
    let lines = '';
    for (let i = -3; i <= 3; i++) {
      lines += `<line x1="${100 + i * 22 - 60}" y1="40" x2="${100 + i * 22 + 60}" y2="160" stroke="#d6a54a" stroke-opacity=".5" stroke-width="2"/>`;
      lines += `<line x1="${100 + i * 22 + 60}" y1="40" x2="${100 + i * 22 - 60}" y2="160" stroke="#d6a54a" stroke-opacity=".5" stroke-width="2"/>`;
    }
    const clip = uid('cl');
    return `<g><defs>${rad(j, [[0, '#8ff0c4'], [0.55, '#1a9a64'], [1, '#063f27']], 0.4, 0.35, 0.75)}${lin(g, GOLD)}<clipPath id="${clip}"><circle cx="100" cy="100" r="64"/></clipPath></defs>
      ${glow('#34e39a', 96, 0.35)}
      <circle cx="100" cy="100" r="80" fill="url(#${g})"/>
      <circle cx="100" cy="100" r="66" fill="url(#${j})"/>
      <g clip-path="url(#${clip})">${lines}</g>
      <circle cx="100" cy="100" r="22" fill="url(#${g})" stroke="#6b3a0c" stroke-width="2"/>
      <circle cx="94" cy="94" r="6" fill="#fff" opacity=".7"/>
    </g>`;
  };

  S.wildTemple = function () {
    const r = uid('wr'), g = uid('wg');
    return `<g><defs>${lin(r, [[0, '#16a86b'], [1, '#053a24']])}${lin(g, GOLD)}</defs>
      ${glow('#2cf09a', 100, 0.45)}
      <path d="M10 60 L30 44 H170 L190 60 V140 L170 156 H30 L10 140Z" fill="url(#${r})" stroke="url(#${g})" stroke-width="7"/>
      <text x="100" y="121" text-anchor="middle" font-family="Caladea, 'DejaVu Serif', serif" font-weight="700" font-size="60" letter-spacing="2" fill="url(#${g})" stroke="#02281a" stroke-width="2">WILD</text>
    </g>`;
  };

  /* ---------------- Card royals ---------------- */
  S.royal = function (letter, top, bottom, stroke = '#1a0a04') {
    const g = uid('rg');
    const size = letter.length > 1 ? 100 : 128;
    return `<g><defs>${lin(g, [[0, '#ffffff'], [0.18, top], [1, bottom]])}</defs>
      <text x="100" y="146" text-anchor="middle" font-family="Caladea, 'Bitstream Charter', 'DejaVu Serif', serif" font-weight="700" font-size="${size}" fill="url(#${g})" stroke="${stroke}" stroke-width="5" paint-order="stroke">${letter}</text>
    </g>`;
  };

  FX.S = S;

  /** Symbol sets per game, ordered high → low. */
  FX.SETS = {
    dragon: {
      wild: 'wildDragon',
      high: ['pearl', 'lantern', 'ingot', 'coin'],
      royals: [
        ['A', '#ff6a5a', '#8a0a16'],
        ['K', '#ffd36a', '#a2560c'],
        ['Q', '#5fe0b0', '#0b6b48'],
        ['J', '#ff9a4a', '#8a3406'],
        ['10', '#e59bff', '#6a1d8a'],
      ],
      cell: ['#3a0a10', '#1c0508'],
      frame: ['#ffe6a0', '#b8741f', '#5a2a08'],
    },
    tide: {
      wild: 'wildTide',
      high: ['jelly', 'shell', 'crystal', 'star'],
      royals: [
        ['A', '#8fd8ff', '#1f4fb8'],
        ['K', '#c7a8ff', '#4a2ab8'],
        ['Q', '#7fffe0', '#0f7a8a'],
        ['J', '#ffb0d8', '#9a2a6a'],
        ['10', '#e8ecff', '#5a64b8'],
      ],
      cell: ['#16185a', '#0a0b2e'],
      frame: ['#e6ecff', '#8f7bff', '#2a1f7a'],
    },
    temple: {
      wild: 'wildTemple',
      high: ['mask', 'sun', 'emerald', 'shield'],
      royals: [
        ['A', '#ffd36a', '#8a4a0c'],
        ['K', '#7fffc0', '#0b6b42'],
        ['Q', '#ff9a6a', '#8a2a0c'],
        ['J', '#9ad8ff', '#1f5a8a'],
        ['10', '#e8ffd0', '#4a7a1f'],
      ],
      cell: ['#0c3a26', '#041a10'],
      frame: ['#fff0b8', '#c98a2c', '#4a2a06'],
    },
  };

  /** Render a symbol by key into a box. */
  FX.sym = function (game, key, x, y, size, extra = '') {
    const set = FX.SETS[game];
    let body;
    if (key.startsWith('royal:')) {
      const r = set.royals[Number(key.slice(6))];
      body = S.royal(r[0], r[1], r[2]);
    } else body = S[key]();
    return `<g transform="translate(${x} ${y}) scale(${size / 200})" ${extra}>${body}</g>`;
  };
})();
