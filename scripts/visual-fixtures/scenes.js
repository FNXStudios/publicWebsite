/*
 * VISUAL FIXTURES — scenes. Each scene returns SVG markup for a w×h canvas.
 * Development artwork only (see render.mjs).
 */
(function () {
  const FX = window.FX;
  const { uid, rad, sym, SETS } = FX;
  const SC = {};

  const wrap = (w, h, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
  FX.render = (name, w, h) => wrap(w, h, SC[name](w, h));
  /** Embed a scene inside another at x,y with size w×h (scene drawn at sw×sh). */
  const nest = (name, x, y, w, h, sw = w, sh = h, extra = '') =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${sw} ${sh}" preserveAspectRatio="xMidYMid slice" ${extra}>${SC[name](sw, sh)}</svg>`;

  const noise = (w, h, opacity = 0.08, freq = 0.9) => {
    const f = uid('nz');
    return `<defs><filter id="${f}"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter></defs><rect width="${w}" height="${h}" filter="url(#${f})" opacity="${opacity}" style="mix-blend-mode:overlay"/>`;
  };
  const vignette = (w, h, a = 0.7, inner = 0.55) => {
    const g = uid('vg');
    return `<defs>${rad(g, [[0, '#000', 0], [inner, '#000', 0], [1, '#000', a]], 0.5, 0.5, 0.75)}</defs><rect width="${w}" height="${h}" fill="url(#${g})"/>`;
  };
  const glowAt = (x, y, r, color, a = 0.5) => {
    const g = uid('ga');
    return `<defs>${rad(g, [[0, color, a], [0.4, color, a * 0.45], [1, color, 0]])}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})"/>`;
  };
  const ellipseGlow = (x, y, rx, ry, color, a = 0.5) => {
    const g = uid('eg');
    return `<defs>${rad(g, [[0, color, a], [0.45, color, a * 0.4], [1, color, 0]])}</defs><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${g})"/>`;
  };
  const particles = (R, n, x0, y0, w, h, colors, rmin = 1, rmax = 3, amin = 0.3, amax = 1) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const r = rmin + R() * (rmax - rmin);
      const c = colors[Math.floor(R() * colors.length)];
      s += `<circle cx="${(x0 + R() * w).toFixed(1)}" cy="${(y0 + R() * h).toFixed(1)}" r="${r.toFixed(2)}" fill="${c}" opacity="${(amin + R() * (amax - amin)).toFixed(2)}"/>`;
    }
    return s;
  };
  /** Jagged ridge silhouette. */
  const ridge = (R, w, h, base, amp, steps, fill, rough = 0.5) => {
    let d = `M0 ${h} L0 ${base}`;
    let y = base;
    for (let i = 1; i <= steps; i++) {
      const x = (i / steps) * w;
      y = base - amp * (0.5 + 0.5 * Math.sin(i * 0.9 + R() * 2)) * (1 - rough + R() * rough);
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return `<path d="${d} L${w} ${h}Z" fill="${fill}"/>`;
  };
  /** Smooth hill silhouette. */
  const hills = (R, w, h, base, amp, n, fill) => {
    let d = `M0 ${h} L0 ${base}`;
    const pts = [];
    for (let i = 0; i <= n; i++) pts.push([(i / n) * w, base - amp * (0.3 + R() * 0.7)]);
    d += ` L${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      d += ` C${x0 + (x1 - x0) / 2} ${y0} ${x0 + (x1 - x0) / 2} ${y1} ${x1} ${y1}`;
    }
    return `<path d="${d} L${w} ${h}Z" fill="${fill}"/>`;
  };
  FX.kit = { noise, vignette, glowAt, ellipseGlow, particles, ridge, hills, nest };

  /* =====================================================================
     Symbol sheet (also a production visual)
     ===================================================================== */
  SC.symbolSheet = (w, h) => {
    const games = ['dragon', 'tide', 'temple'];
    let s = `<rect width="${w}" height="${h}" fill="#101116"/>`;
    const grid = uid('gr');
    s += `<defs><pattern id="${grid}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".04"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#${grid})"/>`;
    const cols = 10, pad = 70;
    const cw = (w - pad * 2) / cols;
    const rowH = (h - 150) / 3;
    games.forEach((g, gi) => {
      const set = SETS[g];
      const keys = [set.wild, ...set.high, 'royal:0', 'royal:1', 'royal:2', 'royal:3', 'royal:4'];
      const y = 110 + gi * rowH;
      s += `<text x="${pad}" y="${y - 22}" font-family="Manrope" font-size="15" font-weight="600" letter-spacing="3" fill="#8d8a96">${['DRAGON’S FORTUNE', 'MYSTIC TIDES', 'TEMPLE OF VALOR'][gi]} — SYMBOL SET</text>`;
      keys.forEach((k, i) => {
        const x = pad + i * cw;
        s += `<rect x="${x + 6}" y="${y}" width="${cw - 12}" height="${rowH - 60}" rx="10" fill="#fff" fill-opacity=".025" stroke="#fff" stroke-opacity=".07"/>`;
        s += sym(g, k, x + 10, y + 6, cw - 20);
        s += `<text x="${x + 18}" y="${y + rowH - 74}" font-family="Manrope" font-size="12" fill="#6f6c78" letter-spacing="1">${(k.startsWith('royal') ? 'LOW_' : 'HI_') + String(i).padStart(2, '0')}</text>`;
      });
    });
    return s;
  };

  FX.SC = SC;
  FX.OUTPUTS = [{ name: 'symbolSheet', w: 1600, h: 1000, file: 'visual-fixtures/production/symbol-sheet.png' }];
})();
