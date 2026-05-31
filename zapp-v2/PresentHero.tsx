"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ⚡ZAPP — Present hero · "The Current".
 * The instrument is on. The mascot stands grounded at the centre of a living
 * node-network (Brâncuší pedestal logic), a soft ⚡ZAPP-gold glow around him,
 * a faint oscilloscope signal tracing across the panel. Clean, contemporary,
 * charged — navy + electric cyan + gold. Crisp mascot (quality 100), parallax
 * + mouse reactivity, reduced-motion safe.
 */
export function PresentHero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLCanvasElement>(null);

  // oscilloscope signal line
  useEffect(() => {
    if (reduce) return;
    const cv = scopeRef.current;
    const hero = heroRef.current;
    if (!cv || !hero) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let W = 0;
    let H = 0;
    let t = 0;

    const fit = () => {
      W = cv.width = hero.offsetWidth;
      H = cv.height = hero.offsetHeight;
    };
    fit();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      const midY = H * 0.62;
      for (let x = 0; x <= W; x += 4) {
        const k = x / W;
        const env = Math.sin(k * Math.PI); // fade at edges
        const y =
          midY +
          Math.sin(k * 18 + t) * 22 * env +
          Math.sin(k * 47 - t * 1.7) * 8 * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(59,130,246,0.35)";
      ctx.lineWidth = 1.4;
      ctx.shadowColor = "#22D3EE";
      ctx.shadowBlur = 10;
      ctx.stroke();
      t += 0.03;
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

  // mouse reactivity
  useEffect(() => {
    if (reduce) return;
    const hero = heroRef.current;
    if (!hero || !window.matchMedia("(pointer:fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      if (mascotRef.current)
        mascotRef.current.style.transform = `translate3d(${dx * -10}px, ${dy * -6}px, 0)`;
      if (netRef.current)
        netRef.current.style.transform = `translate3d(${dx * 14}px, ${dy * 10}px, 0)`;
    };
    const onLeave = () => {
      if (mascotRef.current) mascotRef.current.style.transform = "";
      if (netRef.current) netRef.current.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  return (
    <section ref={heroRef} className="prh-hero" aria-label="Present — The Current">
      <canvas ref={scopeRef} className="prh-scope" aria-hidden="true" />

      <div className="prh-inner">
        <div className="prh-copy">
          <span className="prh-tag">6 · Present · The Current</span>
          <span className="prh-sub">Solana · May 2026 · live now</span>
          <h1 className="prh-h1">The instrument is on.</h1>
          <p className="prh-lead">
            ⚡ZAPP is real, it is live, and the community exists. The frequency is
            transmitting — verifiable, on-chain, owned by no one.
          </p>
          <span className="prh-cue">↓ Read the frequency</span>
        </div>

        <div className="prh-stage">
          <div ref={netRef} className="prh-net" aria-hidden="true">
            <svg viewBox="0 0 320 320" className="prh-netsvg">
              {NODES.map((n, i) =>
                NODES.slice(i + 1).map((m, j) => {
                  const d = Math.hypot(n.x - m.x, n.y - m.y);
                  if (d > 150) return null;
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={n.x}
                      y1={n.y}
                      x2={m.x}
                      y2={m.y}
                      stroke="#3B82F6"
                      strokeOpacity="0.22"
                      strokeWidth="0.8"
                    />
                  );
                }),
              )}
              {NODES.map((n, i) => (
                <circle
                  key={i}
                  className="prh-node"
                  cx={n.x}
                  cy={n.y}
                  r={n.big ? 5 : 3}
                  fill={n.big ? "#FFD700" : "#E8B547"}
                  fillOpacity={n.big ? 1 : 0.7}
                  style={{ animationDelay: `${(i % 6) * 0.4}s` }}
                />
              ))}
            </svg>
          </div>

          <div className="prh-glow" aria-hidden="true" />
          <div ref={mascotRef} className="prh-mascot">
            <Image
              src="/mascot-tower.png"
              alt="The ⚡ZAPP mascot, live on Solana"
              width={1193}
              height={1962}
              quality={100}
              priority
              sizes="(max-width: 920px) 62vw, 30vw"
              style={{ height: "100%", width: "auto" }}
              className="prh-mascot-img"
            />
          </div>
          <div className="prh-pool" aria-hidden="true" />
        </div>
      </div>

      <style>{styles}</style>
    </section>
  );
}

const NODES = [
  { x: 160, y: 70, big: true },
  { x: 70, y: 120 },
  { x: 250, y: 120 },
  { x: 40, y: 210 },
  { x: 280, y: 210 },
  { x: 110, y: 260 },
  { x: 210, y: 260 },
  { x: 160, y: 160, big: true },
];

const styles = `
  .prh-hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;
    background:
      radial-gradient(60% 55% at 70% 35%, rgba(59,130,246,.12), transparent 60%),
      radial-gradient(120% 100% at 50% 10%, #0f1729 0%, #0a0f1e 50%, #060810 100%)}
  .prh-scope{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.9}
  .prh-inner{position:relative;z-index:3;max-width:1280px;width:100%;margin:0 auto;
    padding:130px 40px 90px;display:grid;grid-template-columns:1.05fr .95fr;gap:30px;align-items:center}
  @media(max-width:920px){.prh-inner{grid-template-columns:1fr;gap:14px;text-align:center;padding-top:110px}}
  .prh-copy>*{opacity:0;transform:translateY(26px);animation:prhIn 1s cubic-bezier(.16,1,.3,1) forwards}
  .prh-copy>*:nth-child(1){animation-delay:.15s}.prh-copy>*:nth-child(2){animation-delay:.28s}
  .prh-copy>*:nth-child(3){animation-delay:.42s}.prh-copy>*:nth-child(4){animation-delay:.56s}
  .prh-copy>*:nth-child(5){animation-delay:.72s}
  @keyframes prhIn{to{opacity:1;transform:none}}
  .prh-tag{display:inline-block;font-family:var(--font-jetbrains),monospace;font-size:.78rem;
    letter-spacing:.42em;text-transform:uppercase;color:#FFD700;margin-bottom:10px}
  .prh-sub{display:block;font-family:var(--font-jetbrains),monospace;font-size:.72rem;
    letter-spacing:.3em;text-transform:uppercase;color:rgba(249,250,251,.4);margin-bottom:24px}
  .prh-h1{font-family:var(--font-cormorant),Georgia,serif;font-weight:600;
    font-size:clamp(3rem,7.5vw,5.6rem);line-height:1;color:#F9FAFB;letter-spacing:-.02em;
    margin-bottom:24px;text-shadow:0 0 60px rgba(255,215,0,.18)}
  .prh-lead{font-family:var(--font-inter),system-ui,sans-serif;font-size:clamp(1rem,1.4vw,1.16rem);
    line-height:1.7;color:rgba(249,250,251,.72);max-width:46ch;margin-bottom:28px}
  @media(max-width:920px){.prh-lead{margin-inline:auto}}
  .prh-cue{font-family:var(--font-jetbrains),monospace;font-size:.7rem;letter-spacing:.28em;
    text-transform:uppercase;color:rgba(249,250,251,.4)}
  .prh-stage{position:relative;height:560px;display:flex;align-items:flex-end;justify-content:center;
    opacity:0;animation:prhStage 1.6s cubic-bezier(.16,1,.3,1) .35s forwards}
  @media(max-width:920px){.prh-stage{height:430px;margin-top:20px}}
  @keyframes prhStage{from{opacity:0;transform:translateY(40px) scale(.96)}to{opacity:1;transform:none}}
  .prh-net{position:absolute;top:50%;left:50%;width:480px;height:480px;transform:translate(-50%,-58%);
    z-index:1;transition:transform .4s cubic-bezier(.16,1,.3,1)}
  .prh-netsvg{width:100%;height:100%;filter:drop-shadow(0 0 14px rgba(59,130,246,.25))}
  .prh-node{animation:prhPulse 3.6s ease-in-out infinite}
  @keyframes prhPulse{0%,100%{opacity:.55}50%{opacity:1}}
  .prh-glow{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);width:70%;height:70%;
    z-index:2;pointer-events:none;mix-blend-mode:screen;
    background:radial-gradient(circle at 50% 60%, rgba(255,215,0,.22), rgba(59,130,246,.12) 45%, transparent 70%)}
  .prh-mascot{position:relative;z-index:3;height:78%;margin-bottom:30px;
    transition:transform .4s cubic-bezier(.16,1,.3,1);
    filter:drop-shadow(0 14px 30px rgba(0,0,0,.6)) drop-shadow(0 0 28px rgba(59,130,246,.28))}
  .prh-mascot-img{display:block;max-width:none}
  .prh-pool{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:62%;height:42px;
    border-radius:50%;z-index:2;
    background:radial-gradient(circle, rgba(59,130,246,.3), transparent 70%);filter:blur(8px)}
  @media(prefers-reduced-motion:reduce){
    .prh-node,.prh-copy>*,.prh-stage{animation:none!important;opacity:1!important;transform:none!important}
  }
`;
