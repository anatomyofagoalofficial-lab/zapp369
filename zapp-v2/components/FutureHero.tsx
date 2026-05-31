"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ⚡ZAPP — Future hero · "The Network".
 * A monument. The mascot stands small at the summit of a tall plinth, with
 * light branching up behind him like a planetary network (Gaudí biomimicry —
 * river deltas / neurons, never sharp zigzags). His smallness is on purpose:
 * it signals the magnitude of the network behind him. Cosmic black + violet +
 * electric cyan + gold, a quiet star-field, reverent and expansive. Crisp
 * mascot (quality 100), gentle parallax, reduced-motion safe.
 */
export function FutureHero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // quiet star-field
  useEffect(() => {
    if (reduce) return;
    const cv = starsRef.current;
    const hero = heroRef.current;
    if (!cv || !hero) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let W = 0;
    let H = 0;
    type S = { x: number; y: number; r: number; tw: number; ph: number };
    let stars: S[] = [];

    const fit = () => {
      W = cv.width = hero.offsetWidth;
      H = cv.height = hero.offsetHeight;
      const n = W < 760 ? 70 : 130;
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * 0.5 + 0.2,
        ph: Math.random() * Math.PI * 2,
      }));
    };
    fit();

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = 0.4 + Math.sin(t * s.tw + s.ph) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(249,249,255,${Math.max(0, a)})`;
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
      t += 0.02;
      if (running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => fit();
    window.addEventListener("resize", onResize);
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

  // parallax on scroll
  useEffect(() => {
    if (reduce) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (mascotRef.current)
          mascotRef.current.style.transform = `translateY(${y * 0.04}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce]);

  return (
    <section ref={heroRef} className="frh-hero" aria-label="Future — The Network">
      <canvas ref={starsRef} className="frh-stars" aria-hidden="true" />
      <div className="frh-ghost" aria-hidden="true">
        9
      </div>

      <div className="frh-inner">
        <span className="frh-tag">9 · Future · The Network</span>
        <h1 className="frh-h1">When the signal belongs to everyone.</h1>
        <p className="frh-lead">
          Free money. Free energy. No gatekeepers. The revolution Tesla started,
          carried at the speed of light to anyone with a phone, anywhere on this
          planet.
        </p>

        <div className="frh-monument">
          <svg className="frh-branch" viewBox="0 0 320 360" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="frhBeam" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
                <stop offset="55%" stopColor="#22D3EE" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path d="M160 360 C160 300 160 270 160 230" stroke="url(#frhBeam)" strokeWidth="2.2" />
            <path d="M160 230 C125 195 105 175 80 150" stroke="url(#frhBeam)" strokeWidth="1.5" />
            <path d="M160 230 C195 195 215 175 240 150" stroke="url(#frhBeam)" strokeWidth="1.5" />
            <path d="M160 230 C158 190 156 160 150 120" stroke="url(#frhBeam)" strokeWidth="1.5" />
            <path d="M160 230 C166 190 170 160 178 120" stroke="url(#frhBeam)" strokeWidth="1.2" />
            <path d="M80 150 C68 132 60 122 48 108" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M80 150 C88 130 92 120 98 104" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M240 150 C252 132 260 122 272 108" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M240 150 C232 130 228 120 222 104" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M150 120 C142 102 138 92 130 78" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M178 120 C186 102 190 92 198 78" stroke="#22D3EE" strokeOpacity="0.4" strokeWidth="1" />
            {[
              [48, 108],
              [98, 104],
              [272, 108],
              [222, 104],
              [130, 78],
              [198, 78],
            ].map(([x, y], i) => (
              <circle key={i} className="frh-spark" cx={x} cy={y} r="2.6" fill="#FFD700" fillOpacity="0.85" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
            <circle cx="160" cy="230" r="4" fill="#9D4EDD" />
          </svg>

          <div className="frh-plinth" aria-hidden="true">
            <div className="frh-plinth-top" />
            <div className="frh-plinth-shaft" />
          </div>

          <div className="frh-aura" aria-hidden="true" />
          <div ref={mascotRef} className="frh-mascot">
            <Image
              src="/mascot-tower.png"
              alt="The ⚡ZAPP mascot at the summit of the network"
              width={1193}
              height={1962}
              quality={100}
              priority
              sizes="(max-width: 920px) 40vw, 18vw"
              style={{ height: "100%", width: "auto" }}
              className="frh-mascot-img"
            />
          </div>
        </div>

        <span className="frh-cue">↓ Enter the network</span>
      </div>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .frh-hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;
    overflow:hidden;text-align:center;
    background:
      radial-gradient(55% 50% at 50% 20%, rgba(157,78,221,.16), transparent 65%),
      radial-gradient(120% 100% at 50% 100%, #1a0a2e 0%, #0a0518 45%, #02020a 100%)}
  .frh-stars{position:absolute;inset:0;z-index:1;pointer-events:none}
  .frh-ghost{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;
    font-family:var(--font-cormorant),Georgia,serif;font-weight:800;
    font-size:clamp(20rem,46vw,40rem);line-height:.7;color:transparent;
    -webkit-text-stroke:1.5px rgba(157,78,221,.16);pointer-events:none;user-select:none}
  .frh-inner{position:relative;z-index:3;max-width:1000px;width:100%;padding:130px 28px 90px;
    display:flex;flex-direction:column;align-items:center}
  .frh-inner>*{opacity:0;transform:translateY(26px);animation:frhIn 1.1s cubic-bezier(.16,1,.3,1) forwards}
  .frh-inner>*:nth-child(1){animation-delay:.15s}.frh-inner>*:nth-child(2){animation-delay:.3s}
  .frh-inner>*:nth-child(3){animation-delay:.46s}.frh-inner>*:nth-child(4){animation-delay:.62s}
  .frh-inner>*:nth-child(5){animation-delay:.9s}
  @keyframes frhIn{to{opacity:1;transform:none}}
  .frh-tag{font-family:var(--font-jetbrains),monospace;font-size:.78rem;letter-spacing:.42em;
    text-transform:uppercase;color:#FFD700;margin-bottom:22px}
  .frh-h1{font-family:var(--font-cormorant),Georgia,serif;font-weight:600;
    font-size:clamp(3rem,8vw,6.4rem);line-height:1.02;color:#F9F9FF;letter-spacing:-.02em;
    max-width:18ch;text-shadow:0 0 70px rgba(157,78,221,.3)}
  .frh-lead{font-family:var(--font-inter),system-ui,sans-serif;font-size:clamp(1rem,1.4vw,1.18rem);
    line-height:1.7;color:rgba(249,249,255,.75);max-width:54ch;margin-top:26px}
  .frh-monument{position:relative;width:100%;max-width:420px;height:460px;margin-top:30px;
    display:flex;align-items:flex-end;justify-content:center}
  @media(max-width:920px){.frh-monument{height:360px}}
  .frh-branch{position:absolute;bottom:70px;left:50%;transform:translateX(-50%);height:88%;width:auto;
    z-index:1;filter:drop-shadow(0 0 18px rgba(34,211,238,.35))}
  .frh-spark{animation:frhSpark 3.6s ease-in-out infinite}
  @keyframes frhSpark{0%,100%{opacity:.45}50%{opacity:1}}
  .frh-plinth{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:150px;height:120px;z-index:2}
  .frh-plinth-top{position:absolute;top:0;left:50%;transform:translateX(-50%);width:84%;height:22px;border-radius:50%;
    background:linear-gradient(180deg,#2a1840,#160a26);box-shadow:0 6px 16px rgba(0,0,0,.6),inset 0 2px 5px rgba(157,78,221,.3)}
  .frh-plinth-shaft{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:62%;height:108px;
    background:linear-gradient(90deg,#0e0720,#241338 35%,#190d2c 60%,#0a0518);
    clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);box-shadow:inset 0 -10px 22px rgba(0,0,0,.6)}
  .frh-aura{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:62%;height:62%;z-index:2;
    pointer-events:none;mix-blend-mode:screen;
    background:radial-gradient(circle at 50% 50%, rgba(255,215,0,.22), rgba(157,78,221,.16) 45%, transparent 70%)}
  .frh-mascot{position:relative;z-index:3;height:62%;margin-bottom:96px;
    transition:transform .4s cubic-bezier(.16,1,.3,1);
    filter:drop-shadow(0 12px 26px rgba(0,0,0,.7)) drop-shadow(0 0 26px rgba(157,78,221,.3))}
  @media(max-width:920px){.frh-mascot{margin-bottom:84px;height:56%}}
  .frh-mascot-img{display:block;max-width:none}
  .frh-cue{font-family:var(--font-jetbrains),monospace;font-size:.7rem;letter-spacing:.28em;
    text-transform:uppercase;color:rgba(249,249,255,.4);margin-top:18px}
  @media(prefers-reduced-motion:reduce){
    .frh-spark,.frh-inner>*{animation:none!important;opacity:1!important;transform:none!important}
  }
`;
