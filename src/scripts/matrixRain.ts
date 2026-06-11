import { prefersReducedMotion } from './constants';

// Original coded "digital rain" — falling glyph columns, ZAPP-tinted (cyan/green + the sacred 3·6·9).
// Throttled to ~24fps (the Matrix is steppy by nature) so it stays cheap and never janks.
export function initMatrixRain(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const FONT = 16;
  const CHARS = 'アカサタナハマヤラワ0123456789369∞ZAPP⚡'.split('');
  let W = 0, H = 0, cols = 0, drops: number[] = [], speed: number[] = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / FONT);
    drops = Array.from({ length: cols }, () => Math.random() * -(H / FONT));
    speed = Array.from({ length: cols }, () => 0.45 + Math.random() * 0.85);
  }
  resize();
  addEventListener('resize', resize, { passive: true });

  let raf = 0, last = 0;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (now - last < 45) return;            // ~22fps cap — cheap
    last = now;
    ctx!.fillStyle = 'rgba(2,16,10,0.16)';   // fade the previous frame → trailing green tails
    ctx!.fillRect(0, 0, W, H);
    ctx!.font = `${FONT}px "JetBrains Mono", monospace`;
    for (let i = 0; i < cols; i++) {
      const ch = CHARS[(Math.random() * CHARS.length) | 0];
      const x = i * FONT, y = drops[i] * FONT;
      ctx!.fillStyle = Math.random() < 0.07 ? 'rgba(225,255,240,0.96)'   // bright mint head
        : (i % 7 === 0 ? 'rgba(94,155,130,0.78)' : 'rgba(60,110,85,0.5)'); // Solana-green matrix columns
      ctx!.fillText(ch, x, y);
      drops[i] += speed[i];
      if (y > H && Math.random() > 0.975) drops[i] = Math.random() * -18;
    }
  }
  if (prefersReducedMotion()) return;
  raf = requestAnimationFrame(frame);
}
