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
  const RAYS = 10;

  // floating motes of gold dust — many, but tiny
  const N = reduce ? 0 : 80;
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
    dust();
    sparkLife();
  }

  if (reduce) {
    // one calm static pass — still luminous, just not animated
    ctx.clearRect(0, 0, W, H);
    godRays(); bloom();
  } else {
    frame();
  }

  // pause when the tab is hidden (battery + perf)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
  });
}
