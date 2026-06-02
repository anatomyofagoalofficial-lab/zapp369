import * as THREE from 'three';

const started = new Set<string>();

/* HUB — electric arcs over the logo (2D canvas) */
export function startHubArcs() {
  const cv = document.getElementById('hub-arc-cv') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d')!;
  let W = 0, H = 0;
  const rsz = () => { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight || 280; };
  rsz(); window.addEventListener('resize', rsz);

  function jagged(x1: number, y1: number, x2: number, y2: number, r: number) {
    const dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy);
    if (d < 4) { ctx.lineTo(x2, y2); return; }
    const mx = (x1 + x2) / 2 + (-dy / d) * (Math.random() - .5) * r;
    const my = (y1 + y2) / 2 + (dx / d) * (Math.random() - .5) * r;
    jagged(x1, y1, mx, my, r * .5); jagged(mx, my, x2, y2, r * .5);
  }

  let frame = 0;
  (function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);
    frame++;
    if (!document.getElementById('hub')!.classList.contains('active')) return;
    const lx = W / 2, ly = H * .45;
    if (frame % 8 === 0) {
      const n = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        const ang = (Math.random() - .5) * 1.2 + (Math.PI * .5);
        const len = 20 + Math.random() * 60;
        const ex = lx - 60 + Math.cos(ang) * len, ey = ly - 20 + Math.sin(ang) * len;
        ctx.beginPath(); ctx.moveTo(lx - 60, ly - 20);
        jagged(lx - 60, ly - 20, ex, ey, 20);
        ctx.strokeStyle = 'rgba(180,220,255,0.25)'; ctx.lineWidth = 2.5; ctx.shadowBlur = 12; ctx.shadowColor = '#B4DCFF'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx - 60, ly - 20);
        jagged(lx - 60, ly - 20, ex, ey, 12);
        ctx.strokeStyle = 'rgba(255,220,80,0.7)'; ctx.lineWidth = 1; ctx.shadowBlur = 8; ctx.shadowColor = '#FFD700'; ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    const g = ctx.createRadialGradient(lx - 60, ly - 20, 0, lx - 60, ly - 20, 40);
    g.addColorStop(0, 'rgba(255,230,100,.12)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(lx - 120, ly - 80, 160, 120);
  })();
}

/* HUB — infinite galaxy with warp-travel into each dimension */
let _warpHub: ((dir: number) => void) | null = null;
/** Trigger a warp toward a dimension. dir: -1 past · 0 present · +1 future */
export function warpHub(dir = 0) { _warpHub?.(dir); }

