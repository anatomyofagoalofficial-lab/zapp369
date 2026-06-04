import { prefersReducedMotion } from './constants';

// Original coded Tesla-coil discharge — inspired by the 1899 Colorado Springs photograph,
// NOT the image itself: branching white-blue bolts crackle from the coil and fill the room.
export function initTeslaArc(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  type Bolt = { pts: { x: number; y: number }[]; born: number; life: number; w: number };
  const bolts: Bolt[] = [];

  // drifting embers / dust glowing in the lab air
  const embers = Array.from({ length: 34 }, () => ({
    fx: Math.random(), fy: Math.random(), vy: 0.0005 + Math.random() * 0.0013,
    sway: Math.random() * 6.283, r: 0.6 + Math.random() * 1.7, a: 0.16 + Math.random() * 0.5,
  }));

  // recursive midpoint-displacement — a jagged bolt that occasionally forks
  function jag(x1: number, y1: number, x2: number, y2: number, disp: number, out: { x: number; y: number }[], forks: Bolt[] | null, now: number) {
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
    if (d < 14 || disp < 2) { out.push({ x: x2, y: y2 }); return; }
    const mx = (x1 + x2) / 2 + (-dy / d) * (Math.random() - .5) * disp;
    const my = (y1 + y2) / 2 + (dx / d) * (Math.random() - .5) * disp;
    jag(x1, y1, mx, my, disp * .55, out, forks, now);
    if (forks && d > 60 && Math.random() < 0.16) {
      const fp: { x: number; y: number }[] = [{ x: mx, y: my }];
      jag(mx, my, mx + (Math.random() - .5) * d * .6, my + (Math.random() - .2) * d * .55, disp * .6, fp, null, now);
      forks.push({ pts: fp, born: now, life: 110 + Math.random() * 120, w: .6 });
    }
    jag(mx, my, x2, y2, disp * .55, out, forks, now);
  }

  function strike(now: number, big: boolean) {
    const ox = W * 0.17, oy = H * (0.28 + Math.random() * 0.22);            // the coil — upper-left, like the photo
    const tx = W * (0.45 + Math.random() * 0.55);
    const ty = H * (0.12 + Math.random() * 0.62);
    const pts: { x: number; y: number }[] = [{ x: ox, y: oy }];
    const forks: Bolt[] = [];
    jag(ox, oy, tx, ty, Math.min(W, H) * (big ? 0.2 : 0.09), pts, forks, now);
    bolts.push({ pts, born: now, life: big ? 190 : 120, w: big ? 1.7 : 0.9 });
    for (const f of forks) bolts.push(f);
  }

  let raf = 0, next = 0, nextBig = 0;
  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    ctx!.clearRect(0, 0, W, H);
    // embers first (behind the bolts)
    for (const e of embers) {
      e.fy -= e.vy;
      if (e.fy < -0.02) { e.fy = 1.02; e.fx = Math.random(); }
      const x = e.fx * W + Math.sin(now * 0.0011 + e.sway) * 16;
      const y = e.fy * H;
      const fl = e.a * (0.55 + 0.45 * Math.sin(now * 0.004 + e.sway));   // warm flicker
      ctx!.beginPath();
      ctx!.fillStyle = `rgba(255,206,122,${fl})`;
      ctx!.arc(x, y, e.r * 1.4, 0, Math.PI * 2); ctx!.fill();          // no per-ember shadowBlur — huge canvas perf win
    }
    if (now > next) { strike(now, false); next = now + (90 + Math.random() * 220); }
    if (now > nextBig) { strike(now, true); nextBig = now + (1500 + Math.random() * 2400); }
    ctx!.lineCap = 'round'; ctx!.lineJoin = 'round';
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i]; const age = now - b.born;
      if (age > b.life) { bolts.splice(i, 1); continue; }
      const k = 1 - age / b.life;
      ctx!.beginPath(); ctx!.moveTo(b.pts[0].x, b.pts[0].y);
      for (let j = 1; j < b.pts.length; j++) ctx!.lineTo(b.pts[j].x, b.pts[j].y);
      ctx!.shadowBlur = 20 * k; ctx!.shadowColor = `rgba(170,215,255,${k})`;     // electric-blue halo
      ctx!.strokeStyle = `rgba(190,225,255,${0.5 * k})`; ctx!.lineWidth = b.w * 3; ctx!.stroke();
      ctx!.shadowBlur = 0;
      ctx!.strokeStyle = `rgba(255,255,255,${0.92 * k})`; ctx!.lineWidth = b.w; ctx!.stroke();   // white-hot core
    }
  }

  if (prefersReducedMotion()) { strike(0, true); loop(0); cancelAnimationFrame(raf); return; }
  raf = requestAnimationFrame(loop);
}
