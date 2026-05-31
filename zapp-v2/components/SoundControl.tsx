"use client";

import { useState, useRef, useCallback } from "react";

export function SoundControl() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const toggle = useCallback(() => {
    if (!playing) {
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);
      master.connect(ctx.destination);
      gainRef.current = master;

      // Low base hum — Tesla coil fundamental
      const base = ctx.createOscillator();
      base.type = "sawtooth";
      base.frequency.value = 60;
      const baseGain = ctx.createGain();
      baseGain.gain.value = 0.4;
      base.connect(baseGain);
      baseGain.connect(master);
      base.start();

      // Mid harmonic
      const mid = ctx.createOscillator();
      mid.type = "sine";
      mid.frequency.value = 180;
      const midGain = ctx.createGain();
      midGain.gain.value = 0.2;
      mid.connect(midGain);
      midGain.connect(master);
      mid.start();

      // High shimmer — electrical crackle texture
      const shimmer = ctx.createOscillator();
      shimmer.type = "sine";
      shimmer.frequency.value = 540;
      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.05;
      shimmer.connect(shimmerGain);
      shimmerGain.connect(master);
      shimmer.start();

      // Subtle LFO pulse on the shimmer (breathing feel)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(shimmerGain.gain);
      lfo.start();

      setPlaying(true);
    } else {
      const gain = gainRef.current;
      const ctx = ctxRef.current;
      if (gain && ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => { ctx.close(); setPlaying(false); }, 900);
      }
    }
  }, [playing]);

  return (
    <button
      type="button"
      onClick={toggle}
      title={playing ? "Silence the frequency" : "Tune in · Tesla coil ambient"}
      className="fixed bottom-6 right-6 z-[85] flex h-11 w-11 items-center justify-center rounded-full border border-present-yellow/30 bg-black/70 font-mono text-base text-present-yellow backdrop-blur transition-all duration-300 hover:border-present-yellow hover:shadow-[0_0_24px_rgba(255,215,0,0.5)] hover:scale-110"
    >
      {playing ? "⚡" : "♩"}
    </button>
  );
}