export function startHubVortex() {
  const cv = document.getElementById('hub-cv') as HTMLCanvasElement | null;
  if (!cv) return;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, .1, 1200);
  cam.position.z = 6;

  // ── Infinite travelling starfield (recycles in z → endless) ──
  const SN = 6000, DEPTH = 460;
  const sp = new Float32Array(SN * 3), sc = new Float32Array(SN * 3);
  const PAL = [new THREE.Color(0xFFFFFF), new THREE.Color(0xFFE08A), new THREE.Color(0xBFD4FF), new THREE.Color(0xC9A8FF), new THREE.Color(0x8FE6FF)];
  for (let i = 0; i < SN; i++) {
    sp[i * 3] = (Math.random() - .5) * 170;
    sp[i * 3 + 1] = (Math.random() - .5) * 130;
    sp[i * 3 + 2] = -Math.random() * DEPTH;
    const c = PAL[Math.random() < .58 ? 0 : Math.floor(Math.random() * PAL.length)];
    sc[i * 3] = c.r; sc[i * 3 + 1] = c.g; sc[i * 3 + 2] = c.b;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('color', new THREE.BufferAttribute(sc, 3));
  const starMat = new THREE.PointsMaterial({ vertexColors: true, size: .5, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  scene.add(new THREE.Points(sg, starMat));

  // ── Spiral galaxy disc (3 arms → 3·6·9), tilted, sitting behind the logo ──
  const GN = 2800, GZ = -30;
  const gp = new Float32Array(GN * 3), gc = new Float32Array(GN * 3);
  const ARMS = 3;
  for (let i = 0; i < GN; i++) {
    const arm = i % ARMS;
    const t = Math.pow(Math.random(), .5) * 24;
    const ang = arm / ARMS * Math.PI * 2 + t * 0.42 + (Math.random() - .5) * (1.2 / (0.25 + t * 0.06));
    gp[i * 3] = Math.cos(ang) * t + (Math.random() - .5) * 1.6;
    gp[i * 3 + 1] = (Math.random() - .5) * 1.8 * Math.max(0, 1 - t / 34);
    gp[i * 3 + 2] = Math.sin(ang) * t;
    const c = new THREE.Color().lerpColors(new THREE.Color(0xFFE3A0), new THREE.Color(0x7C3AED), t / 24);
    gc[i * 3] = c.r; gc[i * 3 + 1] = c.g; gc[i * 3 + 2] = c.b;
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.BufferAttribute(gp, 3));
  gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
  const galaxy = new THREE.Points(gg, new THREE.PointsMaterial({ vertexColors: true, size: .34, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  galaxy.position.z = GZ; galaxy.rotation.x = -1.15;
  scene.add(galaxy);

  // ── Soft sprite texture (shared by nebula + glints) ──
  const softTex = (() => {
    const cc = document.createElement('canvas'); cc.width = cc.height = 128; const g2 = cc.getContext('2d')!;
    const rg = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,255,255,.9)'); rg.addColorStop(.35, 'rgba(255,255,255,.3)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = rg; g2.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(cc);
  })();

  // ── Nebula clouds — colored cosmic gas that breathes ──
  const NEB = [0x7C3AED, 0x06B6D4, 0xEC4899, 0xFFB020, 0x4F46E5, 0x10B981, 0x9945FF];
  const nebula: THREE.Sprite[] = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.SpriteMaterial({ map: softTex, color: NEB[i % NEB.length], transparent: true, opacity: 0.10 + Math.random() * 0.10, blending: THREE.AdditiveBlending, depthWrite: false });
    const s = new THREE.Sprite(m);
    const a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 30;
    s.position.set(Math.cos(a) * r, (Math.random() - .5) * 18, GZ + Math.sin(a) * r * 0.5 - Math.random() * 26);
    const sc = 28 + Math.random() * 46; s.scale.set(sc, sc, 1);
    s.userData = { ph: Math.random() * Math.PI * 2, sp: 0.15 + Math.random() * 0.4, baseOp: m.opacity, dx: (Math.random() - .5) * 0.012 };
    nebula.push(s); scene.add(s);
  }

  // ── Shooting stars ──
  interface Shoot { line: THREE.Line; mat: THREE.LineBasicMaterial; life: number; vx: number; vy: number; vz: number; }
  const shoot: Shoot[] = [];
  function spawnShoot() {
    const sx = (Math.random() - .5) * 130, sy = 24 + Math.random() * 26, sz = -30 - Math.random() * 70;
    const sp2 = 2.0 + Math.random() * 2.2, ang = Math.PI * (0.7 + Math.random() * 0.5);
    const vx = Math.cos(ang) * sp2, vy = -(0.7 + Math.random() * 1.1) * sp2 * 0.5, vz = (0.2 + Math.random() * 0.5);
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(sx, sy, sz), new THREE.Vector3(sx, sy, sz)]);
    const mat = new THREE.LineBasicMaterial({ color: 0xFFF3D0, transparent: true, opacity: 1, blending: THREE.AdditiveBlending });
    const line = new THREE.Line(geo, mat); scene.add(line);
    shoot.push({ line, mat, life: 1, vx, vy, vz });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); }, { passive: true });

  let warpAmt = 0, warpDir = 0;
  _warpHub = (dir: number) => { warpAmt = 1; warpDir = dir; };

  const pa = sg.attributes.position.array as Float32Array;
  let tt = 0;
  (function anim() {
    requestAnimationFrame(anim);
    tt += .016;
    const speed = 0.32 + warpAmt * 12;
    for (let i = 0; i < SN; i++) {
      pa[i * 3 + 2] += speed;
      if (pa[i * 3 + 2] > cam.position.z + 6) {
        pa[i * 3 + 2] = -DEPTH;
        pa[i * 3] = (Math.random() - .5) * 170;
        pa[i * 3 + 1] = (Math.random() - .5) * 130;
      }
    }
    sg.attributes.position.needsUpdate = true;
    starMat.size = 0.5 + warpAmt * 1.6;
    galaxy.rotation.z += 0.0006 + warpAmt * 0.012;
    galaxy.rotation.x += ((-1.15 + my * 0.12) - galaxy.rotation.x) * 0.04;

    // nebula breathing + slow drift
    for (const s of nebula) {
      const u = s.userData;
      (s.material as THREE.SpriteMaterial).opacity = u.baseOp * (0.55 + 0.45 * Math.sin(tt * u.sp + u.ph)) * (1 + warpAmt);
      s.position.x += u.dx;
      if (s.position.x > 40) s.position.x = -40; else if (s.position.x < -40) s.position.x = 40;
    }

    // shooting stars
    if (Math.random() < 0.028 && shoot.length < 6) spawnShoot();
    for (let i = shoot.length - 1; i >= 0; i--) {
      const s = shoot[i]; s.life -= 0.012;
      const arr = s.line.geometry.attributes.position.array as Float32Array;
      arr[0] += s.vx; arr[1] += s.vy; arr[2] += s.vz;
      arr[3] = arr[0] - s.vx * 7; arr[4] = arr[1] - s.vy * 7; arr[5] = arr[2] - s.vz * 7;
      s.line.geometry.attributes.position.needsUpdate = true;
      s.mat.opacity = Math.max(0, s.life);
      if (s.life <= 0) { scene.remove(s.line); s.line.geometry.dispose(); s.mat.dispose(); shoot.splice(i, 1); }
    }

    // parallax + warp dolly forward (fly into the distance), drift toward the chosen era
    cam.position.x += ((mx * 1.3 + warpDir * warpAmt * 2.4) - cam.position.x) * 0.05;
    cam.position.y += (-my * 1.05 - cam.position.y) * 0.05;
    cam.position.z += ((6 - warpAmt * 5.5) - cam.position.z) * 0.14;
    cam.lookAt(0, 0, GZ);
    warpAmt *= 0.93; if (warpAmt < 0.001) warpAmt = 0;
    renderer.render(scene, cam);
  })();
  window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); });
}

