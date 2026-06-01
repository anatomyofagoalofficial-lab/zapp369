import { defineConfig } from 'astro/config';

// Static output — Vercel auto-detects Astro and serves /dist.
// Three.js / GSAP / Lenis ship as bundled, tree-shaken client modules.
export default defineConfig({
  site: 'https://zapp369.energy',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // keep the heavy three.js chunk separate so it can be cached
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
            gsap: ['gsap'],
          },
        },
      },
    },
  },
});
