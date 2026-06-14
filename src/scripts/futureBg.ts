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
  let mx = -1e4, my = -1e4;
  if (!reduce && !MOBILE) addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  // ── live oscilloscope: a 3·6·9 frequency wave tuned to the real ZAPP price ──
  const scope = document.getElementById('hud-scope') as HTMLCanvasElement | null;
  const sctx = scope?.getContext('2d') || null;
  let sW = 0, sH = 0, phase = 0;
  function resizeScope() { if (!scope || !sctx) return; const r = scope.getBoundingClientRect(); sW = r.width; sH = r.height; scope.width = sW * dpr; scope.height = sH * dpr; sctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  resizeScope(); addEventListener('resize', resizeScope, { passive: true });
  function drawScope() {
    if (!sctx || !sW) return;
    sctx.clearRect(0, 0, sW, sH);
    const mid = sH / 2;
    const change = (window as any).zappChange || 0;
    const amp = Math.min(sH * 0.42, sH * 0.14 + Math.abs(change) * 0.5);
    const col = change >= 0 ? '43,255,119' : '255,86,86';
    sctx.strokeStyle = 'rgba(43,255,119,.09)'; sctx.lineWidth = 1;
    for (let gx = 0; gx < sW; gx += 16) { sctx.beginPath(); sctx.moveTo(gx, 0); sctx.lineTo(gx, sH); sctx.stroke(); }
    sctx.beginPath(); sctx.moveTo(0, mid); sctx.lineTo(sW, mid); sctx.stroke();
    sctx.beginPath();
    for (let x = 0; x <= sW; x++) {
      const u = x / sW * Math.PI * 2;
      const y = mid - (Math.sin(u * 3 + phase) * 0.5 + Math.sin(u * 6 + phase * 1.3) * 0.3 + Math.sin(u * 9 + phase * 0.8) * 0.2) * amp;
      x ? sctx.lineTo(x, y) : sctx.moveTo(x, y);
    }
    sctx.strokeStyle = `rgba(${col},.95)`; sctx.lineWidth = 1.8; sctx.shadowBlur = 8; sctx.shadowColor = `rgba(${col},.85)`; sctx.stroke(); sctx.shadowBlur = 0;
    if (!reduce) phase += 0.05 + Math.min(0.13, Math.abs(change) * 0.0025);
  }

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

    // network: links + nodes (cursor pushes nearby nodes → reactive)
    if (!reduce) for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 < 16000) { const d = Math.sqrt(d2) || 1, f = (1 - d / 126) * 0.16; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
      p.vx *= 0.99; p.vy *= 0.99;
      if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
    }
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

    drawScope();
  }
  raf = requestAnimationFrame(frame);
}
