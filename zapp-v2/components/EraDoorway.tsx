import { ArrowUpRight } from "lucide-react";
import { MathTexture } from "./MathTexture";
import { TransitionLink } from "./TransitionLink";
import { cn } from "@/lib/utils";

type EraDoorwayProps = {
  era: {
    key: string;
    number: string;
    title: string;
    subtitle: string;
    name: string;
    href: string;
    accent: string;
  };
};

/**
 * One of the three home-page doorways. The architectural number (3 · 6 · 9) is
 * the hero of the card (Brâncuși Endless Column logic). Each card carries its
 * era's own math flavor and glows in its accent on hover.
 */
const STYLES: Record<
  string,
  {
    gradient: string;
    number: string;
    glow: string;
    border: string;
    mathEra: "past" | "present" | "future";
  }
> = {
  past: {
    gradient: "from-[#1A1410] via-[#3a2c1e] to-[#1A1410]",
    number: "text-past-gold",
    glow: "group-hover:shadow-[0_0_90px_-25px_#E8B547]",
    border: "group-hover:border-past-gold/60",
    mathEra: "past",
  },
  present: {
    gradient: "from-present-navy via-[#0a1326] to-present-black",
    number: "text-present-yellow",
    glow: "group-hover:shadow-[0_0_90px_-25px_#FFD700]",
    border: "group-hover:border-present-yellow/60",
    mathEra: "present",
  },
  future: {
    gradient: "from-future-violet via-[#0c0518] to-future-black",
    number: "text-future-crown",
    glow: "group-hover:shadow-[0_0_90px_-25px_#9D4EDD]",
    border: "group-hover:border-future-crown/60",
    mathEra: "future",
  },
};

export function EraDoorway({ era }: EraDoorwayProps) {
  const s = STYLES[era.key];

  return (
    <TransitionLink
      href={era.href}
      aria-label={`Enter ${era.title}, ${era.name}`}
      className={cn(
        "group relative flex min-h-[clamp(26rem,55vh,40rem)] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b p-8 transition-all duration-500 ease-reverent hover:-translate-y-1",
        s.gradient,
        s.glow,
        s.border,
      )}
    >
      <MathTexture era={s.mathEra} tone="onDark" />

      {/* Top: ritual kicker + the architectural number */}
      <div className="relative">
        <p className="font-mono text-xs uppercase tracking-ritual text-white/50">
          {era.number} · {era.title}
        </p>
        <span
          className={cn(
            "mt-2 block font-serif leading-none transition-transform duration-500 ease-reverent group-hover:scale-105",
            s.number,
          )}
          style={{ fontSize: "clamp(7rem, 13vw, 11rem)" }}
        >
          {era.number}
        </span>
      </div>

      {/* TODO(mascot): when era-specific mascot art lands in /public
          (mascot-tower / mascot-network / mascot-future), drop the
          monumental mascot image here, framed against this card's gradient. */}

      {/* Bottom: title, subtitle, enter affordance */}
      <div className="relative">
        <h3 className="font-serif text-3xl font-semibold text-white">{era.title}</h3>
        <p className="mt-1 font-serif text-lg italic text-white/60">{era.subtitle}</p>
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-mono text-xs uppercase tracking-ritual text-white/40">
            {era.name}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-white/70 transition-colors group-hover:text-white">
            Enter
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </TransitionLink>
  );
}
