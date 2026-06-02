import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CA, DEX_API, prefersReducedMotion, isTouch } from './constants';
import { startHubVortex, startDimCanvas, warpHub, setDimScroll } from './scenes';
import { startHubLogo } from './hubLogo';
import { initIntro } from './intro';
import { initSound } from './sound';

gsap.registerPlugin(ScrollTrigger);

/* ───────── Lenis smooth scroll ───────── */
let lenis: Lenis | null = null;
function initLenis() {
  if (prefersReducedMotion()) return;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  lenis.stop(); // hub isn't scrollable
  function raf(time: number) { lenis!.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  gsap.ticker.lagSmoothing(0);
}

/* ───────── Torch cursor ───────── */
function initCursor() {
  if (isTouch()) return;
  const cur = document.getElementById('cur')!, curt = document.getElementById('curt')!;
  let mx = innerWidth / 2, my = innerHeight / 2, tx = mx, ty = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }, { passive: true });
  (function loop() { tx += (mx - tx) * .08; ty += (my - ty) * .08; curt.style.left = (tx - 40) + 'px'; curt.style.top = (ty - 40) + 'px'; requestAnimationFrame(loop); })();
}

/* ───────── Reveal on scroll ───────── */
const rvObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
function initReveals() { document.querySelectorAll('.rv:not(.in)').forEach(el => rvObs.observe(el)); }

/* Draw the 3·6·9 triangle exactly through the live card centres */
function syncTriangle() {
  const portals = document.querySelector('.portals') as HTMLElement | null;
  const main = document.getElementById('tri-main');
  const ang = document.getElementById('tri-angle');
  if (!portals || !main) return;
  const pr = portals.getBoundingClientRect();
  if (pr.width < 10 || pr.height < 10) return;
  const centre = (sel: string) => {
    const e = portals.querySelector(sel) as HTMLElement | null;
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: (r.left + r.width / 2 - pr.left) / pr.width * 100, y: (r.top + r.height / 2 - pr.top) / pr.height * 100 };
  };
  const p3 = centre('.portal.past'), p6 = centre('.portal.present'), p9 = centre('.portal.future');
  if (!p3 || !p6 || !p9) return;
  const d = `M${p3.x.toFixed(2)} ${p3.y.toFixed(2)} L${p6.x.toFixed(2)} ${p6.y.toFixed(2)} L${p9.x.toFixed(2)} ${p9.y.toFixed(2)} Z`;
  main.setAttribute('d', d);
  document.getElementById('tri-flow')?.setAttribute('d', d);
  if (ang) {
    const ux = p3.x - p6.x, uy = p3.y - p6.y, vx = p9.x - p6.x, vy = p9.y - p6.y;
    const ul = Math.hypot(ux, uy) || 1, vl = Math.hypot(vx, vy) || 1, s = 5.5;
    const a = { x: p6.x + ux / ul * s, y: p6.y + uy / ul * s };
    const b = { x: p6.x + vx / vl * s, y: p6.y + vy / vl * s };
    const corner = { x: a.x + (b.x - p6.x), y: a.y + (b.y - p6.y) };
    ang.setAttribute('d', `M${a.x.toFixed(2)} ${a.y.toFixed(2)} L${corner.x.toFixed(2)} ${corner.y.toFixed(2)} L${b.x.toFixed(2)} ${b.y.toFixed(2)}`);
  }
}
const reTriangle = () => { syncTriangle(); requestAnimationFrame(syncTriangle); };

/* ───────── Autoplay videos when visible ───────── */
const vidObs = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
}), { threshold: .35 });
function initVideos() { document.querySelectorAll<HTMLVideoElement>('video[data-autoplay-inview]').forEach(v => vidObs.observe(v)); }

