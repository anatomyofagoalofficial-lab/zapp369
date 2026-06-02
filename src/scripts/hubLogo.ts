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

  let frame = 0, zap = 0;
  function draw() {
    requestAnimationFrame(draw);
    const hub = document.getElementById('hub');
    if (!hub || !hub.classList.contains('active')) { ctx.clearRect(0, 0, W, H); return; }
    frame++;
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * 0.001;
    const breathe = 0.93 + 0.07 * Math.sin(t * 0.9);

    // high-voltage ZAP: random jolt that shakes + over-charges the wordmark
    if (!reduce && zap < 0.05 && Math.random() < 0.014) zap = 1;
    zap *= 0.84; if (zap < 0.01) zap = 0;
    const zjx = (Math.random() - .5) * 7 * DPR * zap;
    const zjy = (Math.random() - .5) * 4 * DPR * zap;

    // liquid-gold body — soft sprites blended additively (+ zap over-charge)
    ctx.globalCompositeOperation = 'lighter';
    const sheenX = (((t * 0.11) % 1.5) - 0.25) * W; // light flowing left → right
    for (const p of pts) {
      const tw = reduce ? 1 : 0.78 + 0.22 * Math.sin(t * p.spd + p.ph);
      const sheen = reduce ? 0 : Math.max(0, 1 - Math.abs(p.x - sheenX) / (W * 0.17));
      const s = p.base * breathe * (0.9 + 0.16 * tw) * (1 + sheen * 0.7 + zap * 0.55);
      ctx.globalAlpha = Math.min(1, (0.30 + 0.55 * sheen + zap * 0.3) * (0.78 + 0.22 * tw));
      ctx.drawImage(spr, p.x + zjx - s / 2, p.y + zjy - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // electric sparks zapping around the letters — constant trickle, storm on a zap
    if (!reduce && pts.length > 3) {
      const bursts = zap > 0.25 ? 2 + ((Math.random() * 3) | 0) : (frame % 11 === 0 ? 1 : 0);
      for (let k = 0; k < bursts; k++) {
        const o = pts[(Math.random() * pts.length) | 0];
        const ax = o.x + zjx, ay = o.y + zjy;
        const ang = Math.random() * Math.PI * 2, len = (26 + Math.random() * 80) * DPR;
        const bx = ax + Math.cos(ang) * len, by = ay + Math.sin(ang) * len;
        ctx.beginPath(); ctx.moveTo(ax, ay); jag(ax, ay, bx, by, 15 * DPR);
        ctx.strokeStyle = 'rgba(200,228,255,.5)'; ctx.lineWidth = 1.4 * DPR; ctx.shadowBlur = 13; ctx.shadowColor = '#CFE3FF'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ax, ay); jag(ax, ay, bx, by, 9 * DPR);
        ctx.strokeStyle = 'rgba(255,226,130,.82)'; ctx.lineWidth = .85 * DPR; ctx.shadowBlur = 8; ctx.shadowColor = '#FFD700'; ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  }

  const start = () => { size(); draw(); };
  if ((document as any).fonts?.ready) (document as any).fonts.ready.then(start); else start();
  window.addEventListener('resize', size);
}
