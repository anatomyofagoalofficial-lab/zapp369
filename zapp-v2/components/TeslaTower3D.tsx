"use client";

/**
 * PARKED: the full cinematic Three.js Wardenclyffe tower lives in
 * `TeslaTower3D.full.txt` (next to this file). It's temporarily stubbed out so
 * the production build stays green WITHOUT the `three` dependency. To re-enable:
 *   1) add "three" + "@types/three" to package.json
 *   2) add transpilePackages: ["three"] to next.config.js
 *   3) restore the body from TeslaTower3D.full.txt
 *   4) use <TeslaTower3D /> on the Past page (debug the real Vercel build error)
 *
 * The stub renders nothing, so importing it can never break the build.
 */
export function TeslaTower3D({ className }: { className?: string }) {
  return <div aria-hidden="true" className={className} />;
}