/* ───────── ScrollTrigger parallax (per dimension) ───────── */
function buildParallax(dimId: string) {
  if (prefersReducedMotion()) return;
  const root = document.getElementById(dimId)!;
  root.querySelectorAll<HTMLElement>('.vid-frame, .blueprint, .geo').forEach(el => {
    gsap.fromTo(el, { y: 40 }, {
      y: -40, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  ScrollTrigger.refresh();
}

/* ───────── Page navigation ───────── */
let currentPage = 'hub';
function showPage(id: string) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); (p as HTMLElement).style.position = 'fixed'; (p as HTMLElement).style.overflow = 'hidden'; });
  const page = document.getElementById(id)!;
  page.classList.add('active');
  const isDim = id.startsWith('dim-');
  document.getElementById('dim-nav')!.classList.toggle('show', isDim);
  if (isDim) {
    (page as HTMLElement).style.position = 'relative'; (page as HTMLElement).style.height = 'auto'; (page as HTMLElement).style.overflow = 'visible';
    document.body.classList.add('scrollable');
    lenis?.scrollTo(0, { immediate: true }); lenis?.start();
    window.scrollTo(0, 0);
    const era = id.replace('dim-', '');
    document.querySelectorAll('.dn-era [data-era]').forEach(b => b.classList.toggle('on', b.getAttribute('data-era') === era));
    setTimeout(() => { initReveals(); initVideos(); buildParallax(id); }, 100);
  } else {
    document.body.classList.remove('scrollable');
    document.getElementById('dim-nav')!.classList.remove('scrolled');
    lenis?.stop();
    if (id === 'hub') setTimeout(reTriangle, 60);
  }
  currentPage = id;
}