export function startDimCanvas(name: string) {
  if (started.has(name)) return; started.add(name);
  if (name === 'past') startPast();
  else if (name === 'present') startPresent();
  else if (name === 'future') startFuture();
  else if (name === 'winter') startWinter();
}

function startPast() {
  const cv = document.getElementById('past-canvas') as HTMLCanvasElement | null; if (!cv) return;
  const par = cv.parentElement as HTMLElement;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x120c06, 0.018);
  const cam = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
  cam.position.set(0, 3, 16);
  const resize = () => { const r = par.getBoundingClientRect(); renderer.setSize(r.width || 1, r.height || 1); cam.aspect = (r.width || 1) / (r.height || 1); cam.updateProjectionMatrix(); };

  const basic = (col: number, opts: THREE.MeshBasicMaterialParameters = {}) => new THREE.MeshBasicMaterial({ color: col, ...opts });
  const seg3 = (pts: THREE.Vector3[], m: THREE.LineBasicMaterial) => scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5a4426, transparent: true, opacity: 0.4 });
  const beamMat = new THREE.LineBasicMaterial({ color: 0x6a5230, transparent: true, opacity: 0.55 });

  // ── ROOM ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 70), basic(0x241a0e)); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(90, 34), basic(0x1c140a)); back.position.set(0, 17, -24); scene.add(back);
  for (let i = -22; i <= 22; i++) seg3([new THREE.Vector3(i * 2.0, 0, -23.9), new THREE.Vector3(i * 2.0, 34, -23.9)], lineMat);
  for (let i = -16; i <= 16; i++) seg3([new THREE.Vector3(i * 2.4, 0.02, -24), new THREE.Vector3(i * 4.4, 0.02, 24)], lineMat);
  for (let z = -22; z <= 8; z += 3.2) { seg3([new THREE.Vector3(-30, 24, z), new THREE.Vector3(0, 33, z), new THREE.Vector3(30, 24, z)], beamMat); seg3([new THREE.Vector3(-30, 24, z), new THREE.Vector3(30, 24, z)], lineMat); }
  for (let i = -13; i <= 13; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 10, 0.14), basic(0x3a2c19)); p.position.set(i * 2.7, 5, -17); scene.add(p); }

  // ── LEFT primary coil + sphere electrode (lightning source) ──
  const coil = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 9, 30, 1, true), basic(0x3a2c19, { wireframe: true, transparent: true, opacity: 0.6 }));
  coil.position.set(-13, 4.5, -4); scene.add(coil);
  const SRC = new THREE.Vector3(-13, 10.6, -4);
  const electrode = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), basic(0x12100a)); electrode.position.copy(SRC); scene.add(electrode);
  const eglow = new THREE.Mesh(new THREE.SphereGeometry(2.3, 20, 20), basic(0xFFE8B0, { transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })); eglow.position.copy(SRC); scene.add(eglow);

  // ── RIGHT magnifying transmitter ──
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 13, 18), basic(0x0d0a05)); col.position.set(15, 6.5, -6); scene.add(col);
  const colTop = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.2, 18), basic(0x161009)); colTop.position.set(15, 13, -6); scene.add(colTop);

  // ── CENTRE round cage ──
  const cage = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 6, 22, 1, true), basic(0x3a2c19, { wireframe: true, transparent: true, opacity: 0.55 })); cage.position.set(0, 3, -2); scene.add(cage);

  // ── tripod ──
  ([[-1.4, 1.4], [1.4, 1.4], [0, -1.6]] as const).forEach(([dx, dz]) => seg3([new THREE.Vector3(6 + dx, 0, -4 + dz), new THREE.Vector3(6, 7, -4)], beamMat));

  // ── seated Tesla, reading ──
  const man = new THREE.Group();
  man.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.8, 2.4, 10), basic(0x070402)));
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 14, 14), basic(0x070402)); head.position.y = 1.7; man.add(head);
  const legs = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 1.6), basic(0x070402)); legs.position.set(0, -1.0, 0.7); man.add(legs);
  const chair = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.15), basic(0x0b0805)); chair.position.set(0, 0.2, -0.6); man.add(chair);
  man.position.set(-7, 1.6, 5); man.rotation.y = 0.5; scene.add(man);

  // ── LIGHTNING ──
  const bolts = new THREE.Group(); scene.add(bolts);
  const boltMat = () => new THREE.LineBasicMaterial({ color: 0xFFF6DC, transparent: true, opacity: 0.45 + Math.random() * 0.5, blending: THREE.AdditiveBlending });
  function rebuild() {
    bolts.clear();
    for (let i = 0; i < 9; i++) {
      const end = new THREE.Vector3(SRC.x + 8 + Math.random() * 22, SRC.y + (Math.random() - 0.6) * 9, SRC.z + (Math.random() - 0.5) * 11);
      const segN = 9, pts = [SRC.clone()];
      for (let s = 1; s < segN; s++) { const t = s / segN; pts.push(new THREE.Vector3(SRC.x + (end.x - SRC.x) * t + (Math.random() - 0.5) * 2.6, SRC.y + (end.y - SRC.y) * t + (Math.random() - 0.5) * 2.6, SRC.z + (end.z - SRC.z) * t + (Math.random() - 0.5) * 2.6)); }
      pts.push(end);
      bolts.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), boltMat()));
      if (Math.random() < 0.5) { const f = pts[Math.floor(segN * 0.6)]; const fe = new THREE.Vector3(f.x + (Math.random() - 0.5) * 7, f.y + (Math.random() - 0.7) * 5, f.z + (Math.random() - 0.5) * 5); bolts.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([f.clone(), fe]), boltMat())); }
    }
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); }, { passive: true });
  let frame = 0, t = 0;
  function anim() {
    requestAnimationFrame(anim);
    if (!document.getElementById('dim-past')?.classList.contains('active')) return;
    frame++; t += 0.016;
    if (frame % 5 === 0) rebuild();
    eglow.scale.setScalar(1 + 0.25 * Math.sin(t * 9) + Math.random() * 0.15);
    cam.position.x += ((mx * 5 - 1) - cam.position.x) * 0.025;
    cam.position.y += ((3 - my * 2.5) - cam.position.y) * 0.025;
    cam.position.z = 16 + Math.sin(t * 0.15) * 1.2;
    cam.lookAt(-2, 4.5, -4);
    renderer.render(scene, cam);
  }
  resize(); window.addEventListener('resize', resize); rebuild(); anim();
}

