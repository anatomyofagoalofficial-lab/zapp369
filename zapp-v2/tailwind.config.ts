import type { Config } from "tailwindcss";

/**
 * ⚡ZAPP design system.
 * Three era palettes (Past / Present / Future) carry the chakra progression
 * from root-red shadows to crown-violet light — felt, never labeled on the site.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── PAST · "The Tower" — sepia, candlelight, blueprint paper ──
        past: {
          sepia: "#C9A878",
          ink: "#1A1410",
          cream: "#F4E8D0",
          gold: "#E8B547", // candle gold
          root: "#7A2E2E", // root red — deepest shadow (never labeled)
          sacral: "#D97706", // sacral orange
          solar: "#F59E0B", // solar-plexus yellow — highlights
        },
        // ── PRESENT · "The Current" — the instrument is on ──
        present: {
          navy: "#0F1729",
          black: "#0A0A0A", // screen black
          white: "#F9FAFB", // electric white
          yellow: "#FFD700", // ⚡ZAPP yellow
          blue: "#3B82F6", // signal blue
          green: "#10B981", // heart green — success whispers
        },
        // ── FUTURE · "The Network" — cosmic, monumental, alien-tech ──
        future: {
          black: "#02020A", // cosmic black
          violet: "#1A0A2E", // deep violet
          white: "#F9F9FF", // starlight white
          gold: "#FFD700", // solar gold
          cyan: "#22D3EE", // electric cyan
          indigo: "#4338CA", // third-eye indigo
          crown: "#9D4EDD", // crown violet — the summit
        },
        // ── Brand constants ──
        brand: {
          gold: "#FFD700",
          ink: "#0A0A0A",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Architectural 3·6·9 markers (Brâncuși Endless Column logic)
        marker: [
          "clamp(8rem, 20vw, 18rem)",
          { lineHeight: "1", letterSpacing: "-0.02em" },
        ],
      },
      letterSpacing: {
        ritual: "0.35em", // spaced small-caps labels like "3 · 6 · 9"
      },
      maxWidth: {
        reading: "68ch",
      },
      transitionTimingFunction: {
        reverent: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "100%": { transform: "translateY(-40px) translateX(20px)" },
        },
        "light-streak": {
          "0%": { transform: "translateX(-120%) skewX(-12deg)", opacity: "0" },
          "50%": { opacity: "0.6" },
          "100%": { transform: "translateX(120%) skewX(-12deg)", opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        drift: "drift 60s ease-in-out infinite alternate",
        "light-streak": "light-streak 600ms ease-in-out",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        reveal: "reveal 700ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
