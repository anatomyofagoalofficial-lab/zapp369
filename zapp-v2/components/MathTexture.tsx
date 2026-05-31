import { cn } from "@/lib/utils";

type Era = "past" | "present" | "future" | "home";

/**
 * The faint mathematics background layer — the visual DNA tying all eras
 * together. Real notation, era-specific, drifted across the surface at low
 * opacity. Never labeled, never explained. Decorative only (aria-hidden).
 *
 * `era`  picks the equations + font feel.
 * `tone` picks the color (auto: Past renders dark-on-light, others light-on-dark;
 *         override with tone="onDark" to place Past equations on a dark surface,
 *         e.g. the home-page doorway cards).
 */
const EQUATIONS: Record<Era, string[]> = {
  // Classical physics, Tesla-era engineering
  past: [
    "∇·E = ρ/ε₀",
    "∇×B = μ₀J + μ₀ε₀ ∂E/∂t",
    "ω = 1/√(LC)",
    "ε = −dΦ/dt",
    "f = 1/(2π√(LC))",
    "∮ E·dl = −dΦ/dt",
  ],
  // Cryptography, blockchain, live computation
  present: [
    "H(x) → y",
    "y = k / x",
    "σ = (r, s)",
    "Ed25519",
    "hₙ = H(hₙ₋₁)",
    "SHA-256",
  ],
  // Cosmic, theoretical, abstract
  future: ["E = mc²", "rₛ = 2GM/c²", "|ψ⟩", "⟨ψ|ψ⟩ = 1", "∞", "3 · 6 · 9 ∞"],
  // A blend, for the foyer
  home: [
    "E = mc²",
    "ω = 1/√(LC)",
    "H(x) → y",
    "3 · 6 · 9 ∞",
    "∞",
    "∇·E = ρ/ε₀",
    "|ψ⟩",
  ],
};

/** Deterministic scatter — fixed positions keep SSR + client markup identical. */
const POSITIONS = [
  { top: "8%", left: "6%", rotate: -8, size: "1.1rem" },
  { top: "18%", left: "72%", rotate: 6, size: "0.9rem" },
  { top: "32%", left: "22%", rotate: -3, size: "1.3rem" },
  { top: "46%", left: "84%", rotate: 10, size: "1rem" },
  { top: "58%", left: "10%", rotate: 4, size: "0.95rem" },
  { top: "67%", left: "55%", rotate: -6, size: "1.2rem" },
  { top: "78%", left: "30%", rotate: 8, size: "0.9rem" },
  { top: "86%", left: "78%", rotate: -4, size: "1.05rem" },
  { top: "12%", left: "44%", rotate: 3, size: "0.85rem" },
  { top: "40%", left: "48%", rotate: -10, size: "1rem" },
  { top: "70%", left: "88%", rotate: 5, size: "0.9rem" },
  { top: "92%", left: "18%", rotate: -7, size: "0.95rem" },
];

export function MathTexture({
  era = "home",
  tone,
  className,
}: {
  era?: Era;
  tone?: "onDark" | "onLight";
  className?: string;
}) {
  const eqs = EQUATIONS[era];
  const resolvedTone = tone ?? (era === "past" ? "onLight" : "onDark");
  const colorClass =
    resolvedTone === "onLight"
      ? "text-past-ink opacity-[0.08]"
      : "text-white opacity-[0.06]";
  const fontClass = era === "present" ? "font-mono" : "font-serif";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 select-none overflow-hidden",
        colorClass,
        className,
      )}
    >
      {POSITIONS.map((p, i) => (
        <span
          key={i}
          className={cn("absolute whitespace-nowrap", fontClass)}
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {eqs[i % eqs.length]}
        </span>
      ))}
    </div>
  );
}