function startPresent() {
  const cv = document.getElementById('present-canvas') as HTMLCanvasElement | null; if (!cv) return;
  const par = document.getElementById('dim-present') as HTMLElement;
  const W = () => par.offsetWidth || innerWidth, H = () => par.scrollHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(W(), H());
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, W() / H(), .1, 200); cam.position.z = 10;
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(3.2, 28, 18), new THREE.MeshBasicMaterial({ color: 0xCFE8FF, wireframe: true, transparent: true, opacity: .14 })));
  const ng = new THREE.Group(); scene.add(ng); const npts: THREE.Vector3[] = [], nc = 80;
  for (let i = 0; i < nc; i++) { const phi = Math.acos(-1 + 2 * i / nc), theta = Math.sqrt(nc * Math.PI) * phi; const x = 3.2 * Math.sin(phi) * Math.cos(theta), y = 3.2 * Math.cos(phi), z = 3.2 * Math.sin(phi) * Math.sin(theta); npts.push(new THREE.Vector3(x, y, z)); const nm = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 4), new THREE.MeshBasicMaterial({ color: 0xEAF3FC, transparent: true, opacity: .7 })); nm.position.set(x, y, z); nm.userData.ph = Math.random() * Math.PI * 2; ng.add(nm); }
  const cp: number[] = []; for (let i = 0; i < nc; i++) for (let j = i + 1; j < nc; j++) if (npts[i].distanceTo(npts[j]) < 1.55) cp.push(npts[i].x, npts[i].y, npts[i].z, npts[j].x, npts[j].y, npts[j].z);
  const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cp), 3)); scene.add(new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0xCFE8FF, transparent: true, opacity: .2 })));
  let t = 0; (function anim() { requestAnimationFrame(anim); t += .004; ng.rotation.y = t * .09; ng.children.forEach(n => { if (n.userData.ph !== undefined) n.scale.setScalar(.65 + .55 * Math.sin(t * 2 + n.userData.ph)); }); renderer.render(scene, cam); })();
}

