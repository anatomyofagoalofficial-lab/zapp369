export const CA = 'Ab16ce5SDbibTbXevxHLpqUnUvu9tNkkpaJcSDvCpump';
export const DEX_API = 'https://api.dexscreener.com/latest/dex/tokens/' + CA;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  window.matchMedia('(hover: none)').matches;
