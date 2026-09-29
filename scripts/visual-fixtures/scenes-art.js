/*
 * VISUAL FIXTURES — key art: the three fixture games and the FNX hero architecture.
 */
(function () {
  const FX = window.FX;
  const { uid, lin, rad, blur, rng, GOLD } = FX;
  const { noise, vignette, glowAt, ellipseGlow, particles, ridge, hills } = FX.kit;
  const SC = FX.SC;

  /** Catmull-Rom through points → sampled positions. */
  function spline(pts, n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * (pts.length - 1);
      const k = Math.min(Math.floor(t), pts.length - 2);
      const u = t - k;
      const p0 = pts[Math.max(k - 1, 0)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(k + 2, pts.length - 1)];
      const f = (a, b, c, d) =>
        0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
    return out;
  }

  /** Auspicious cloud: scalloped top, flat base, curled ends. */
  function cloud(x, y, width, s, fill, stroke, R) {
    let d = `M${x} ${y}`;
    let cx = x;
    const bumps = [];
    while (cx < x + width) {
      const r = s * (0.5 + R() * 0.7);
      bumps.push(r);
      cx += r * 2;
    }
    cx = x;
    for (const r of bumps) {
      d += ` a${r} ${r} 0 0 1 ${r * 2} 0`;
      cx += r * 2;
    }
    const h = s * 0.9;
    d += ` a${h / 2} ${h / 2} 0 0 1 0 ${h} L${x} ${y + h} a${h / 2} ${h / 2} 0 0 1 0 ${-h}Z`;
    const curlL = `<path d="M${x + h * 0.2} ${y + h * 0.5} a${h * 0.28} ${h * 0.28} 0 1 1 ${h * 0.3} ${h * 0.12}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, s * 0.05)}" stroke-linecap="round"/>`;
    const curlR = `<path d="M${cx - h * 0.2} ${y + h * 0.5} a${h * 0.28} ${h * 0.28} 0 1 0 ${-h * 0.3} ${h * 0.12}" fill="none" stroke="${stroke}" stroke-width="${Math.max(1.5, s * 0.05)}" stroke-linecap="round"/>`;
    return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1.5, s * 0.05)}" stroke-linejoin="round"/>${curlL}${curlR}`;
  }

  function pagoda(x, base, s, fill, lit) {
    let g = '';
    let y = base;
    const tiers = 5;
    for (let i = 0; i < tiers; i++) {
      const bw = s * (1 - i * 0.14);
      const bh = s * 0.32 * (1 - i * 0.06);
      g += `<rect x="${x - bw * 0.36}" y="${y - bh}" width="${bw * 0.72}" height="${bh}" fill="${fill}"/>`;
      for (let wi = -1; wi <= 1; wi++) g += `<rect x="${x + wi * bw * 0.18 - s * 0.025}" y="${y - bh * 0.72}" width="${s * 0.05}" height="${bh * 0.4}" fill="${lit}" opacity="${0.55 + wi * 0.1}"/>`;
      y -= bh;
      const rw = bw * 0.62, rh = s * 0.12;
      g += `<path d="M${x - rw} ${y + rh * 0.2} Q${x - rw * 0.7} ${y - rh * 0.1} ${x - rw * 0.4} ${y - rh * 0.55} L${x + rw * 0.4} ${y - rh * 0.55} Q${x + rw * 0.7} ${y - rh * 0.1} ${x + rw} ${y + rh * 0.2} Q${x + rw * 0.6} ${y + rh * 0.05} ${x} ${y + rh * 0.12} Q${x - rw * 0.6} ${y + rh * 0.05} ${x - rw} ${y + rh * 0.2}Z" fill="${fill}"/>`;
      y -= rh * 0.55;
    }
    g += `<rect x="${x - s * 0.012}" y="${y - s * 0.35}" width="${s * 0.024}" height="${s * 0.35}" fill="${fill}"/>`;
    return g;
  }

  /* =====================================================================
     Dragon's Fortune — red / amber / gold
     ===================================================================== */
  SC.dragonArt = (w, h) => {
    const R = rng(7);
    const wide = w > h * 1.2;
    const m = Math.min(w, h);
    const cx = wide ? w * 0.64 : w * 0.54, cy = wide ? h * 0.46 : h * 0.4;
    const SR = m * (wide ? 0.26 : 0.3);
    const sky = uid('sk'), sun = uid('sn'), haze = uid('hz'), bodyG = uid('bd'), fin = uid('fn'), bl = uid('b'), bl2 = uid('b');
    let s = `<defs>
      ${lin(sky, [[0, '#1c0306'], [0.35, '#5a0a10'], [0.62, '#b3281c'], [0.8, '#6e0e10'], [1, '#1a0204']])}
      ${rad(sun, [[0, '#fff1c4'], [0.35, '#ffb45a'], [0.75, '#f0561e'], [1, '#c02316']], 0.42, 0.4, 0.6)}
      ${lin(haze, [[0, '#ff7a2e', 0], [0.6, '#ff7a2e', 0.18], [1, '#2a0306', 0.9]])}
      ${rad(bodyG, [[0, '#fff3c6'], [0.45, '#f2c262'], [0.85, '#b06a1c'], [1, '#5a2c06']], 0.4, 0.35, 0.7)}
      ${lin(fin, [[0, '#ff5a2a'], [1, '#8a0a12']])}
      ${blur(bl, m * 0.012)}${blur(bl2, 3)}
    </defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#${sky})"/>`;
    s += glowAt(cx, cy, SR * 3.2, '#ff5a1f', 0.55);
    // rings
    for (let i = 1; i <= 6; i++) s += `<circle cx="${cx}" cy="${cy}" r="${SR * (1 + i * 0.16)}" fill="none" stroke="#ffc07a" stroke-opacity="${0.16 - i * 0.02}" stroke-width="${i % 2 ? 2 : 1}" ${i === 3 ? 'stroke-dasharray="2 10"' : ''}/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${SR}" fill="url(#${sun})"/>`;
    const sclip = uid('sc');
    s += `<defs><clipPath id="${sclip}"><circle cx="${cx}" cy="${cy}" r="${SR}"/></clipPath></defs><g clip-path="url(#${sclip})">`;
    for (let i = 0; i < 7; i++) s += `<rect x="${cx - SR}" y="${cy + SR * (0.1 + i * 0.13)}" width="${SR * 2}" height="${SR * (0.02 + i * 0.012)}" fill="#a3170f" opacity="${0.25 + i * 0.07}"/>`;
    s += `</g>`;
    // distant ridges
    s += ridge(R, w, h, h * 0.66, h * 0.1, 40, '#4a060c', 0.6);
    s += `<g opacity=".95">${pagoda(wide ? w * 0.2 : w * 0.16, h * 0.7, m * 0.22, '#2a0307', '#ffb24a')}${pagoda(wide ? w * 0.86 : w * 0.9, h * 0.69, m * 0.16, '#2a0307', '#ffb24a')}</g>`;
    s += ridge(R, w, h, h * 0.74, h * 0.06, 30, '#300408', 0.4);
    s += `<rect y="${h * 0.45}" width="${w}" height="${h * 0.55}" fill="url(#${haze})"/>`;

    // back clouds
    const cloudFill = '#7a0e14', cloudStroke = '#f0bd72';
    s += `<g opacity=".9">${cloud(cx - SR * 2.3, cy + SR * 0.55, SR * 1.2, SR * 0.14, '#5e0a10', '#e2a45a', R)}${cloud(cx + SR * 0.9, cy - SR * 0.95, SR * 1.1, SR * 0.12, '#5e0a10', '#e2a45a', R)}</g>`;

    // dragon body: loops around the sun, head off-canvas
    const pts = [
      [-1.9, 2.3], [-1.35, 1.25], [-0.2, 1.45], [1.05, 1.05], [1.45, 0.05], [0.95, -0.95], [-0.15, -1.3], [-1.15, -1.05], [-1.7, -1.9], [-1.9, -3],
    ].map(([x, y]) => [cx + x * SR, cy + y * SR]);
    const P = spline(pts, 520);
    let body = '', fins = '';
    for (let i = 0; i < P.length; i++) {
      const t = i / (P.length - 1);
      const r = SR * (0.02 + 0.115 * Math.min(1, t * 3.2));
      const [x, y] = P[i];
      if (i % 2 === 0) body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${bodyG})" stroke="#6b3408" stroke-opacity=".55" stroke-width="${Math.max(1, r * 0.06)}"/>`;
      if (i % 14 === 7 && t > 0.08) {
        const [px, py] = P[Math.min(i + 1, P.length - 1)];
        let nx = -(py - y), ny = px - x;
        const L = Math.hypot(nx, ny) || 1;
        nx /= L; ny /= L;
        // outer side = away from sun
        if ((x - cx) * nx + (y - cy) * ny < 0) { nx = -nx; ny = -ny; }
        const bx = x + nx * r * 0.7, by = y + ny * r * 0.7;
        const tx = x + nx * r * 1.9 - (px - x) * 3, ty = y + ny * r * 1.9 - (py - y) * 3;
        fins += `<path d="M${bx - (px - x) * 3} ${by - (py - y) * 3} Q${tx} ${ty} ${tx} ${ty} L${bx + (px - x) * 4} ${by + (py - y) * 4}Z" fill="url(#${fin})"/>`;
      }
    }
    s += `<g>${fins}${body}</g>`;
    // body highlight pass
    let hl = '';
    for (let i = 0; i < P.length; i += 3) {
      const t = i / (P.length - 1);
      const r = SR * (0.02 + 0.115 * Math.min(1, t * 3.2));
      hl += `<circle cx="${(P[i][0] - r * 0.25).toFixed(1)}" cy="${(P[i][1] - r * 0.3).toFixed(1)}" r="${(r * 0.35).toFixed(1)}" fill="#fff6d8" opacity=".12"/>`;
    }
    s += hl;
    // belly plates on the sun-facing side + dark segment rings
    let belly2 = '';
    for (let i = 4; i < P.length - 1; i += 4) {
      const t = i / (P.length - 1);
      const r = SR * (0.02 + 0.115 * Math.min(1, t * 3.2));
      const [x, y] = P[i], [px, py] = P[i + 1];
      let nx = -(py - y), ny = px - x;
      const L = Math.hypot(nx, ny) || 1;
      nx /= L; ny /= L;
      if ((x - cx) * nx + (y - cy) * ny > 0) { nx = -nx; ny = -ny; }
      const bx = x + nx * r * 0.62, by = y + ny * r * 0.62;
      const tx = (px - x) / (L || 1), ty = (py - y) / (L || 1);
      belly2 += `<path d="M${(bx - nx * r * 0.3 - tx * r * 0.3).toFixed(1)} ${(by - ny * r * 0.3 - ty * r * 0.3).toFixed(1)} Q${(bx + nx * r * 0.25).toFixed(1)} ${(by + ny * r * 0.25).toFixed(1)} ${(bx - nx * r * 0.3 + tx * r * 0.3).toFixed(1)} ${(by - ny * r * 0.3 + ty * r * 0.3).toFixed(1)}" stroke="#fff0c0" stroke-opacity=".75" stroke-width="${Math.max(1, r * 0.2).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
      if (i % 12 === 0) belly2 += `<circle cx="${(x - nx * r * 0.2).toFixed(1)}" cy="${(y - ny * r * 0.2).toFixed(1)}" r="${(r * 0.55).toFixed(1)}" fill="none" stroke="#7a3a08" stroke-opacity=".35" stroke-width="${Math.max(1, r * 0.08).toFixed(1)}"/>`;
    }
    s += belly2;

    // front clouds weave over the body
    s += cloud(cx - SR * 1.9, cy + SR * 1.05, SR * 1.2, SR * 0.2, cloudFill, cloudStroke, R);
    s += cloud(cx + SR * 0.8, cy + SR * 0.55, SR * 1.1, SR * 0.17, cloudFill, cloudStroke, R);
    s += cloud(cx - SR * 1.1, cy - SR * 1.45, SR * 1.0, SR * 0.15, cloudFill, cloudStroke, R);

    // dragon pearl
    s += FX.sym('dragon', 'pearl', cx - SR * 0.95 - SR * 0.35, cy - SR * 0.05 - SR * 0.35, SR * 0.7);

    // hanging lanterns
    const lx = wide ? [0.08, 0.3, 0.44, 0.94] : [0.1, 0.34, 0.86];
    lx.forEach((f, i) => {
      const x = w * f, len = h * (0.1 + R() * 0.16), sz = m * (0.07 + R() * 0.05) * (i % 2 ? 0.8 : 1);
      s += `<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="#f0bd72" stroke-opacity=".5" stroke-width="2"/>`;
      s += FX.sym('dragon', 'lantern', x - sz / 2, len - sz * 0.05, sz);
    });

    // treasure pile
    const py0 = h * 0.94;
    s += ellipseGlow(cx, py0, w * 0.45, h * 0.12, '#ffb03a', 0.45);
    for (let i = 0; i < 60; i++) {
      const x = cx + (R() - 0.5) * w * (wide ? 0.55 : 0.9);
      const y = py0 + (R() - 0.3) * h * 0.08;
      const r = m * (0.018 + R() * 0.022);
      const cg = uid('cn');
      s += `<defs>${lin(cg, GOLD, 0, 0, 1, 1)}</defs><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}" fill="url(#${cg})" stroke="#6b3408" stroke-width="1"/><rect x="${x - r * 0.18}" y="${y - r * 0.09}" width="${r * 0.36}" height="${r * 0.18}" fill="#5a2806"/>`;
    }
    const ing = wide ? [[-0.34, 0.2], [0.22, 0.14], [0.02, 0.26]] : [[-0.28, 0.2], [0.26, 0.16], [0, 0.26]];
    ing.forEach(([fx, s2]) => {
      const sz = m * s2;
      s += FX.sym('dragon', fx === 0 ? 'coin' : 'ingot', cx + fx * w - sz / 2, py0 - sz * 0.75, sz);
    });

    // embers
    s += `<g filter="url(#${bl2})">${particles(R, 90, 0, 0, w, h, ['#ffb04a', '#ff7a2a', '#ffd78a'], 1, 3.5, 0.3, 0.9)}</g>`;
    s += particles(R, 60, 0, 0, w, h, ['#ffe2a0'], 0.6, 1.6, 0.4, 1);
    s += vignette(w, h, 0.75, 0.5);
    s += noise(w, h, 0.07);
    return s;
  };

  /* =====================================================================
     Mystic Tides — indigo / blue / violet
     ===================================================================== */
  SC.tideArt = (w, h) => {
    const R = rng(11);
    const wide = w > h * 1.2;
    const m = Math.min(w, h);
    const mx = wide ? w * 0.66 : w * 0.5, my = wide ? h * 0.3 : h * 0.24;
    const MR = m * 0.12;
    const hz = wide ? h * 0.58 : h * 0.52;
    const sky = uid('sk'), moon = uid('mn'), sea = uid('se'), au = uid('au'), bl = uid('b'), bl2 = uid('b'), bl3 = uid('b');
    let s = `<defs>
      ${lin(sky, [[0, '#04041a'], [0.4, '#10124e'], [0.85, '#2e2a8c'], [1, '#4b3bb0']])}
      ${rad(moon, [[0, '#ffffff'], [0.6, '#e6e8ff'], [1, '#aab2f2']], 0.4, 0.4, 0.6)}
      ${lin(sea, [[0, '#2a2f8e'], [0.25, '#161a62'], [1, '#04051c']])}
      ${lin(au, [[0, '#8a5cff', 0], [0.3, '#8a5cff', 0.9], [0.6, '#3fd0ff', 0.8], [1, '#8a5cff', 0]], 0, 0, 1, 0)}
      ${blur(bl, m * 0.04)}${blur(bl2, 2.5)}${blur(bl3, m * 0.01)}
    </defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#${sky})"/>`;
    s += particles(R, 220, 0, 0, w, hz * 0.9, ['#ffffff', '#cfd6ff', '#b9a8ff'], 0.5, 1.8, 0.2, 0.9);
    // aurora
    s += `<g filter="url(#${bl})" opacity=".85">`;
    for (let i = 0; i < 3; i++) {
      const y = h * (0.1 + i * 0.09);
      s += `<path d="M${-w * 0.1} ${y + h * 0.08} C${w * 0.25} ${y - h * 0.1} ${w * 0.5} ${y + h * 0.16} ${w * 1.1} ${y - h * 0.02}" stroke="url(#${au})" stroke-width="${m * (0.1 - i * 0.02)}" fill="none"/>`;
    }
    s += `</g>`;
    // moon
    s += glowAt(mx, my, MR * 5, '#7e6bff', 0.5);
    s += glowAt(mx, my, MR * 2.2, '#cfd6ff', 0.45);
    s += `<circle cx="${mx}" cy="${my}" r="${MR}" fill="url(#${moon})"/>`;
    s += `<circle cx="${mx - MR * 0.3}" cy="${my + MR * 0.2}" r="${MR * 0.18}" fill="#8f97d8" opacity=".25"/><circle cx="${mx + MR * 0.35}" cy="${my - MR * 0.25}" r="${MR * 0.12}" fill="#8f97d8" opacity=".22"/><circle cx="${mx + MR * 0.1}" cy="${my + MR * 0.5}" r="${MR * 0.09}" fill="#8f97d8" opacity=".2"/>`;
    // horizon glow
    s += ellipseGlow(mx, hz, w * 0.6, h * 0.08, '#9a7bff', 0.5);
    // sea stacks
    const stack = (x, top, wd, dir) => {
      let d = `M${x} ${hz + h * 0.02}`;
      const steps = 8;
      for (let i = 0; i <= steps; i++) d += ` L${x + (wd * i) / steps + (R() - 0.5) * wd * 0.12} ${top + Math.abs(Math.sin(i / steps * Math.PI)) * -h * 0.02 + (i === 0 || i === steps ? hz - top : R() * h * 0.05)}`;
      d += ` L${x + wd} ${hz + h * 0.02}Z`;
      const edge = dir > 0 ? x + wd : x;
      return `<path d="${d}" fill="#07082a"/><line x1="${edge}" y1="${top + h * 0.03}" x2="${edge}" y2="${hz}" stroke="#9a86ff" stroke-opacity=".35" stroke-width="3" filter="url(#${bl2})"/>`;
    };
    if (wide) s += stack(w * 0.02, h * 0.3, w * 0.12, 1) + stack(w * 0.9, h * 0.42, w * 0.07, -1);
    else s += stack(-w * 0.02, h * 0.3, w * 0.2, 1) + stack(w * 0.86, h * 0.4, w * 0.16, -1);
    // sea
    s += `<rect y="${hz}" width="${w}" height="${h - hz}" fill="url(#${sea})"/>`;
    const bands = 18;
    for (let i = 0; i < bands; i++) {
      const t = i / bands;
      const y = hz + (h - hz) * Math.pow(t, 1.6);
      const amp = 2 + t * m * 0.02;
      const per = w / (4 + (1 - t) * 10);
      let d = `M0 ${y}`;
      for (let x = 0; x <= w + per; x += per / 2) d += ` Q${x + per / 4} ${y + ((x / (per / 2)) % 2 ? amp : -amp)} ${x + per / 2} ${y}`;
      s += `<path d="${d} L${w} ${h} L0 ${h}Z" fill="#0a0c3a" opacity="${0.12 + t * 0.25}"/>`;
      s += `<path d="${d}" fill="none" stroke="#9fb4ff" stroke-opacity="${0.22 - t * 0.12}" stroke-width="${1 + t * 1.5}"/>`;
    }
    // moon reflection
    let refl = '';
    for (let i = 0; i < 46; i++) {
      const t = i / 46;
      const y = hz + (h - hz) * Math.pow(t, 1.3) + 4;
      const ww = MR * (0.4 + t * 2.6) * (0.5 + R());
      refl += `<rect x="${mx - ww / 2 + (R() - 0.5) * MR * t * 2}" y="${y}" width="${ww}" height="${2 + t * 5}" rx="2" fill="#e6ecff" opacity="${0.55 - t * 0.35}"/>`;
    }
    s += `<g filter="url(#${bl2})">${refl}</g>`;
    // bioluminescence
    s += `<g filter="url(#${bl3})">${particles(R, 70, 0, hz + h * 0.04, w, h - hz, ['#56e0ff', '#8a6bff', '#7ff7ff'], 2, 6, 0.4, 0.9)}</g>`;
    s += particles(R, 90, 0, hz + h * 0.04, w, h - hz, ['#bff6ff', '#d8ccff'], 0.8, 2.2, 0.5, 1);
    // jellyfish
    const jel = wide
      ? [[0.34, 0.28, 0.24], [0.48, 0.12, 0.1], [0.84, 0.18, 0.12], [0.22, 0.14, 0.08]]
      : [[0.22, 0.48, 0.3], [0.78, 0.4, 0.16], [0.6, 0.1, 0.1]];
    jel.forEach(([fx, fy, fs], i) => {
      const sz = m * fs * (wide ? 1.3 : 1);
      s += `<g opacity="${i === 0 ? 0.95 : 0.75}">${FX.sym('tide', 'jelly', w * fx - sz / 2, h * fy, sz)}</g>`;
    });
    // shell on a rock (foreground)
    const rx = wide ? w * 0.82 : w * 0.72, ry = h * 0.9;
    s += `<ellipse cx="${rx}" cy="${ry + m * 0.06}" rx="${m * 0.2}" ry="${m * 0.06}" fill="#05061e"/>`;
    s += FX.sym('tide', 'shell', rx - m * 0.1, ry - m * 0.13, m * 0.2);
    s += vignette(w, h, 0.7, 0.5);
    s += noise(w, h, 0.06);
    return s;
  };

  /* =====================================================================
     Temple of Valor — emerald / jungle / gold
     ===================================================================== */
  function leaf(x, y, len, ang, fill, rib, wdt = 0.26) {
    const l = len, ww = l * wdt;
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M0 0 C${l * 0.25} ${-ww} ${l * 0.7} ${-ww * 0.9} ${l} 0 C${l * 0.7} ${ww * 0.9} ${l * 0.25} ${ww} 0 0Z" fill="${fill}"/><path d="M0 0 Q${l * 0.5} ${-ww * 0.08} ${l * 0.96} 0" stroke="${rib}" stroke-width="${Math.max(1, l * 0.012)}" fill="none"/></g>`;
  }
  function frond(x, y, len, ang, fill, rib, R) {
    let s = `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M0 0 Q${len * 0.5} ${-len * 0.12} ${len} ${len * 0.05}" stroke="${rib}" stroke-width="${len * 0.012}" fill="none"/>`;
    for (let i = 1; i < 16; i++) {
      const t = i / 16;
      const px = len * t, py = -len * 0.12 * 4 * t * (1 - t) * 0.5 + len * 0.05 * t * t;
      const ll = len * 0.28 * Math.sin(t * Math.PI) + len * 0.04;
      s += leaf(px, py, ll, -55 + R() * 10, fill, rib, 0.16) + leaf(px, py, ll, 55 + R() * 10, fill, rib, 0.16);
    }
    return s + '</g>';
  }
  SC.templeArt = (w, h) => {
    const R = rng(23);
    const wide = w > h * 1.2;
    const m = Math.min(w, h);
    const tx = wide ? w * 0.64 : w * 0.5;
    const base = wide ? h * 0.78 : h * 0.72;
    const TW = m * (wide ? 0.62 : 0.72);
    const sky = uid('sk'), stone = uid('st'), mist = uid('mi'), ray = uid('ry'), door = uid('dr'), bl = uid('b'), bl2 = uid('b'), bl3 = uid('b');
    let s = `<defs>
      ${lin(sky, [[0, '#02110b'], [0.35, '#073222'], [0.62, '#1d6a44'], [0.75, '#c9a24c'], [1, '#0b2a1a']])}
      ${lin(stone, [[0, '#123a28'], [1, '#051a10']])}
      ${lin(mist, [[0, '#8ff0c0', 0], [0.5, '#8ff0c0', 0.16], [1, '#8ff0c0', 0]])}
      ${lin(ray, [[0, '#ffd77a', 0.28], [1, '#ffd77a', 0]])}
      ${rad(door, [[0, '#fff6d0'], [0.5, '#ffc24a'], [1, '#c77a12']])}
      ${blur(bl, m * 0.02)}${blur(bl2, 2.5)}${blur(bl3, m * 0.006)}
    </defs>`;
    s += `<rect width="${w}" height="${h}" fill="url(#${sky})"/>`;
    const topY = base - TW * 0.62;
    s += glowAt(tx, topY, m * 0.9, '#ffc452', 0.5);
    // rays
    let rays = '';
    for (let i = 0; i < 22; i++) {
      const a = (-170 + (i / 21) * 160) * (Math.PI / 180);
      const a2 = a + 0.035 + R() * 0.03;
      const L = m * 1.6;
      rays += `<path d="M${tx} ${topY} L${tx + Math.cos(a) * L} ${topY + Math.sin(a) * L} L${tx + Math.cos(a2) * L} ${topY + Math.sin(a2) * L}Z" fill="#ffd77a" opacity="${0.05 + R() * 0.07}"/>`;
    }
    s += `<g filter="url(#${bl3})">${rays}</g>`;
    s += particles(R, 80, 0, 0, w, h * 0.5, ['#fff3c4', '#d8ffe9'], 0.5, 1.5, 0.2, 0.7);
    // distant mountains
    s += ridge(R, w, h, h * 0.6, h * 0.16, 26, '#0e3d2a', 0.5);
    s += `<rect y="${h * 0.5}" width="${w}" height="${h * 0.2}" fill="url(#${mist})"/>`;
    s += hills(R, w, h, h * 0.7, h * 0.1, 10, '#0a2e1f');
    // temple
    let t = '';
    const tiers = 6;
    let y = base;
    const th = TW * 0.085;
    for (let i = 0; i < tiers; i++) {
      const bw = TW * (1 - i * 0.13);
      const x0 = tx - bw / 2;
      t += `<path d="M${x0} ${y} L${x0 + th * 0.35} ${y - th} L${x0 + bw - th * 0.35} ${y - th} L${x0 + bw} ${y}Z" fill="url(#${stone})"/>`;
      t += `<line x1="${x0 + th * 0.35}" y1="${y - th}" x2="${x0 + bw - th * 0.35}" y2="${y - th}" stroke="#f4d27a" stroke-opacity=".55" stroke-width="2"/>`;
      t += `<path d="M${x0 + bw - th * 0.35} ${y - th} L${x0 + bw} ${y}" stroke="#ffd77a" stroke-opacity=".5" stroke-width="3"/>`;
      for (let k = 1; k < 8; k++) t += `<rect x="${x0 + (bw * k) / 8 - th * 0.12}" y="${y - th * 0.7}" width="${th * 0.24}" height="${th * 0.4}" fill="#031109" opacity=".6"/>`;
      y -= th;
    }
    // stairs
    const sw0 = TW * 0.16, sw1 = TW * 0.1;
    t += `<path d="M${tx - sw0 / 2} ${base} L${tx - sw1 / 2} ${y} L${tx + sw1 / 2} ${y} L${tx + sw0 / 2} ${base}Z" fill="#1c4a33"/>`;
    for (let k = 0; k < 24; k++) {
      const yy = base - ((base - y) * k) / 24;
      const ww = sw0 - ((sw0 - sw1) * k) / 24;
      t += `<line x1="${tx - ww / 2}" y1="${yy}" x2="${tx + ww / 2}" y2="${yy}" stroke="#e8c46a" stroke-opacity="${0.12 + (k / 24) * 0.35}" stroke-width="1.5"/>`;
    }
    // shrine
    const shW = TW * 0.28, shH = TW * 0.16;
    t += `<rect x="${tx - shW / 2}" y="${y - shH}" width="${shW}" height="${shH}" fill="#0b2a1c"/>`;
    t += `<path d="M${tx - shW * 0.62} ${y - shH} L${tx} ${y - shH - TW * 0.08} L${tx + shW * 0.62} ${y - shH}Z" fill="#0d3322" stroke="#f4d27a" stroke-opacity=".5" stroke-width="2"/>`;
    t += glowAt(tx, y - shH * 0.4, TW * 0.22, '#ffc24a', 0.7);
    t += `<rect x="${tx - shW * 0.14}" y="${y - shH * 0.8}" width="${shW * 0.28}" height="${shH * 0.8}" fill="url(#${door})"/>`;
    s += t;
    s += FX.sym('temple', 'emerald', tx - TW * 0.06, y - shH - TW * 0.2, TW * 0.12);
    // light spill down the stairs
    s += `<path d="M${tx - sw1 * 0.3} ${y} L${tx + sw1 * 0.3} ${y} L${tx + sw0 * 0.9} ${h} L${tx - sw0 * 0.9} ${h}Z" fill="url(#${ray})" filter="url(#${bl})"/>`;
    // canopy either side
    let can = '';
    for (let i = 0; i < 38; i++) {
      const side = i % 2 ? 1 : -1;
      const x = tx + side * (TW * 0.45 + R() * w * 0.5);
      const cy = base - R() * h * 0.08;
      const r = m * (0.04 + R() * 0.07);
      can += `<circle cx="${x}" cy="${cy}" r="${r}" fill="${['#06261a', '#082f20', '#041d13'][i % 3]}"/>`;
    }
    s += can + `<rect y="${base}" width="${w}" height="${h - base}" fill="#041a10"/>`;
    s += `<rect y="${base - h * 0.05}" width="${w}" height="${h * 0.1}" fill="url(#${mist})"/>`;
    // foreground foliage
    const fg = '#021009', rib = '#1f5a3a';
    let f = '';
    f += frond(-w * 0.02, h * 0.98, m * 0.6, -38, fg, rib, R);
    f += frond(-w * 0.04, h * 0.7, m * 0.5, -8, '#03140c', rib, R);
    f += frond(w * 1.02, h * 0.96, m * 0.6, 218, fg, rib, R);
    f += frond(w * 1.03, h * 0.62, m * 0.45, 190, '#03140c', rib, R);
    for (let i = 0; i < 9; i++) f += leaf(w * (0.02 + R() * 0.2), h * (0.9 + R() * 0.1), m * (0.12 + R() * 0.12), -60 - R() * 70, '#03160d', '#2a7a4e', 0.3);
    for (let i = 0; i < 9; i++) f += leaf(w * (0.8 + R() * 0.2), h * (0.9 + R() * 0.1), m * (0.12 + R() * 0.12), -110 - R() * 60, '#03160d', '#2a7a4e', 0.3);
    // vines
    for (let i = 0; i < 6; i++) {
      const x = i < 3 ? w * (0.02 + i * 0.06) : w * (0.84 + (i - 3) * 0.06);
      const L = h * (0.2 + R() * 0.25);
      f += `<path d="M${x} 0 Q${x + (R() - 0.5) * 40} ${L / 2} ${x + (R() - 0.5) * 30} ${L}" stroke="#052215" stroke-width="${m * 0.006}" fill="none"/>`;
      for (let k = 1; k < 8; k++) f += leaf(x + (R() - 0.5) * 20, (L * k) / 8, m * 0.04, R() > 0.5 ? 30 : 150, '#052215', '#1f5a3a', 0.35);
    }
    s += f;
    // fireflies
    s += `<g filter="url(#${bl2})">${particles(R, 70, 0, h * 0.35, w, h * 0.65, ['#ffe27a', '#d8ff9a'], 1.5, 4, 0.4, 0.95)}</g>`;
    s += particles(R, 50, 0, h * 0.35, w, h * 0.65, ['#fff6c4'], 0.6, 1.5, 0.5, 1);
    s += vignette(w, h, 0.7, 0.5);
    s += noise(w, h, 0.07);
    return s;
  };

  /* =====================================================================
     FNX hero — architecture, warm doorway, violet edge light, wet floor
     ===================================================================== */
  SC.heroArt = (w, h) => {
    const R = rng(3);
    const wide = w > h;
    const vx = wide ? w * 0.68 : w * 0.56, vy = wide ? h * 0.47 : h * 0.44;
    const F = wide ? h * 0.62 : h * 0.44;
    const bl = uid('b'), bl2 = uid('b'), bl3 = uid('b'), floor = uid('fl'), refl = uid('rf'), door = uid('dr'), shaft = uid('sh'), fog = uid('fg');
    const P = (X, Y, Z) => [vx + (X * F) / Z, vy + (Y * F) / Z];
    const zDoor = 14;
    let s = `<defs>
      ${blur(bl, h * 0.02)}${blur(bl2, h * 0.006)}${blur(bl3, h * 0.05)}
      ${lin(floor, [[0, '#0b0a0c'], [1, '#040506']])}
      ${lin(refl, [[0, '#ffe2b0', 0.95], [0.18, '#f0a860', 0.5], [0.55, '#c07a40', 0.12], [1, '#f0a860', 0]])}
      ${lin(door, [[0, '#fff3d6'], [0.6, '#ffd9a0'], [1, '#f6b870']])}
      ${lin(shaft, [[0, '#f0bd72', 0.14], [1, '#f0bd72', 0]])}
      ${rad(fog, [[0, '#f0bd72', 0.35], [0.5, '#a0603a', 0.08], [1, '#000', 0]])}
    </defs>`;
    s += `<rect width="${w}" height="${h}" fill="#050607"/>`;
    // back wall
    const [bx0, by0] = P(-1.6, -1.6, zDoor), [bx1, by1] = P(1.6, 1, zDoor);
    s += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${by1 - by0}" fill="#0d0b0c"/>`;
    // floor
    const [fl0x] = P(-1.6, 1, 0.6), [fr0x] = P(1.6, 1, 0.6);
    s += `<path d="M${P(-1.6, 1, zDoor)} L${P(1.6, 1, zDoor)} L${fr0x} ${h * 1.4} L${fl0x} ${h * 1.4}Z" fill="url(#${floor})"/>`;
    // ceiling
    s += `<path d="M${P(-1.6, -1.6, zDoor)} L${P(1.6, -1.6, zDoor)} L${P(1.6, -1.6, 0.5)} L${P(-1.6, -1.6, 0.5)}Z" fill="#070708"/>`;
    // pillars (side faces facing the corridor, lit by the door; front faces dark)
    let pil = '';
    const zs = [1.6, 2.3, 3.2, 4.3, 5.6, 7.1, 8.8, 10.6, 12.4];
    for (const side of [-1, 1]) {
      for (let i = zs.length - 1; i >= 0; i--) {
        const z0 = zs[i], z1 = z0 + 0.55;
        const X = side * 1.6, X2 = side * 2.2;
        const light = Math.min(1, 0.04 + Math.pow(z0 / zDoor, 1.4) * 0.95);
        const c = side < 0 ? `rgb(${Math.round(28 + 70 * light)},${Math.round(20 + 44 * light)},${Math.round(16 + 22 * light)})` : `rgb(${Math.round(20 + 40 * light)},${Math.round(16 + 26 * light)},${Math.round(24 + 30 * light)})`;
        // side face
        pil += `<path d="M${P(X, -1.6, z0)} L${P(X, -1.6, z1)} L${P(X, 1, z1)} L${P(X, 1, z0)}Z" fill="${c}"/>`;
        // front face
        pil += `<path d="M${P(X, -1.6, z0)} L${P(X2, -1.6, z0)} L${P(X2, 1, z0)} L${P(X, 1, z0)}Z" fill="#070708"/>`;
        // edge highlight
        const [ex0, ey0] = P(X, -1.6, z0), [, ey1] = P(X, 1, z0);
        pil += `<line x1="${ex0}" y1="${ey0}" x2="${ex0}" y2="${ey1}" stroke="${side > 0 ? '#8a5cff' : '#f0bd72'}" stroke-opacity="${side > 0 ? 0.5 * (1 - z0 / 14) : 0.25 * light}" stroke-width="${Math.max(1, 3 / z0)}"/>`;
      }
      // recess wall between pillars
    }
    s += pil;
    // light shafts from the door
    const [dx0, dy0] = P(-0.4, -0.95, zDoor), [dx1, dy1] = P(0.4, 1, zDoor);
    s += `<g filter="url(#${bl})" opacity=".9"><path d="M${dx0} ${dy0} L${dx1} ${dy0} L${P(1.5, 1, 1.4)} L${P(-1.2, 1, 1.4)}Z" fill="url(#${shaft})"/></g>`;
    s += `<g filter="url(#${bl3})"><ellipse cx="${(dx0 + dx1) / 2}" cy="${(dy0 + dy1) / 2}" rx="${(dx1 - dx0) * 4}" ry="${(dy1 - dy0) * 1.6}" fill="url(#${fog})"/></g>`;
    // door
    s += glowAt((dx0 + dx1) / 2, (dy0 + dy1) / 2, (dy1 - dy0) * 2.2, '#ffb45a', 0.45);
    s += `<rect x="${dx0}" y="${dy0}" width="${dx1 - dx0}" height="${dy1 - dy0}" fill="url(#${door})"/>`;
    s += `<rect x="${dx0}" y="${dy0}" width="${dx1 - dx0}" height="${dy1 - dy0}" fill="none" stroke="#fff6e0" stroke-width="2" filter="url(#${bl2})"/>`;
    // wet floor reflection with ripples
    const ref = `<path d="M${dx0} ${dy1} L${dx1} ${dy1} L${P(0.42, 1, 1.3)} L${P(-0.42, 1, 1.3)}Z" fill="url(#${refl})"/>`;
    s += `<g filter="url(#${bl2})">${ref}</g>`;
    let rip = '';
    for (let i = 0; i < 26; i++) {
      const z = zDoor * Math.pow(0.86, i);
      const [x0, y0] = P(-0.8, 1, z), [x1] = P(0.8, 1, z);
      rip += `<line x1="${x0 + (R() - 0.5) * 20}" y1="${y0}" x2="${x1 + (R() - 0.5) * 20}" y2="${y0}" stroke="#050607" stroke-opacity="${0.18 + R() * 0.22}" stroke-width="${Math.max(1, 3 / Math.sqrt(z))}"/>`;
    }
    s += rip;
    // puddle highlights
    for (let i = 0; i < 18; i++) {
      const z = 1.2 + R() * 8;
      const [x, y] = P((R() - 0.5) * 2.4, 1, z);
      s += `<ellipse cx="${x}" cy="${y}" rx="${(40 + R() * 90) / Math.sqrt(z)}" ry="${2 / Math.sqrt(z) + 0.6}" fill="#f0bd72" opacity="${0.05 + R() * 0.12}"/>`;
    }
    // violet edge light from the right
    s += ellipseGlow(w * 1.02, h * 0.3, w * 0.28, h * 0.6, '#7134f4', 0.28);
    s += ellipseGlow(vx, vy, w * 0.14, h * 0.4, '#f0bd72', 0.08);
    // faint FNX diagonal geometry on the far wall
    s += `<g opacity=".08" stroke="#c9b6ff" stroke-width="1.2"><line x1="${bx0}" y1="${by0}" x2="${bx1}" y2="${by1}"/><line x1="${bx1}" y1="${by0}" x2="${(bx0 + bx1) / 2 + (bx1 - bx0) * 0.08}" y2="${(by0 + by1) / 2 - (by1 - by0) * 0.06}"/></g>`;
    // dust in the light
    s += `<g>${particles(R, 120, dx0 - (dx1 - dx0) * 6, dy0 - (dy1 - dy0) * 0.6, (dx1 - dx0) * 13, (dy1 - dy0) * 2.4, ['#ffe0b0'], 0.5, 1.6, 0.1, 0.6)}</g>`;
    s += vignette(w, h, 0.8, 0.45);
    s += noise(w, h, 0.06);
    return s;
  };

  FX.OUTPUTS.push(
    { name: 'heroArt', w: 2560, h: 1440, file: 'art/hero.png', quality: 86 },
    { name: 'heroArt', w: 1200, h: 1500, file: 'art/hero-mobile.png', quality: 86 },
    { name: 'dragonArt', w: 1200, h: 1500, file: 'visual-fixtures/games/dragons-fortune.jpg' },
    { name: 'dragonArt', w: 2560, h: 1280, file: 'visual-fixtures/games/dragons-fortune- hero.png' },
    { name: 'tideArt', w: 1200, h: 1500, file: 'visual-fixtures/games/mystic-tides.jpg' },
    { name: 'tideArt', w: 2560, h: 1280, file: 'visual-fixtures/games/mystic-tides- hero.png' },
    { name: 'templeArt', w: 1200, h: 1500, file: 'visual-fixtures/games/temple-of-valor.jpg' },
    { name: 'templeArt', w: 2560, h: 1280, file: 'visual-fixtures/games/temple-of-valor- hero.png' },
  );
})();