function startFuture() {
  const cv = document.getElementById('future-canvas') as HTMLCanvasElement | null; if (!cv) return;
  const par = document.getElementById('dim-future') as HTMLElement;
  const W = () => par.offsetWidth || innerWidth, H = () => par.scrollHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(W(), H());
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W() / H(), .1, 200); cam.position.z = 8;
  const COLS = [0x7C3AED, 0x06B6D4, 0x10B981, 0xEC4899, 0xA78BFA];
  ([[new THREE.IcosahedronGeometry(2, 0), 0x7C3AED, .12, .007], [new THREE.OctahedronGeometry(1.4, 0), 0x06B6D4, .1, -.011], [new THREE.TorusGeometry(2.8, .013, 4, 80), 0xA78BFA, .08, .005]] as const).forEach(([g, c, op, sp]) => { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: op, blending: THREE.AdditiveBlending })); m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0); m.userData.sp = sp; scene.add(m); });
  const fpN = 120, fpP = new Float32Array(fpN * 3), fpC = new Float32Array(fpN * 3);
  for (let i = 0; i < fpN; i++) { fpP[i * 3] = (Math.random() - .5) * 16; fpP[i * 3 + 1] = (Math.random() - .5) * 14; fpP[i * 3 + 2] = (Math.random() - .5) * 5; const c = new THREE.Color(COLS[Math.floor(Math.random() * COLS.length)]); fpC[i * 3] = c.r; fpC[i * 3 + 1] = c.g; fpC[i * 3 + 2] = c.b; }
  const fpG = new THREE.BufferGeometry(); fpG.setAttribute('position', new THREE.BufferAttribute(fpP, 3)); fpG.setAttribute('color', new THREE.BufferAttribute(fpC, 3)); scene.add(new THREE.Points(fpG, new THREE.PointsMaterial({ vertexColors: true, size: .07, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, sizeAttenuation: true })));
  let t = 0; (function anim() { requestAnimationFrame(anim); t += .004; scene.children.filter(c => c.type === 'Mesh').forEach(m => { m.rotation.x += m.userData.sp * .7 || .004; m.rotation.y += m.userData.sp || .006; }); const pp = fpG.attributes.position.array as Float32Array; for (let i = 0; i < fpN; i++) { pp[i * 3 + 1] -= .0025; if (pp[i * 3 + 1] < -8) pp[i * 3 + 1] = 8; } fpG.attributes.position.needsUpdate = true; renderer.render(scene, cam); })();
}

