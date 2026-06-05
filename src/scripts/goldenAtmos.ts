// ⚡ZAPP — "The man who saw the future"
// A warm, cinematic golden atmosphere for the Past / Tower tribute: volumetric god-rays
// streaming from an off-frame light source, slow-drifting motes of gold dust, a soft halo
// of light, and rare filaments of energy. Pure 2D canvas — light on the GPU, alive on screen.

export function initGoldenAtmos(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0;
  const DPR = Math.min(devicePixelRatio || 1, 1.5);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height || innerHeight);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  // The light pours in from the upper-right — the same direction as the tribute artwork.
  const src = () => ({ x: W * 0.82, y: -H * 0.16 });
  const RAYS = 7;

  // floating motes of gold dust — fewer now (perf + less "dust")
  const N = reduce ? 0 : 36;
  const motes = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.5 + Math.random() * 1.9,
    sp: 0.2 + Math.random() * 0.9,      // rise speed
    sway: 0.4 + Math.random() * 1.1,
    ph: Math.random() * Math.PI * 2,
    tw: 0.6 + Math.random() * 1.8,       // twinkle rate
  }));

  // rare drifting "filaments" of light (tiny energy sparks crossing the rays)
  const sparks: { x: number; y: number; vx: number; vy: number; life: number; max: number }[] = [];

  // ── Wardenclyffe tower — a glowing lattice mast + dome, alive with electric discharge ──
  type Bolt = { pts: { x: number; y: number }[]; life: number; w: number };
  const bolts: Bolt[] = [];
  const groundPulses: { r: number; life: number }[] = [];
  // warm embers rising near the tower base
  const embers = Array.from({ length: reduce ? 0 : 14 }, () => ({
    x: 0.62 + Math.random() * 0.28, y: 1 + Math.random() * 0.3,
    vy: 0.3 + Math.random() * 0.9, drift: (Math.random() - .5) * 0.5,
    ph: Math.random() * Math.PI * 2, r: 0.7 + Math.random() * 1.8,
  }));
  function towerGeom() {
    const cx = W * 0.76;
    const baseY = H * 0.985;
    const h = Math.min(H * 0.62, 540);
    const wBase = Math.min(W * 0.155, H * 0.145);
    const wTop = Math.min(W * 0.085, H * 0.08);
    return { cx, baseY, topY: baseY - h, wBase, wTop };
  }
  function jag(x1: number, y1: number, x2: number, y2: number, r: number, out: { x: number; y: number }[]) {
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    if (d < 9 || r < 1.2) { out.push({ x: x2, y: y2 }); return; }
    const mx = (x1 + x2) / 2 + (-dy / d) * (Math.random() - .5) * r;
    const my = (y1 + y2) / 2 + (dx / d) * (Math.random() - .5) * r;
    jag(x1, y1, mx, my, r * .55, out); jag(mx, my, x2, y2, r * .55, out);
  }
  function drawTower(): { x: number; y: number } {
    const { cx, baseY, topY, wBase, wTop } = towerGeom();
    // backing aura
    const gg = ctx!.createRadialGradient(cx, topY, 0, cx, topY, (baseY - topY) * 0.8);
    gg.addColorStop(0, 'rgba(255,206,120,.14)'); gg.addColorStop(1, 'transparent');
    ctx!.save(); ctx!.globalCompositeOperation = 'lighter';
    ctx!.fillStyle = gg; ctx!.fillRect(cx - W, topY - H, 2 * W, 2 * H);
    ctx!.restore();
    // lattice
    ctx!.save();
    ctx!.strokeStyle = 'rgba(255,214,134,.6)'; ctx!.lineWidth = 1.5; ctx!.lineJoin = 'round';
    // (no shadowBlur on the lattice — far cheaper; the backing aura carries the glow)
    const blx = cx - wBase / 2, brx = cx + wBase / 2, tlx = cx - wTop / 2, trx = cx + wTop / 2;
    ctx!.beginPath(); ctx!.moveTo(blx, baseY); ctx!.lineTo(tlx, topY); ctx!.moveTo(brx, baseY); ctx!.lineTo(trx, topY); ctx!.stroke();
    const cells = 13;
    for (let i = 0; i <= cells; i++) {
      const f = i / cells, fy = baseY + (topY - baseY) * f;
      const lx = blx + (tlx - blx) * f, rx = brx + (trx - brx) * f;
      ctx!.beginPath(); ctx!.moveTo(lx, fy); ctx!.lineTo(rx, fy); ctx!.stroke();
      if (i < cells) {
        const f2 = (i + 1) / cells, fy2 = baseY + (topY - baseY) * f2;
        const lx2 = blx + (tlx - blx) * f2, rx2 = brx + (trx - brx) * f2;
        ctx!.globalAlpha = .5;
        ctx!.beginPath(); ctx!.moveTo(lx, fy); ctx!.lineTo(rx2, fy2); ctx!.moveTo(rx, fy); ctx!.lineTo(lx2, fy2); ctx!.stroke();
        ctx!.globalAlpha = 1;
      }
    }
    // inner vertical legs — octagonal lattice density
    for (const s of [-0.5, 0.5]) { ctx!.beginPath(); ctx!.moveTo(cx + s * wBase * 0.5, baseY); ctx!.lineTo(cx + s * wTop * 0.5, topY); ctx!.stroke(); }

    // ── the wide mushroom cupola — Wardenclyffe's signature overhanging dome ──
    const capR = wTop * 1.8, domeH = capR * 0.64, apexY = topY - domeH;
    // overhang struts from the cap rim back down to the narrow mast top
    ctx!.beginPath();
    ctx!.moveTo(cx - capR, topY); ctx!.lineTo(tlx, topY + wTop * 0.55);
    ctx!.moveTo(cx + capR, topY); ctx!.lineTo(trx, topY + wTop * 0.55);
    ctx!.stroke();
    // the wide platform rim, seen in perspective
    ctx!.beginPath(); ctx!.ellipse(cx, topY, capR, capR * 0.17, 0, 0, Math.PI * 2); ctx!.stroke();
    // the domed top
    ctx!.beginPath(); ctx!.moveTo(cx - capR, topY); ctx!.quadraticCurveTo(cx, apexY - domeH * 0.5, cx + capR, topY); ctx!.stroke();
    // dome ribs converging on the finial
    for (let i = -2; i <= 2; i++) { const fx = i / 2.6; ctx!.beginPath(); ctx!.moveTo(cx + fx * capR, topY); ctx!.quadraticCurveTo(cx + fx * capR * 0.4, apexY - domeH * 0.2, cx, apexY); ctx!.stroke(); }
    // finial sphere at the very top
    ctx!.beginPath(); ctx!.arc(cx, apexY, Math.max(2, wTop * 0.07), 0, Math.PI * 2); ctx!.stroke();
    const domeTop = apexY;
    // splayed foundation footing at the base
    const footW = wBase * 1.55;
    ctx!.beginPath();
    ctx!.moveTo(cx - footW / 2, baseY); ctx!.lineTo(blx, baseY - wBase * 0.32);
    ctx!.moveTo(cx + footW / 2, baseY); ctx!.lineTo(brx, baseY - wBase * 0.32);
    ctx!.moveTo(cx - footW / 2, baseY); ctx!.lineTo(cx + footW / 2, baseY);
    ctx!.stroke();
    // guy-wires anchoring the mast to the ground
    ctx!.globalAlpha = .3;
    ([[cx - W * 0.2, baseY], [cx - W * 0.11, baseY], [cx + W * 0.17, baseY], [cx + W * 0.09, baseY]] as const).forEach(([ax, ay]) => {
      ctx!.beginPath(); ctx!.moveTo(cx, topY + wTop * 0.5); ctx!.lineTo(ax, ay); ctx!.stroke();
    });
    ctx!.globalAlpha = 1;
    ctx!.shadowBlur = 0; ctx!.restore();
    return { x: cx, y: domeTop };
  }
  function towerEnergy(apex: { x: number; y: number }) {
    // pulsing corona at the dome
    const pulse = 0.5 + 0.5 * Math.sin(t * 7);
    ctx!.save(); ctx!.globalCompositeOperation = 'lighter';
    const cg = ctx!.createRadialGradient(apex.x, apex.y, 0, apex.x, apex.y, 44 + pulse * 26);
    cg.addColorStop(0, `rgba(255,250,224,${.45 + pulse * .3})`); cg.addColorStop(.4, 'rgba(255,210,120,.22)'); cg.addColorStop(1, 'transparent');
    ctx!.fillStyle = cg; ctx!.beginPath(); ctx!.arc(apex.x, apex.y, 70, 0, Math.PI * 2); ctx!.fill();
    // spawn fresh discharge
    if (!reduce && Math.random() < 0.55) {
      const n = 1 + (Math.random() < .4 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - .5) * 2.5;
        const len = 60 + Math.random() * 190;
        const ex = apex.x + Math.cos(ang) * len, ey = apex.y + Math.sin(ang) * len;
        const pts: { x: number; y: number }[] = [{ x: apex.x, y: apex.y }];
        jag(apex.x, apex.y, ex, ey, 32, pts);
        bolts.push({ pts, life: 1, w: 0.8 + Math.random() * 1.5 });
        // a branching fork off the middle of the bolt
        if (Math.random() < 0.55 && pts.length > 3) {
          const f = pts[(pts.length / 2) | 0];
          const fx = f.x + (Math.random() - .5) * 130, fy = f.y - Math.random() * 90;
          const fp: { x: number; y: number }[] = [{ x: f.x, y: f.y }];
          jag(f.x, f.y, fx, fy, 20, fp);
          bolts.push({ pts: fp, life: 1, w: 0.5 + Math.random() * 0.9 });
        }
      }
    }
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i]; b.life -= 0.085; const a = Math.max(0, b.life);
      ctx!.beginPath(); ctx!.moveTo(b.pts[0].x, b.pts[0].y);
      for (let k = 1; k < b.pts.length; k++) ctx!.lineTo(b.pts[k].x, b.pts[k].y);
      // additive double-stroke glow (no shadowBlur — much cheaper)
      ctx!.strokeStyle = `rgba(255,206,110,${a * .35})`; ctx!.lineWidth = b.w * 3.4; ctx!.stroke();
      ctx!.strokeStyle = `rgba(255,248,214,${a * .95})`; ctx!.lineWidth = b.w; ctx!.stroke();
      if (b.life <= 0) bolts.splice(i, 1);
    }
    ctx!.restore();
  }

  // warm earth + glowing horizon filling the lower frame
  function drawGround() {
    const { baseY } = towerGeom();
    const g = ctx!.createLinearGradient(0, baseY - 40, 0, H);
    g.addColorStop(0, 'rgba(60,38,12,0)'); g.addColorStop(.6, 'rgba(46,28,8,.34)'); g.addColorStop(1, 'rgba(26,15,4,.55)');
    ctx!.fillStyle = g; ctx!.fillRect(0, baseY - 40, W, H - baseY + 40);
    ctx!.save(); ctx!.globalCompositeOperation = 'lighter';
    const lg = ctx!.createLinearGradient(0, 0, W, 0);
    lg.addColorStop(0, 'transparent'); lg.addColorStop(.5, 'rgba(255,200,96,.22)'); lg.addColorStop(1, 'transparent');
    ctx!.strokeStyle = lg; ctx!.lineWidth = 1.6; ctx!.beginPath(); ctx!.moveTo(0, baseY); ctx!.lineTo(W, baseY); ctx!.stroke();
    ctx!.restore();
  }

  // rings of energy spreading through the Earth from the tower base
  function drawGroundPulses() {
    const { cx, baseY } = towerGeom();
    if (!reduce && Math.random() < 0.04 && groundPulses.length < 6) groundPulses.push({ r: 0, life: 1 });
    ctx!.save(); ctx!.globalCompositeOperation = 'lighter';
    for (let i = groundPulses.length - 1; i >= 0; i--) {
      const p = groundPulses[i]; p.r += W * 0.006; p.life -= 0.011; const a = Math.max(0, p.life);
      ctx!.strokeStyle = `rgba(255,206,110,${a * .4})`; ctx!.lineWidth = 1.4;
      ctx!.beginPath(); ctx!.ellipse(cx, baseY, p.r, p.r * 0.16, 0, Math.PI, 0); ctx!.stroke();
      if (p.life <= 0) groundPulses.splice(i, 1);
    }
    ctx!.restore();
  }

  // glowing embers rising near the tower
  function drawEmbers() {
    if (!embers.length) return;
    ctx!.save(); ctx!.globalCompositeOperation = 'lighter';
    for (const e of embers) {
      e.y -= e.vy * 0.0009; e.x += e.drift * 0.0004;
      if (e.y < -0.05) { e.y = 1.05; e.x = 0.62 + Math.random() * 0.28; }
      const px = (e.x + Math.sin(t * 0.5 + e.ph) * 0.01) * W, py = e.y * H;
      const a = 0.3 + 0.6 * Math.abs(Math.sin(t * 1.6 + e.ph));
      ctx!.beginPath(); ctx!.arc(px, py, e.r, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,196,96,${a * .7})`; ctx!.fill();
    }
    ctx!.restore();
  }

  let t = 0, raf = 0;

  function godRays() {
    if (!ctx) return;
    const { x: lx, y: ly } = src();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const diag = Math.hypot(W, H) * 1.25;
    for (let i = 0; i < RAYS; i++) {
      const k = i / (RAYS - 1) - 0.5;
      const ang = Math.PI * 0.66 + k * 0.46 + Math.sin(t * 0.18 + i) * 0.008;
      const ex = lx + Math.cos(ang) * diag, ey = ly + Math.sin(ang) * diag;
      const px = -Math.sin(ang), py = Math.cos(ang);
      const wHalf = (10 + Math.abs(k) * 46) * (0.72 + 0.28 * Math.sin(t * 0.5 + i * 1.4));
      const a = 0.045 + 0.035 * (0.5 + 0.5 * Math.sin(t * 0.4 + i * 0.7));
      const g = ctx.createLinearGradient(lx, ly, ex, ey);
      g.addColorStop(0, `rgba(255,238,186,${a * 1.5})`);
      g.addColorStop(0.45, `rgba(255,206,112,${a})`);
      g.addColorStop(1, 'rgba(255,190,90,0)');
      ctx.beginPath();
      ctx.moveTo(lx + px * 4, ly + py * 4);
      ctx.lineTo(lx - px * 4, ly - py * 4);
      ctx.lineTo(ex - px * wHalf, ey - py * wHalf);
      ctx.lineTo(ex + px * wHalf, ey + py * wHalf);
      ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
  }

  function bloom() {
    if (!ctx) return;
    const { x: lx, y: ly } = src();
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, H * (0.78 + pulse * 0.06));
    g.addColorStop(0, `rgba(255,242,206,${0.34 + pulse * 0.06})`);
    g.addColorStop(0.4, 'rgba(255,212,124,0.10)');
    g.addColorStop(1, 'transparent');
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function dust() {
    if (!ctx) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const m of motes) {
      m.y -= m.sp * 0.00045;
      if (m.y < -0.03) { m.y = 1.03; m.x = Math.random(); }
      const mx = (m.x + Math.sin(t * 0.12 + m.ph) * m.sway * 0.012) * W;
      const my = m.y * H;
      const a = 0.18 + 0.5 * Math.abs(Math.sin(t * m.tw + m.ph));
      ctx.beginPath(); ctx.arc(mx, my, m.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,226,150,${a * 0.55})`; ctx.fill();
    }
    ctx.restore();
  }

  function sparkLife() {
    if (!ctx) return;
    if (!reduce && Math.random() < 0.05 && sparks.length < 14) {
      const { x: lx, y: ly } = src();
      const ang = Math.PI * 0.66 + (Math.random() - 0.5) * 0.4;
      const d = Math.random() * Math.hypot(W, H) * 0.7;
      const x = lx + Math.cos(ang) * d, y = ly + Math.sin(ang) * d;
      const max = 60 + Math.random() * 60;
      sparks.push({ x, y, vx: Math.cos(ang) * (0.4 + Math.random()), vy: Math.sin(ang) * (0.4 + Math.random()), life: max, max });
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.x += s.vx; s.y += s.vy; s.life--;
      const a = Math.max(0, s.life / s.max);
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,244,210,${a * 0.9})`; ctx.fill();
      if (s.life <= 0) sparks.splice(i, 1);
    }
    ctx.restore();
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    t += 0.016;
    ctx!.clearRect(0, 0, W, H);
    godRays();
    bloom();
    drawGround();
    const apex = drawTower();
    drawGroundPulses();
    towerEnergy(apex);
    drawEmbers();
    dust();
    sparkLife();
  }

  if (reduce) {
    // one calm static pass — still luminous, just not animated
    ctx.clearRect(0, 0, W, H);
    godRays(); bloom(); drawGround(); const apex = drawTower(); towerEnergy(apex);
  } else {
    frame();
  }

  // pause when the tab is hidden (battery + perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  });
}
