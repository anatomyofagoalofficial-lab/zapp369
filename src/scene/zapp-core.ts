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
  group.scale.setScalar(1.6); // small — sits inside the cleared galaxy core, behind the logo

  // 1. Inner crystalline core — small, sharp, bright
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.6, 1),
    new THREE.MeshBasicMaterial({ color: 0xFFE890, wireframe: true, transparent: true, opacity: 0.9 }),
  );
  group.add(core);

  // 2. Counter-rotating outer cage
  const cage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 0),
    new THREE.MeshBasicMaterial({ color: 0xC896FF, wireframe: true, transparent: true, opacity: 0.4 }),
  );
  group.add(cage);

  // 3. Tight glow sprite — modest, not a giant sun
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: softGlow(), color: 0xFFE890, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.set(1.5, 1.5, 1);
  group.add(glow);

  // 4. Lightning arcs — the ZAPP signature
  const arcs = buildLightningArcs();
  group.add(arcs);

  scene.add(group);

  return {
    group,
    update(t: number) {
      core.rotation.x = t * 0.5; core.rotation.y = t * 0.3;
      cage.rotation.x = -t * 0.2; cage.rotation.z = t * 0.15;
      (glow.material as THREE.SpriteMaterial).opacity = 0.4 + 0.15 * Math.sin(t * 2);
      animateArcs(arcs, t);
    },
  };
}

function buildLightningArcs(): THREE.Group {
  const arcs = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const points: THREE.Vector3[] = [];
    const angle = (i / 6) * Math.PI * 2;
    for (let j = 0; j <= 8; j++) {
      const r = 0.6 + (j / 8) * 1.0 + (Math.random() - 0.5) * 0.15;
      points.push(new THREE.Vector3(
        Math.cos(angle) * r + (Math.random() - 0.5) * 0.1,
        (j / 8 - 0.5) * 0.4,
        Math.sin(angle) * r + (Math.random() - 0.5) * 0.1,
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    arcs.add(new THREE.Line(geo, mat));
  }
  return arcs;
}

function animateArcs(arcs: THREE.Group, t: number) {
  arcs.children.forEach((arc, i) => {
    const line = arc as THREE.Line;
    (line.material as THREE.LineBasicMaterial).opacity = Math.random() > 0.7 ? 0.9 : 0.2;
    line.rotation.y = t * (0.1 + i * 0.05);
  });
}
