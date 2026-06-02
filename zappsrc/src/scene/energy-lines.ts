import * as THREE from 'three';
import { DIMENSIONS } from './dimensions.config';

export type EnergyLine = { line: THREE.Line; material: THREE.LineDashedMaterial; id: string };

// Curved dashed beams streaming from the ⚡ZAPP core out to each dimension.
export function buildEnergyLines(scene: THREE.Scene): EnergyLine[] {
  const out: EnergyLine[] = [];
  DIMENSIONS.forEach(dim => {
    const start = new THREE.Vector3(0, 0, 0);
    const end = dim.position.clone();
    const mid = start.clone().lerp(end, 0.5); mid.y += 10; // organic upward arc
    const pts = new THREE.QuadraticBezierCurve3(start, mid, end).getPoints(60);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineDashedMaterial({ color: new THREE.Color(dim.color), dashSize: 0.9, gapSize: 1.3, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geo, material);
    line.computeLineDistances();
    scene.add(line);
    out.push({ line, material, id: dim.id });
  });
  return out;
}

export function animateEnergyLines(lines: EnergyLine[], t: number, hoveredId: string | null) {
  lines.forEach(({ material, id }, i) => {
    const hot = id === hoveredId;
    material.dashSize = (hot ? 1.6 : 0.9) + 0.3 * Math.sin(t * 2 + i);
    material.opacity = hot ? 1 : 0.45 + 0.3 * Math.sin(t * 1.5 + i * 2);
  });
}
