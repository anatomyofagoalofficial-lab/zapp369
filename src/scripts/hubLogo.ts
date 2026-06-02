// Living particle ⚡ZAPP wordmark for the Hub — the same gold-particle identity
// as the intro, but settled and gently breathing: twinkle + drifting sparkle +
// electric arcs across the bolt. Unifies the intro → hub moment.
import { prefersReducedMotion } from './constants';

interface P { bx: number; by: number; sz: number; c: string; ph: number; spd: number; glow: boolean; jit: number; }

export function startHubLogo() {
  const cv = document.getElementById('hub-logo-cv') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d')!;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, parts: P[] = [];
  const reduce = prefersReducedMotion();

  function build() {
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
    const ox = oc.getContext('2d')!;
    const fs = Math.min(W * 0.135, H * 0.5);
    ox.fillStyle = '#fff';
    ox.textAlign = 'center'; ox.textBaseline = 'middle';
    ox.font = `700 ${fs}px "Cormorant Garamond",serif`;
    ox.fillText('⚡ZAPP', W / 2, H * 0.44);
    ox.font = `500 ${fs * 0.13}px "JetBrains Mono",monospace`;
    ox.fillText('3 · 6 · 9 · ∞', W / 2, H * 0.44 + fs * 0.6);
    const d = ox.getImageData(0, 0, W, H).data;
    const step = Math.max(2, Math.floor(Math.min(W, H) / 230));
    parts = [];
    for (let x = 0; x < W; x += step) for (let y = 0; y < H; y += step) {
      if (d[(y * W + x) * 4 + 3] > 80) {
        const r = Math.random();
        const c = r < .5 ? '#FFD700' : r < .7 ? '#FFE9A0' : r < .85 ? '#FFFFFF' : r < .93 ? '#FFA500' : '#BFE0FF';
        parts.push({ bx: x, by: y, sz: (0.8 + Math.random() * 2.4) * DPR, c, ph: Math.random() * Math.PI * 2, spd: 0.5 + Math.random() * 1.4, glow: Math.random() > .35, jit: Math.random() * 0.9 * DPR });
      }
    }
    // bolt zone (left part of the wordmark) for electric arcs
    boltX = W * 0.20; boltY = H * 0.44;
  }

  let boltX = 0, boltY = 0;
  function size() {
    const r = cv!.getBoundingClientRect();
    W = cv!.width = Math.max(1, Math.floor(r.width * DPR));
    H = cv!.height = Math.max(1, Math.floor(r.height * DPR));
    build();
  }

  function jag(x1: number, y1: number, x2: number, y2: number, r: number) {
    const dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
    if (dd < 4 * DPR) { ctx.lineTo(x2, y2); return; }
    const mx = (x1 + x2) / 2 + (-dy / dd) * (Math.random() - .5) * r;
    const my = (y1 + y2) / 2 + (dx / dd) * (Math.random() - .5) * r;
    jag(x1, y1, mx, my, r * .5); jag(mx, my, x2, y2, r * .5);
  }

  let frame = 0;
  function draw() {
    requestAnimationFrame(draw);
    const hub = document.getElementById('hub');
    if (!hub || !hub.classList.contains('active')) { ctx.clearRect(0, 0, W, H); return; }
    frame++;
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * 0.001;

    for (const p of parts) {
      const tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * p.spd + p.ph);
      const x = reduce ? p.bx : p.bx + Math.sin(t * 0.7 + p.ph) * p.jit;
      const y = reduce ? p.by : p.by + Math.cos(t * 0.6 + p.ph) * p.jit;
      if (p.glow) { ctx.shadowBlur = 9 * tw; ctx.shadowColor = p.c; }
      ctx.globalAlpha = 0.5 + 0.5 * tw;
      ctx.fillStyle = p.c;
      const s = p.sz * (0.7 + 0.5 * tw);
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    // electric arcs flicker across the bolt
    if (!reduce && frame % 9 === 0) {
      const n = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        const ang = (Math.random() - .5) * 1.6 + (Math.random() < .5 ? -1 : 1);
        const len = (20 + Math.random() * 55) * DPR;
        const ex = boltX + Math.cos(ang) * len, ey = boltY + Math.sin(ang) * len;
        ctx.beginPath(); ctx.moveTo(boltX, boltY); jag(boltX, boltY, ex, ey, 22 * DPR);
        ctx.strokeStyle = 'rgba(190,225,255,.5)'; ctx.lineWidth = 2 * DPR; ctx.shadowBlur = 12; ctx.shadowColor = '#B4DCFF'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(boltX, boltY); jag(boltX, boltY, ex, ey, 14 * DPR);
        ctx.strokeStyle = 'rgba(255,225,120,.85)'; ctx.lineWidth = 1 * DPR; ctx.shadowBlur = 8; ctx.shadowColor = '#FFD700'; ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  }

  const start = () => { size(); draw(); };
  if ((document as any).fonts?.ready) (document as any).fonts.ready.then(start); else start();
  window.addEventListener('resize', size);
}
