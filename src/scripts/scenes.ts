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

/* HUB — 3D vortex */
export function startHubVortex() {
  const cv = document.getElementById('hub-cv') as HTMLCanvasElement | null;
  if (!cv) return;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 200);
  cam.position.z = 7;
  const tkg = new THREE.TorusKnotGeometry(2, 0.5, 128, 16);
  const tkm = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true, transparent: true, opacity: .18 });
  const tk = new THREE.Mesh(tkg, tkm); scene.add(tk);
  ([[3.5, .012, 100, 0xFFD700, .1], [4.2, .009, 80, 0x9945FF, .08], [2.8, .008, 60, 0x06B6D4, .09]] as const).forEach(([r, t, s, c, op]) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 4, s), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, blending: THREE.AdditiveBlending }));
    m.rotation.x = Math.PI * (Math.random() * .5 + .2); scene.add(m); m.userData.sp = (Math.random() - .5) * .008;
  });
  const N = 1500, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const COLS = [new THREE.Color(0xFFD700), new THREE.Color(0x9945FF), new THREE.Color(0x06B6D4), new THREE.Color(0xEC4899)];
  for (let i = 0; i < N; i++) { const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 6, h = (Math.random() - .5) * 8; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = h; pos[i * 3 + 2] = Math.sin(a) * r; const c = COLS[Math.floor(Math.random() * COLS.length)]; col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ vertexColors: true, size: .05, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, sizeAttenuation: true })));
  let mxn = 0;
  document.addEventListener('mousemove', e => { mxn = (e.clientX / innerWidth - .5) * .5; }, { passive: true });
  (function anim() { requestAnimationFrame(anim); tk.rotation.x += .004; tk.rotation.y += .006; scene.children.filter(c => c.type === 'Mesh' && (c as THREE.Mesh).geometry.type === 'TorusGeometry').forEach(m => m.rotation.z += m.userData.sp || 0); cam.position.x += (mxn - cam.position.x) * .04; cam.lookAt(0, 0, 0); renderer.render(scene, cam); })();
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
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(par.offsetWidth || 500, par.offsetHeight || 600);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(52, (par.offsetWidth || 500) / (par.offsetHeight || 600), .1, 100); cam.position.set(1.5, 1.5, 8); cam.lookAt(0, .5, 0);
  const wm = (c: number, op: number) => new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: op, blending: THREE.AdditiveBlending });
  const tw = new THREE.Mesh(new THREE.CylinderGeometry(.08, .55, 4, 8, 5, true), wm(0xB87333, .3)); tw.position.y = -1; scene.add(tw);
  const dm = new THREE.Mesh(new THREE.SphereGeometry(.62, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), wm(0xD4A820, .4)); dm.position.y = 1.05; scene.add(dm);
  const glw = new THREE.Mesh(new THREE.SphereGeometry(.11, 8, 8), new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: .6, blending: THREE.AdditiveBlending })); glw.position.y = 1.7; scene.add(glw);
  const arcG = new THREE.Group(); scene.add(arcG);
  function arc() { arcG.clear(); for (let a = 0; a < 4; a++) { const ang = (a / 4) * Math.PI * 2 + Math.random() * .5, ex = Math.cos(ang) * (1.4 + Math.random() * 2), ey = .5 + Math.random() * 2, ez = Math.sin(ang) * (1.4 + Math.random() * 2); const pts = [new THREE.Vector3(0, 1.7, 0)]; for (let s = 1; s < 6; s++) pts.push(new THREE.Vector3(ex * (s / 6) + (Math.random() - .5) * .4, 1.7 + ey * (s / 6) + (Math.random() - .5) * .3, ez * (s / 6) + (Math.random() - .5) * .4)); pts.push(new THREE.Vector3(ex, 1.7 + ey, ez)); const cg = new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts).getPoints(20)); arcG.add(new THREE.Line(cg, new THREE.LineBasicMaterial({ color: 0xD4A820, transparent: true, opacity: .4 + Math.random() * .4, blending: THREE.AdditiveBlending }))); } }
  arc(); setInterval(arc, 900);
  let t = 0; (function anim() { requestAnimationFrame(anim); t += .004; tw.rotation.y = t * .15; dm.rotation.y = -t * .1; arcG.rotation.y = t * .07; glw.scale.setScalar(.85 + .25 * Math.sin(t * 2.8)); renderer.render(scene, cam); })();
}

function startPresent() {
  const cv = document.getElementById('present-canvas') as HTMLCanvasElement | null; if (!cv) return;
  const par = document.getElementById('dim-present') as HTMLElement;
  const W = () => par.offsetWidth || innerWidth, H = () => par.scrollHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(W(), H());
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, W() / H(), .1, 200); cam.position.z = 10;
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(3.2, 28, 18), new THREE.MeshBasicMaterial({ color: 0x0D2233, wireframe: true, transparent: true, opacity: .1 })));
  const ng = new THREE.Group(); scene.add(ng); const npts: THREE.Vector3[] = [], nc = 80;
  for (let i = 0; i < nc; i++) { const phi = Math.acos(-1 + 2 * i / nc), theta = Math.sqrt(nc * Math.PI) * phi; const x = 3.2 * Math.sin(phi) * Math.cos(theta), y = 3.2 * Math.cos(phi), z = 3.2 * Math.sin(phi) * Math.sin(theta); npts.push(new THREE.Vector3(x, y, z)); const nm = new THREE.Mesh(new THREE.SphereGeometry(.06, 6, 4), new THREE.MeshBasicMaterial({ color: 0x1A4A6B, transparent: true, opacity: .55 })); nm.position.set(x, y, z); nm.userData.ph = Math.random() * Math.PI * 2; ng.add(nm); }
  const cp: number[] = []; for (let i = 0; i < nc; i++) for (let j = i + 1; j < nc; j++) if (npts[i].distanceTo(npts[j]) < 1.55) cp.push(npts[i].x, npts[i].y, npts[i].z, npts[j].x, npts[j].y, npts[j].z);
  const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(cp), 3)); scene.add(new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0x1A4A6B, transparent: true, opacity: .12 })));
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
