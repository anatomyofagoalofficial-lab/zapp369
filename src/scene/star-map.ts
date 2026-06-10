import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { DIMENSIONS } from './dimensions.config';
import { flyTo } from './camera-controller';
import { buildGalaxy, buildStarLayers, animateStarLayers } from './galaxy';

export function initStarMap(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  const MOBILE = innerWidth < 768;
  const PR = Math.min(devicePixelRatio, MOBILE ? 1.25 : 1.5); // lighter on phones = smoother
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, alpha: true });
  renderer.setPixelRatio(PR);
  renderer.setSize(innerWidth, innerHeight);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(PR);
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth*0.5, innerHeight*0.5), 0.42, 0.4, 0.88));

  // ── 3D layers: spiral galaxy + parallax stars. The HTML ⚡ZAPP wordmark IS the centre —
  //    nothing 3D lives at the origin, so it can never crowd the logo. ──
  const { points: galaxy, material: galaxyMat } = buildGalaxy(scene);
  const starLayers = buildStarLayers(scene);
  // (Shooting stars are rendered as CSS overlays in the markup — reliable on every GPU.)

  // The connections between dimensions: fine streams of glowing dots that flow along
  // curved paths — a divine current circulating Tower → Signal → Network → Tower.
  // Each arc bows OUTWARD from the centre so the three lines frame the ⚡ZAPP logo in a
  // soft rounded triangle, never crossing the wordmark.
  const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0]];
  const EDGE_COLORS = [0xF4D27A, 0xE8B85C, 0xB87333]; // tonal golds — one brand, three shades
  const edgeCol = EDGE_COLORS.map(c => new THREE.Color(c));
  const DOTS = 110;   // many tiny dots → a fine, continuous current rather than chunky beads
  const dotTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  // Connections are a desktop flourish; on mobile the cards stack vertically so they'd be meaningless.
  const triEdges = MOBILE ? [] : EDGES.map(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DOTS * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(DOTS * 3), 3));
    const m = new THREE.PointsMaterial({ size: 2.3, sizeAttenuation: false, map: dotTex, transparent: true, opacity: 0.7, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(g, m);
    scene.add(points);
    return { g, m, curve: null as THREE.Curve<THREE.Vector3> | null };
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
    if (!MOBILE && worlds[0] && worlds[1] && worlds[2]) {
      EDGES.forEach(([a, b], ei) => {
        const A = worlds[a], B = worlds[b];
        // Route each link as an ARC that sweeps ANGULARLY around the centre (an orbital path),
        // so it physically curves around the ⚡ZAPP logo and can never cross the middle.
        const rA = Math.hypot(A.x, A.y), rB = Math.hypot(B.x, B.y);
        const angA = Math.atan2(A.y, A.x);
        let dAng = Math.atan2(B.y, B.x) - angA;
        while (dAng > Math.PI) dAng -= Math.PI * 2;        // always sweep the short way
        while (dAng < -Math.PI) dAng += Math.PI * 2;
        const zMid = (A.z + B.z) / 2;
        const N = 30, pts: THREE.Vector3[] = [];
        for (let i = 0; i <= N; i++) {
          const f = i / N;
          const ang = angA + dAng * f;
          // radius eases card→card, with a gentle outward swell in the middle to round the arc
          const rad = rA + (rB - rA) * f + Math.sin(f * Math.PI) * 7;
          pts.push(new THREE.Vector3(Math.cos(ang) * rad, Math.sin(ang) * rad, zMid));
        }
        triEdges[ei].curve = new THREE.CatmullRomCurve3(pts);
      });
    }
  }
  // cards are laid out by CSS — wait a frame so getBoundingClientRect is correct
  requestAnimationFrame(refreshLineTargets);

  // ── hover brightens the matching stream ──
  let hoveredId: string | null = null;
  document.addEventListener('mouseover', e => { const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null; if (t) hoveredId = DIMENSIONS.find(d => d.route === t.getAttribute('data-go'))?.id ?? null; });
  document.addEventListener('mouseout', e => { if ((e.target as HTMLElement).closest('[data-go]')) hoveredId = null; });

  // ── click a card → smooth warp through the galaxy, bloom to the dimension's light, then navigate ──
  let flying = false, warpStart = -1, warpRoute = '', navigated = false;
  let warpDim: (typeof DIMENSIONS)[number] | null = null;
  const flashEl = document.getElementById('warp-flash') as HTMLElement | null;
  document.addEventListener('click', e => {
    const t = (e.target as HTMLElement).closest('[data-go]') as HTMLElement | null;
    if (!t || flying) return;
    e.preventDefault();
    warpRoute = t.getAttribute('data-go')!;
    warpDim = DIMENSIONS.find(d => d.route === warpRoute) || null;
    flying = true;
    warpStart = clock.getElapsedTime();
    if (flashEl && warpDim) flashEl.style.setProperty('--wc', warpDim.color);
    document.getElementById('dimension-cards')?.classList.add('flying');
    (document.querySelector('.sm-center') as HTMLElement | null)?.style.setProperty('opacity', '0');
  });

  // ── ⚡ZAPP title — pinned dead-centre (the HTML wordmark IS the centre of the star-map) ──
  const smEl = document.querySelector('.sm-center') as HTMLElement | null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── parallax depth: the galaxy breathes around the cursor (cards stay fixed) ──
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  if (!MOBILE) addEventListener('pointermove', e => { tmx = (e.clientX / innerWidth) * 2 - 1; tmy = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const BEAT = 9.0; // the 9 of 3·6·9
    galaxyMat.uniforms.uTime.value = t;
    mx += (tmx - mx) * 0.045; my += (tmy - my) * 0.045;        // smooth easing toward the cursor
    galaxy.position.x = mx * 2.4; galaxy.position.y = my * 1.8;
    if (starLayers[0]) { starLayers[0].position.x = mx * 1.0; starLayers[0].position.y = my * 0.8; }
    if (starLayers[2]) { starLayers[2].position.x = mx * 3.0; starLayers[2].position.y = my * 2.2; }
    galaxy.rotation.y = (t / BEAT) * Math.PI * 0.4;           // alive — the galaxy spins, the camera stays calm
    galaxy.rotation.x = Math.PI * 0.22 + Math.sin(t / 14) * 0.04;
    animateStarLayers(starLayers, t);
    if (flying) refreshLineTargets();                          // keep lines attached while diving
    const hi = DIMENSIONS.findIndex(d => d.id === hoveredId);  // hovering a card lights its two streams
    const flow = t * 0.092;                                    // the divine current circulates — smooth & alive
    triEdges.forEach((e, ei) => {
      if (!e.curve) return;
      const pos = e.g.attributes.position as THREE.BufferAttribute;
      const col = e.g.attributes.color as THREE.BufferAttribute;
      const hot = hi === EDGES[ei][0] || hi === EDGES[ei][1];
      const base = edgeCol[ei];
      for (let i = 0; i < DOTS; i++) {
        const p = e.curve.getPoint(((i / DOTS) + flow) % 1);
        pos.setXYZ(i, p.x, p.y, p.z);
        // a soft glow travels along the stream → a smooth, flowing current (gentle, not blinky)
        const b = 0.5 + 0.5 * Math.pow(0.5 + 0.5 * Math.sin((i / DOTS - flow) * Math.PI * 4), 2);
        const m = hot ? b * 1.4 : b;
        col.setXYZ(i, base.r * m, base.g * m, base.b * m);
      }
      pos.needsUpdate = true; col.needsUpdate = true;
      e.m.opacity = flying ? Math.max(0, e.m.opacity - 0.05) : 0.7;
    });

    // ⚡ZAPP stays pinned dead-centre (no drifting) so the full wordmark is always visible
    // and never collides with the corner cards. A gentle breathing scale keeps it alive.
    if (smEl && !flying && !reduceMotion && !MOBILE) {
      const s = 1 + Math.sin(t * 0.8) * 0.012;
      smEl.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
    }

    // ── the warp dive: fly into the galaxy, twist, and bloom into the dimension's light ──
    if (flying && warpStart >= 0) {
      const wt = Math.min(1, (t - warpStart) / 0.8);          // quick teleport
      const ew = wt < 0.5 ? 4 * wt * wt * wt : 1 - Math.pow(-2 * wt + 2, 3) / 2;
      camera.position.z = 20 - ew * 30;                       // snap-dolly through the galaxy
      const tx = (warpDim ? warpDim.position.x : 0) * 0.35, ty = (warpDim ? warpDim.position.y : 0) * 0.35;
      camera.position.x += (tx - camera.position.x) * 0.08;
      camera.position.y += (ty - camera.position.y) * 0.08;
      camera.lookAt(0, 0, 0);
      galaxy.rotation.z += 0.02 + ew * 0.07;                  // warp twist
      if (flashEl) flashEl.style.opacity = String(Math.max(0, (wt - 0.45) / 0.55));  // quick white flash near the end
      if (wt >= 1 && !navigated) {
        navigated = true;
        (window as any).zappWarp ? (window as any).zappWarp(warpRoute) : (window.location.href = warpRoute);
      }
    }

    composer.render();
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
    refreshLineTargets();
  });
}
