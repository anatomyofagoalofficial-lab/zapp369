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

  // The 3·6·9 triangle — a dashed loop linking the three cards (incl. the hypotenuse).
  const triGeo = new THREE.BufferGeometry();
  triGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
  const triMat = new THREE.LineDashedMaterial({ color: 0xFFE08A, transparent: true, opacity: 0.26, dashSize: 1.1, gapSize: 1.0, blending: THREE.AdditiveBlending });
  const triLine = new THREE.Line(triGeo, triMat);
  scene.add(triLine);

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
      const pos = triGeo.attributes.position as THREE.BufferAttribute;
      [worlds[0], worlds[1], worlds[2], worlds[0]].forEach((w, i) => pos.setXYZ(i, w.x, w.y, w.z));
      pos.needsUpdate = true;
      triLine.computeLineDistances();
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
    triMat.opacity = flying ? Math.max(0, triMat.opacity - 0.04) : 0.2 + 0.12 * Math.sin(t * 1.1);  // 3·6·9 triangle breathes
    composer.render();
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
    refreshLineTargets();
  });
}
