// 3 · PAST — "Enter the Laboratory"
// A walk-IN immersive scene: the camera travels forward (−Z) through Tesla's
// 1899 lab — coils crackling overhead, the 3·6·9 chalkboard — then out through a
// doorway to the Wardenclyffe Tower under the stars. Scroll drives forward travel
// into depth (you go *into* the screen, not down a page).
//
// Conventions match the rest of /src/scene: `import * as THREE`, a renderer bound
// to an existing <canvas>, pixel-ratio clamped to 1.5, self-scheduling rAF loop
// gated on #dim-past.active, UnrealBloom for the electric glow. Pure procedural
// geometry + canvas textures — no external image assets to go missing.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { prefersReducedMotion } from '../scripts/constants';

const PAST_GLOW = 0xF4D27A;   // canonical "past" era colour
const LAB_END = -78;          // z where the lab ends and the doorway opens
const TOWER_Z = -150;         // z of the Wardenclyffe tower (seen through the door)

type Arc = { line: THREE.Line; attr: THREE.BufferAttribute };
type Coil = { top: THREE.Vector3; orb: THREE.Sprite };

export function initPastLab(canvas: HTMLCanvasElement): void {
  const reduced = prefersReducedMotion();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x050208, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050208);
  scene.fog = new THREE.FogExp2(0x0d0905, 0.008);

  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 600);

  // ---- glow sprite textures (procedural, fake-bloom seeds) ----
  function glowTex(c1: string, c2: string): THREE.CanvasTexture {
    const s = 128;
    const cv = document.createElement('canvas'); cv.width = cv.height = s;
    const x = cv.getContext('2d')!;
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, c1); g.addColorStop(0.4, c2); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cv);
  }
  const goldGlow = glowTex('rgba(255,212,132,.95)', 'rgba(184,144,47,.5)');
  const blueGlow = glowTex('rgba(220,240,255,.95)', 'rgba(120,180,255,.4)');
  function sprite(tex: THREE.Texture, size: number, x: number, y: number, z: number, parent: THREE.Object3D): THREE.Sprite {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    sp.scale.set(size, size, 1); sp.position.set(x, y, z); parent.add(sp); return sp;
  }

  // ---- lab shell : wooden-plank barn (Colorado Springs) ----
  function plankTex(planks: number): THREE.CanvasTexture {
    const w = 256, h = 256, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const x = cv.getContext('2d')!; const ph = h / planks;
    for (let i = 0; i < planks; i++) {
      const s = 30 + Math.floor(Math.random() * 36);
      x.fillStyle = `rgb(${150 + s},${112 + s * 0.7},${72 + s * 0.5})`; x.fillRect(0, i * ph, w, ph - 1);
      x.strokeStyle = 'rgba(60,38,18,0.28)'; x.lineWidth = 1;
      for (let k = 0; k < 5; k++) { const yy = i * ph + Math.random() * ph; x.beginPath(); x.moveTo(0, yy);
        x.bezierCurveTo(w * 0.35, yy + (Math.random() - 0.5) * 4, w * 0.7, yy + (Math.random() - 0.5) * 4, w, yy); x.stroke(); }
      x.fillStyle = 'rgba(18,11,5,0.85)'; x.fillRect(0, i * ph + ph - 2, w, 2);
    }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  const floorWood = plankTex(7); floorWood.repeat.set(7, 12);
  const wallWood = plankTex(9); wallWood.repeat.set(7, 3);
  const woodMat = new THREE.MeshStandardMaterial({ map: floorWood, roughness: 0.95, metalness: 0.05 });
  const wallMat = new THREE.MeshStandardMaterial({ map: wallWood, roughness: 1, metalness: 0, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(46, 120), woodMat);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -6, LAB_END / 2 + 6); scene.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(46, 120), wallMat);
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 12, LAB_END / 2 + 6); scene.add(ceil);
  for (const sx of [-16, 16]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(120, 18), wallMat);
    w.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2; w.position.set(sx, 3, LAB_END / 2 + 6); scene.add(w);
  }
  const panel = (w: number, h: number, x: number, y: number, z: number): void => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat); p.position.set(x, y, z); scene.add(p);
  };
  panel(46, 18, 0, 3, 8);              // wall behind the entrance
  panel(11, 18, -11.5, 3, LAB_END);    // back-left of the doorway
  panel(11, 18, 11.5, 3, LAB_END);     // back-right
  panel(46, 5, 0, 11.5, LAB_END);      // lintel above the doorway
  const door = new THREE.Mesh(new THREE.PlaneGeometry(12.4, 18.4), new THREE.MeshBasicMaterial({ color: 0x0a1626 }));
  door.position.set(0, 3, LAB_END - 0.2); scene.add(door);
  sprite(blueGlow, 30, 0, 3, LAB_END - 1, scene); // moonlight through the doorway

  // ---- warm rafter lights ----
  const amber: THREE.PointLight[] = [];
  const shadeMat = new THREE.MeshStandardMaterial({ color: 0x140d06, roughness: 1, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const z = 2 - i * 16;
    const L = new THREE.PointLight(0xffd080, 3.2, 74, 2); L.position.set(0, 9, z); scene.add(L); amber.push(L);
    // a hanging work-lamp so the light reads as a real source, not a floating orb
    const shade = new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.1, 16, 1, true), shadeMat);
    shade.position.set(0, 10.1, z); scene.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe6a8 }));
    bulb.position.set(0, 9.2, z); scene.add(bulb);
    sprite(goldGlow, 4, 0, 9.1, z, scene);   // a tight halo, not a sun
  }
  scene.add(new THREE.AmbientLight(0x6a5440, 2.9));
  scene.add(new THREE.HemisphereLight(0xfff0d8, 0x6a5238, 1.3));   // broad overall fill so the whole room reads
  // a soft warm fill that rides with the camera so the room is always clearly lit
  const camFill = new THREE.PointLight(0xffd28a, 2.5, 66, 2); scene.add(camFill);

  // ---- workbenches + period clutter ----
  function bench(z: number, side: number): void {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 4), woodMat); top.position.y = -1.6; g.add(top);
    const legGeo = new THREE.BoxGeometry(0.4, 4.4, 0.4);
    for (const [lx, lz] of [[-4, -1.8], [4, -1.8], [-4, 1.8], [4, 1.8]]) {
      const l = new THREE.Mesh(legGeo, woodMat); l.position.set(lx, -3.9, lz); g.add(l);
    }
    for (let i = 0; i < 4; i++) {
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x6fa8c0, transparent: true, opacity: 0.4, roughness: 0.2, metalness: 0.3, emissive: 0x12303f, emissiveIntensity: 0.6 }));
      jar.position.set(-3 + i * 2, -0.7, 0); g.add(jar);
    }
    const dev = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.28, 8, 18),
      new THREE.MeshStandardMaterial({ color: 0x9a6a23, metalness: 0.9, roughness: 0.35, emissive: 0x3a2406, emissiveIntensity: 0.4 }));
    dev.position.set(2.6, -0.4, 0); dev.rotation.x = Math.PI / 2; g.add(dev);
    g.position.set(side * 9, 0, z); scene.add(g);
  }
  bench(-8, -1); bench(-8, 1); bench(-30, -1); bench(-52, 1);

  // ---- Tesla coils ----
  const coils: Coil[] = [];
  function teslaCoil(x: number, z: number, scale: number): void {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2, 1.4, 18),
      new THREE.MeshStandardMaterial({ color: 0x241a10, roughness: 0.8, metalness: 0.3 }));
    base.position.y = -5.3; g.add(base);
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 7, 20),
      new THREE.MeshStandardMaterial({ color: 0x7a4a1c, metalness: 0.7, roughness: 0.4, emissive: 0x2a1605, emissiveIntensity: 0.5 }));
    col.position.y = -1; g.add(col);
    for (let i = 0; i < 7; i++) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.07, 6, 22),
        new THREE.MeshStandardMaterial({ color: 0xc97b2a, metalness: 1, roughness: 0.3, emissive: 0x4a2607, emissiveIntensity: 0.5 }));
      r.position.y = -4 + i * 0.95; r.rotation.x = Math.PI / 2; g.add(r);
    }
    const tor = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.55, 12, 28),
      new THREE.MeshStandardMaterial({ color: 0xb0832e, metalness: 1, roughness: 0.25, emissive: 0x5a3a0c, emissiveIntensity: 0.7 }));
    tor.position.y = 3; tor.rotation.x = Math.PI / 2; g.add(tor);
    const orb = sprite(blueGlow, 4.4, 0, 3, 0, g);
    g.position.set(x, 0, z); g.scale.setScalar(scale); scene.add(g);
    coils.push({ top: new THREE.Vector3(x, 3 * scale, z), orb });
  }
  teslaCoil(-7, -22, 0.85); teslaCoil(7, -34, 0.9);

  // ---- the Magnifying Transmitter — the Colorado Springs centrepiece ----
  let mtTop = new THREE.Vector3(0, 9, -58);
  (function magnifyingTransmitter(): void {
    const X = 0, Z = -58;
    const prim = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.7, 2.4, 30, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x7a4a1c, metalness: 0.6, roughness: 0.5, side: THREE.DoubleSide, emissive: 0x180c03, emissiveIntensity: 0.4 }));
    prim.position.set(X, -3.8, Z); scene.add(prim);
    const sec = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 9, 24),
      new THREE.MeshStandardMaterial({ color: 0x8a5a22, metalness: 0.8, roughness: 0.4, emissive: 0x2a1605, emissiveIntensity: 0.5 }));
    sec.position.set(X, 1.6, Z); scene.add(sec);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc97b2a, metalness: 1, roughness: 0.3 });
    for (let i = 0; i < 12; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 6, 24), ringMat); r.position.set(X, -2.6 + i * 0.74, Z); r.rotation.x = Math.PI / 2; scene.add(r); }
    const ball = new THREE.Mesh(new THREE.SphereGeometry(2.3, 30, 22),
      new THREE.MeshStandardMaterial({ color: 0xb9c2cc, metalness: 1, roughness: 0.18, emissive: 0x223044, emissiveIntensity: 0.5 }));
    ball.position.set(X, 7.4, Z); scene.add(ball);
    mtTop = new THREE.Vector3(X, 9.4, Z);
    sprite(blueGlow, 10, X, 7.4, Z, scene);
    // the circular cage of vertical posts (the secondary "fence")
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x5a3c1e, roughness: 0.9, metalness: 0.1 });
    const CR = 7.5, posts = 30;
    for (let i = 0; i < posts; i++) { const a = i / posts * Math.PI * 2;
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 6.2, 6), cageMat);
      p.position.set(X + Math.cos(a) * CR, -2.9, Z + Math.sin(a) * CR); scene.add(p); }
    for (const yy of [-6, 0.2]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(CR, 0.11, 6, 44), cageMat); ring.position.set(X, yy, Z); ring.rotation.x = Math.PI / 2; scene.add(ring); }
  })();
  // wooden tripods scattered around the floor
  function tripod(x: number, z: number): void {
    const m = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.95 });
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7, 6), m);
      leg.position.set(x + Math.cos(a) * 1.1, -2.6, z + Math.sin(a) * 1.1); leg.rotation.z = Math.cos(a) * 0.26; leg.rotation.x = Math.sin(a) * 0.26; scene.add(leg); }
  }
  tripod(-11, -48); tripod(11, -52);

  // ---- framed archive photographs on the plank walls ----
  const texLoader = new THREE.TextureLoader();
  function wallPhoto(url: string, z: number, side: number): void {
    const g = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 5.0), new THREE.MeshStandardMaterial({ color: 0x2a1c0e, roughness: 0.85, metalness: 0.15 }));
    const tex = texLoader.load(url);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(6, 4.4), new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false }));
    pic.position.z = 0.06; pic.layers.set(1); pic.renderOrder = 10;   // layer 1 = drawn in full colour on top of the B&W world
    g.add(frame); g.add(pic);
    g.position.set(side * 15.6, 3.4, z); g.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; scene.add(g);
  }
  wallPhoto('/illustrations/tesla-lab-1899.jpg', -14, -1);
  wallPhoto('/illustrations/world-system.jpg', -52, -1);
  wallPhoto('/illustrations/wardenclyffe.jpg', -24, 1);
  wallPhoto('/illustrations/tesla-tower-news.jpg', -46, 1);
  wallPhoto('/illustrations/tribute.jpg', -66, 1);    // the ZAPP figure looking up at the tower
  wallPhoto('/illustrations/torch-v2.jpg', -70, -1);  // the ZAPP torch (Prometheus / fire-bringer)

  // ---- chalkboard : 3 · 6 · 9 ----
  (function chalkboard(): void {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256;
    const x = cv.getContext('2d')!;
    x.fillStyle = '#0c1a14'; x.fillRect(0, 0, 512, 256);
    x.textAlign = 'center';
    x.font = "600 120px 'Cormorant Garamond', Georgia, serif"; x.fillStyle = 'rgba(244,234,214,.9)';
    x.fillText('3 · 6 · 9', 256, 150);
    x.font = '20px monospace'; x.fillStyle = 'rgba(244,210,122,.7)';
    x.fillText('the key to the universe', 256, 210);
    const b = new THREE.Mesh(new THREE.PlaneGeometry(10, 5),
      new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(cv), emissive: 0x223322, emissiveIntensity: 0.3, roughness: 0.9 }));
    b.position.set(-15.7, 4, -34); b.rotation.y = Math.PI / 2; scene.add(b);
  })();

  // ---- electric arcs (jagged THREE.Line, additive, crackle per frame) ----
  function makeArc(color: number): Arc {
    const attr = new THREE.BufferAttribute(new Float32Array(16 * 3), 3);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', attr);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
    line.frustumCulled = false; scene.add(line); return { line, attr };
  }
  function updateArc(arc: Arc, a: THREE.Vector3, b: THREE.Vector3): void {
    const p = arc.attr.array as Float32Array; const N = 16;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      p[i * 3] = a.x + (b.x - a.x) * t + (Math.random() - 0.5) * 1.6 * (1 - Math.abs(t - 0.5) * 1.4);
      p[i * 3 + 1] = a.y + (b.y - a.y) * t + (Math.random() - 0.5) * 1.6;
      p[i * 3 + 2] = a.z + (b.z - a.z) * t + (Math.random() - 0.5) * 1.6;
    }
    arc.attr.needsUpdate = true;
  }
  const arcs: Arc[] = [makeArc(0xcfe8ff), makeArc(0xcfe8ff), makeArc(0xcfe8ff)];
  const mtArcs: Arc[] = [makeArc(0xeaf4ff), makeArc(0xeaf4ff), makeArc(0xeaf4ff), makeArc(0xeaf4ff), makeArc(0xeaf4ff), makeArc(0xeaf4ff)];

  // ---- dust motes ----
  (function dust(): void {
    const N = 800, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 30; pos[i * 3 + 1] = Math.random() * 16 - 5; pos[i * 3 + 2] = 10 - Math.random() * 100; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffcf8a, size: 0.07, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })));
  })();

  // ============ EXTERIOR : WARDENCLYFFE TOWER ============
  const tower = new THREE.Group(); tower.position.set(0, -6, TOWER_Z); scene.add(tower);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshStandardMaterial({ color: 0x0c1320, roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2; tower.add(ground);

  // everything sky-related lives in one group we can hide while indoors
  const sky = new THREE.Group(); scene.add(sky);

  // ---- the night SKY: a gradient dome + moon so the exterior reads as OUTSIDE, not a void ----
  (function nightSky(): void {
    const cv = document.createElement('canvas'); cv.width = 16; cv.height = 256;
    const cx = cv.getContext('2d')!;
    const g = cx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0.00, '#070810');  // zenith
    g.addColorStop(0.40, '#0c1226');
    g.addColorStop(0.52, '#141d33');  // soft horizon band (no hard cut)
    g.addColorStop(0.64, '#0a0f1c');
    g.addColorStop(1.00, '#06070e');
    cx.fillStyle = g; cx.fillRect(0, 0, 16, 256);
    const tex = new THREE.CanvasTexture(cv);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(440, 32, 24),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, depthWrite: false }));
    dome.position.set(0, 0, TOWER_Z + 20); sky.add(dome);
    // the moon (disc + soft halo), high over the horizon
    const moon = new THREE.Mesh(new THREE.CircleGeometry(9, 40),
      new THREE.MeshBasicMaterial({ color: 0xeaf0fc, fog: false }));
    moon.position.set(-155, 115, TOWER_Z - 130); moon.lookAt(0, 30, TOWER_Z); sky.add(moon);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: blueGlow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, opacity: 0.9 }));
    halo.scale.set(80, 80, 1); halo.position.set(-155, 115, TOWER_Z - 128); sky.add(halo);
  })();
  const latMat = new THREE.LineBasicMaterial({ color: 0x9fb6c9, transparent: true, opacity: 0.8 });
  const H = 42, RINGS = 11, SIDES = 8;
  const ringPts = (y: number, r: number): THREE.Vector3[] => {
    const a: THREE.Vector3[] = [];
    for (let i = 0; i <= SIDES; i++) { const t = i / SIDES * Math.PI * 2; a.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r)); }
    return a;
  };
  let prev: THREE.Vector3[] | null = null;
  for (let i = 0; i < RINGS; i++) {
    const y = i / (RINGS - 1) * H, r = 9 - (i / (RINGS - 1)) * 6.5;
    const pts = ringPts(y, r);
    tower.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), latMat));
    if (prev) {
      for (let k = 0; k < SIDES; k++) {
        tower.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([prev[k], pts[(k + 1) % SIDES]]), latMat));
        tower.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([prev[k], pts[k]]), latMat));
      }
    }
    prev = pts;
  }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(7, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x6a4a22, metalness: 1, roughness: 0.3, emissive: 0x2a1a08, emissiveIntensity: 0.6 }));
  dome.position.y = H; tower.add(dome);
  const domeGlow = sprite(goldGlow, 18, 0, H, 0, tower);
  const moon = new THREE.DirectionalLight(0xaecbe6, 1.4); moon.position.set(-30, 50, -100); scene.add(moon);
  const towerGlow = new THREE.PointLight(PAST_GLOW, 0, 90, 2); towerGlow.position.set(0, H - 6, TOWER_Z); scene.add(towerGlow);
  (function stars(): void {
    const N = 2200, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 380 + Math.random() * 40, th = Math.random() * Math.PI * 2, ph = Math.acos(Math.random()); // upper hemisphere
      pos[i * 3] = Math.sin(ph) * Math.cos(th) * r; pos[i * 3 + 1] = Math.cos(ph) * r * 0.9 + 8; pos[i * 3 + 2] = TOWER_Z + Math.sin(ph) * Math.sin(th) * r;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sky.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdce6f5, size: 1.05, transparent: true, opacity: 0.9, fog: false, depthWrite: false })));
  })();
  const bolt = makeArc(0xeaf4ff); bolt.line.visible = false;
  const boltBase = new THREE.Vector3(0, H - 6, TOWER_Z), boltTop = new THREE.Vector3(0, H + 40, TOWER_Z);

  // ============ JOURNEY (scroll → forward travel into −Z) ============
  const camStart = new THREE.Vector3(0, 2, 6);
  const camEnd = new THREE.Vector3(0, 2, -96);
  let t = 0, target = 0;

  const chapterEl = document.getElementById('lab-chapter');
  const lineEl = document.getElementById('lab-line');
  const hintEl = document.getElementById('lab-hint');
  const labUi = document.querySelector('.lab-ui') as HTMLElement | null;
  const beats = [
    { p: 0.00, c: 'Colorado Springs · 1899', l: 'Step inside the <em>laboratory</em>.' },
    { p: 0.24, c: 'The Experiment', l: 'He pulled <em>lightning</em> from the empty air.' },
    { p: 0.46, c: '3 · 6 · 9', l: 'Energy, frequency, vibration —<br>the keys he left behind.' },
    { p: 0.62, c: 'Wardenclyffe · 1901', l: 'The tower built to wire the<br><em>whole world</em> for free.' },
  ];
  let curBeat = -1;
  function setBeat(i: number): void {
    if (i === curBeat || !chapterEl || !lineEl) return; curBeat = i;
    chapterEl.style.opacity = '0'; lineEl.style.opacity = '0'; lineEl.style.transform = 'translateY(10px)';
    window.setTimeout(() => {
      chapterEl.textContent = beats[i].c; lineEl.innerHTML = beats[i].l;
      chapterEl.style.opacity = '0.85'; lineEl.style.opacity = '1'; lineEl.style.transform = 'translateY(0)';
    }, 380);
  }

  function readScroll(): void {
    const denom = Math.max(1, innerHeight * 6);   // ~600vh of travel through the lab
    target = THREE.MathUtils.clamp(window.scrollY / denom, 0, 1);
  }
  addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  // ---- render plumbing (UnrealBloom for the electric glow) ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.6, 0.3);
  composer.addPass(bloom);
  // 1910 film grade: grayscale inside the lab, warming to sepia as you step outside
  const monoPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uSepia: { value: 0.1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader:
      'uniform sampler2D tDiffuse; uniform float uSepia; varying vec2 vUv;' +
      'void main(){ vec4 c = texture2D(tDiffuse, vUv);' +
      ' float l = dot(c.rgb, vec3(0.299,0.587,0.114));' +
      ' float e = l * 2.1; l = e / (e + 0.8);' +   // filmic tonemap: lifts mid-tones, compresses highlights so it never blows out to white
      ' vec3 gray = vec3(l);' +
      ' vec3 sepia = vec3(min(1.0,l*1.14), l*0.93, l*0.70);' +
      ' gl_FragColor = vec4(mix(gray, sepia, uSepia), c.a); }',
  });
  composer.addPass(monoPass);

  function size(): void {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); addEventListener('resize', size);

  const clock = new THREE.Clock();
  function frame(): void {
    requestAnimationFrame(frame);
    if (!document.getElementById('dim-past')?.classList.contains('active')) return;
    const time = clock.elapsedTime + clock.getDelta();

    t += (target - t) * (reduced ? 1 : 0.08);

    const cz = THREE.MathUtils.lerp(camStart.z, camEnd.z, t);
    const sway = reduced ? 0 : Math.sin(time * 0.3) * 0.6 + Math.sin(t * Math.PI) * 1.4 * Math.sin(time * 0.2);
    camera.position.set(sway, THREE.MathUtils.lerp(camStart.y, camEnd.y, t) + (reduced ? 0 : Math.sin(time * 0.8) * 0.12), cz);
    camera.lookAt((reduced ? 0 : Math.sin(time * 0.18) * 1.2), 2.4, cz - 30);
    camFill.position.set(camera.position.x, camera.position.y + 1.5, cz - 7);

    if (!reduced) {
      for (let i = 0; i < amber.length; i++) amber[i].intensity = 4.2 + Math.sin(time * 7 + i * 1.7) * 0.45 + Math.random() * 0.2;
      for (let i = 0; i < coils.length; i++) coils[i].orb.scale.setScalar(3.2 * (1.4 + Math.sin(time * 5 + i) * 0.5 + Math.random() * 0.4));
      if (Math.random() < 0.6) {
        updateArc(arcs[0], coils[0].top, coils[1].top);
        updateArc(arcs[1], coils[0].top, new THREE.Vector3(coils[0].top.x + (Math.random() - 0.5) * 5, coils[0].top.y + 2.5, coils[0].top.z));
        updateArc(arcs[2], coils[1].top, new THREE.Vector3(coils[1].top.x + (Math.random() - 0.5) * 5, coils[1].top.y + 2.5, coils[1].top.z));
        for (const a of arcs) a.line.visible = true;
      } else for (const a of arcs) a.line.visible = false;
      // the magnifying transmitter — long branching discharge spreading outward
      if (Math.random() < 0.88) {
        for (let k = 0; k < mtArcs.length; k++) { const ang = Math.random() * Math.PI * 2, len = 7 + Math.random() * 11;
          updateArc(mtArcs[k], mtTop, new THREE.Vector3(mtTop.x + Math.cos(ang) * len, mtTop.y + (Math.random() - 0.35) * 7, mtTop.z + Math.sin(ang) * len));
          mtArcs[k].line.visible = true; }
      } else for (const a of mtArcs) a.line.visible = false;
    }

    const ext = THREE.MathUtils.smoothstep(t, 0.7, 1);
    // black-and-white inside the lab, warming into a sepia "splash of brown" once outside
    monoPass.uniforms.uSepia.value = 0.1 + THREE.MathUtils.smoothstep(t, 0.6, 0.82) * 0.72;
    sky.visible = t > 0.55;   // hide the night sky + stars while you're inside the lab
    towerGlow.intensity = ext * 3.2;
    domeGlow.scale.setScalar(18 + ext * 16 + (reduced ? 0 : Math.sin(time * 4) * ext * 4));
    if (!reduced) tower.rotation.y = Math.sin(time * 0.05) * 0.04;
    if (ext > 0.25 && !reduced && Math.random() < 0.18) {
      boltTop.set((Math.random() - 0.5) * 16, H + 36 + Math.random() * 14, TOWER_Z);
      updateArc(bolt, boltBase, boltTop); bolt.line.visible = true; towerGlow.intensity = 6;
    } else if (Math.random() < 0.4) bolt.line.visible = false;

    for (let i = beats.length - 1; i >= 0; i--) { if (t >= beats[i].p) { setBeat(i); break; } }
    if (hintEl) hintEl.style.opacity = t > 0.04 ? '0' : '0.7';
    // fade the floating story caption out as the arrival/close section scrolls in, so they don't overlap
    if (labUi) labUi.style.opacity = String(1 - THREE.MathUtils.smoothstep(t, 0.68, 0.78));

    composer.render();
    // draw the framed pictures again in their REAL colour, on top of the black-and-white world
    renderer.autoClear = false;
    camera.layers.set(1);
    renderer.render(scene, camera);
    camera.layers.set(0);
    renderer.autoClear = true;
  }
  frame();
}
