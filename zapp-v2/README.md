# ⚡ZAPP — v2 website

The official site for **⚡ZAPP**, a community-driven Solana token honoring Nikola
Tesla's unfinished revolution and the 3·6·9 frequency. A mythic, three-act
experience: **Past** (the Tower) → **Present** (the Current) → **Future** (the
Network).

> The brand mark is always **`⚡ZAPP`** — bolt on the left, no space. Render it
> through `components/BrandMark.tsx` so it can never be mistyped.

## Stack

- **Next.js 15** (App Router, TypeScript strict)
- **Tailwind CSS v3**
- **framer-motion** (page transitions + scroll reveals)
- **lucide-react** (icons)
- Fonts via `next/font/google`: Cormorant Garamond, Inter, JetBrains Mono
- Deploys to **Vercel**

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
```

## Deploy (Vercel)

This app lives in the `zapp-v2/` subfolder of the repo. In the Vercel project:

- **Settings → Build & Deployment → Root Directory → `zapp-v2`**
- Recommended: use a **new** Vercel project so the existing v1 site stays live
  until v2 is ready.

No environment variables are required. Live market stats are fetched from
DexScreener's public API server-side and fall back to verified static values if
unavailable (`lib/stats.ts`).

## Routes

| Path | Page |
|------|------|
| `/` | Home — the foyer |
| `/past` | Past — The Tower (sepia / light) |
| `/present` | Present — The Current (live stats) |
| `/future` | Future — The Network (cosmic) |
| `/how-to-buy` | Step-by-step buying guide |
| `/whitepaper` | Full whitepaper + `#honest-words` (MiCA) |
| `/api/stats` | JSON stats endpoint (cached 5 min) |

## Structure

```
app/         routes, layout, template (page transitions), api, robots, sitemap,
             generated icon + social image (opengraph-image / twitter-image)
components/  BrandMark, Header, Footer, MathTexture, Reveal, EraDoorway,
             VerifiedPanel, LiveStat, CopyButton, RiskDisclaimer, PageTransition
lib/         constants.ts (single source of truth), stats.ts, utils.ts
public/      images + whitepaper PDF (see below)
```

All facts, links, and slogans live in **`lib/constants.ts`** — edit there, never
hard-code values in pages.

## Assets

Already wired into the app from the existing repo assets:

- `public/logo.png`, `public/mascot.png` (from `zapp-mascot.png`),
  `public/og-default.jpg` (from `zapp-social-preview.jpg`),
  `public/ZAPP_Whitepaper_369.pdf`
- Favicon: `app/favicon.ico` (the brand icon, auto-detected by Next)

Optional later — era-specific mascot art (`mascot-tower.png`,
`mascot-network.png`, `mascot-future.png`); see the `TODO(mascot)` comments in
`app/past|present|future`.

## Hard rules

No price predictions. No copyrighted IP. No fabricated facts (only what's in
`lib/constants.ts`). No wallet-connect. The full MiCA risk disclosure lives only
on `/whitepaper#honest-words`, with a one-line footer pointer.
