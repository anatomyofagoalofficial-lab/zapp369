import * as THREE from 'three';

// soft radial glow (procedural — no external /glow.png needed)
function softGlow(): THREE.Texture {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
  const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.4, 'rgba(255,255,255,.45)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function buildZappCore(scene: THREE.Scene) {
  const group = new THREE.Group();
  group.scale.setScalar(1.25); // a compact electric jewel — sits cleanly behind the wordmark

  // 1. Inner crystalline core — sharp, bright, white-gold
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.MeshBasicMaterial({ color: 0xFFF6D8, wireframe: true, transparent: true, opacity: 0.95 }),
  );
  group.add(core);

  // 2. Counter-rotating outer cage — violet sacred geometry
  const cage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.18, 0),
    new THREE.MeshBasicMaterial({ color: 0xC9A2FF, wireframe: true, transparent: true, opacity: 0.5 }),
  );
  group.add(cage);

  // 2b. Tilted golden halo ring — a single elegant orbit
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.012, 8, 110),
    new THREE.MeshBasicMaterial({ color: 0xFFD27A, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  ring.rotation.x = Math.PI * 0.42;
  group.add(ring);

  // (No glow sprite — the wireframe + bloom give a clean halo, no yellow bubble.)

  // 4. Crackling Tesla electricity — the ⚡ZAPP signature
  const arcs = buildLightningArcs();
  group.add(arcs);

  scene.add(group);

  return {
    group,
    update(t: number) {
      core.rotation.x = t * 0.5; core.rotation.y = t * 0.3;
      cage.rotation.x = -t * 0.2; cage.rotation.z = t * 0.15;
      ring.rotation.z = t * 0.3;
      animateArcs(arcs, t);
    },
  };
}

function buildLightningArcs(): THREE.Group {
  const arcs = new THREE.Group();
  const ARCS = 12, SEG = 11;
  for (let i = 0; i < ARCS; i++) {
    const points: THREE.Vector3[] = [];
    const angle = (i / ARCS) * Math.PI * 2;
    for (let j = 0; j <= SEG; j++) {
      const r = 0.5 + (j / SEG) * 1.15 + (Math.random() - 0.5) * 0.24;     // jagged bolt
      points.push(new THREE.Vector3(
        Math.cos(angle) * r + (Math.random() - 0.5) * 0.2,
        (j / SEG - 0.5) * 0.5 + (Math.random() - 0.5) * 0.12,
        Math.sin(angle) * r + (Math.random() - 0.5) * 0.2,
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xDCEEFF, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    arcs.add(new THREE.Line(geo, mat));
  }
  return arcs;
}

function animateArcs(arcs: THREE.Group, t: number) {
  arcs.children.forEach((arc, i) => {
    const line = arc as THREE.Line;
    // each bolt flickers independently — a live Tesla-coil crackle
    (line.material as THREE.LineBasicMaterial).opacity = Math.random() > 0.62 ? 0.95 : 0.12;
    line.rotation.y = t * (0.12 + i * 0.04);
  });
}
