/*
 * VISUAL FIXTURES — in-game screens and production material (symbol evolution,
 * motion frames, UI work, device contexts, studio board).
 */
(function () {
  const FX = window.FX;
  const { uid, lin, rad, blur, rng, sym, sparkle, SETS } = FX;
  const { noise, vignette, glowAt, ellipseGlow, particles, nest } = FX.kit;
  const SC = FX.SC;

  const GAMES = {
    dragon: { art: 'dragonArt', title: 'DRAGON’S FORTUNE', cols: 5, rows: 3, accent: '#ffcf7a', ink: '#3a0507', seed: 5 },
    tide: { art: 'tideArt', title: 'MYSTIC TIDES', cols: 6, rows: 4, accent: '#cfd9ff', ink: '#0b0b3a', seed: 9 },
    temple: { art: 'templeArt', title: 'TEMPLE OF VALOR', cols: 5, rows: 3, accent: '#ffe39a', ink: '#03281a', seed: 13 },
  };
  const txt = (x, y, str, size, fill, o = {}) =>
    `<text x="${x}" y="${y}" font-family="${o.family || 'Manrope'}" font-size="${size}" font-weight="${o.weight || 600}" fill="${fill}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} ${o.ls ? `letter-spacing="${o.ls}"` : ''} ${o.extra || ''}>${str}</text>`;

  function pickGrid(game, cols, rows, seed) {
    const R = rng(seed);
    const set = SETS[game];
    const pool = [...set.high, ...set.high, 'royal:0', 'royal:1', 'royal:2', 'royal:3', 'royal:4', 'royal:0', 'royal:1', 'royal:2', set.wild];
    const g = [];
    for (let c = 0; c < cols; c++) {
      g.push([]);
      for (let r = 0; r < rows; r++) g[c].push(pool[Math.floor(R() * pool.length)]);
    }
    return g;
  }

  /**
   * A game screen. variant: 'base' | 'win' | 'feature'.
   * Works in landscape and portrait; the grid, logo and bar reflow.
   */
  function gameScreen(game, variant) {
    return (w, h) => {
      const G = GAMES[game], set = SETS[game];
      const portrait = h > w;
      const { cols, rows } = G;
      const topH = (portrait ? h * 0.2 : h * 0.16) + (variant === 'feature' ? h * 0.06 : 0), barH = portrait ? h * 0.2 : h * 0.13;
      const cell = Math.min((h - topH - barH - (portrait ? 30 : 60)) / rows, (w * (portrait ? 0.94 : 0.7)) / cols);
      const gw = cell * cols, gh = cell * rows;
      const gx = (w - gw) / 2, gy = topH + (h - topH - barH - gh) / 2;
      const frame = uid('fr'), cellG = uid('ce'), bar = uid('ba'), spin = uid('sp'), title = uid('ti'), bl = uid('b'), bl2 = uid('b');
      let s = `<defs>
        ${lin(frame, [[0, set.frame[0]], [0.5, set.frame[1]], [1, set.frame[2]]])}
        ${lin(cellG, [[0, set.cell[0]], [1, set.cell[1]]])}
        ${lin(bar, [[0, '#000', 0], [0.35, '#000', 0.65], [1, '#000', 0.85]])}
        ${rad(spin, [[0, '#ffffff'], [0.3, set.frame[0]], [0.8, set.frame[1]], [1, set.frame[2]]], 0.4, 0.35, 0.7)}
        ${lin(title, [[0, '#ffffff'], [0.35, set.frame[0]], [1, set.frame[1]]])}
        ${blur(bl, cell * 0.06)}${blur(bl2, 8)}
      </defs>`;
      s += nest(G.art, 0, 0, w, h, portrait ? 1200 : 1920, portrait ? 1500 : 1080);
      s += `<rect width="${w}" height="${h}" fill="#000" opacity=".38"/>`;
      // logo
      const ts = portrait ? w * 0.085 : h * 0.07;
      const ty = variant === 'feature' ? topH * 0.36 : topH * 0.5;
      s += ellipseGlow(w / 2, ty * 1.04, ts * 6, ts * 1.2, set.frame[1], 0.35);
      s += txt(w / 2, ty + ts * 0.35, G.title, ts, `url(#${title})`, { family: "Caladea, 'DejaVu Serif', serif", weight: 700, anchor: 'middle', ls: ts * 0.04, extra: `stroke="${G.ink}" stroke-width="${ts * 0.06}" paint-order="stroke"` });
      s += `<line x1="${w / 2 - ts * 3}" y1="${ty + ts * 0.75}" x2="${w / 2 + ts * 3}" y2="${ty + ts * 0.75}" stroke="${set.frame[0]}" stroke-opacity=".5" stroke-width="2"/>`;
      // feature header
      if (variant === 'feature') {
        const label = game === 'temple' ? 'HOLD &amp; WIN · 3 RESPINS' : game === 'tide' ? 'FREE SPINS · 3 OF 10' : 'FREE SPINS · 8';
        const fw = Math.min(w * 0.5, ts * 9), fy = gy - cell * 0.08 - ts * 1.15;
        s += `<rect x="${w / 2 - fw / 2}" y="${fy}" width="${fw}" height="${ts * 0.9}" rx="${ts * 0.45}" fill="${G.ink}" stroke="url(#${frame})" stroke-width="3"/>`;
        s += txt(w / 2, fy + ts * 0.6, label, ts * 0.42, set.frame[0], { anchor: 'middle', weight: 800, ls: ts * 0.06 });
      }
      // frame + cells
      s += `<rect x="${gx - cell * 0.12}" y="${gy - cell * 0.12}" width="${gw + cell * 0.24}" height="${gh + cell * 0.24}" rx="${cell * 0.14}" fill="#000" opacity=".55" filter="url(#${bl2})"/>`;
      s += `<rect x="${gx - cell * 0.08}" y="${gy - cell * 0.08}" width="${gw + cell * 0.16}" height="${gh + cell * 0.16}" rx="${cell * 0.12}" fill="${set.cell[1]}" stroke="url(#${frame})" stroke-width="${cell * 0.045}"/>`;
      const grid = pickGrid(game, cols, rows, G.seed + (variant === 'base' ? 0 : 3));
      const win = new Set();
      if (variant === 'win') {
        const k = set.high[1];
        for (let c = 0; c < 3; c++) {
          grid[c][1] = k;
          win.add(`${c},1`);
        }
        grid[3][1] = set.wild;
        win.add('3,1');
      }
      const locked = new Set();
      if (variant === 'feature' && game === 'temple') ['0,0', '1,2', '2,1', '3,0', '4,2', '4,1'].forEach((k) => locked.add(k));
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++) {
          const x = gx + c * cell, y = gy + r * cell;
          const key = `${c},${r}`;
          const hi = win.has(key);
          s += `<rect x="${x + cell * 0.03}" y="${y + cell * 0.03}" width="${cell * 0.94}" height="${cell * 0.94}" rx="${cell * 0.08}" fill="url(#${cellG})" ${hi ? `stroke="${set.frame[0]}" stroke-width="${cell * 0.03}"` : 'stroke="#fff" stroke-opacity=".05"'}/>`;
          if (variant === 'feature' && game === 'temple') {
            if (locked.has(key)) {
              s += sym(game, 'sun', x + cell * 0.08, y + cell * 0.06, cell * 0.84);
              s += txt(x + cell / 2, y + cell * 0.9, ['×5', '×10', '×2', '×25', '×5', '×3'][[...locked].indexOf(key)], cell * 0.18, '#fff7d6', { anchor: 'middle', weight: 800, extra: `stroke="#3a1f04" stroke-width="${cell * 0.03}" paint-order="stroke"` });
            }
            continue;
          }
          if (hi) s += glowAt(x + cell / 2, y + cell / 2, cell * 0.7, set.frame[0], 0.35);
          s += sym(game, grid[c][r], x + cell * 0.1, y + cell * 0.1, cell * 0.8, hi ? '' : variant === 'win' ? 'opacity=".45"' : '');
        }
      if (variant === 'win') {
        const y = gy + cell * 1.5;
        s += `<polyline points="${gx - cell * 0.05},${y} ${gx + cell * 3.5},${y}" stroke="${set.frame[0]}" stroke-width="${cell * 0.035}" stroke-linecap="round" filter="url(#${bl})"/>`;
        s += `<polyline points="${gx - cell * 0.05},${y} ${gx + cell * 3.5},${y}" stroke="#fff8e0" stroke-width="${cell * 0.012}" stroke-linecap="round"/>`;
      }
      // bar
      const by = h - barH;
      s += `<rect y="${by - barH * 0.3}" width="${w}" height="${barH * 1.3}" fill="url(#${bar})"/>`;
      const u = portrait ? w * 0.045 : h * 0.028;
      const cyBar = by + barH * 0.55;
      const label = (x, y, l, v, anchor) => txt(x, y, l, u * 0.55, '#ffffff', { anchor, weight: 700, ls: u * 0.12, extra: 'opacity=".55"' }) + txt(x, y + u * 1.25, v, u * 1.05, '#ffffff', { anchor, weight: 700 });
      const pad = portrait ? w * 0.07 : w * 0.06;
      s += label(pad, cyBar - u * 0.5, 'BALANCE', '1,000.00', 'start');
      s += label(w - pad, cyBar - u * 0.5, 'WIN', variant === 'win' ? '48.00' : '0.00', 'end');
      const sr = portrait ? w * 0.1 : h * 0.058;
      s += `<circle cx="${w / 2}" cy="${cyBar}" r="${sr * 1.12}" fill="#000" opacity=".5"/>`;
      s += `<circle cx="${w / 2}" cy="${cyBar}" r="${sr}" fill="url(#${spin})" stroke="${set.frame[2]}" stroke-width="3"/>`;
      s += `<circle cx="${w / 2}" cy="${cyBar}" r="${sr * 0.78}" fill="${G.ink}" opacity=".85"/>`;
      s += `<path d="M${w / 2 + sr * 0.38} ${cyBar - sr * 0.12} A${sr * 0.4} ${sr * 0.4} 0 1 0 ${w / 2 + sr * 0.3} ${cyBar + sr * 0.26}" stroke="${set.frame[0]}" stroke-width="${sr * 0.1}" fill="none" stroke-linecap="round"/><path d="M${w / 2 + sr * 0.2} ${cyBar - sr * 0.22} L${w / 2 + sr * 0.44} ${cyBar - sr * 0.1} L${w / 2 + sr * 0.5} ${cyBar - sr * 0.38}Z" fill="${set.frame[0]}"/>`;
      // bet stepper
      if (!portrait) {
        const bx = w / 2 - sr * 3.4;
        s += label(bx, cyBar - u * 0.5, 'BET', '1.00', 'middle');
        for (const [dx, sign] of [[-1.6, '−'], [1.6, '+']]) {
          s += `<circle cx="${bx + dx * u * 1.6}" cy="${cyBar + u * 0.1}" r="${u * 0.9}" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".25"/>`;
          s += txt(bx + dx * u * 1.6, cyBar + u * 0.5, sign, u * 1.1, '#fff', { anchor: 'middle', weight: 600 });
        }
        s += `<circle cx="${w / 2 + sr * 3.4}" cy="${cyBar + u * 0.1}" r="${u * 1.3}" fill="#fff" fill-opacity=".06" stroke="#fff" stroke-opacity=".25"/>`;
        s += `<path d="M${w / 2 + sr * 3.4 - u * 0.5} ${cyBar + u * 0.1 - u * 0.5} L${w / 2 + sr * 3.4 + u * 0.55} ${cyBar + u * 0.1} L${w / 2 + sr * 3.4 - u * 0.5} ${cyBar + u * 0.6}Z" fill="#fff" opacity=".8"/>`;
      }
      return s;
    };
  }
  for (const g of Object.keys(GAMES)) for (const v of ['base', 'win', 'feature']) SC[`${g}Screen_${v}`] = gameScreen(g, v);

  /* =====================================================================
     Made to hit — 01 Game feel: reels mid-spin, a win landing
     ===================================================================== */
  SC.madeFeel = (w, h) => {
    const set = SETS.dragon, cell = h * 0.3;
    const cols = 5, gx = (w - cols * cell) / 2, gy = h * 0.5 - cell * 1.5;
    const cellG = uid('c'), mb = uid('mb'), bl = uid('b'), fr = uid('f');
    let s = `<defs>${lin(cellG, [[0, set.cell[0]], [1, set.cell[1]]])}<filter id="${mb}" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="0 ${cell * 0.16}"/></filter>${blur(bl, cell * 0.05)}${lin(fr, [[0, set.frame[0]], [0.5, set.frame[1]], [1, set.frame[2]]])}</defs>`;
    s += nest('dragonArt', 0, 0, w, h, 1920, 1080);
    s += `<rect width="${w}" height="${h}" fill="#140204" opacity=".62"/>`;
    s += `<rect x="${gx - 16}" y="${gy - 16}" width="${cols * cell + 32}" height="${cell * 3 + 32}" rx="26" fill="${set.cell[1]}" stroke="url(#${fr})" stroke-width="10"/>`;
    const land = ['lantern', 'lantern', 'lantern'];
    const R = rng(4);
    for (let c = 0; c < cols; c++) {
      const spinning = c >= 3;
      let col = '';
      const extra = spinning ? 2 : 0;
      for (let r = -extra; r < 3 + extra; r++) {
        const x = gx + c * cell, y = gy + r * cell + (spinning ? cell * (c === 3 ? 0.35 : 0.6) : 0);
        const key = r === 1 && c < 3 ? land[c] : [...set.high, 'royal:0', 'royal:1', 'royal:3'][Math.floor(R() * 7)];
        col += `<rect x="${x + 6}" y="${y + 6}" width="${cell - 12}" height="${cell - 12}" rx="16" fill="url(#${cellG})"/>`;
        if (!spinning && r === 1) col += glowAt(x + cell / 2, y + cell / 2, cell * 0.8, '#ffb24a', c === 2 ? 0.6 : 0.35);
        col += sym('dragon', key, x + cell * 0.1, y + cell * 0.1, cell * 0.8, !spinning && r !== 1 ? 'opacity=".4"' : '');
      }
      const clip = uid('cl');
      s += `<defs><clipPath id="${clip}"><rect x="${gx + c * cell}" y="${gy}" width="${cell}" height="${cell * 3}"/></clipPath></defs><g clip-path="url(#${clip})"><g ${spinning ? `filter="url(#${mb})"` : ''}>${col}</g></g>`;
    }
    // landing burst on reel 3
    const bx = gx + cell * 2.5, by = gy + cell * 1.5;
    for (let i = 1; i <= 3; i++) s += `<circle cx="${bx}" cy="${by}" r="${cell * (0.45 + i * 0.13)}" fill="none" stroke="#ffd78a" stroke-opacity="${0.55 - i * 0.14}" stroke-width="${6 - i * 1.5}"/>`;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      s += sparkle(bx + Math.cos(a) * cell * 0.72, by + Math.sin(a) * cell * 0.72, 0.8 + (i % 3) * 0.4, '#fff3c4');
    }
    s += `<line x1="${gx}" y1="${by}" x2="${bx + cell * 0.45}" y2="${by}" stroke="#ffcf7a" stroke-width="12" stroke-linecap="round" filter="url(#${bl})"/><line x1="${gx}" y1="${by}" x2="${bx + cell * 0.45}" y2="${by}" stroke="#fff6dc" stroke-width="3" stroke-linecap="round"/>`;
    s += vignette(w, h, 0.65, 0.5) + noise(w, h, 0.05);
    return s;
  };

  /* 02 Visual impact: a lineup of hero symbols from all three worlds */
  SC.madeImpact = (w, h) => {
    const floor = uid('fl'), bl = uid('b');
    let s = `<defs>${lin(floor, [[0, '#0b0c12'], [1, '#040406']])}${blur(bl, 40)}</defs><rect width="${w}" height="${h}" fill="#07080c"/>`;
    s += glowAt(w * 0.2, h * 0.35, h * 0.7, '#e2402a', 0.45) + glowAt(w * 0.52, h * 0.3, h * 0.75, '#7e5bff', 0.5) + glowAt(w * 0.84, h * 0.35, h * 0.7, '#2cd08a', 0.42);
    // spotlight cones
    for (const [x, c] of [[0.2, '#ff8a5a'], [0.52, '#b69cff'], [0.84, '#7ff0c0']]) s += `<path d="M${w * x - 30} 0 L${w * x + 30} 0 L${w * x + w * 0.16} ${h * 0.86} L${w * x - w * 0.16} ${h * 0.86}Z" fill="${c}" opacity=".06" filter="url(#${bl})"/>`;
    s += `<rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="url(#${floor})"/>`;
    const items = [
      ['dragon', 'lantern', 0.08, 0.3, 0.2], ['dragon', 'pearl', 0.2, 0.44, 0.3], ['tide', 'crystal', 0.36, 0.36, 0.22],
      ['tide', 'jelly', 0.52, 0.18, 0.4], ['temple', 'emerald', 0.68, 0.4, 0.22], ['temple', 'mask', 0.84, 0.36, 0.34], ['temple', 'sun', 0.95, 0.24, 0.16],
    ];
    const back = items.filter((i) => i[4] < 0.25), front = items.filter((i) => i[4] >= 0.25);
    let refl = '';
    for (const [g, k, fx, fy, fs] of [...back, ...front]) {
      const sz = h * fs * 1.25;
      s += sym(g, k, w * fx - sz / 2, h * fy - sz * 0.05 + h * 0.08, sz);
      refl += sym(g, k, w * fx - sz / 2, h * fy - sz * 0.05 + h * 0.08, sz);
    }
    const fc = uid('fc');
    s += `<defs><clipPath id="${fc}"><rect y="${h * 0.8}" width="${w}" height="${h * 0.2}"/></clipPath></defs><g clip-path="url(#${fc})"><g opacity=".14" transform="translate(0 ${h * 1.6}) scale(1 -1)">${refl}</g></g>`;
    s += particles(rng(8), 80, 0, 0, w, h * 0.8, ['#ffd9a0', '#d8ccff', '#bff6d8'], 0.6, 2, 0.2, 0.8);
    s += vignette(w, h, 0.7, 0.5) + noise(w, h, 0.05);
    return s;
  };

  /* 03 Production ready: the same games across real devices */
  function device(x, y, w, h, r, bezel, screen, sw, sh) {
    const id = uid('d');
    return `<g><rect x="${x + 10}" y="${y + 30}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity=".55" filter="url(#dsh)"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#dbody)" stroke="#3a3d48" stroke-width="2"/>
      <rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="#fff" stroke-opacity=".12"/>
      <defs><clipPath id="${id}"><rect x="${x + bezel}" y="${y + bezel}" width="${w - bezel * 2}" height="${h - bezel * 2}" rx="${Math.max(2, r - bezel)}"/></clipPath></defs>
      <g clip-path="url(#${id})">${nest(screen, x + bezel, y + bezel, w - bezel * 2, h - bezel * 2, sw, sh)}</g>
      <rect x="${x + bezel}" y="${y + bezel}" width="${w - bezel * 2}" height="${(h - bezel * 2) * 0.45}" rx="${Math.max(2, r - bezel)}" fill="url(#dglare)"/></g>`;
  }
  SC.madeDevices = (w, h) => {
    let s = `<defs>${blur('dsh', 26)}${lin('dbody', [[0, '#23252d'], [1, '#0c0d11']])}${lin('dglare', [[0, '#fff', 0.08], [1, '#fff', 0]])}</defs>`;
    s += `<rect width="${w}" height="${h}" fill="#07090d"/>`;
    s += glowAt(w * 0.5, h * 0.45, w * 0.6, '#3a4a8a', 0.35) + glowAt(w * 0.85, h * 0.7, w * 0.3, '#7134f4', 0.25);
    const grid = uid('g');
    s += `<defs><pattern id="${grid}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#${grid})"/>`;
    // desktop monitor
    const mw = w * 0.66, mh = mw * 0.5625 + 28;
    const mx = w * 0.06, my = h * 0.14;
    s += device(mx, my, mw, mh, 16, 14, 'templeScreen_base', 1920, 1080);
    s += `<rect x="${mx + mw / 2 - 60}" y="${my + mh}" width="120" height="${h * 0.08}" fill="url(#dbody)"/><rect x="${mx + mw / 2 - 150}" y="${my + mh + h * 0.08}" width="300" height="14" rx="7" fill="#1a1c22"/>`;
    // tablet
    const tw = w * 0.4, th = tw * 0.72;
    s += device(w * 0.52, h * 0.44, tw, th, 26, 16, 'tideScreen_feature', 1920, 1380);
    // phone
    const pw = w * 0.17, ph = pw * 2.1;
    s += device(w * 0.38, h * 0.36, pw, ph, 34, 10, 'dragonScreen_win', 900, 1890);
    s += vignette(w, h, 0.6, 0.55) + noise(w, h, 0.04);
    return s;
  };

  /* =====================================================================
     From idea to game — the lantern, four stages
     ===================================================================== */
  const pencil = (d, R, o = 0.6, wd = 2, n = 3) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<path d="${d}" transform="translate(${(R() - 0.5) * 3} ${(R() - 0.5) * 3}) rotate(${(R() - 0.5) * 0.8} 600 480)" fill="none" stroke="#3a3632" stroke-opacity="${o * (0.5 + R() * 0.5)}" stroke-width="${wd * (0.6 + R() * 0.6)}" stroke-linecap="round"/>`;
    return s;
  };
  function sketchLantern(cx, cy, k, R, o = 0.7) {
    const e = (rx, ry) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
    let s = '';
    s += pencil(e(64 * k, 58 * k), R, o, 2.4);
    for (const f of [0.25, 0.55, 0.8]) s += pencil(`M${cx} ${cy - 58 * k} C${cx - 64 * k * f * 1.3} ${cy - 30 * k} ${cx - 64 * k * f * 1.3} ${cy + 30 * k} ${cx} ${cy + 58 * k}`, R, o * 0.6, 1.4, 2) + pencil(`M${cx} ${cy - 58 * k} C${cx + 64 * k * f * 1.3} ${cy - 30 * k} ${cx + 64 * k * f * 1.3} ${cy + 30 * k} ${cx} ${cy + 58 * k}`, R, o * 0.6, 1.4, 2);
    s += pencil(`M${cx - 32 * k} ${cy - 56 * k} h${64 * k} v-${16 * k} h-${64 * k}Z`, R, o, 2.2);
    s += pencil(`M${cx - 30 * k} ${cy + 56 * k} h${60 * k} v${14 * k} h-${60 * k}Z`, R, o, 2.2);
    s += pencil(`M${cx} ${cy - 72 * k} V${cy - 96 * k} M${cx} ${cy + 70 * k} V${cy + 98 * k} M${cx - 6 * k} ${cy + 96 * k} L${cx} ${cy + 108 * k} L${cx + 6 * k} ${cy + 96 * k}`, R, o, 2);
    s += pencil(e(19 * k, 19 * k).replace(`${cy}`, `${cy}`), R, o * 0.8, 1.6, 2);
    return s;
  }
  SC.stageConcept = (w, h) => {
    const R = rng(21), paper = uid('pp'), pf = uid('pf'), sh = uid('sh');
    let s = `<defs>${lin(paper, [[0, '#efe8d8'], [1, '#d9d0bc']], 0, 0, 1, 1)}<filter id="${pf}"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .25  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>${blur(sh, 18)}</defs>`;
    s += `<rect width="${w}" height="${h}" fill="#0a0908"/>` + glowAt(w * 0.2, h * 0.1, w * 0.9, '#f0bd72', 0.22);
    s += `<g transform="rotate(-3 ${w / 2} ${h / 2})">`;
    const px = w * 0.08, py = h * 0.08, pw = w * 0.84, ph = h * 0.86;
    s += `<rect x="${px + 14}" y="${py + 24}" width="${pw}" height="${ph}" fill="#000" opacity=".6" filter="url(#${sh})"/>`;
    s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="url(#${paper})"/><rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#fff" filter="url(#${pf})"/>`;
    // construction lines
    const cx = px + pw * 0.42, cy = py + ph * 0.5;
    s += `<g stroke="#6a8ab8" stroke-opacity=".35" stroke-width="1.2" fill="none"><line x1="${cx}" y1="${py + 30}" x2="${cx}" y2="${py + ph - 30}"/><line x1="${px + 40}" y1="${cy}" x2="${px + pw * 0.75}" y2="${cy}"/><ellipse cx="${cx}" cy="${cy}" rx="${190}" ry="${172}" stroke-dasharray="6 6"/></g>`;
    s += sketchLantern(cx, cy, 2.9, R, 0.75);
    // hatching shade on the right side
    for (let i = 0; i < 26; i++) {
      const y = cy - 120 + i * 9;
      s += `<line x1="${cx + 90 + (R() - 0.5) * 8}" y1="${y}" x2="${cx + 150 + (R() - 0.5) * 10}" y2="${y + 22}" stroke="#3a3632" stroke-opacity=".28" stroke-width="1.2"/>`;
    }
    // thumbnails
    const tx = px + pw * 0.8;
    [0.22, 0.44, 0.66].forEach((f, i) => {
      s += `<rect x="${tx - 70}" y="${py + ph * f - 80}" width="140" height="150" fill="none" stroke="#3a3632" stroke-opacity=".3" stroke-width="1"/>`;
      s += sketchLantern(tx, py + ph * f, 0.62 + i * 0.05, R, 0.55);
      s += `<text x="${tx - 62}" y="${py + ph * f - 60}" font-family="Caladea, serif" font-style="italic" font-size="18" fill="#3a3632" opacity=".7">${['a', 'b', 'c ✓'][i]}</text>`;
    });
    const note = (x, y, t, sz = 26, rot = -2) => `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" font-family="Caladea, serif" font-style="italic" font-size="${sz}" fill="#2e2a26" opacity=".8">${t}</text>`;
    s += note(px + 50, py + 70, 'HI_02 — lantern', 34);
    s += note(px + 50, py + ph - 110, 'caps must read at 64px', 24, -1);
    s += note(px + 50, py + ph - 72, 'tassel swings on land →', 24, -1);
    s += `<path d="M${cx + 110} ${cy + 200} q40 30 90 10" stroke="#b8322a" stroke-opacity=".7" stroke-width="3" fill="none"/><circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#b8322a" stroke-opacity=".55" stroke-width="2.5" stroke-dasharray="3 7"/>`;
    s += `</g>`;
    s += `<g transform="rotate(28 ${w * 0.82} ${h * 0.86})"><rect x="${w * 0.6}" y="${h * 0.85}" width="${w * 0.46}" height="16" rx="6" fill="#2a2d3a"/><path d="M${w * 0.6} ${h * 0.85} l-40 8 l40 8Z" fill="#d9b48a"/><path d="M${w * 0.6 - 40} ${h * 0.85 + 8} l12 -2.4 l0 4.8Z" fill="#222"/></g>`;
    s += vignette(w, h, 0.6, 0.55) + noise(w, h, 0.05);
    return s;
  };

  SC.stageDesign = (w, h) => {
    const grid = uid('g');
    let s = `<defs><pattern id="${grid}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern></defs>`;
    s += `<rect width="${w}" height="${h}" fill="#101116"/><rect width="${w}" height="${h}" fill="url(#${grid})"/>`;
    s += glowAt(w * 0.38, h * 0.5, h * 0.55, '#ff5a2a', 0.18);
    s += `<text x="48" y="64" font-family="Manrope" font-size="16" font-weight="700" letter-spacing="3" fill="#8d8a96">HI_02 · LANTERN · FINAL</text>`;
    s += `<rect x="${w * 0.38 - h * 0.34}" y="${h * 0.5 - h * 0.34}" width="${h * 0.68}" height="${h * 0.68}" fill="none" stroke="#8a5cff" stroke-opacity=".5" stroke-dasharray="6 6"/>`;
    s += sym('dragon', 'lantern', w * 0.38 - h * 0.32, h * 0.5 - h * 0.32, h * 0.64);
    const colX = w * 0.72;
    const sw = [['#ee3a2a', 'LACQUER'], ['#a90d1f', 'SHADOW'], ['#f7d58a', 'GOLD HI'], ['#d1953a', 'GOLD MID'], ['#ff8a4c', 'GLOW']];
    s += `<text x="${colX}" y="${h * 0.2}" font-family="Manrope" font-size="14" font-weight="700" letter-spacing="3" fill="#6f6c78">PALETTE</text>`;
    sw.forEach(([c, n], i) => {
      const y = h * 0.24 + i * 46;
      s += `<rect x="${colX}" y="${y}" width="34" height="34" rx="6" fill="${c}"/><text x="${colX + 50}" y="${y + 16}" font-family="Manrope" font-size="14" font-weight="700" fill="#d8d6de">${n}</text><text x="${colX + 50}" y="${y + 32}" font-family="Manrope" font-size="12" fill="#6f6c78">${c.toUpperCase()}</text>`;
    });
    s += `<text x="${colX}" y="${h * 0.66}" font-family="Manrope" font-size="14" font-weight="700" letter-spacing="3" fill="#6f6c78">STATES</text>`;
    ['IDLE', 'WIN', 'DIM'].forEach((n, i) => {
      const x = colX + i * 96, y = h * 0.69;
      s += `<rect x="${x}" y="${y}" width="84" height="84" rx="10" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>`;
      s += sym('dragon', 'lantern', x + 6, y + 6, 72, i === 2 ? 'opacity=".4"' : i === 1 ? '' : 'opacity=".85"');
      if (i === 1) s += `<rect x="${x}" y="${y}" width="84" height="84" rx="10" fill="none" stroke="#ffcf7a" stroke-width="2"/>`;
      s += `<text x="${x}" y="${y + 106}" font-family="Manrope" font-size="12" font-weight="700" letter-spacing="2" fill="#8d8a96">${n}</text>`;
    });
    return s + noise(w, h, 0.03);
  };

  SC.stageMotion = (w, h) => {
    const bl = uid('b');
    let s = `<defs>${blur(bl, 10)}</defs><rect width="${w}" height="${h}" fill="#0c0d12"/>`;
    s += glowAt(w * 0.5, h * 0.36, h * 0.6, '#ff6a2a', 0.2);
    const px = w * 0.5, py = h * 0.06, size = h * 0.42;
    const angles = [-26, -16, -7, 4, 0];
    angles.forEach((a, i) => {
      const last = i === angles.length - 1;
      const tint = last ? '' : `opacity="${0.12 + i * 0.07}"`;
      s += `<g transform="rotate(${a} ${px} ${py})" ${tint}>${last ? '' : `<g style="filter:hue-rotate(${-40 + i * 10}deg) saturate(.6)">`}${sym('dragon', 'lantern', px - size / 2, py + h * 0.06, size)}${last ? '' : '</g>'}</g>`;
    });
    const cx = px, cy = py + h * 0.06 + size / 2;
    for (let i = 1; i <= 3; i++) s += `<circle cx="${cx}" cy="${cy}" r="${size * (0.42 + i * 0.1)}" fill="none" stroke="#ffd78a" stroke-opacity="${0.5 - i * 0.13}" stroke-width="${5 - i}"/>`;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      s += sparkle(cx + Math.cos(a) * size * 0.66, cy + Math.sin(a) * size * 0.66, 0.9 + (i % 3) * 0.3, '#fff3c4');
    }
    s += `<path d="M${px - size * 0.9} ${py + h * 0.1} A${size * 1.1} ${size * 1.1} 0 0 0 ${px + size * 0.2} ${py + size * 1.18}" stroke="#8a5cff" stroke-opacity=".6" stroke-width="2" stroke-dasharray="4 8" fill="none"/>`;
    // curve editor
    const ex = w * 0.07, ey = h * 0.66, ew = w * 0.86, eh = h * 0.28;
    s += `<rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" rx="14" fill="#15161d" stroke="#fff" stroke-opacity=".08"/>`;
    for (let i = 1; i < 12; i++) s += `<line x1="${ex + (ew * i) / 12}" y1="${ey + 30}" x2="${ex + (ew * i) / 12}" y2="${ey + eh - 14}" stroke="#fff" stroke-opacity=".04"/>`;
    s += `<text x="${ex + 20}" y="${ey + 22}" font-family="Manrope" font-size="12" font-weight="700" letter-spacing="2" fill="#8d8a96">LAND_BOUNCE · ROTATION · 320MS</text>`;
    const gx0 = ex + 30, gx1 = ex + ew - 30, gy0 = ey + eh - 26, gy1 = ey + 44;
    const curve = `M${gx0} ${gy0} C${gx0 + (gx1 - gx0) * 0.18} ${gy1 - 34} ${gx0 + (gx1 - gx0) * 0.34} ${gy1 + 10} ${gx0 + (gx1 - gx0) * 0.55} ${gy1 + 22} S${gx0 + (gx1 - gx0) * 0.8} ${gy1 + 8} ${gx1} ${gy1 + 14}`;
    s += `<path d="${curve}" stroke="#ffcf7a" stroke-width="3" fill="none"/><path d="${curve}" stroke="#ffcf7a" stroke-width="10" stroke-opacity=".25" fill="none" filter="url(#${bl})"/>`;
    for (const f of [0, 0.34, 0.55, 1]) {
      const x = gx0 + (gx1 - gx0) * f;
      s += `<rect x="${x - 7}" y="${ey + eh - 12 - 7}" width="14" height="14" transform="rotate(45 ${x} ${ey + eh - 12})" fill="#b69cff"/>`;
    }
    const ph = gx0 + (gx1 - gx0) * 0.62;
    s += `<line x1="${ph}" y1="${ey + 30}" x2="${ph}" y2="${ey + eh - 4}" stroke="#8a5cff" stroke-width="2"/>`;
    return s + noise(w, h, 0.03);
  };

  SC.stageGame = (w, h) => {
    // crop into the win moment on the dragon screen
    return `<svg x="0" y="0" width="${w}" height="${h}" viewBox="${1920 * 0.2} ${1080 * 0.18} ${1920 * 0.6} ${1920 * 0.6 * (h / w)}" preserveAspectRatio="xMidYMid slice">${SC.dragonScreen_win(1920, 1080)}</svg>` + vignette(w, h, 0.45, 0.6);
  };

  /* Animation frames strip (careers / studio) */
  SC.framesStrip = (w, h) => {
    let s = `<rect width="${w}" height="${h}" fill="#0d0e13"/>` + glowAt(w * 0.5, h * 0.5, w * 0.5, '#ff6a2a', 0.12);
    const n = 8, fw = (w - 120) / n;
    for (let i = 0; i < n; i++) {
      const x = 60 + i * fw, y = h * 0.14;
      s += `<rect x="${x + 8}" y="${y}" width="${fw - 16}" height="${h * 0.6}" rx="12" fill="#fff" fill-opacity="${i === 5 ? 0.06 : 0.025}" stroke="${i === 5 ? '#ffcf7a' : '#fff'}" stroke-opacity="${i === 5 ? 0.8 : 0.08}"/>`;
      const a = [-24, -18, -10, -2, 6, 3, -1, 0][i];
      const sc = [0.7, 0.78, 0.9, 1.04, 1.1, 1, 0.98, 1][i];
      const sz = Math.min(fw - 40, h * 0.5) * sc;
      const cx = x + fw / 2, cy = y + h * 0.3;
      s += `<g transform="rotate(${a} ${cx} ${y + 20})" ${i < 3 ? `opacity="${0.55 + i * 0.15}"` : ''}>${sym('dragon', 'lantern', cx - sz / 2, cy - sz / 2, sz)}</g>`;
      s += `<text x="${x + 20}" y="${y + h * 0.6 + 34}" font-family="Manrope" font-size="15" font-weight="700" letter-spacing="2" fill="#8d8a96">F${String(i * 3 + 1).padStart(2, '0')}</text>`;
    }
    s += `<line x1="60" y1="${h * 0.9}" x2="${w - 60}" y2="${h * 0.9}" stroke="#fff" stroke-opacity=".12"/>`;
    for (let i = 0; i <= 24; i++) s += `<line x1="${60 + ((w - 120) * i) / 24}" y1="${h * 0.9 - (i % 3 ? 5 : 10)}" x2="${60 + ((w - 120) * i) / 24}" y2="${h * 0.9}" stroke="#fff" stroke-opacity=".25"/>`;
    return s + noise(w, h, 0.03);
  };

  /* UI kit — spin button states, bet stepper, win banner */
  SC.uiKit = (w, h) => {
    const grid = uid('g');
    let s = `<defs><pattern id="${grid}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern></defs><rect width="${w}" height="${h}" fill="#0f1015"/><rect width="${w}" height="${h}" fill="url(#${grid})"/>`;
    s += txt(60, 70, 'UI KIT · CONTROLS · V3', 16, '#8d8a96', { weight: 700, ls: 3 });
    const themes = ['dragon', 'tide', 'temple'];
    themes.forEach((g, gi) => {
      const set = SETS[g], y = 170 + gi * 250;
      const sp = uid('s');
      s += `<defs>${rad(sp, [[0, '#ffffff'], [0.3, set.frame[0]], [0.8, set.frame[1]], [1, set.frame[2]]], 0.4, 0.35, 0.7)}</defs>`;
      ['IDLE', 'HOVER', 'PRESSED', 'DISABLED'].forEach((st, i) => {
        const x = 130 + i * 190, r = st === 'PRESSED' ? 58 : 64;
        if (st === 'HOVER') s += glowAt(x, y + 60, 110, set.frame[1], 0.4);
        s += `<g opacity="${st === 'DISABLED' ? 0.35 : 1}"><circle cx="${x}" cy="${y + 60}" r="${r}" fill="url(#${sp})" stroke="${set.frame[2]}" stroke-width="3"/><circle cx="${x}" cy="${y + 60}" r="${r * 0.78}" fill="${set.cell[1]}"/>
          <path d="M${x + r * 0.38} ${y + 60 - r * 0.12} A${r * 0.4} ${r * 0.4} 0 1 0 ${x + r * 0.3} ${y + 60 + r * 0.26}" stroke="${set.frame[0]}" stroke-width="${r * 0.1}" fill="none" stroke-linecap="round"/><path d="M${x + r * 0.2} ${y + 60 - r * 0.22} L${x + r * 0.44} ${y + 60 - r * 0.1} L${x + r * 0.5} ${y + 60 - r * 0.38}Z" fill="${set.frame[0]}"/></g>`;
        s += txt(x, y + 160, st, 12, '#6f6c78', { anchor: 'middle', weight: 700, ls: 2 });
      });
      // stepper + banner
      const bx = 900;
      s += `<rect x="${bx}" y="${y + 24}" width="260" height="72" rx="36" fill="${set.cell[1]}" stroke="${set.frame[1]}" stroke-width="2"/>`;
      s += txt(bx + 130, y + 52, 'BET', 12, '#ffffff', { anchor: 'middle', weight: 700, ls: 2, extra: 'opacity=".5"' }) + txt(bx + 130, y + 80, '1.00', 22, '#fff', { anchor: 'middle', weight: 700 });
      s += `<circle cx="${bx + 38}" cy="${y + 60}" r="24" fill="#fff" fill-opacity=".08"/><circle cx="${bx + 222}" cy="${y + 60}" r="24" fill="#fff" fill-opacity=".08"/>` + txt(bx + 38, y + 68, '−', 26, '#fff', { anchor: 'middle' }) + txt(bx + 222, y + 68, '+', 26, '#fff', { anchor: 'middle' });
      const tg = uid('t');
      s += `<defs>${lin(tg, [[0, '#fff'], [0.4, set.frame[0]], [1, set.frame[1]]])}</defs><rect x="${bx + 300}" y="${y + 14}" width="200" height="92" rx="46" fill="${set.cell[1]}" stroke="${set.frame[0]}" stroke-width="3"/>` + txt(bx + 400, y + 74, 'BIG WIN', 30, `url(#${tg})`, { anchor: 'middle', weight: 800, ls: 2 });
    });
    return s + noise(w, h, 0.03);
  };

  /* Concept thumbnails — value studies of the three worlds */
  SC.concepts = (w, h) => {
    const mono = uid('m'), sh = uid('s');
    let s = `<defs><filter id="${mono}"><feColorMatrix type="matrix" values=".4 .4 .4 0 .1  .36 .36 .36 0 .08  .3 .3 .3 0 .06  0 0 0 1 0"/><feComponentTransfer><feFuncR type="gamma" exponent=".7" amplitude="1.15"/><feFuncG type="gamma" exponent=".7" amplitude="1.1"/><feFuncB type="gamma" exponent=".7" amplitude="1.0"/></feComponentTransfer></filter>${blur(sh, 12)}</defs>`;
    s += `<rect width="${w}" height="${h}" fill="#0c0c0f"/>` + glowAt(w * 0.3, 0, w * 0.8, '#f0bd72', 0.12);
    const arts = [['dragonArt', 'A1'], ['dragonArt', 'A2'], ['tideArt', 'B1'], ['tideArt', 'B3'], ['templeArt', 'C1'], ['templeArt', 'C2']];
    const cw = (w - 140) / 3, ch = (h - 140) / 2;
    arts.forEach(([a, label], i) => {
      const x = 50 + (i % 3) * (cw + 20), y = 50 + Math.floor(i / 3) * (ch + 30);
      const rot = [-1.5, 1, -0.5, 1.5, -1, 0.8][i];
      s += `<g transform="rotate(${rot} ${x + cw / 2} ${y + ch / 2})"><rect x="${x + 6}" y="${y + 12}" width="${cw}" height="${ch}" fill="#000" opacity=".6" filter="url(#${sh})"/><rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#e9e3d6"/>`;
      s += `<g filter="url(#${mono})">${nest(a, x + 14, y + 14, cw - 28, ch - 60, i % 2 ? 2560 : 1920, i % 2 ? 1280 : 1080)}</g>`;
      s += `<text x="${x + 16}" y="${y + ch - 18}" font-family="Caladea, serif" font-style="italic" font-size="22" fill="#2e2a26">${label} — ${['warm sun', 'coil tighter', 'moon high', 'jellies lower', 'stairs lit', 'more canopy'][i]}</text></g>`;
    });
    return s + noise(w, h, 0.05);
  };

  /* Character sheet — the Temple idol, turnaround and expressions */
  SC.characterSheet = (w, h) => {
    const grid = uid('g');
    let s = `<defs><pattern id="${grid}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".035"/></pattern></defs><rect width="${w}" height="${h}" fill="#0c120f"/><rect width="${w}" height="${h}" fill="url(#${grid})"/>`;
    s += glowAt(w * 0.4, h * 0.45, h * 0.7, '#2cd08a', 0.16);
    s += txt(60, 70, 'TEMPLE OF VALOR · IDOL · TURNAROUND', 16, '#8d9a92', { weight: 700, ls: 3 });
    const sz = h * 0.46, y = h * 0.16;
    [['FRONT', 1, 0], ['3/4', 0.78, -8], ['SIDE', 0.42, 0], ['BACK', 1, 0]].forEach(([n, sx, sk], i) => {
      const cx = 170 + i * (sz * 0.9);
      s += `<line x1="${cx}" y1="${y - 10}" x2="${cx}" y2="${y + sz + 10}" stroke="#fff" stroke-opacity=".06"/>`;
      s += `<g transform="translate(${cx} ${y}) skewY(${sk}) scale(${sx} 1) translate(${-sz / 2} 0)" ${i === 3 ? 'style="filter:brightness(.35)"' : ''}>${sym('temple', 'mask', 0, 0, sz)}</g>`;
      s += txt(cx, y + sz + 44, n, 13, '#8d9a92', { anchor: 'middle', weight: 700, ls: 2 });
    });
    for (let i = 1; i < 4; i++) s += `<line x1="60" y1="${y + (sz * i) / 4}" x2="${w - 60}" y2="${y + (sz * i) / 4}" stroke="#46ffb0" stroke-opacity=".08" stroke-dasharray="4 8"/>`;
    s += txt(60, h * 0.8, 'EXPRESSIONS', 13, '#8d9a92', { weight: 700, ls: 3 });
    ['DORMANT', 'AWAKE', 'TRIGGER'].forEach((n, i) => {
      const x = 60 + i * 200, yy = h * 0.83, ss = 130;
      s += `<rect x="${x}" y="${yy}" width="170" height="${ss + 10}" rx="10" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>`;
      if (i === 2) s += glowAt(x + 85, yy + ss / 2, 90, '#46ffb0', 0.5);
      s += `<g style="filter:${['saturate(.2) brightness(.7)', 'none', 'saturate(1.4) brightness(1.15)'][i]}">${sym('temple', 'mask', x + 20, yy + 5, ss)}</g>`;
      s += txt(x + 180, yy + 30, n, 12, '#6f7a74', { weight: 700, ls: 2 });
    });
    return s + noise(w, h, 0.03);
  };

  /* Studio board — production evidence laid out on a desk */
  SC.studioBoard = (w, h) => {
    const R = rng(33), sh = uid('s');
    let s = `<defs>${blur(sh, 18)}</defs><rect width="${w}" height="${h}" fill="#0b0b0e"/>`;
    s += glowAt(w * 0.25, h * 0.1, w * 0.7, '#f0bd72', 0.2) + glowAt(w * 1, h * 0.8, w * 0.5, '#7134f4', 0.18);
    const card = (name, x, y, cw, ch, sw, sh2, rot, extra = '') =>
      `<g transform="rotate(${rot} ${x + cw / 2} ${y + ch / 2})"><rect x="${x + 10}" y="${y + 22}" width="${cw}" height="${ch}" rx="6" fill="#000" opacity=".65" filter="url(#${sh})"/><g>${nest(name, x, y, cw, ch, sw, sh2)}</g><rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="2" fill="none" stroke="#fff" stroke-opacity=".08"/>${extra}</g>`;
    s += card('symbolSheet', w * 0.03, h * 0.08, w * 0.34, w * 0.34 * 0.625, 1600, 1000, -2);
    s += card('dragonArt', w * 0.4, h * 0.05, w * 0.15, w * 0.15 * 1.25, 1200, 1500, 2);
    s += card('tideArt', w * 0.57, h * 0.1, w * 0.15, w * 0.15 * 1.25, 1200, 1500, -1.5);
    s += card('templeArt', w * 0.74, h * 0.04, w * 0.15, w * 0.15 * 1.25, 1200, 1500, 2.5);
    s += card('stageConcept', w * 0.05, h * 0.58, w * 0.26, w * 0.26 * 0.8, 1200, 960, 3);
    s += card('framesStrip', w * 0.34, h * 0.64, w * 0.4, w * 0.4 * 0.32, 2560, 820, -1);
    s += card('uiKit', w * 0.76, h * 0.56, w * 0.21, w * 0.21 * 0.75, 1600, 1200, -3);
    // colour chips
    ['#ee3a2a', '#f7d58a', '#6a3fe0', '#56c8ff', '#2fd08a', '#ffc24a'].forEach((c, i) => {
      s += `<g transform="rotate(${(R() - 0.5) * 16} ${w * 0.6 + i * 44} ${h * 0.53})"><rect x="${w * 0.6 + i * 44}" y="${h * 0.5}" width="36" height="56" rx="3" fill="#e9e3d6"/><rect x="${w * 0.6 + i * 44 + 3}" y="${h * 0.5 + 3}" width="30" height="34" fill="${c}"/></g>`;
    });
    s += vignette(w, h, 0.7, 0.5) + noise(w, h, 0.05);
    return s;
  };

  FX.OUTPUTS.push(
    { name: 'dragonScreen_base', w: 1920, h: 1080, file: 'visual-fixtures/games/dragons-fortune-screen-1.jpg' },
    { name: 'dragonScreen_win', w: 1920, h: 1080, file: 'visual-fixtures/games/dragons-fortune-screen-2.jpg' },
    { name: 'tideScreen_base', w: 1920, h: 1080, file: 'visual-fixtures/games/mystic-tides-screen-1.jpg' },
    { name: 'tideScreen_feature', w: 1920, h: 1080, file: 'visual-fixtures/games/mystic-tides-screen-2.jpg' },
    { name: 'templeScreen_base', w: 1920, h: 1080, file: 'visual-fixtures/games/temple-of-valor-screen-1.jpg' },
    { name: 'templeScreen_feature', w: 1920, h: 1080, file: 'visual-fixtures/games/temple-of-valor-screen-2.jpg' },
    { name: 'madeFeel', w: 1600, h: 1200, file: 'visual-fixtures/production/made-feel.png' },
    { name: 'madeImpact', w: 1600, h: 1200, file: 'visual-fixtures/production/made-impact.png' },
    { name: 'madeDevices', w: 1600, h: 1200, file: 'visual-fixtures/production/made-devices.png' },
    { name: 'stageConcept', w: 1200, h: 960, file: 'visual-fixtures/production/stage-concept.png' },
    { name: 'stageDesign', w: 1200, h: 960, file: 'visual-fixtures/production/stage-design.png' },
    { name: 'stageMotion', w: 1200, h: 960, file: 'visual-fixtures/production/stage-motion.png' },
    { name: 'stageGame', w: 1200, h: 960, file: 'visual-fixtures/production/stage-game.png' },
    { name: 'framesStrip', w: 2560, h: 820, file: 'visual-fixtures/production/animation-frames.png' },
    { name: 'uiKit', w: 1600, h: 1200, file: 'visual-fixtures/production/ui-kit.png' },
    { name: 'concepts', w: 1600, h: 1000, file: 'visual-fixtures/production/concepts.png' },
    { name: 'characterSheet', w: 1600, h: 1000, file: 'visual-fixtures/production/character-sheet.png' },
    { name: 'studioBoard', w: 2560, h: 1200, file: 'visual-fixtures/production/studio-board.png' },
  );
})();
