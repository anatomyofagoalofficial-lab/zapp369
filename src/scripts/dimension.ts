import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CA, DEX_API, prefersReducedMotion } from './constants';
import { startDimCanvas, setDimScroll } from './scenes';
import { initCursor } from './ui';
import { initSound } from './sound';

gsap.registerPlugin(ScrollTrigger);

const ROUTE: Record<string, string> = { past: '/dimensions/tower', present: '/dimensions/signal', future: '/dimensions/network' };

function boot() {
  const dimEl = document.querySelector('#dim-past,#dim-present,#dim-future') as HTMLElement | null;
  if (!dimEl) return;
  const name = dimEl.id.replace('dim-', '');
  dimEl.classList.add('active');
  document.body.classList.add('scrollable');
  document.getElementById('dim-nav')?.classList.add('show');
  document.querySelectorAll('.dn-era [data-era]').forEach(b => b.classList.toggle('on', b.getAttribute('data-era') === name));

  let lenis: Lenis | null = null;
  if (!prefersReducedMotion()) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => { lenis!.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);
  }
  initCursor(); initSound();

  const rvObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
  const initReveals = () => document.querySelectorAll('.rv:not(.in)').forEach(el => rvObs.observe(el));
  const vidObs = new IntersectionObserver(es => es.forEach(e => { const v = e.target as HTMLVideoElement; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .35 });
  const initVideos = () => document.querySelectorAll<HTMLVideoElement>('video[data-autoplay-inview]').forEach(v => vidObs.observe(v));
  function buildParallax() { if (prefersReducedMotion()) return; dimEl!.querySelectorAll<HTMLElement>('.vid-frame, .blueprint, .geo').forEach(el => { gsap.fromTo(el, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }); }); ScrollTrigger.refresh(); }

  const cinEl = () => document.getElementById('cin') as HTMLInputElement | null;
  let livePrice = 0;
  function uc() { const el = cinEl(), out = document.getElementById('cout'); if (!el || !out) return; const v = Number(el.value.replace(/[^0-9]/g, '')); if (!v || !livePrice) { out.textContent = '—'; return; } const x = v * livePrice; out.textContent = x >= 1e9 ? '$' + (x / 1e9).toFixed(3) + 'B' : x >= 1e6 ? '$' + (x / 1e6).toFixed(3) + 'M' : x >= 1e3 ? '$' + (x / 1e3).toFixed(2) + 'K' : '$' + x.toFixed(x < .01 ? 6 : 2); }
  async function fetchData() { try { const r = await fetch(DEX_API); const d = await r.json(); const p = d?.pairs?.[0]; if (!p) return; livePrice = +p.priceUsd || 0; const mc = +p.marketCap || 0, ch = +(p.priceChange?.h24) || 0; const fmt = (v: number) => v >= 1e9 ? '$' + (v / 1e9).toFixed(2) + 'B' : v >= 1e6 ? '$' + (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? '$' + (v / 1e3).toFixed(0) + 'K' : '$' + v.toFixed(0); const fp = (v: number) => v < 0.0001 ? v.toFixed(9) : v < 0.01 ? v.toFixed(6) : v.toFixed(4); const pStr = '$' + fp(livePrice); const set = (id: string, t: string) => { const e = document.getElementById(id); if (e) e.textContent = t; }; set('p-price', pStr); set('p-mcap', fmt(mc)); const ch2 = document.getElementById('p-change'); if (ch2) { ch2.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; (ch2 as HTMLElement).style.color = ch >= 0 ? '#10B981' : '#EF4444'; } set('zv', fmt(mc)); set('dn-price', '⚡ ' + pStr); uc(); } catch { /* offline */ } }
  const ci = cinEl();
  ci?.addEventListener('input', () => { const v = ci.value.replace(/[^0-9]/g, ''); if (v) ci.value = Number(v).toLocaleString('en-US'); uc(); });

  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-hub],[data-era],[data-copy-ca],[data-scroll-buy],[data-sc]') as HTMLElement | null;
    if (!t) return;
    const go = (u: string) => (window as any).zappWarp ? (window as any).zappWarp(u) : (location.href = u);
    if (t.hasAttribute('data-hub')) { e.preventDefault(); go('/'); }
    else if (t.hasAttribute('data-era')) { e.preventDefault(); const er = t.getAttribute('data-era')!; if (er !== name) go(ROUTE[er] || '/'); }
    else if (t.hasAttribute('data-copy-ca')) { navigator.clipboard.writeText(CA).then(() => { const m = document.getElementById('ca-msg'); if (m) { m.textContent = '✓ Copied!'; m.style.opacity = '1'; setTimeout(() => m.style.opacity = '0', 2500); } }); }
    else if (t.hasAttribute('data-scroll-buy')) { e.preventDefault(); const b = document.getElementById('buy-section'); if (b) lenis ? lenis.scrollTo(b) : b.scrollIntoView({ behavior: 'smooth' }); }
    else if (t.hasAttribute('data-sc')) { const el = cinEl(); if (el) { el.value = Number(t.getAttribute('data-sc')).toLocaleString('en-US'); uc(); } }
  });

  const onScroll = () => { const y = window.scrollY; document.getElementById('dim-nav')?.classList.toggle('scrolled', y > 60); setDimScroll(y / Math.max(1, innerHeight * 0.9)); };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);

  startDimCanvas(name);
  initReveals(); initVideos(); setTimeout(buildParallax, 150);
  fetchData(); setInterval(fetchData, 60000);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