function startWinter() {
  const cv = document.getElementById('winter-canvas') as HTMLCanvasElement | null; if (!cv) return;
  const par = document.getElementById('dim-winter') as HTMLElement;
  const W = () => par.offsetWidth || innerWidth, H = () => par.scrollHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(W(), H());
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W() / H(), .1, 200); cam.position.z = 8;
  const N = 300, pos = new Float32Array(N * 3), vel: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 20; pos[i * 3 + 1] = Math.random() * 16 - 4; pos[i * 3 + 2] = (Math.random() - .5) * 8; vel.push({ x: (Math.random() - .5) * .01, y: -(0.005 + Math.random() * .01) }); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x78B4DC, size: .06, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, sizeAttenuation: true })));
  ([[2.5, .008, 80, 0x78B4DC, .1, .005], [3.2, .006, 60, 0xA8D8F0, .07, -.007]] as const).forEach(([r, t, s, c, op, sp]) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 4, s), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, blending: THREE.AdditiveBlending })); m.rotation.x = Math.PI / 3; m.userData.sp = sp; scene.add(m); });
  let t = 0; (function anim() { requestAnimationFrame(anim); t += .003; const p = g.attributes.position.array as Float32Array; for (let i = 0; i < N; i++) { p[i * 3] += vel[i].x; p[i * 3 + 1] += vel[i].y; p[i * 3 + 2] += vel[i].x * .5; if (p[i * 3 + 1] < -8) p[i * 3 + 1] = 8; } g.attributes.position.needsUpdate = true; scene.children.filter(c => c.type === 'Mesh').forEach(m => m.rotation.z += m.userData.sp || 0); renderer.render(scene, cam); })();
}
