"use client";

import { useEffect, useRef } from "react";

/**
 * The cinematic 3D Wardenclyffe energy tower — the ⚡ZAPP hero centerpiece.
 * Ported from the original v1 tesla3d.js to modern `three` (ESM). Octagonal
 * tapered lattice, open bronze coil crown with toroid electrode + 9 spires,
 * Tesla coil stack, white-hot energy orb, live branching arcs, 369 rising
 * motes, polar floor grid, UnrealBloom + filmic colour-grade. Honours
 * prefers-reduced-motion (renders one static frame), pauses off-screen / when
 * the tab is hidden, and degrades silently if WebGL is unavailable.
 */
export function TeslaTower3D({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { EffectComposer } = await import(
        "three/examples/jsm/postprocessing/EffectComposer.js"
      );
      const { RenderPass } = await import(
        "three/examples/jsm/postprocessing/RenderPass.js"
      );
      const { UnrealBloomPass } = await import(
        "three/examples/jsm/postprocessing/UnrealBloomPass.js"
      );
      const { ShaderPass } = await import(
        "three/examples/jsm/postprocessing/ShaderPass.js"
      );
      const { mergeGeometries } = await import(
        "three/examples/jsm/utils/BufferGeometryUtils.js"
      );
      if (disposed || !mountRef.current) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      const W = () => mount.clientWidth || window.innerWidth;
      const H = () => mount.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(W(), H());
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x06050a, 0.05);
      const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
      camera.position.set(0, 1.6, 11.4);

      function envTex() {
        const c = document.createElement("canvas");
        c.width = 512; c.height = 256;
        const x = c.getContext("2d")!;
        const g = x.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, "#070510"); g.addColorStop(0.42, "#2a1a08");
        g.addColorStop(0.5, "#ffcf86"); g.addColorStop(0.58, "#52300d"); g.addColorStop(1, "#05040a");
        x.fillStyle = g; x.fillRect(0, 0, 512, 256);
        const rg = x.createRadialGradient(370, 86, 0, 370, 86, 140);
        rg.addColorStop(0, "rgba(255,244,210,0.95)"); rg.addColorStop(1, "rgba(255,200,120,0)");
        x.fillStyle = rg; x.fillRect(0, 0, 512, 256);
        const t = new THREE.Texture(c);
        t.mapping = THREE.EquirectangularReflectionMapping; t.needsUpdate = true;
        return t;
      }
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        pmrem.compileEquirectangularShader();
        scene.environment = pmrem.fromEquirectangular(envTex()).texture;
      } catch { /* env optional */ }

      scene.add(new THREE.AmbientLight(0x241a08, 0.6));
      const key = new THREE.PointLight(0xffd27a, 2.2, 70); key.position.set(6, 10, 8); scene.add(key);
      const rim = new THREE.PointLight(0xff6a14, 1.5, 70); rim.position.set(-7, 3, -6); scene.add(rim);
      const fill = new THREE.PointLight(0x6a4fff, 0.45, 60); fill.position.set(-5, 7, 7); scene.add(fill);

      const group = new THREE.Group(); scene.add(group);
      group.position.set(1.7, -0.2, 0);

      function glowTex() {
        const c = document.createElement("canvas"); c.width = c.height = 128;
        const x = c.getContext("2d")!;
        const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,238,190,1)"); g.addColorStop(0.3, "rgba(255,202,96,0.55)"); g.addColorStop(1, "rgba(255,180,60,0)");
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      }
      const GTEX = glowTex();

      const steel = new THREE.MeshStandardMaterial({ color: 0x9c7434, metalness: 1, roughness: 0.34, emissive: 0x1d1304, emissiveIntensity: 0.5, envMapIntensity: 1.25 });
      const steelD = new THREE.MeshStandardMaterial({ color: 0x7a5826, metalness: 1, roughness: 0.42, emissive: 0x150d03, emissiveIntensity: 0.4, envMapIntensity: 1.1 });
      const copper = new THREE.MeshStandardMaterial({ color: 0xa85f1d, metalness: 1, roughness: 0.52, emissive: 0x241204, emissiveIntensity: 0.34, envMapIntensity: 0.78 });
      const coilM = new THREE.MeshStandardMaterial({ color: 0xffb866, metalness: 0.9, roughness: 0.25, emissive: 0xff7a1e, emissiveIntensity: 1.4, envMapIntensity: 1.2 });

      const towerH = 4.4, baseR = 1.05, topR = 0.34, LEGS = 8, SEGS = 9;
      const legAng = (i: number) => (i / LEGS) * Math.PI * 2 + Math.PI / LEGS;
      const radAt = (t: number) => baseR * (1 - t) + topR * t;
      const nodeV = (i: number, s: number) => {
        const a = legAng(i), t = s / SEGS, r = radAt(t);
        return new THREE.Vector3(Math.cos(a) * r, -towerH / 2 + t * towerH, Math.sin(a) * r);
      };
      const steelGeos: import("three").BufferGeometry[] = [];
      const braceGeos: import("three").BufferGeometry[] = [];
      for (let i = 0; i < LEGS; i++) {
        const pts = []; for (let s = 0; s <= SEGS; s++) pts.push(nodeV(i, s));
        steelGeos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), SEGS * 3, 0.05, 8, false));
        const ni = (i + 1) % LEGS;
        for (let s = 0; s < SEGS; s++) {
          const a0 = nodeV(i, s), a1 = nodeV(i, s + 1), b0 = nodeV(ni, s), b1 = nodeV(ni, s + 1);
          braceGeos.push(new THREE.TubeGeometry(new THREE.LineCurve3(a0, b1), 1, 0.02, 5, false));
          braceGeos.push(new THREE.TubeGeometry(new THREE.LineCurve3(b0, a1), 1, 0.02, 5, false));
        }
      }
      for (let s = 0; s <= SEGS; s++) {
        const t = s / SEGS, r = radAt(t), y = -towerH / 2 + t * towerH;
        const ringGeo = new THREE.TorusGeometry(r, 0.026, 8, 8 * LEGS);
        ringGeo.rotateX(Math.PI / 2); ringGeo.translate(0, y, 0);
        steelGeos.push(ringGeo);
      }
      group.add(new THREE.Mesh(mergeGeometries(steelGeos, false), steel));
      group.add(new THREE.Mesh(mergeGeometries(braceGeos, false), steelD));

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, towerH + 1.2, 12), copper);
      shaft.position.y = -0.4; group.add(shaft);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(baseR + 0.18, baseR + 0.42, 0.34, 8), new THREE.MeshStandardMaterial({ color: 0x4a3216, metalness: 0.5, roughness: 0.85, envMapIntensity: 0.6 }));
      base.position.y = -towerH / 2 - 0.12; group.add(base);
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(baseR + 0.5, baseR + 0.7, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0x2e2010, metalness: 0.4, roughness: 0.9, envMapIntensity: 0.5 }));
      plinth.position.y = -towerH / 2 - 0.3; group.add(plinth);

      const domeY = towerH / 2;
      const crown = new THREE.Group(); crown.position.y = domeY; group.add(crown);
      const crownH = 0.72, rBot = topR + 0.06, rTop = 0.7, crownTop = domeY + crownH;
      const bronze = new THREE.MeshStandardMaterial({ color: 0xb06a26, metalness: 1, roughness: 0.42, emissive: 0x2a1505, emissiveIntensity: 0.42, envMapIntensity: 1.1 });
      const bronzeLit = new THREE.MeshStandardMaterial({ color: 0xffb866, metalness: 0.94, roughness: 0.24, emissive: 0xff7a1e, emissiveIntensity: 1.25, envMapIntensity: 1.2 });
      const coilPts = []; const TURNS = 9, CSTEPS = 9 * 40;
      for (let k = 0; k <= CSTEPS; k++) {
        const t = k / CSTEPS, a = TURNS * Math.PI * 2 * t, r = rBot + (rTop - rBot) * t, y = crownH * t;
        coilPts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      crown.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPts), CSTEPS, 0.028, 8, false), bronze));
      const toroid = new THREE.Mesh(new THREE.TorusGeometry(rTop, 0.07, 18, 64), bronzeLit);
      toroid.rotation.x = Math.PI / 2; toroid.position.y = crownH; crown.add(toroid);
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        const b = new THREE.Vector3(Math.cos(a) * rTop, crownH, Math.sin(a) * rTop);
        const m = new THREE.Vector3(Math.cos(a) * rTop * 0.7, crownH + 0.34, Math.sin(a) * rTop * 0.7);
        const tp = new THREE.Vector3(Math.cos(a) * 0.1, crownH + 0.62, Math.sin(a) * 0.1);
        crown.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([b, m, tp]), 24, 0.013, 6, false), bronze));
      }
      const seed = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 1), bronzeLit);
      seed.position.y = crownH + 0.62; crown.add(seed);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(rBot, topR + 0.02, 0.16, 9), steel);
      collar.position.y = -0.05; crown.add(collar);

      for (let i = 0; i < 5; i++) {
        const r = 0.26 - i * 0.03;
        const c = new THREE.Mesh(new THREE.TorusGeometry(r, 0.028, 8, 40), coilM);
        c.rotation.x = Math.PI / 2; c.position.y = domeY - 1 + i * 0.14; group.add(c);
      }

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.95, 10), copper);
      mast.position.y = crownTop + 0.18; group.add(mast);
      const orbY = crownTop + 0.78;
      const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      orb.position.y = orbY; group.add(orb);
      const orbLight = new THREE.PointLight(0xffe7ac, 2.4, 36); orbLight.position.y = orbY; group.add(orbLight);
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: GTEX, color: 0xffffff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.95 }));
      core.position.y = orbY; core.scale.set(0.95, 0.95, 1); group.add(core);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GTEX, color: 0xffe3a0, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
      glow.position.y = orbY; glow.scale.set(2, 2, 1); group.add(glow);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: GTEX, color: 0xffc874, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.4 }));
      halo.position.y = orbY; halo.scale.set(3.8, 3.8, 1); group.add(halo);

      const ARCS = 6, SEG = 22;
      const arcs: { line: import("three").Line; target: import("three").Vector3 }[] = [];
      for (let i = 0; i < ARCS; i++) {
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SEG * 3), 3));
        const mat = new THREE.LineBasicMaterial({ color: 0xfff2cc, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
        const line = new THREE.Line(g, mat); group.add(line);
        arcs.push({ line, target: new THREE.Vector3() });
      }
      function reseed(a: { target: import("three").Vector3 }) {
        const ang = Math.random() * Math.PI * 2, dist = 1.1 + Math.random() * 1.5, dy = 0.4 + Math.random() * -2;
        a.target.set(Math.cos(ang) * dist, orbY + dy, Math.sin(ang) * dist);
      }
      function bolt(a: { line: import("three").Line; target: import("three").Vector3 }) {
        const p = (a.line.geometry.attributes.position as import("three").BufferAttribute).array as Float32Array;
        const ex = a.target;
        for (let i = 0; i < SEG; i++) {
          const t = i / (SEG - 1), j = i > 0 && i < SEG - 1 ? 0.12 * (1 - Math.abs(t - 0.5) * 1.2) : 0;
          p[i * 3] = ex.x * t + (Math.random() - 0.5) * j;
          p[i * 3 + 1] = orbY + (ex.y - orbY) * t + (Math.random() - 0.5) * j;
          p[i * 3 + 2] = ex.z * t + (Math.random() - 0.5) * j;
        }
        a.line.geometry.attributes.position.needsUpdate = true;
      }
      arcs.forEach((a) => { reseed(a); bolt(a); });

      const N = 369, pg = new THREE.BufferGeometry(), pa = new Float32Array(N * 3), pv: number[] = [];
      for (let i = 0; i < N; i++) {
        const r = 2 + Math.random() * 5.5, ang = Math.random() * Math.PI * 2;
        pa[i * 3] = Math.cos(ang) * r; pa[i * 3 + 1] = -2.5 + Math.random() * 9; pa[i * 3 + 2] = Math.sin(ang) * r;
        pv.push(0.006 + Math.random() * 0.02);
      }
      pg.setAttribute("position", new THREE.BufferAttribute(pa, 3));
      const points = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.13, map: GTEX, color: 0xffd27a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 }));
      scene.add(points);

      const Mn = 144, sg = new THREE.BufferGeometry(), sa = new Float32Array(Mn * 3), sv: number[] = [];
      for (let i = 0; i < Mn; i++) {
        const r = Math.random() * 1.6, ang = Math.random() * Math.PI * 2;
        sa[i * 3] = Math.cos(ang) * r; sa[i * 3 + 1] = orbY - 1.5 + Math.random() * 3; sa[i * 3 + 2] = Math.sin(ang) * r;
        sv.push(0.02 + Math.random() * 0.05);
      }
      sg.setAttribute("position", new THREE.BufferAttribute(sa, 3));
      const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.06, map: GTEX, color: 0xfff0c4, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.95 }));
      group.add(sparks);

      const floorY = -towerH / 2 - 0.4;
      const GMAT = new THREE.LineBasicMaterial({ color: 0x8a5a18, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
      for (let ri = 1; ri <= 9; ri++) {
        const rr = ri * 0.9, seg = 72, pos = new Float32Array((seg + 1) * 3);
        for (let s = 0; s <= seg; s++) { const th = (s / seg) * Math.PI * 2; pos[s * 3] = Math.cos(th) * rr; pos[s * 3 + 1] = floorY; pos[s * 3 + 2] = Math.sin(th) * rr; }
        const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        group.add(new THREE.LineLoop(rg, GMAT));
      }
      const disc = new THREE.Sprite(new THREE.SpriteMaterial({ map: GTEX, color: 0xffaa3c, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.55 }));
      disc.position.y = floorY + 0.02; disc.scale.set(6.8, 6.8, 1); group.add(disc);
      const lshaft = new THREE.Sprite(new THREE.SpriteMaterial({ map: GTEX, color: 0xffd27a, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.42 }));
      lshaft.position.y = orbY + 1.7; lshaft.scale.set(1.6, 8, 1); group.add(lshaft);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(W() * 0.5, H() * 0.5), 0.62, 0.42, 0.9);
      composer.addPass(bloomPass);
      const GradeShader = {
        uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: [
          "precision highp float;",
          "uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;",
          "float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }",
          "void main(){",
          "  vec2 uv=vUv; vec4 src=texture2D(tDiffuse, uv); vec3 c=src.rgb;",
          "  float l=dot(c, vec3(0.299,0.587,0.114));",
          "  c*=mix(vec3(0.84,0.94,1.08), vec3(1.07,0.99,0.86), smoothstep(0.12,0.78,l));",
          "  c=mix(vec3(l), c, 1.07); c=(c-0.5)*1.075+0.5;",
          "  float d=distance(uv, vec2(0.5)); c*= 0.74 + 0.26*smoothstep(0.95,0.32,d);",
          "  float g=hash(uv*vec2(1024.0,1024.0)+fract(uTime)*97.0); c+=(g-0.5)*0.035;",
          "  gl_FragColor=vec4(max(c,0.0), src.a);",
          "}",
        ].join("\n"),
      };
      const gradePass = new ShaderPass(GradeShader);
      composer.addPass(gradePass);
      composer.setSize(W(), H());

      let tx = 0, ty = 0;
      function onMove(e: PointerEvent) { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; }
      if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
      function resize() {
        camera.aspect = W() / H(); camera.updateProjectionMatrix();
        renderer.setSize(W(), H()); composer.setSize(W(), H());
      }
      window.addEventListener("resize", resize);

      let running = true, frame = 0, clock = 0, hidden = document.hidden, raf = 0;
      function onVis() { hidden = document.hidden; if (!hidden && running) loop(); }
      document.addEventListener("visibilitychange", onVis);
      const io = new IntersectionObserver((es) => {
        const vis = es[0].isIntersecting;
        if (vis && !running) { running = true; loop(); } else running = vis;
      }, { threshold: 0.01 });
      io.observe(mount);

      function render() { composer.render(); }
      function loop() {
        if (!running || hidden) return;
        clock += 0.016; frame++;
        group.rotation.y = clock * 0.14 + tx * 0.5;
        group.rotation.x = ty * 0.09;
        const pulse = 0.5 + 0.5 * Math.sin(clock * 3);
        orb.scale.setScalar(1 + 0.14 * pulse);
        core.scale.setScalar(0.85 + 0.35 * pulse); core.material.opacity = 0.8 + 0.2 * pulse;
        glow.scale.setScalar(1.6 + 0.5 * pulse); glow.material.opacity = 0.6 + 0.3 * pulse;
        halo.scale.setScalar(3.4 + 0.8 * pulse); halo.material.opacity = 0.26 + 0.2 * pulse;
        orbLight.intensity = 1.6 + 1.6 * pulse;
        coilM.emissiveIntensity = 1 + 0.8 * pulse;
        bronzeLit.emissiveIntensity = 0.95 + 0.7 * pulse;
        disc.material.opacity = 0.4 + 0.25 * pulse; disc.scale.setScalar(6.4 + 0.6 * pulse);
        lshaft.material.opacity = 0.3 + 0.2 * pulse;
        bloomPass.strength = 0.54 + 0.16 * pulse;
        gradePass.uniforms.uTime.value = clock;
        if (frame % 5 === 0) arcs.forEach((a) => { if (Math.random() < 0.45) reseed(a); bolt(a); (a.line.material as import("three").LineBasicMaterial).opacity = 0.45 + Math.random() * 0.55; });
        const arr = pg.attributes.position.array as Float32Array;
        for (let i = 0; i < N; i++) { arr[i * 3 + 1] += pv[i]; if (arr[i * 3 + 1] > 6.5) arr[i * 3 + 1] = -2.5; }
        pg.attributes.position.needsUpdate = true;
        const sar = sg.attributes.position.array as Float32Array;
        for (let i = 0; i < Mn; i++) { sar[i * 3 + 1] += sv[i]; if (sar[i * 3 + 1] > orbY + 1.5) sar[i * 3 + 1] = orbY - 1.5; }
        sg.attributes.position.needsUpdate = true;
        const breathe = Math.sin(clock * 0.4) * 0.4;
        camera.position.x += (tx * 1.6 - camera.position.x) * 0.04;
        camera.position.y += (1.6 - ty * 0.9 - camera.position.y) * 0.04;
        camera.position.z += (11.4 + breathe - camera.position.z) * 0.04;
        camera.lookAt(0, 0.3, 0);
        render();
        if (!reduce) raf = requestAnimationFrame(loop);
      }
      resize();
      if (reduce) render(); else loop();

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("resize", resize);
        if (!reduce) window.removeEventListener("pointermove", onMove);
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return <div ref={mountRef} aria-hidden="true" className={className} />;
}
