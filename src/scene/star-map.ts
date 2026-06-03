import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { DIMENSIONS } from './dimensions.config';
import { flyTo } from './camera-controller';
import { buildZappCore } from './zapp-core';
import { buildGalaxy, buildStarLayers, animateStarLayers } from './galaxy';
import { buildEnergyLines, setEnergyLineEnd, animateEnergyLines } from './energy-lines';

export function initStarMap(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio, 2));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.45, 0.35, 0.9));

  // ── 3D layers only: ⚡ZAPP core, spiral galaxy, parallax stars, energy beams ──
  const zappCore = buildZappCore(scene);
  const { points: galaxy, material: galaxyMat } = buildGalaxy(scene);
  const starLayers = buildStarLayers(scene);
  const energyLines = buildEnergyLines(scene);

  // The 3·6·9 links — soft, transparent curved arcs between every pair of cards
  // (Tower↔Network, Network↔Signal, Signal↔Tower) — incl. the hypotenuse.
  const EDGE_SEG = 44;
  const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0]];
  const triEdges = EDGES.map(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((EDGE_SEG + 1) * 3), 3));
    const m = new THREE.LineBasicMaterial({ color: 0xFFE08A, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
    const line = new THREE.Line(g, m);
    scene.add(line);
    return { g, m };
  });

  // Each energy beam ends at its dimension card's on-screen position (unprojected to 3D).
  const cardEls = DIMENSIONS.map(d => ({ id: d.id, el: document.querySelector(`[data-go="${d.route}"]`) as HTMLElement | null }));
  function refreshLineTargets() {
    const worlds: THREE.Vector3[] = [];
    cardEls.forEach((c, i) => {
      if (!c.el) return;
      const r = c.el.getBoundingClientRect();
      const ndcX = ((r.left + r.width / 2) / innerWidth) * 2 - 1;
      const ndcY = -((r.top + r.height / 2) / innerHeight) * 2 + 1;
      const world = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      setEnergyLineEnd(energyLines[i], world);
      worlds[i] = world;
    });
    if (worlds[0] && worlds[1] && worlds[2]) {
      EDGES.forEach(([a, b], ei) => {
        const A = worlds[a], B = worlds[b];
        const mid = A.clone().add(B).multiplyScalar(0.5).multiplyScalar(0.8); // bow gently toward the ⚡ZAPP core
        const pts = new THREE.QuadraticBezierCurve3(A, mid, B).getPoints(EDGE_SEG);
        const pos = triEdges[ei].g.attributes.position as THREE.BufferAttribute;
        pts.forEach((p, i) => pos.setXYZ(i, p.x, p.y, p.z));
        pos.needsUpdate = true;
      });
    }
  }
  // cards are laid out by CSS — wait a frame so getBoundingClientRect is correct
  requestAnimationFrame(refreshLineTargets);

  // ── hover brightens the matching beam ──
  let hoveredId: string | null = null;
  document.addEventListener('mouseover', e => { const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null; if (t) hoveredId = DIMENSIONS.find(d => d.route === t.getAttribute('data-go'))?.id ?? null; });
  document.addEventListener('mouseout', e => { if ((e.target as HTMLElement).closest('[data-go]')) hoveredId = null; });

  // ── click a card → dive through space toward that dimension → navigate ──
  let flying = false;
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (!t || flying) return;
    e.preventDefault();
    const route = t.getAttribute('data-go')!;
    const dim = DIMENSIONS.find(d => d.route === route)!;
    flying = true;
    document.getElementById('dimension-cards')?.classList.add('flying');
    (document.querySelector('.sm-center') as HTMLElement | null)?.style.setProperty('opacity', '0');
    flyTo(camera, dim.position, () => { window.location.href = route; });
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const BEAT = 9.0; // the 9 of 3·6·9
    zappCore.update(t);
    galaxyMat.uniforms.uTime.value = t;
    galaxy.rotation.y = (t / BEAT) * Math.PI * 0.4;           // alive — the galaxy spins, the camera stays calm
    galaxy.rotation.x = Math.PI * 0.22 + Math.sin(t / 14) * 0.04;
    animateStarLayers(starLayers, t);
    if (flying) refreshLineTargets();                          // keep beams attached while diving
    animateEnergyLines(energyLines, t, hoveredId, flying);
    const triOp = flying ? 0 : 0.13 + 0.07 * Math.sin(t * 1.1);  // soft arcs breathe
    triEdges.forEach(e => { e.m.opacity = flying ? Math.max(0, e.m.opacity - 0.04) : triOp; });
    composer.render();
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
    refreshLineTargets();
  });
}
