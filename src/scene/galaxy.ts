import * as THREE from 'three';
import { buildStarMaterial } from './galaxy-material';

// soft round sprite for the background star layers (kept small — not bubbles)
function roundTex(): THREE.Texture {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!;
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.45, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}
const TEX = roundTex();

// 12k-particle tilted spiral galaxy with an EMPTY core (logo lives in the hole).
// Each particle is a sharp twinkling star (diffraction spikes via shader).
export function buildGalaxy(scene: THREE.Scene): { points: THREE.Points; material: THREE.ShaderMaterial } {
  const N = 12000, INNER = 12, OUTER = 45;
  const positions = new Float32Array(N * 3), colors = new Float32Array(N * 3), sizes = new Float32Array(N), twinkles = new Float32Array(N);
  const cGold = new THREE.Color('#F4D27A'), cPurple = new THREE.Color('#9D6CFF'), cWhite = new THREE.Color('#FFFFFF');
  for (let i = 0; i < N; i++) {
    const arm = i % 3;
    const armAngle = (arm / 3) * Math.PI * 2;
    const t = Math.pow(Math.random(), 0.6);
    const distance = INNER + t * (OUTER - INNER);   // never closer than INNER → clear core
    const angle = armAngle + distance * 0.25 + (Math.random() - 0.5) * 0.5;
    positions[i * 3] = Math.cos(angle) * distance;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
    positions[i * 3 + 2] = Math.sin(angle) * distance;
    const mix = new THREE.Color().lerpColors(cGold, cPurple, (distance - INNER) / (OUTER - INNER));
    if (Math.random() > 0.95) mix.copy(cWhite);
    colors[i * 3] = mix.r; colors[i * 3 + 1] = mix.g; colors[i * 3 + 2] = mix.b;
    sizes[i] = Math.random() < 0.92 ? 1.0 + Math.random() * 1.5 : 4.0 + Math.random() * 3.0; // few bright anchors
    twinkles[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aTwinkle', new THREE.BufferAttribute(twinkles, 1));
  const material = buildStarMaterial();
  const galaxy = new THREE.Points(geo, material);
  galaxy.position.z = -52;             // backdrop, behind the cards
  galaxy.rotation.z = Math.PI * -0.05; // slight roll
  scene.add(galaxy);
  return { points: galaxy, material };
}

// three parallax star layers for infinite depth
export function buildStarLayers(scene: THREE.Scene): THREE.Points[] {
  const make = (count: number, range: number, size: number, color: number, opacity: number) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * range;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const layer = new THREE.Points(geo, new THREE.PointsMaterial({ map: TEX, color, size, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
    scene.add(layer); return layer;
  };
  return [
    make(3000, 600, 0.7, 0xCCCCFF, 0.55),
    make(1500, 320, 1.1, 0xFFFFFF, 0.75),
    make(400, 130, 1.7, 0xFFE890, 0.9),
  ];
}
export function animateStarLayers(layers: THREE.Points[], t: number) {
  if (layers[0]) layers[0].rotation.y = t * 0.005;
  if (layers[1]) layers[1].rotation.y = t * 0.01;
  if (layers[2]) layers[2].rotation.y = t * 0.02;
}
