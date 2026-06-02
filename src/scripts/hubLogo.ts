// ⚡ZAPP wordmark — "liquid gold". Not the intro's crisp square particles, but
// soft round sprites blended additively into a continuous, smooth, molten-gold
// form, with a light-sheen that flows through the letters (liquid metal) and a
// slow breathing glow. Same identity as the intro — smoother, richer, alive.
import { prefersReducedMotion } from './constants';

interface P { x: number; y: number; base: number; ph: number; spd: number; }

export function startHubLogo() {
  const cv = document.getElementById('hub-logo-cv') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d')!;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  const reduce = prefersReducedMotion();
  let W = 0, H = 0, pts: P[] = [], boltX = 0, boltY = 0;

  // soft circular sprite (molten-gold falloff) — the key to smoothness
  const spr = document.createElement('canvas'); spr.width = spr.height = 64;
  const sx = spr.getContext('2d')!;
  const grd = sx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,246,214,1)');
  grd.addColorStop(.30, 'rgba(255,212,96,.85)');
  grd.addColorStop(.65, 'rgba(232,150,20,.28)');
  grd.addColorStop(1, 'rgba(232,150,20,0)');
  sx.fillStyle = grd; sx.fillRect(0, 0, 64, 64);

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
    const step = Math.max(2, Math.floor(Math.min(W, H) / 200));
    pts = [];
    for (let x = 0; x < W; x += step) for (let y = 0; y < H; y += step) {
      if (d[(y * W + x) * 4 + 3] > 70) {
        pts.push({ x, y, base: (11 + Math.random() * 8) * DPR, ph: Math.random() * Math.PI * 2, spd: 0.6 + Math.random() * 1.1 });
      }
    }
    boltX = W * 0.205; boltY = H * 0.44;
  }

  function size() {
    const r = cv!.getBoundingClientRect();
    W = cv!.width = Math.max(1, Math.floor(r.width * DPR));
    H = cv!.height = Math.max(1, Math.floor(r.height * DPR));
    build();
  }

  function jag(x1: number, y1: number, x2: number, y2: number, r: number) {
    const dx = x2 - x1, dy = y2 - y1, dd = Math.sqrt(dx * dx + dy * dy);
    if (dd < 5 * DPR) { ctx.lineTo(x2, y2); return; }
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
    const breathe = 0.93 + 0.07 * Math.sin(t * 0.9);

    // liquid-gold body — soft sprites blended additively
    ctx.globalCompositeOperation = 'lighter';
    const sheenX = (((t * 0.11) % 1.5) - 0.25) * W; // light flowing left → right
    for (const p of pts) {
      const tw = reduce ? 1 : 0.78 + 0.22 * Math.sin(t * p.spd + p.ph);
      const sheen = reduce ? 0 : Math.max(0, 1 - Math.abs(p.x - sheenX) / (W * 0.17));
      const s = p.base * breathe * (0.9 + 0.16 * tw) * (1 + sheen * 0.7);
      ctx.globalAlpha = Math.min(1, (0.30 + 0.55 * sheen) * (0.78 + 0.22 * tw));
      ctx.drawImage(spr, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // smooth electric whisper on the bolt (sparse, soft)
    if (!reduce && frame % 14 === 0) {
      const ang = (Math.random() - .5) * 1.4 - 1.2;
      const len = (24 + Math.random() * 46) * DPR;
      const ex = boltX + Math.cos(ang) * len, ey = boltY + Math.sin(ang) * len;
      ctx.beginPath(); ctx.moveTo(boltX, boltY); jag(boltX, boltY, ex, ey, 16 * DPR);
      ctx.strokeStyle = 'rgba(210,232,255,.35)'; ctx.lineWidth = 1.4 * DPR; ctx.shadowBlur = 14; ctx.shadowColor = '#CFE3FF'; ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  const start = () => { size(); draw(); };
  if ((document as any).fonts?.ready) (document as any).fonts.ready.then(start); else start();
  window.addEventListener('resize', size);
}
