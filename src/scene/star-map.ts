import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DIMENSIONS } from './dimensions.config';
import { flyTo } from './camera-controller';
import { buildZappCore } from './zapp-core';

export function initStarMap(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20); // pulled back just enough — core has breathing room

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio, 2));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.9, 0.6, 0.1));

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

  // ── starfield (smooth) ──
  const SN = 2600, sp = new Float32Array(SN * 3), scl = new Float32Array(SN * 3);
  const SPAL = [new THREE.Color(0xffffff), new THREE.Color(0xBFD4FF), new THREE.Color(0xFFE6B0), new THREE.Color(0xC9A8FF)];
  for (let i = 0; i < SN; i++) {
    const v = new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize().multiplyScalar(150 + Math.random() * 350);
    sp[i * 3] = v.x; sp[i * 3 + 1] = v.y; sp[i * 3 + 2] = v.z;
    const c = SPAL[Math.random() < .7 ? 0 : (Math.random() * SPAL.length) | 0]; scl[i * 3] = c.r; scl[i * 3 + 1] = c.g; scl[i * 3 + 2] = c.b;
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('color', new THREE.BufferAttribute(scl, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ map: dot, vertexColors: true, size: 1.6, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })));

  // ── each dimension: glowing orb + halo + connecting beam + floating label ──
  const orbs: { mesh: THREE.Object3D; glow: THREE.Sprite; inner: HTMLElement; pos: THREE.Vector3 }[] = [];
  DIMENSIONS.forEach(dim => {
    const col = new THREE.Color(dim.color);
    const grp = new THREE.Group(); grp.position.copy(dim.position);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 24), new THREE.MeshBasicMaterial({ color: col })); grp.add(orb);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: col, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.set(18, 18, 1); grp.add(glow);
    // beam from core → dimension
    const beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), dim.position.clone()]), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending }));
    scene.add(beam);

    const wrap = document.createElement('div'); wrap.style.pointerEvents = 'none';
    const el = document.createElement('div');
    el.className = 'dim-label';
    el.innerHTML = `
      <div class="dim-label-meta">${dim.number} · ${dim.subtitle}</div>
      <div class="dim-label-title" style="color:${dim.color}">${dim.icon} ${dim.title}</div>
      <div class="dim-label-desc">${dim.description}</div>
      <button class="dim-label-cta" data-go="${dim.route}" style="border-color:${dim.color};color:${dim.color}">Enter →</button>`;
    el.style.pointerEvents = 'auto';
    wrap.appendChild(el);
    const label = new CSS2DObject(wrap); label.position.set(0, 5, 0); grp.add(label);

    scene.add(grp); orbs.push({ mesh: grp, glow, inner: el, pos: dim.position.clone() });
  });

  // ── click an "Enter →" → fly to it → navigate ──
  let flying = false;
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (!t || flying) return;
    const route = t.getAttribute('data-go')!;
    const dim = DIMENSIONS.find(d => d.route === route)!;
    flying = true;
    document.querySelectorAll('.dim-label').forEach(l => (l as HTMLElement).style.opacity = '0');
    const center = (document.querySelector('.sm-center') as HTMLElement | null);
    if (center) center.style.opacity = '0';
    flyTo(camera, dim.position, () => { window.location.href = route; });
  });

  // ── gentle mouse-look + drift ──
  let mx = 0, my = 0;
  document.addEventListener('mousemove', ev => { mx = ev.clientX / innerWidth - .5; my = ev.clientY / innerHeight - .5; }, { passive: true });
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    zappCore.update(t);
    orbs.forEach((o, i) => {
      o.glow.material.opacity = 0.6 + 0.3 * Math.sin(t * (1.2 + i * 0.4) + i);
      o.mesh.rotation.y += 0.003;
      // depth: nearer cards bigger & brighter
      const dist = camera.position.distanceTo(o.pos);
      o.inner.style.transform = `scale(${THREE.MathUtils.clamp(64 / dist, 0.6, 1.2).toFixed(3)})`;
      o.inner.style.opacity = flying ? '0' : THREE.MathUtils.clamp(110 / dist, 0.5, 1).toFixed(2);
    });
    if (!flying) {
      // fixed corner framing + subtle mouse parallax (no auto-orbit so corners stay put)
      camera.position.x += (mx * 6 - camera.position.x) * 0.04;
      camera.position.y += (-my * 4 - camera.position.y) * 0.04;
      camera.position.z += (20 - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);
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
