import { prefersReducedMotion } from './constants';

// Spectacular electric particle intro that resolves the ⚡ZAPP wordmark.
export function initIntro(onComplete: () => void) {
  const intro = document.getElementById('intro')!;
  const cv = document.getElementById('intro-cv') as HTMLCanvasElement | null;
  const TOP = document.getElementById('intro-top')!;
  const BOT = document.getElementById('intro-bot')!;
  const skip = document.getElementById('intro-skip');
  if (!cv) { onComplete(); return; }

  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    cancelAnimationFrame(raf);
    intro.style.transition = 'opacity .35s'; intro.style.opacity = '0';
    setTimeout(() => { intro.style.display = 'none'; document.body.style.overflow = ''; onComplete(); }, 360);
  };
  skip?.addEventListener('click', finish);

  // Honour reduced-motion: skip straight to the site.
  if (prefersReducedMotion()) { finish(); return; }

  document.body.style.overflow = 'hidden';
  const ctx = cv.getContext('2d')!;
  let W = cv.width = innerWidth, H = cv.height = innerHeight;
  window.addEventListener('resize', () => { W = cv.width = innerWidth; H = cv.height = innerHeight; });

  function blt(x1: number, y1: number, x2: number, y2: number, r: number) {
    const dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 5) { ctx.lineTo(x2, y2); return; }
    const mx = (x1 + x2) / 2 + (-dy / d) * (Math.random() - .5) * r;
    const my = (y1 + y2) / 2 + (dx / d) * (Math.random() - .5) * r;
    blt(x1, y1, mx, my, r * .55); blt(mx, my, x2, y2, r * .55);
  }

  let targets: { x: number; y: number }[] = [], particles: Pt[] = [];
  function buildTargets() {
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
    const ox = oc.getContext('2d')!;
    const fs = Math.min(W * .16, H * .26);
    ox.fillStyle = '#fff';
    ox.font = `700 ${fs}px "Cormorant Garamond",serif`;
    ox.textAlign = 'center'; ox.textBaseline = 'middle';
    ox.fillText('⚡ZAPP', W / 2, H / 2 - fs * .06);
    ox.font = `500 ${fs * .1}px "JetBrains Mono",monospace`;
    ox.fillStyle = 'rgba(255,215,0,.8)';
    ox.fillText('3  ·  6  ·  9  ·  ∞', W / 2, H / 2 + fs * .58);
    const d = ox.getImageData(0, 0, W, H).data;
    targets = [];
    const step = Math.max(2, Math.floor(Math.min(W, H) / 180));
    for (let x = 0; x < W; x += step) for (let y = 0; y < H; y += step) if (d[(y * W + x) * 4 + 3] > 80) targets.push({ x, y });
  }

  class Pt {
    sx: number; sy: number; tx: number; ty: number; x: number; y: number; px: number; py: number; delay: number; c: string; sz: number; glow: boolean;
    constructor(tx: number, ty: number) {
      const ang = Math.random() * Math.PI * 2, dist = 150 + Math.random() * Math.max(W, H) * .7;
      this.sx = W / 2 + Math.cos(ang) * dist; this.sy = H / 2 + Math.sin(ang) * dist;
      this.tx = tx; this.ty = ty; this.x = this.sx; this.y = this.sy;
      this.px = this.sx; this.py = this.sy;
      this.delay = Math.random() * .3;
      const r = Math.random();
      this.c = r < .55 ? '#FFD700' : r < .75 ? '#FFA500' : r < .88 ? '#fff' : '#FFE55C';
      this.sz = 1 + Math.random() * 2;
      this.glow = Math.random() > .3;
    }
    update(p: number) {
      this.px = this.x; this.py = this.y;
      const pp = Math.max(0, Math.min(1, (p - this.delay) / (1 - this.delay)));
      const ep = pp < 1 ? 1 - Math.pow(2, -10 * pp) : 1;
      this.x = this.sx + (this.tx - this.sx) * ep; this.y = this.sy + (this.ty - this.sy) * ep;
    }
    draw() {
      if (Math.abs(this.x - this.px) > 0.5 || Math.abs(this.y - this.py) > 0.5) {
        ctx.beginPath(); ctx.moveTo(this.px, this.py); ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.c === '#FFD700' ? 'rgba(255,215,0,0.25)' : this.c === '#FFA500' ? 'rgba(255,165,0,0.2)' : this.c === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(255,229,92,0.2)';
        ctx.lineWidth = this.sz * .5; ctx.stroke();
      }
      if (this.glow) { ctx.shadowBlur = 8; ctx.shadowColor = this.c; }
      ctx.fillStyle = this.c;
      ctx.fillRect(this.x - this.sz / 2, this.y - this.sz / 2, this.sz, this.sz);
      ctx.shadowBlur = 0;
    }
  }

  const DUR = { wave: 1400, burst: 1900, form: 3400, glow: 3900, reveal: 4500 };
  let t0: number | null = null, raf = 0, assembled = false;
  const e01 = (t: number, s: number, e: number) => Math.max(0, Math.min(1, (t - s) / (e - s)));

  function frame(now: number) {
    if (finished) return;
    raf = requestAnimationFrame(frame);
    if (!t0) t0 = now;
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    if (t < DUR.wave) {
      const p = e01(t, 100, DUR.wave);
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * .4 * p);
      bg.addColorStop(0, `rgba(80,0,160,${.08 * p})`); bg.addColorStop(.5, `rgba(30,0,80,${.05 * p})`); bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      const pulse = .5 + .5 * Math.sin(t * .012);
      const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10 + p * 35 * pulse);
      og.addColorStop(0, 'rgba(255,255,255,.95)'); og.addColorStop(.2, `rgba(255,215,0,${.9 * Math.min(p * 3, 1)})`); og.addColorStop(.6, `rgba(255,150,0,${.4 * p})`); og.addColorStop(1, 'transparent');
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(cx, cy, 10 + p * 35 * pulse, 0, Math.PI * 2); ctx.fill();
      if (t > 250) {
        const wp = e01(t, 250, DUR.wave);
        const wW = 100 + wp * (W - 80);
        const amp1 = 12 + wp * 90, f1 = .014 + wp * .04, s1 = t * .005;
        ctx.beginPath();
        for (let x = cx - wW / 2; x <= cx + wW / 2; x += 2) {
          const env = Math.sin(Math.PI * (x - (cx - wW / 2)) / wW);
          const y = cy + Math.sin((x - cx) * f1 + s1) * amp1 * env + (Math.random() - .5) * wp * 6;
          x <= cx - wW / 2 + 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,215,0,${.6 + wp * .35})`; ctx.lineWidth = 2 + wp * 2; ctx.shadowBlur = 16 + wp * 22; ctx.shadowColor = '#FFD700'; ctx.stroke(); ctx.shadowBlur = 0;
        if (wp > .35) {
          const h2p = (wp - .35) / .65;
          ctx.beginPath();
          for (let x = cx - wW / 2; x <= cx + wW / 2; x += 2) {
            const env = Math.sin(Math.PI * (x - (cx - wW / 2)) / wW);
            const y = cy + Math.sin((x - cx) * f1 * 3 + s1 * 2) * amp1 * .35 * env;
            x <= cx - wW / 2 + 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(255,165,0,${.3 * h2p})`; ctx.lineWidth = 1; ctx.shadowBlur = 8; ctx.shadowColor = '#FFA500'; ctx.stroke(); ctx.shadowBlur = 0;
        }
        if (wp > .65) {
          const h3p = (wp - .65) / .35;
          ctx.beginPath();
          for (let x = cx - wW / 2; x <= cx + wW / 2; x += 3) {
            const env = Math.sin(Math.PI * (x - (cx - wW / 2)) / wW);
            const y = cy + Math.sin((x - cx) * f1 * 7 + s1 * 3.5) * amp1 * .2 * env * (Math.random() * .4 + .8);
            x <= cx - wW / 2 + 3 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(255,255,255,${.2 * h3p})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }
    }

    if (t >= DUR.wave && t < DUR.burst) {
      const p = e01(t, DUR.wave, DUR.burst);
      const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * (0.08 + p * .45));
      fg.addColorStop(0, `rgba(255,255,255,${1 - p * .7})`); fg.addColorStop(.25, `rgba(255,215,0,${.8 * (1 - p * .6)})`); fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2, len = 80 + Math.random() * Math.max(W, H) * .55;
        ctx.beginPath(); ctx.moveTo(cx, cy); blt(cx, cy, cx + Math.cos(ang) * len * p, cy + Math.sin(ang) * len * p, 100 * (1 - p * .7));
        ctx.strokeStyle = `rgba(255,215,0,${.5 + Math.random() * .4})`; ctx.lineWidth = .9; ctx.shadowBlur = 10; ctx.shadowColor = '#FFD700'; ctx.stroke(); ctx.shadowBlur = 0;
      }
    }

    if (t >= DUR.burst) {
      if (!assembled) {
        assembled = true;
        buildTargets();
        const tgt = targets.sort(() => Math.random() - .5).slice(0, 2400);
        particles = tgt.map(tp => new Pt(tp.x, tp.y));
      }
      const p = e01(t, DUR.burst, DUR.form);
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * .45);
      bg.addColorStop(0, `rgba(255,215,0,${.04 + p * .05})`); bg.addColorStop(.5, `rgba(80,0,160,${.02 + p * .04})`); bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      particles.forEach(pt => { pt.update(p); pt.draw(); });
    }

    if (t >= DUR.form && t < DUR.glow) {
      particles.forEach(pt => pt.draw());
      const p = e01(t, DUR.form, DUR.glow);
      const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * .6);
      gl.addColorStop(0, `rgba(255,215,0,${.28 * p})`); gl.addColorStop(.4, `rgba(200,100,0,${.12 * p})`); gl.addColorStop(1, 'transparent');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      [1, .7, .45].forEach((_spd, i) => {
        const delay = i * .25;
        const rp = Math.max(0, p - delay) / (1 - delay);
        if (rp <= 0) return;
        const sr = rp * Math.max(W, H) * (0.5 + i * .15);
        ctx.beginPath(); ctx.arc(cx, cy, sr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,215,0,${.6 * (1 - rp) * (1 - i * .2)})`;
        ctx.lineWidth = 2.5 - rp * 1.8; ctx.shadowBlur = 16; ctx.shadowColor = '#FFD700'; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(cx, cy, sr * .85, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${.2 * (1 - rp)})`; ctx.lineWidth = .8; ctx.stroke();
      });
    }

    if (t >= DUR.glow && !finished) {
      particles.forEach(pt => pt.draw());
      const p = e01(t, DUR.glow, DUR.reveal);
      if (p > .2 && TOP.style.display === 'none') { TOP.style.display = 'block'; BOT.style.display = 'block'; }
      const cp = Math.max(0, (p - .2) / .8);
      const ecp = cp < 1 ? 1 - Math.pow(2, -10 * cp) : 1;
      if (p > .2) { TOP.style.transform = `translateY(${-ecp * 51}%)`; BOT.style.transform = `translateY(${ecp * 51}%)`; }
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, .8 - p * 3)})`; ctx.fillRect(0, 0, W, H);
      if (p >= 1) finish();
    }
  }

  document.fonts.ready.then(() => setTimeout(() => requestAnimationFrame(frame), 150));
}
