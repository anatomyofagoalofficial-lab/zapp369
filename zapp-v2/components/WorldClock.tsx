"use client";

import { useEffect, useState } from "react";

/** Cities spanning the globe — the frequency reaches every time zone. */
const CITIES = [
  { city: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { city: "São Paulo", tz: "America/Sao_Paulo", flag: "🇧🇷" },
  { city: "London", tz: "Europe/London", flag: "🇬🇧" },
  { city: "Cluj-Napoca", tz: "Europe/Bucharest", flag: "🇷🇴" },
  { city: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  { city: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
] as const;

function timeIn(tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

/**
 * Live world clock — every city ticks in its own time zone, once a second.
 * Renders placeholders until mounted to avoid SSR/client hydration mismatch.
 */
export function WorldClock() {
  const [, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
      {CITIES.map((c) => (
        <div
          key={c.city}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 text-left transition-colors hover:border-future-cyan/40"
        >
          <p className="font-mono text-[0.7rem] uppercase tracking-wider text-future-white/45">
            <span aria-hidden="true">{c.flag} </span>
            {c.city}
          </p>
          <p className="mt-1 font-mono text-2xl tabular-nums text-future-white">
            {mounted ? timeIn(c.tz) : "--:--:--"}
          </p>
        </div>
      ))}
    </div>
  );
}
