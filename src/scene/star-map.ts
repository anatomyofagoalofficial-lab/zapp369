import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { DIMENSIONS } from './dimensions.config';
import { flyTo } from './camera-controller';
import { buildZappCore } from './zapp-core';
import { buildGalaxy, buildStarLayers, animateStarLayers } from './galaxy';

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

  // The connections between dimensions: fine streams of glowing dots that flow along
  // curved paths — a divine current circulating Tower → Network → Signal → Tower.
  const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0]];
  const EDGE_COLORS = [0xF4D27A, 0x9FE8FF, 0xC896FF];
  const DOTS = 28;
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const triEdges = EDGES.map((_, i) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DOTS * 3), 3));
    const m = new THREE.PointsMaterial({ color: EDGE_COLORS[i], size: 7, sizeAttenuation: false, map: dotTex, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(g, m);
    scene.add(points);
    return { g, m, curve: null as THREE.QuadraticBezierCurve3 | null };
  });

  // Anchor each line end to a card's on-screen position (unprojected into 3D).
  const cardEls = DIMENSIONS.map(d => ({ id: d.id, el: document.querySelector(`[data-go="${d.route}"]`) as HTMLElement | null }));
  function refreshLineTargets() {
    const worlds: THREE.Vector3[] = [];
    cardEls.forEach((c, i) => {
      if (!c.el) return;
      const r = c.el.getBoundingClientRect();
      const ndcX = ((r.left + r.width / 2) / innerWidth) * 2 - 1;
      const ndcY = -((r.top + r.height / 2) / innerHeight) * 2 + 1;
      worlds[i] = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    });
    if (worlds[0] && worlds[1] && worlds[2]) {
      EDGES.forEach(([a, b], ei) => {
        const A = worlds[a], B = worlds[b];
        const mid = A.clone().add(B).multiplyScalar(0.5).multiplyScalar(0.8); // bow gently toward the ⚡ZAPP core
        triEdges[ei].curve = new THREE.QuadraticBezierCurve3(A, mid, B);
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

  // ── ⚡ZAPP title as an air-hockey puck: smooth & slow at first, faster the longer you stay ──
  const smEl = document.querySelector('.sm-center') as HTMLElement | null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let px = 0, py = 0, vx = 0.66, vy = 0.42;
  { const n = Math.hypot(vx, vy); vx /= n; vy /= n; }
  let lastT = 0;

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
    if (flying) refreshLineTargets();                          // keep lines attached while diving
    const hi = DIMENSIONS.findIndex(d => d.id === hoveredId);  // hovering a card lights its two streams
    const flow = t * 0.12;                                     // the divine current circulates, smooth & endless
    triEdges.forEach((e, ei) => {
      if (!e.curve) return;
      const pos = e.g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < DOTS; i++) {
        const p = e.curve.getPoint(((i / DOTS) + flow) % 1);
        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;
      const hot = hi === EDGES[ei][0] || hi === EDGES[ei][1];
      e.m.opacity = flying ? Math.max(0, e.m.opacity - 0.05) : (hot ? 1 : 0.85);
    });

    if (smEl && !flying && !reduceMotion) {
      const dt = Math.min(0.05, t - lastT);
      const speed = Math.min(380, 20 + t * 2.4);          // smooth start → accelerates the longer you watch
      const maxX = Math.max(40, (innerWidth - smEl.offsetWidth) / 2 - 8);
      const maxY = Math.max(40, (innerHeight - smEl.offsetHeight) / 2 - 8);
      px += vx * speed * dt; py += vy * speed * dt;
      if (px > maxX) { px = maxX; vx = -vx; } else if (px < -maxX) { px = -maxX; vx = -vx; }
      if (py > maxY) { py = maxY; vy = -vy; } else if (py < -maxY) { py = -maxY; vy = -vy; }
      smEl.style.transform = `translate(calc(-50% + ${px.toFixed(1)}px), calc(-50% + ${py.toFixed(1)}px))`;
    }
    lastT = t;

    composer.render();
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
    refreshLineTargets();
  });
}
