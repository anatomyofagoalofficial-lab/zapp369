"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { TESLA_QUOTES, SLOGANS } from "@/lib/constants";

/**
 * ⚡ZAPP — Past hero · "The Vitrine".
 * Tesla's lab the night before the great experiment: the Wardenclyffe tower
 * rising behind the mascot, who stands on a Brâncuși plinth under a single warm
 * key-light (Michelangelo chiaroscuro). A bolt descends from the energy crown
 * and stops in a charged gap ABOVE his head — the unresolved moment — never
 * across the face. Gaudí catenary arch frames the vitrine; da Vinci annotations
 * and real classical-physics equations drift in the background; golden dust
 * rises. Parallax + mouse reactivity, all reduced-motion safe.
 *
 * Display/voice elements use font-serif (Cormorant); the running quote is a
 * serif pull-quote; everything explanatory elsewhere on the page is Inter.
 */
export function PastHero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const candleRef = useRef<HTMLDivElement>(null);
  const motesRef = useRef<HTMLCanvasElement>(null);

  // golden dust motes
  useEffect(() => {
    if (reduce) return;
    const cv = motesRef.current;
    const hero = heroRef.current;
    if (!cv || !hero) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let W = 0;
    let H = 0;
    type P = { x: number; y: number; r: number; s: number; d: number; o: number };
    let dust: P[] = [];

    const fit = () => {
      W = cv.width = hero.offsetWidth;
      H = cv.height = hero.offsetHeight;
      dust = Array.from({ length: 46 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        s: Math.random() * 0.4 + 0.1,
        d: Math.random() * Math.PI * 2,
        o: Math.random() * 0.5 + 0.2,
      }));
    };
    fit();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of dust) {
        p.y -= p.s;
        p.x += Math.sin(p.d + p.y * 0.01) * 0.3;
        if (p.y < -4) {
          p.y = H + 4;
          p.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(244,232,208,${p.o})`;
        ctx.shadowColor = "#e8b547";
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => fit();
    window.addEventListener("resize", onResize);

    // pause when hero leaves the viewport (perf)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.02 },
    );
    io.observe(hero);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [reduce]);

  // parallax on scroll + mouse reactivity
  useEffect(() => {
    if (reduce) return;
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (numeralRef.current)
          numeralRef.current.style.transform = `translateY(calc(-50% + ${y * 0.2}px))`;
        if (towerRef.current)
          towerRef.current.style.transform = `translateX(-50%) translateY(${y * 0.06}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const fine = window.matchMedia("(pointer:fine)").matches;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      if (mascotRef.current)
        mascotRef.current.style.transform = `translate3d(${dx * -12}px, ${dy * -7}px, 0) rotate(${dx * -0.9}deg)`;
      if (towerRef.current)
        towerRef.current.style.transform = `translateX(-50%) translate3d(${dx * 9}px, ${dy * 5}px, 0)`;
      if (raysRef.current) raysRef.current.style.transform = `rotate(${dx * 1.4}deg)`;
      if (candleRef.current) {
        candleRef.current.style.left = `${e.clientX}px`;
        candleRef.current.style.top = `${e.clientY}px`;
      }
    };
    const onLeave = () => {
      if (mascotRef.current) mascotRef.current.style.transform = "";
      if (towerRef.current) towerRef.current.style.transform = "translateX(-50%)";
    };
    if (fine) {
      hero.addEventListener("mousemove", onMove);
      hero.addEventListener("mouseleave", onLeave);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  return (
    <section ref={heroRef} className="ph-hero" aria-label="Past — The Tower">
      <div ref={candleRef} className="ph-candle" aria-hidden="true" />
      <div ref={raysRef} className="ph-rays" aria-hidden="true" />
      <canvas ref={motesRef} className="ph-motes" aria-hidden="true" />
      <div ref={numeralRef} className="ph-numeral" aria-hidden="true">
        3
      </div>
      <div className="ph-haze" aria-hidden="true" />

      <div className="ph-inner">
        <div className="ph-copy">
          <span className="ph-tag">3 · Past · The Tower</span>
          <h1 className="ph-h1">
            The <em>Spark</em>
          </h1>
          <blockquote className="ph-quote">
            {TESLA_QUOTES.magnificence}
            <cite>— Nikola Tesla</cite>
          </blockquote>
          <p className="ph-slogan">{SLOGANS.freeEnergy}</p>
        </div>

        <div className="ph-stage">
          {/* Gaudí catenary arch */}
          <svg className="ph-archframe" viewBox="0 0 400 620" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 600 L20 230 Q200 20 380 230 L380 600" />
            <path className="ph-corner" d="M20 250 L20 230 Q30 150 70 110" />
            <path className="ph-corner" d="M380 250 L380 230 Q370 150 330 110" />
          </svg>

          {/* Wardenclyffe tower */}
          <div ref={towerRef} className="ph-tower-wrap">
            <svg className="ph-tower" viewBox="0 0 200 540" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
              <defs>
                <radialGradient id="phOrb" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#fff8e6" />
                  <stop offset="32%" stopColor="#f4e8d0" />
                  <stop offset="68%" stopColor="#e8b547" />
                  <stop offset="100%" stopColor="rgba(232,181,71,0)" />
                </radialGradient>
              </defs>
              <g className="ph-crown">
                <circle className="ph-orbfill" cx="100" cy="46" r="30" />
                <circle cx="100" cy="46" r="15" strokeWidth="0.7" />
                <ellipse cx="100" cy="64" rx="48" ry="15" />
                <ellipse cx="100" cy="64" rx="32" ry="9" />
              </g>
              <path d="M70 76 q30 18 60 0 M74 84 q26 14 52 0 M78 92 q22 11 44 0" />
              <polyline points="62,100 138,100 150,512 50,512 62,100" />
              <line x1="62" y1="100" x2="100" y2="512" />
              <line x1="138" y1="100" x2="100" y2="512" />
              <line x1="78" y1="100" x2="68" y2="512" />
              <line x1="122" y1="100" x2="132" y2="512" />
              <path d="M56 156 H144 M54 216 H146 M52 276 H148 M51 336 H149 M50 396 H150 M50 456 H150" />
              <path d="M60 116 L140 176 M140 116 L60 176 M58 176 L142 236 M142 176 L58 236 M56 236 L144 306 M144 236 L56 306 M54 306 L146 376 M146 306 L54 376 M52 376 L148 446 M148 376 L52 446" />
              <path d="M70 512 L80 528 M100 512 L100 530 M130 512 L120 528" strokeDasharray="3 3" />
              <text className="ph-anno" x="152" y="50">187 ft</text>
              <text className="ph-anno" x="150" y="300">ω = 1/√(LC)</text>
              <circle cx="100" cy="46" r="44" strokeWidth="0.5" strokeDasharray="2 5" />
            </svg>
          </div>

          {/* reaching bolt + charged gap, above the head */}
          <svg className="ph-reach" viewBox="0 0 110 220" aria-hidden="true">
            <path className="ph-bolt" d="M55 0 L46 64 L66 60 L50 138" />
          </svg>
          <div className="ph-gap" aria-hidden="true" />

          {/* plinth */}
          <div className="ph-plinth" aria-hidden="true">
            <div className="ph-plinth-glow" />
            <div className="ph-plinth-body" />
            <div className="ph-plinth-top" />
          </div>

          <div className="ph-keylight" aria-hidden="true" />
          <div ref={mascotRef} className="ph-mascot">
            <Image
              src="/mascot-tower.png"
              alt="The ⚡ZAPP mascot before the Wardenclyffe tower"
              width={596}
              height={980}
              priority
              className="ph-mascot-img"
            />
          </div>
          <div className="ph-fillshadow" aria-hidden="true" />
        </div>
      </div>

      <div className="ph-scrollcue" aria-hidden="true">
        Descend <span />
      </div>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .ph-hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;
    background:
      radial-gradient(70% 60% at 72% 30%, rgba(232,181,71,.10), transparent 60%),
      radial-gradient(120% 100% at 60% 18%, #2c2114 0%, #181109 46%, #0b0704 100%)}
  .ph-rays{position:absolute;inset:-20% -10%;z-index:1;pointer-events:none;opacity:.55;mix-blend-mode:screen;
    background:conic-gradient(from 196deg at 70% 16%,
      transparent 0deg, rgba(232,181,71,.10) 5deg, transparent 11deg,
      rgba(244,232,208,.13) 18deg, transparent 24deg, rgba(232,181,71,.09) 32deg,
      transparent 42deg, rgba(232,181,71,.12) 52deg, transparent 60deg,
      rgba(244,232,208,.08) 70deg, transparent 80deg);
    animation:phRay 26s ease-in-out infinite alternate}
  @keyframes phRay{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
  .ph-haze{position:absolute;left:0;right:0;bottom:0;height:55%;z-index:2;pointer-events:none;
    background:linear-gradient(180deg,transparent, rgba(11,7,4,.55) 70%, rgba(11,7,4,.85))}
  .ph-candle{position:fixed;width:540px;height:540px;border-radius:50%;z-index:1;pointer-events:none;
    transform:translate(-50%,-50%);left:60%;top:30%;mix-blend-mode:screen;opacity:.45;
    background:radial-gradient(circle, rgba(232,181,71,.16), rgba(217,119,6,.06) 38%, transparent 70%)}
  .ph-motes{position:absolute;inset:0;z-index:4;pointer-events:none}
  .ph-numeral{position:absolute;left:2%;top:50%;transform:translateY(-50%);z-index:1;
    font-family:var(--font-cormorant),Georgia,serif;font-weight:800;
    font-size:clamp(16rem,40vw,40rem);line-height:.74;color:transparent;
    -webkit-text-stroke:1.5px rgba(232,181,71,.14);text-shadow:0 0 120px rgba(232,181,71,.06);
    pointer-events:none;user-select:none}
  .ph-inner{position:relative;z-index:5;max-width:1280px;width:100%;margin:0 auto;
    padding:130px 40px 90px;display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:center}
  @media(max-width:920px){.ph-inner{grid-template-columns:1fr;gap:10px;text-align:center;padding-top:110px}}
  .ph-copy{position:relative;z-index:6}
  .ph-copy>*{opacity:0;transform:translateY(28px);animation:phIn 1.1s cubic-bezier(.16,1,.3,1) forwards}
  .ph-copy>*:nth-child(1){animation-delay:.2s}.ph-copy>*:nth-child(2){animation-delay:.36s}
  .ph-copy>*:nth-child(3){animation-delay:.54s}.ph-copy>*:nth-child(4){animation-delay:.72s}
  @keyframes phIn{to{opacity:1;transform:none}}
  .ph-tag{font-family:var(--font-jetbrains),monospace;font-size:.78rem;letter-spacing:.46em;
    text-transform:uppercase;color:#E8B547;margin-bottom:24px;display:inline-block}
  .ph-h1{font-family:var(--font-cormorant),Georgia,serif;font-weight:600;
    font-size:clamp(3.6rem,9vw,7rem);line-height:.94;color:#F4E8D0;letter-spacing:-.015em;
    margin-bottom:30px;text-shadow:0 0 70px rgba(232,181,71,.22)}
  .ph-h1 em{font-style:italic;color:#E8B547}
  .ph-quote{font-family:var(--font-cormorant),Georgia,serif;font-style:italic;
    font-size:clamp(1.2rem,2vw,1.55rem);color:#C9A878;line-height:1.5;max-width:30ch;
    border-left:2px solid rgba(232,181,71,.45);padding-left:22px;margin-bottom:32px}
  @media(max-width:920px){.ph-quote{border-left:none;border-top:2px solid rgba(232,181,71,.4);
    padding:18px 0 0;margin-inline:auto;max-width:32ch}}
  .ph-quote cite{display:block;font-style:normal;font-family:var(--font-jetbrains),monospace;
    font-size:.74rem;letter-spacing:.22em;text-transform:uppercase;color:#C9A878;opacity:.7;margin-top:16px}
  .ph-slogan{font-family:var(--font-cormorant),Georgia,serif;font-size:1.35rem;font-weight:600;
    color:#E8B547;letter-spacing:.01em}
  .ph-stage{position:relative;height:620px;display:flex;align-items:flex-end;justify-content:center;
    opacity:0;animation:phStage 1.7s cubic-bezier(.16,1,.3,1) .4s forwards}
  @media(max-width:920px){.ph-stage{height:480px;margin-top:24px}}
  @keyframes phStage{from{opacity:0;transform:translateY(46px) scale(.96)}to{opacity:1;transform:none}}
  .ph-archframe{position:absolute;inset:0;z-index:1;pointer-events:none}
  .ph-archframe path{fill:none;stroke:rgba(232,181,71,.28);stroke-width:1.2;vector-effect:non-scaling-stroke}
  .ph-archframe .ph-corner{stroke:rgba(232,181,71,.5);stroke-width:1.4}
  .ph-tower-wrap{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);height:92%;z-index:2;
    transition:transform .4s cubic-bezier(.16,1,.3,1)}
  .ph-tower{height:100%;filter:drop-shadow(0 0 26px rgba(232,181,71,.20))}
  .ph-tower path,.ph-tower line,.ph-tower polyline,.ph-tower ellipse,.ph-tower circle{
    stroke:#E8B547;fill:none;stroke-width:1.1;vector-effect:non-scaling-stroke;opacity:.6}
  .ph-tower .ph-orbfill{fill:url(#phOrb);stroke:none;opacity:1}
  .ph-anno{font-family:var(--font-jetbrains),monospace;font-size:6.5px;fill:#C9A878;opacity:.55;stroke:none}
  .ph-crown{transform-origin:center;animation:phCrown 4s ease-in-out infinite}
  @keyframes phCrown{0%,100%{opacity:.9}50%{opacity:1;filter:drop-shadow(0 0 10px #e8b547)}}
  .ph-reach{position:absolute;z-index:4;top:-2%;left:50%;transform:translateX(-50%);width:110px;height:18%;pointer-events:none}
  .ph-bolt{stroke:#fff3d0;stroke-width:2.6;fill:none;vector-effect:non-scaling-stroke;
    filter:drop-shadow(0 0 7px rgba(232,181,71,.95));
    stroke-dasharray:300;stroke-dashoffset:300;animation:phStrike 4.6s ease-in-out infinite}
  @keyframes phStrike{0%,52%{stroke-dashoffset:300;opacity:0}58%{opacity:1}
    70%{stroke-dashoffset:0;opacity:1}84%{opacity:1}92%{opacity:0;stroke-dashoffset:0}100%{opacity:0}}
  .ph-gap{position:absolute;z-index:4;left:50%;top:9%;transform:translate(-50%,-50%);width:15px;height:15px;
    border-radius:50%;background:radial-gradient(circle,#fff3d0,rgba(232,181,71,.2) 60%,transparent);
    box-shadow:0 0 24px 6px rgba(232,181,71,.55);animation:phGap 4.6s ease-in-out infinite}
  @keyframes phGap{0%,55%{opacity:0;transform:translate(-50%,-50%) scale(.5)}
    70%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}86%{opacity:.8}100%{opacity:0}}
  .ph-plinth{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);width:340px;height:90px;z-index:3}
  @media(max-width:920px){.ph-plinth{width:260px;height:70px}}
  .ph-plinth-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:78%;height:34px;border-radius:50%;
    background:linear-gradient(180deg,#3a2c1a,#241a10);box-shadow:0 8px 20px rgba(0,0,0,.6),inset 0 2px 6px rgba(244,232,208,.12)}
  .ph-plinth-body{position:absolute;top:18px;left:50%;transform:translateX(-50%);width:62%;height:64px;
    background:linear-gradient(90deg,#1c140c,#3a2c1a 30%,#2a2012 55%,#140e08);
    clip-path:polygon(6% 0,94% 0,100% 100%,0 100%);box-shadow:inset 0 -10px 22px rgba(0,0,0,.6)}
  .ph-plinth-glow{position:absolute;top:6px;left:50%;transform:translateX(-50%);width:80%;height:30px;border-radius:50%;
    background:radial-gradient(circle,rgba(232,181,71,.4),transparent 70%);filter:blur(6px)}
  .ph-mascot{position:relative;z-index:4;height:74%;margin-bottom:64px;
    transition:transform .4s cubic-bezier(.16,1,.3,1);
    filter:drop-shadow(-26px 10px 30px rgba(0,0,0,.62)) drop-shadow(16px -8px 34px rgba(232,181,71,.22))}
  @media(max-width:920px){.ph-mascot{margin-bottom:54px}}
  .ph-mascot-img{height:100%!important;width:auto!important;display:block}
  .ph-keylight{position:absolute;z-index:3;top:2%;right:14%;width:64%;height:74%;pointer-events:none;
    mix-blend-mode:screen;background:radial-gradient(circle at 72% 22%, rgba(244,232,208,.4), transparent 58%)}
  .ph-fillshadow{position:absolute;z-index:5;bottom:60px;left:14%;width:50%;height:60%;pointer-events:none;
    mix-blend-mode:multiply;background:radial-gradient(circle at 30% 80%, rgba(122,46,46,.45), transparent 60%)}
  .ph-scrollcue{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:6;
    font-family:var(--font-jetbrains),monospace;font-size:.68rem;letter-spacing:.32em;text-transform:uppercase;
    color:#C9A878;opacity:.6;display:flex;flex-direction:column;align-items:center;gap:8px}
  .ph-scrollcue span{width:1px;height:32px;background:linear-gradient(#E8B547,transparent);
    animation:phCue 2s ease-in-out infinite}
  @keyframes phCue{0%,100%{opacity:.3;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}
  @media(prefers-reduced-motion:reduce){
    .ph-rays,.ph-crown,.ph-bolt,.ph-gap,.ph-scrollcue span{animation:none!important}
    .ph-copy>*,.ph-stage{opacity:1!important;transform:none!important;animation:none!important}
    .ph-candle{display:none}
  }
`;