function withOverlay(color: string, mid: () => void, dur = .45) {
  if (!('gsap' in window) && !gsap) { mid(); return; }
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;inset:0;z-index:1000;background:${color};opacity:0;pointer-events:none`;
  document.body.appendChild(overlay);
  gsap.to(overlay, { opacity: 1, duration: dur, ease: 'power2.inOut', onComplete: () => {
    mid();
    gsap.to(overlay, { opacity: 0, duration: dur + .05, ease: 'power2.inOut', delay: .1, onComplete: () => overlay.remove() });
  } });
}

const DIM_COLORS: Record<string, string> = { past: '#0C0600', present: '#2C5E8E', future: '#F3EEFF', winter: '#0A1628' };
const DIM_DIR: Record<string, number> = { past: -1, present: 0, future: 1, winter: 0 };
function enterDimension(name: string) {
  warpHub(DIM_DIR[name] ?? 0); // fly into the distance toward that era
  withOverlay(DIM_COLORS[name] || '#000', () => { showPage('dim-' + name); startDimCanvas(name); }, .55);
}
function backToHub() { withOverlay('#000', () => showPage('hub'), .4); }

/* ───────── Time-travel between eras (past ↔ present ↔ future) ───────── */
const ERA_ORDER: Record<string, number> = { past: 0, present: 1, future: 2 };
const ERA_TINT: Record<string, string> = { past: '#C8862A', present: '#3E7EBC', future: '#7C3AED' };
function timeWarp(dir: number, tint: string, mid: () => void) {
  if (prefersReducedMotion()) { mid(); return; }
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;inset:0;z-index:1200;pointer-events:none';
  document.body.appendChild(cv);
  const c = cv.getContext('2d')!;
  const W = cv.width = innerWidth, H = cv.height = innerHeight;
  const cx = W / 2, cy = H / 2, maxR = Math.hypot(W, H) / 2;
  const st: { a: number; r: number; sp: number; col: string }[] = [];
  for (let i = 0; i < 170; i++) st.push({ a: Math.random() * Math.PI * 2, r: dir < 0 ? maxR * (0.5 + Math.random() * 0.6) : Math.random() * maxR * 0.4, sp: 4 + Math.random() * 16, col: Math.random() < .55 ? '#FFD700' : (Math.random() < .5 ? '#fff' : tint) });
  // 3·6·9 numerals flying through the time tunnel
  const GLYPH = ['3', '6', '9', '3', '6', '9', '∞'];
  const nums: { ch: string; a: number; r: number; sp: number; col: string }[] = [];
  for (let i = 0; i < 16; i++) nums.push({ ch: GLYPH[(Math.random() * GLYPH.length) | 0], a: Math.random() * Math.PI * 2, r: Math.random() * maxR * 0.3, sp: 3 + Math.random() * 9, col: Math.random() < .5 ? '#FFD700' : tint });
  const t0 = performance.now(), DUR = 900; let swapped = false, raf = 0;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  function frame(now: number) {
    const p = Math.min(1, (now - t0) / DUR);
    c.clearRect(0, 0, W, H);
    c.fillStyle = `rgba(4,2,8,${0.12 + 0.55 * p})`; c.fillRect(0, 0, W, H);
    // central tunnel glow
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, maxR * (0.25 + p * 0.5));
    g.addColorStop(0, `rgba(255,240,185,${0.28 * (1 - p * 0.4)})`); g.addColorStop(1, 'transparent');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const acc = 1 + p * p * 14;
    for (const s of st) {
      const r2 = s.r + s.sp * (6 + p * 30);
      c.beginPath();
      c.moveTo(cx + Math.cos(s.a) * s.r, cy + Math.sin(s.a) * s.r);
      c.lineTo(cx + Math.cos(s.a) * r2, cy + Math.sin(s.a) * r2);
      c.strokeStyle = s.col; c.globalAlpha = 0.45 + 0.55 * p; c.lineWidth = 1 + p * 1.8; c.shadowBlur = 8; c.shadowColor = s.col; c.stroke();
      s.r += s.sp * acc * dir;
      if (s.r > maxR * 1.25) s.r = 0; else if (s.r < 0) s.r = maxR;
    }
    // flying numerals (grow as they rush past)
    for (const n of nums) {
      const x = cx + Math.cos(n.a) * n.r, y = cy + Math.sin(n.a) * n.r;
      const fs = 10 + (n.r / maxR) * 150 * (1 + p);
      c.font = `700 ${fs}px "Cormorant Garamond",serif`;
      c.globalAlpha = Math.max(0, 1 - n.r / (maxR * 1.1)) * (0.45 + 0.55 * p);
      c.fillStyle = n.col; c.shadowBlur = 14; c.shadowColor = '#FFD700';
      c.fillText(n.ch, x, y);
      n.r += n.sp * (1 + p * p * 15);
      if (n.r > maxR * 1.15) { n.r = Math.random() * maxR * 0.12; n.a = Math.random() * Math.PI * 2; }
    }
    c.globalAlpha = 1; c.shadowBlur = 0;
    if (p >= 0.5 && !swapped) { swapped = true; mid(); c.fillStyle = 'rgba(255,255,255,.92)'; c.fillRect(0, 0, W, H); }
    if (p >= 1) { cancelAnimationFrame(raf); cv.remove(); return; }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
}
function timeTravel(name: string) {
  if (currentPage === 'dim-' + name) return;
  if (currentPage === 'hub') { enterDimension(name); return; }
  const cur = currentPage.replace('dim-', '');
  const dir = (ERA_ORDER[name] ?? 1) >= (ERA_ORDER[cur] ?? 1) ? 1 : -1;
  document.querySelectorAll('.dn-era [data-era]').forEach(b => b.classList.toggle('on', b.getAttribute('data-era') === name));
  timeWarp(dir, ERA_TINT[name] || '#FFD700', () => { showPage('dim-' + name); startDimCanvas(name); });
}

/* ───────── Live price data ───────── */
let livePrice = 0;
const cinEl = () => document.getElementById('cin') as HTMLInputElement | null;
function uc() {
  const el = cinEl(), out = document.getElementById('cout');
  if (!el || !out) return;
  const v = Number(el.value.replace(/[^0-9]/g, ''));
  if (!v || !livePrice) { out.textContent = '—'; return; }
  const x = v * livePrice;
  out.textContent = x >= 1e9 ? '$' + (x / 1e9).toFixed(3) + 'B' : x >= 1e6 ? '$' + (x / 1e6).toFixed(3) + 'M' : x >= 1e3 ? '$' + (x / 1e3).toFixed(2) + 'K' : '$' + x.toFixed(x < .01 ? 6 : 2);
}
async function fetchData() {
  try {
    const r = await fetch(DEX_API); const d = await r.json(); const p = d?.pairs?.[0]; if (!p) return;
    livePrice = +p.priceUsd || 0;
    const mc = +p.marketCap || 0, ch = +(p.priceChange?.h24) || 0;
    const fmt = (v: number) => v >= 1e9 ? '$' + (v / 1e9).toFixed(2) + 'B' : v >= 1e6 ? '$' + (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? '$' + (v / 1e3).toFixed(0) + 'K' : '$' + v.toFixed(0);
    const fp = (v: number) => v < 0.0001 ? v.toFixed(9) : v < 0.01 ? v.toFixed(6) : v.toFixed(4);
    const pStr = '$' + fp(livePrice);
    const setText = (id: string, t: string) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    setText('hub-price-val', pStr); setText('p-price', pStr);
    setText('p-mcap', fmt(mc));
    const ch2 = document.getElementById('p-change'); if (ch2) { ch2.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; (ch2 as HTMLElement).style.color = ch >= 0 ? '#10B981' : '#EF4444'; }
    setText('zv', fmt(mc));
    setText('dn-price', '⚡ ' + pStr);
    uc();
  } catch { /* offline / rate-limited — leave placeholders */ }
}

/* ───────── Wire up DOM ───────── */
function wire() {
  // portals + hub buttons (delegated)
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-dim],[data-era],[data-hub],[data-copy-ca],[data-scroll-buy],[data-sc]') as HTMLElement | null;
    if (!t) return;
    if (t.hasAttribute('data-dim')) { e.preventDefault(); enterDimension(t.getAttribute('data-dim')!); }
    else if (t.hasAttribute('data-era')) { e.preventDefault(); timeTravel(t.getAttribute('data-era')!); }
    else if (t.hasAttribute('data-hub')) { e.preventDefault(); backToHub(); }
    else if (t.hasAttribute('data-copy-ca')) { navigator.clipboard.writeText(CA).then(() => { const m = document.getElementById('ca-msg'); if (m) { m.textContent = '✓ Copied!'; m.style.opacity = '1'; setTimeout(() => m.style.opacity = '0', 2500); } }); }
    else if (t.hasAttribute('data-scroll-buy')) { e.preventDefault(); const b = document.querySelector('.page.active #buy-section'); if (b) lenis ? lenis.scrollTo(b as HTMLElement) : (b as HTMLElement).scrollIntoView({ behavior: 'smooth' }); }
    else if (t.hasAttribute('data-sc')) { const el = cinEl(); if (el) { el.value = Number(t.getAttribute('data-sc')).toLocaleString('en-US'); uc(); } }
  });

  const ci = cinEl();
  ci?.addEventListener('input', () => { const v = ci.value.replace(/[^0-9]/g, ''); if (v) ci.value = Number(v).toLocaleString('en-US'); uc(); });

  // dim-nav scroll state (works with Lenis or native)
  const onScroll = () => { const y = window.scrollY; document.getElementById('dim-nav')!.classList.toggle('scrolled', y > 60); setDimScroll(y / Math.max(1, innerHeight * 0.9)); };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
}

/* ───────── Boot ───────── */
function boot() {
  initLenis();
  initCursor();
  initSound();
  wire();
  startHubLogo();
  startHubVortex();
  reTriangle(); window.addEventListener('resize', reTriangle);
  fetchData(); setInterval(fetchData, 60000);
  initIntro(() => { initReveals(); reTriangle(); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
