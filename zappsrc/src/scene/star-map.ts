import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DIMENSIONS } from './dimensions.config';
import { flyTo } from './camera-controller';
import { buildZappCore } from './zapp-core';
import { buildGalaxy, buildStarLayers, animateStarLayers } from './galaxy';
import { buildEnergyLines, animateEnergyLines } from './energy-lines';

export function initStarMap(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20); // pulled back just enough — core has breathing room

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  // ── free, smooth navigation: drag to look around space (damped) ──
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;   // weighty, smooth glide — no jitter
  controls.enablePan = false;
  controls.rotateSpeed = 0.45;
  controls.zoomSpeed = 0.6;
  controls.minDistance = 12;
  controls.maxDistance = 70;
  controls.autoRotate = true;       // gentle idle breath — pauses the moment you reach a card
  controls.autoRotateSpeed = 0.22;
  controls.target.set(0, 0, 0);
  let dragging = false;
  controls.addEventListener('start', () => { dragging = true; });
  controls.addEventListener('end', () => { dragging = false; });

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio, 2));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.4, 0.85));

  // CSS2D label overlay
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(innerWidth, innerHeight);
  labelRenderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:20;pointer-events:none';
  document.body.appendChild(labelRenderer.domElement);

  // soft round sprite for stars/glows
  const dot = (() => {
    const cc = document.createElement('canvas'); cc.width = cc.height = 64; const g = cc.getContext('2d')!;
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.45, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(cc);
  })();

  // ── ⚡ZAPP crystalline core at origin (modest — not a sun) ──
  const zappCore = buildZappCore(scene);

  // ── tilted spiral galaxy (empty core) + 3 parallax star layers ──
  const { points: galaxy, material: galaxyMat } = buildGalaxy(scene);
  const starLayers = buildStarLayers(scene);

  // ── each dimension: glowing orb + halo + connecting beam + floating label ──
  const orbs: { mesh: THREE.Object3D; glow: THREE.Sprite; inner: HTMLElement; pos: THREE.Vector3; home: THREE.Vector3; id: string; color: string }[] = [];
  DIMENSIONS.forEach(dim => {
    const col = new THREE.Color(dim.color);
    const grp = new THREE.Group(); grp.position.copy(dim.position);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 24), new THREE.MeshBasicMaterial({ color: col })); grp.add(orb);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: col, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.set(14, 14, 1); grp.add(glow);

    const wrap = document.createElement('div'); wrap.style.pointerEvents = 'none';
    const el = document.createElement('div');
    el.className = 'dim-label';
    el.innerHTML = `
      <div class="dim-label-meta">${dim.number} · ${dim.subtitle}</div>
      <div class="dim-label-title" style="color:${dim.color}">${dim.icon} ${dim.title}</div>
      <div class="dim-label-desc">${dim.description}</div>
      <button class="dim-label-cta" data-go="${dim.route}" style="border-color:${dim.color};color:${dim.color}">Enter →</button>`;
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
    el.setAttribute('data-go', dim.route); // whole card is clickable, not just the button
    wrap.appendChild(el);
    const label = new CSS2DObject(wrap); label.position.set(0, 5, 0); grp.add(label);

    scene.add(grp); orbs.push({ mesh: grp, glow, inner: el, pos: dim.position.clone(), home: dim.position.clone(), id: dim.id, color: dim.color });
  });

  // ── animated energy beams from core → each dimension ──
  const energyLines = buildEnergyLines(scene);

  // hover brightens the hovered dimension's beam
  let hoveredId: string | null = null;
  document.addEventListener('mouseover', e => { const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null; if (t) hoveredId = DIMENSIONS.find(d => d.route === t.getAttribute('data-go'))?.id ?? null; });
  document.addEventListener('mouseout', e => { if ((e.target as HTMLElement).closest('[data-go]')) hoveredId = null; });

  // ── click an "Enter →" → fly to it → navigate (a drag never counts as a click) ──
  let flying = false;
  let downX = 0, downY = 0, moved = false;
  document.addEventListener('pointerdown', e => { downX = e.clientX; downY = e.clientY; moved = false; }, { passive: true });
  document.addEventListener('pointermove', e => { if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) moved = true; }, { passive: true });
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (!t || flying || moved) return;
    const route = t.getAttribute('data-go')!;
    const dim = DIMENSIONS.find(d => d.route === route)!;
    flying = true;
    controls.enabled = false;
    document.querySelectorAll('.dim-label').forEach(l => (l as HTMLElement).style.opacity = '0');
    const center = (document.querySelector('.sm-center') as HTMLElement | null);
    if (center) center.style.opacity = '0';
    flyTo(camera, dim.position, () => { window.location.href = route; });
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const BEAT = 9.0; // one shared rhythm — the 9 of 3·6·9
    zappCore.update(t);
    galaxyMat.uniforms.uTime.value = t;
    galaxy.rotation.y = (t / BEAT) * Math.PI * 0.4;
    galaxy.rotation.x = Math.PI * 0.22 + Math.sin(t / 14) * 0.04; // ~40° Hubble tilt + breath
    animateStarLayers(starLayers, t);
    animateEnergyLines(energyLines, t, flying ? null : hoveredId);
    orbs.forEach((o, i) => {
      const hot = o.id === hoveredId;
      // ── magnetic pull: reach for a dimension and it glides toward you ──
      const target = hot ? o.home.clone().lerp(camera.position, 0.34) : o.home;
      o.mesh.position.lerp(target, 0.08);
      o.glow.material.opacity = (0.6 + 0.3 * Math.sin(t * (1.2 + i * 0.4) + i)) * (hot ? 1.6 : 1);
      o.mesh.rotation.y += 0.003;
      // depth: nearer cards bigger & brighter, hovered card pops
      const dist = camera.position.distanceTo(o.mesh.position);
      const sc = THREE.MathUtils.clamp(64 / dist, 0.6, 1.5) * (hot ? 1.06 : 1);
      o.inner.style.transform = `scale(${sc.toFixed(3)})`;
      o.inner.style.opacity = flying ? '0' : THREE.MathUtils.clamp(120 / dist, 0.55, 1).toFixed(2);
      o.inner.style.boxShadow = hot ? `0 0 55px ${o.color}66` : '';
    });
    if (!flying) {
      // free, damped navigation — idle breath pauses the instant you reach a card or grab the view
      controls.autoRotate = !dragging && !hoveredId;
      controls.update();
    }
    composer.render();
    labelRenderer.render(scene, camera);
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight); labelRenderer.setSize(innerWidth, innerHeight);
  });
}
