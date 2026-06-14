import { prefersReducedMotion } from './constants';

// ⚡ The Network — a living futuristic substrate behind the Future page:
//   · nano particles wired into a drifting constellation (the network)
//   · wireframe objects fading in and out of existence
//   · floating mathematics / code glyphs rising like thought
// One throttled canvas, neon-green, reduced-motion aware.
const G = '43,255,119'; // neon green rgb

export function initFutureBg(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const MOBILE = innerWidth < 768;
  let W = 0, H = 0;
  function resize() { W = innerWidth; H = innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); }
  resize(); addEventListener('resize', resize, { passive: true });
  const reduce = prefersReducedMotion();

  // ── nano particles → network nodes ──
  const NP = MOBILE ? 30 : 66;
  const LINK = MOBILE ? 110 : 152;
  const nodes = Array.from({ length: NP }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));

  // ── floating mathematics / code glyphs ──
  const GLYPHS = ['∑', '∫', 'π', '∞', 'λ', 'Ω', 'Δ', '√', '≈', '369', '3·6·9', 'f(x)', 'E=mc²', 'νλ=c', '01101', 'ZAPP', '⚡'];
  const NG = MOBILE ? 9 : 18;
  const mkGlyph = (atBottom = false) => ({ x: Math.random() * W, y: atBottom ? H + 24 : Math.random() * H, txt: GLYPHS[(Math.random() * GLYPHS.length) | 0], sz: 11 + Math.random() * 22, vy: -(0.12 + Math.random() * 0.34), life: Math.random(), sp: 0.0014 + Math.random() * 0.0022 });
  const glyphs = Array.from({ length: NG }, () => mkGlyph());

  // ── wireframe objects coming in & out ──
  const NO = MOBILE ? 4 : 7;
  const mkObj = () => ({ x: Math.random() * W, y: Math.random() * H, r: 22 + Math.random() * 78, sides: 3 + ((Math.random() * 4) | 0), rot: Math.random() * 6.28, vr: (Math.random() - .5) * 0.006, vx: (Math.random() - .5) * 0.24, vy: (Math.random() - .5) * 0.24, life: Math.random(), sp: 0.0007 + Math.random() * 0.0012 });
  const objs = Array.from({ length: NO }, mkObj);

  let raf = 0, last = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!document.getElementById('dim-future')?.classList.contains('active')) return;
    if (now - last < 32) return; last = now;          // ~30fps
    ctx!.clearRect(0, 0, W, H);

    // wireframe objects (deepest layer)
    ctx!.lineWidth = 1;
    for (let k = 0; k < objs.length; k++) {
      const o = objs[k];
      if (!reduce) { o.x += o.vx; o.y += o.vy; o.rot += o.vr; o.life += o.sp; if (o.life > 1) objs[k] = mkObj(); }
      const a = Math.sin(o.life * Math.PI) * 0.16;     // fade in → out
      ctx!.strokeStyle = `rgba(${G},${a})`;
      ctx!.beginPath();
      for (let i = 0; i <= o.sides; i++) { const ang = o.rot + (i / o.sides) * 6.2832; const px = o.x + Math.cos(ang) * o.r, py = o.y + Math.sin(ang) * o.r; i ? ctx!.lineTo(px, py) : ctx!.moveTo(px, py); }
      ctx!.stroke();
    }

    // network: links + nodes
    if (!reduce) for (const p of nodes) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 < LINK * LINK) { const al = (1 - Math.sqrt(d2) / LINK) * 0.17; ctx!.strokeStyle = `rgba(${G},${al})`; ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke(); }
    }
    for (const p of nodes) { ctx!.beginPath(); ctx!.arc(p.x, p.y, 1.5, 0, 6.2832); ctx!.fillStyle = 'rgba(120,255,175,.72)'; ctx!.fill(); }

    // floating mathematics
    ctx!.textAlign = 'center';
    for (let k = 0; k < glyphs.length; k++) {
      const g = glyphs[k];
      if (!reduce) { g.y += g.vy; g.life += g.sp; if (g.y < -30 || g.life > 1) glyphs[k] = mkGlyph(true); }
      const a = Math.sin(g.life * Math.PI) * 0.5;
      ctx!.font = `${g.sz}px "JetBrains Mono", monospace`;
      ctx!.fillStyle = `rgba(${G},${a * 0.55})`;
      ctx!.fillText(g.txt, g.x, g.y);
    }
  }
  raf = requestAnimationFrame(frame);
}
