"use client";

import { useEffect, useRef } from "react";

/**
 * A signature ⚡ZAPP touch: a comet of gold energy that trails the cursor and
 * sparks off it — Tesla electricity made into the pointer itself. Pure canvas,
 * no deps, runs only on fine-pointer (mouse) devices, pauses when the tab is
 * hidden, and disables for prefers-reduced-motion. Sits above everything,
 * never blocks clicks.
 */
export function EnergyCursor() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduce) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      cv!.width = Math.floor(window.innerWidth * dpr);
      cv!.height = Math.floor(window.innerHeight * dpr);
      cv!.style.width = window.innerWidth + "px";
      cv!.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    // pointer + smoothed trail
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let px = mx;
    let py = my;
    const trail: { x: number; y: number }[] = [];
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    let moving = false;
    let lastMove = 0;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      moving = true;
      lastMove = performance.now();
      // occasionally fling a spark off the cursor as it moves
      if (Math.abs(mx - px) + Math.abs(my - py) > 6 && sparks.length < 40) {
        const ang = Math.atan2(my - py, mx - px) + (Math.sin(lastMove) * 0.8);
        const spd = 1 + Math.abs(Math.sin(lastMove)) * 2.5;
        sparks.push({
          x: mx,
          y: my,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
        });
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let hidden = document.hidden;
    function onVis() {
      hidden = document.hidden;
    }
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (hidden) return;

      // ease the comet head toward the pointer
      px += (mx - px) * 0.25;
      py += (my - py) * 0.25;
      trail.push({ x: px, y: py });
      if (trail.length > 18) trail.shift();
      if (now - lastMove > 120) moving = false;

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx!.globalCompositeOperation = "lighter";

      // the trailing comet tail (gold → transparent)
      for (let i = 1; i < trail.length; i++) {
        const a = i / trail.length;
        ctx!.beginPath();
        ctx!.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx!.lineTo(trail[i].x, trail[i].y);
        ctx!.strokeStyle = `rgba(255, 215, 0, ${a * 0.5})`;
        ctx!.lineWidth = a * 6;
        ctx!.lineCap = "round";
        ctx!.shadowBlur = 12;
        ctx!.shadowColor = "rgba(255,215,0,0.9)";
        ctx!.stroke();
      }

      // the glowing head
      ctx!.beginPath();
      ctx!.arc(px, py, moving ? 5 : 3, 0, Math.PI * 2);
      ctx!.fillStyle = "rgba(255,240,200,0.95)";
      ctx!.shadowBlur = 20;
      ctx!.shadowColor = "rgba(255,215,0,1)";
      ctx!.fill();

      // sparks
      ctx!.shadowBlur = 8;
      ctx!.shadowColor = "rgba(255,200,80,0.9)";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // slight gravity
        s.life -= 0.03;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 210, 90, ${s.life})`;
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}
