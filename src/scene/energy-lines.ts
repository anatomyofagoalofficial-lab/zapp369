import * as THREE from 'three';
import { DIMENSIONS } from './dimensions.config';

export type EnergyLine = { line: THREE.Line; material: THREE.LineDashedMaterial; id: string };

const SEG = 60;

// Dashed beams streaming from the ⚡ZAPP core out to each dimension card.
// Endpoints are set later (and on resize) from the cards' on-screen positions.
export function buildEnergyLines(scene: THREE.Scene): EnergyLine[] {
  return DIMENSIONS.map(dim => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3));
    const material = new THREE.LineDashedMaterial({ color: new THREE.Color(dim.color), dashSize: 0.9, gapSize: 1.3, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geo, material);
    scene.add(line);
    return { line, material, id: dim.id };
  });
}

const CORE = new THREE.Vector3(0, 0, 0);
const CLEAR = 18; // begin the beam this far out from the core so it never cuts across the ⚡ZAPP wordmark
export function setEnergyLineEnd(el: EnergyLine, end: THREE.Vector3) {
  const dir = end.clone().sub(CORE).normalize();
  const start = CORE.clone().addScaledVector(dir, CLEAR); // radiate from the core's glow edge, leaving a clean halo around the logo
  const mid = start.clone().lerp(end, 0.5); mid.y += 6; // gentle upward arc
  const pts = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(SEG);
  const pos = el.line.geometry.attributes.position as THREE.BufferAttribute;
  pts.forEach((p, i) => pos.setXYZ(i, p.x, p.y, p.z));
  pos.needsUpdate = true;
  el.line.computeLineDistances();
}

export function animateEnergyLines(lines: EnergyLine[], t: number, hoveredId: string | null, flying = false) {
  lines.forEach(({ material, id }, i) => {
    if (flying) { material.opacity = Math.max(0, material.opacity - 0.06); return; }
    const hot = id === hoveredId;
    material.dashSize = (hot ? 1.6 : 0.9) + 0.3 * Math.sin(t * 2 + i);
    material.opacity = hot ? 1 : 0.4 + 0.25 * Math.sin(t * 1.5 + i * 2);
  });
}
