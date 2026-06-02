import * as THREE from 'three';

// soft round sprite so particles are smooth, never blocky squares
function roundTex(): THREE.Texture {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!;
  const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.45, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}
const TEX = roundTex();

// 8000-particle tilted spiral galaxy — 3 arms (3·6·9), gold core → purple rim
export function buildGalaxy(scene: THREE.Scene): THREE.Points {
  const N = 8000;
  const positions = new Float32Array(N * 3), colors = new Float32Array(N * 3);
  const cGold = new THREE.Color('#F4D27A'), cPurple = new THREE.Color('#9D6CFF'), cWhite = new THREE.Color('#FFFFFF');
  for (let i = 0; i < N; i++) {
    const arm = i % 3;
    const armAngle = (arm / 3) * Math.PI * 2;
    const distance = Math.pow(Math.random(), 0.7) * 40;
    const angle = armAngle + distance * 0.3 + (Math.random() - 0.5) * 0.6;
    positions[i * 3] = Math.cos(angle) * distance;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4 * (1 - distance / 40);
    positions[i * 3 + 2] = Math.sin(angle) * distance;
    const mix = new THREE.Color().lerpColors(cGold, cPurple, distance / 40);
    if (Math.random() > 0.95) mix.copy(cWhite);
    colors[i * 3] = mix.r; colors[i * 3 + 1] = mix.g; colors[i * 3 + 2] = mix.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({ map: TEX, size: 1.1, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
  const galaxy = new THREE.Points(geo, mat);
  galaxy.position.z = -52;             // sits behind the cards as a backdrop
  galaxy.rotation.z = Math.PI * -0.08; // slight roll
  scene.add(galaxy);
  return galaxy;
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
    make(3000, 600, 0.8, 0xCCCCFF, 0.6),  // far
    make(1500, 320, 1.3, 0xFFFFFF, 0.8),  // mid
    make(400, 130, 2.0, 0xFFE890, 0.9),   // near sparkles
  ];
}
export function animateStarLayers(layers: THREE.Points[], t: number) {
  if (layers[0]) layers[0].rotation.y = t * 0.005;
  if (layers[1]) layers[1].rotation.y = t * 0.01;
  if (layers[2]) layers[2].rotation.y = t * 0.02;
}
