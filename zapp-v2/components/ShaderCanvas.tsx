"use client";

import { useEffect, useRef } from "react";

/**
 * Runs a full-screen pure-math WebGL fragment shader on a <canvas>. Ported from
 * the original ⚡ZAPP v1 era effects (pastfx / futurefx / frequencyfx / cosmosfx)
 * into React. Dependency-free (raw WebGL). Degrades silently if WebGL is absent,
 * pauses when off-screen (IntersectionObserver) or tab hidden, caps DPR, and
 * honours prefers-reduced-motion (renders a single frozen frame).
 *
 * Each shader expects uniforms: vec2 R (resolution), float T (time). The cosmos
 * variant also reads vec2 M (pointer) + vec3 C (glow colour) — handled here.
 */
const VS = "attribute vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }";

export type ShaderName = "past" | "future" | "frequency" | "cosmos";

const SHADERS: Record<ShaderName, { fs: string; pointer?: boolean; color?: [number, number, number]; frozenT: number }> = {
  // ── PAST: backlit monument on a golden-hour horizon, godrays, 3·6·9 ──
  past: {
    frozenT: 8.0,
    fs: [
      "precision highp float;",
      "uniform vec2 R; uniform float T;",
      "float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }",
      "float noise(vec2 p){ vec2 i=floor(p),f=fract(p);",
      "  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));",
      "  vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
      "float fbm(vec2 p){ float v=0.,a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);",
      "  for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }",
      "float tri(vec2 uv, float base, float h, float yb){",
      "  uv.x=abs(uv.x);",
      "  vec2 a=vec2(0.0, yb+h);",
      "  vec2 b=vec2(base, yb);",
      "  vec2 e=b-a; vec2 w=uv-a;",
      "  float d=dot(w,e)/dot(e,e); d=clamp(d,0.0,1.0);",
      "  vec2 proj=a+e*d; float dist=length(uv-proj);",
      "  float side=step(0.0, e.x*w.y-e.y*w.x);",
      "  return uv.y>yb && side>0.5 ? -dist : dist;",
      "}",
      "void main(){",
      "  vec2 uv=(gl_FragCoord.xy-0.5*R)/R.y;",
      "  float hY=-0.18;",
      "  vec3 col=vec3(0.0);",
      "  vec3 sky=mix(vec3(0.30,0.16,0.07), vec3(0.06,0.04,0.10), smoothstep(hY,0.9,uv.y));",
      "  col=sky;",
      "  vec2 sunP=vec2(0.0, hY+0.10);",
      "  float sd=length((uv-sunP)*vec2(1.0,1.3));",
      "  col+=vec3(1.0,0.74,0.36)*exp(-sd*sd*5.5)*1.5;",
      "  float ang=atan(uv.y-sunP.y, uv.x-sunP.x);",
      "  float rays=(0.5+0.5*sin(ang*22.0+T*0.18))*(0.5+0.5*sin(ang*39.0-T*0.10));",
      "  col+=vec3(1.0,0.70,0.34)*rays*exp(-sd*1.4)*0.18;",
      "  float haze=fbm(uv*2.2+vec2(T*0.03,0.0));",
      "  col+=vec3(0.9,0.6,0.3)*haze*0.06;",
      "  float d=tri(uv, 0.62, 0.82, hY);",
      "  float edge=exp(-abs(d)*60.0);",
      "  float inside=smoothstep(0.004,-0.004,d);",
      "  vec3 stone=vec3(0.05,0.035,0.03);",
      "  float courses=0.5+0.5*sin((uv.y-hY)*70.0);",
      "  stone+=vec3(0.06,0.04,0.02)*courses*inside;",
      "  col=mix(col, stone, inside*0.96);",
      "  col+=vec3(1.0,0.78,0.40)*edge*0.9;",
      "  float cap=exp(-length(uv-vec2(0.0,hY+0.82))*22.0);",
      "  col+=vec3(1.0,0.9,0.6)*cap*0.8;",
      "  if(uv.y<hY){",
      "    float dune=fbm(vec2(uv.x*3.0, uv.y*8.0)+vec2(T*0.02,0.0));",
      "    vec3 sand=mix(vec3(0.22,0.13,0.06), vec3(0.40,0.24,0.10), dune);",
      "    sand*=exp((uv.y-hY)*2.0);",
      "    col=mix(col, sand, smoothstep(hY,hY-0.02,uv.y));",
      "  }",
      "  float sg=abs(fract(sd*6.0 - 0.0)-0.5);",
      "  col+=vec3(0.9,0.66,0.34)*smoothstep(0.49,0.5,1.0-sg)*exp(-sd*2.0)*0.05;",
      "  col=col/(col+0.72); col=pow(col, vec3(0.90));",
      "  col*=smoothstep(1.5,0.32,length(uv));",
      "  gl_FragColor=vec4(col,1.0);",
      "}",
    ].join("\n"),
  },
  // ── FUTURE: infinite energy grid flying toward a radiant horizon sun ──
  future: {
    frozenT: 6.0,
    fs: [
      "precision highp float;",
      "uniform vec2 R; uniform float T;",
      "float hash(vec2 v){ return fract(sin(dot(v,vec2(41.3,289.1)))*43758.5453); }",
      "void main(){",
      "  vec2 p = (gl_FragCoord.xy - 0.5*R)/R.y;",
      "  float hY = 0.04;",
      "  vec3 col = vec3(0.0);",
      "  if(p.y < hY){",
      "    float fz = 1.0/(hY - p.y + 0.0001);",
      "    float gx = p.x * fz;",
      "    float gz = fz - T*2.4;",
      "    float gridX = abs(fract(gx)-0.5);",
      "    float gridZ = abs(fract(gz)-0.5);",
      "    float fade = exp(-fz*0.05);",
      "    float lx = smoothstep(0.46,0.5,gridX);",
      "    float lz = smoothstep(0.46,0.5,gridZ);",
      "    float g = max(lx,lz) * fade;",
      "    col += vec3(0.30,0.78,1.0) * g * 1.7;",
      "    col += vec3(0.20,0.55,1.0) * fade * 0.08;",
      "  } else {",
      "    float star = step(0.9982, hash(floor(p*vec2(180.0))));",
      "    col += vec3(0.85,0.9,1.0) * star * 0.6;",
      "    float aur = exp(-abs(p.x - sin(p.y*2.6+T*0.2)*0.7)*2.6) * smoothstep(0.55,0.06,p.y-hY) * 0.06;",
      "    col += vec3(0.62,0.34,1.0) * aur;",
      "  }",
      "  float sun = exp(-length(vec2(p.x*0.9,(p.y-hY)*2.2))*2.0);",
      "  col += vec3(1.0,0.84,0.42) * sun * 1.4;",
      "  float band = exp(-abs(p.y-hY)*9.0);",
      "  col += vec3(0.34,0.80,1.0) * band * 0.7;",
      "  col = col/(col + 0.7);",
      "  col = pow(col, vec3(0.92));",
      "  float v = smoothstep(1.45, 0.35, length(p));",
      "  gl_FragColor = vec4(col*v, 1.0);",
      "}",
    ].join("\n"),
  },
  // ── FREQUENCY (Present): flight through 9 spiralling strands of light ──
  frequency: {
    frozenT: 9.0,
    fs: [
      "precision highp float;",
      "uniform vec2 R; uniform float T;",
      "void main(){",
      "  vec2 uv = (gl_FragCoord.xy - 0.5*R)/R.y;",
      "  vec3 ro = vec3(0.0, 0.0, T*4.0);",
      "  vec3 rd = normalize(vec3(uv, 1.25));",
      "  float a = sin(T*0.15)*0.12;",
      "  rd.xy = mat2(cos(a),-sin(a),sin(a),cos(a)) * rd.xy;",
      "  vec3 col = vec3(0.0);",
      "  float t = 0.0;",
      "  for(int i=0;i<72;i++){",
      "    vec3 p = ro + rd*t;",
      "    vec2 c = vec2(sin(p.z*0.18)*1.6, cos(p.z*0.13)*1.2);",
      "    vec2 d = p.xy - c;",
      "    float r = length(d);",
      "    float ring = abs(r - 2.2);",
      "    float ang = atan(d.y, d.x);",
      "    float strands = pow(0.5 + 0.5*sin(ang*9.0 + p.z*1.6 - T*2.4), 3.0);",
      "    float pulse  = 0.5 + 0.5*sin(p.z*2.4 - T*3.0);",
      "    float e = strands * (0.35 + 0.65*pulse);",
      "    float fog = exp(-t*0.05);",
      "    float line = exp(-ring*ring*26.0);",
      "    col += vec3(0.30,0.78,1.0) * line * e * 0.55 * fog;",
      "    col += vec3(1.0,0.84,0.3) * exp(-r*r*0.45) * 0.02 * pulse * fog;",
      "    t += max(ring*0.5, 0.08);",
      "    if(t>90.0) break;",
      "  }",
      "  col *= 0.62;",
      "  col = col/(col + 0.62);",
      "  col = pow(col, vec3(0.92));",
      "  float v = smoothstep(1.35, 0.35, length(uv));",
      "  gl_FragColor = vec4(col*v, 1.0);",
      "}",
    ].join("\n"),
  },
  // ── COSMOS: full-screen warm nebula field + receding grid (home/global) ──
  cosmos: {
    frozenT: 12.0,
    pointer: true,
    color: [1.0, 0.66, 0.26],
    fs: [
      "precision highp float;",
      "uniform vec2 R; uniform float T; uniform vec2 M; uniform vec3 C;",
      "float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }",
      "float noise(vec2 p){ vec2 i=floor(p),f=fract(p);",
      "  float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));",
      "  vec2 u=f*f*(3.-2.*f); return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
      "float fbm(vec2 p){ float v=0.,a=.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);",
      "  for(int i=0;i<6;i++){ v+=a*noise(p); p=m*p; a*=.5; } return v; }",
      "void main(){",
      "  vec2 uv=(gl_FragCoord.xy-0.5*R)/R.y;",
      "  vec2 par=(M-0.5)*0.10; uv+=par;",
      "  vec2 src=vec2(0.40,0.30);",
      "  float t=T*0.045;",
      "  vec2 q=uv*1.55;",
      "  vec2 warp=vec2(fbm(q+t), fbm(q+vec2(5.2,1.3)-t));",
      "  float n=fbm(q+2.3*warp+vec2(0.0,t*1.4)); n=pow(n,1.85);",
      "  vec3 col=vec3(0.060,0.046,0.052);",
      "  col+=vec3(0.10,0.06,0.12)*smoothstep(0.95,-0.25,uv.y);",
      "  col+=C*0.17*exp(-length(uv-src)*0.82);",
      "  vec3 gold=C, amber=C*vec3(1.0,0.60,0.42);",
      "  col+=mix(amber,gold,n)*n*0.64;",
      "  float d=length(uv-src);",
      "  col+=mix(C,vec3(1.0),0.50)*exp(-d*d*5.0)*1.48;",
      "  float ang=atan(uv.y-src.y,uv.x-src.x);",
      "  float rays=(0.5+0.5*sin(ang*18.0+T*0.5))*(0.5+0.5*sin(ang*33.0-T*0.28));",
      "  col+=mix(C,vec3(1.0),0.18)*rays*exp(-d*1.7)*0.34;",
      "  float horizon=0.16;",
      "  if(uv.y<horizon){",
      "    float fz=1.0/(horizon-uv.y+0.04);",
      "    float gx=abs(fract(uv.x*fz*0.42+0.5)-0.5);",
      "    float gz=abs(fract(fz*0.5-T*0.32)-0.5);",
      "    float grid=smoothstep(0.47,0.5,1.0-gx)+smoothstep(0.47,0.5,1.0-gz);",
      "    col+=C*0.92*grid*exp(-(horizon-uv.y)*3.2)*0.13;",
      "  }",
      "  col=col/(col+0.72); col=pow(col,vec3(0.86));",
      "  col*=(0.44+0.56*smoothstep(1.9,0.25,length(uv)));",
      "  gl_FragColor=vec4(col,1.0);",
      "}",
    ].join("\n"),
  },
};

export function ShaderCanvas({
  shader,
  className,
}: {
  shader: ShaderName;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const def = SHADERS[shader];
    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, def.fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(prog, "R");
    const uT = gl.getUniformLocation(prog, "T");
    const uM = gl.getUniformLocation(prog, "M");
    const uC = gl.getUniformLocation(prog, "C");
    const C = def.color ?? [1, 0.66, 0.26];

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function size() {
      cv!.width = Math.max(1, Math.round(cv!.clientWidth * dpr));
      cv!.height = Math.max(1, Math.round(cv!.clientHeight * dpr));
      gl!.viewport(0, 0, cv!.width, cv!.height);
    }
    size();
    window.addEventListener("resize", size);

    let mx = 0.5, my = 0.5, pmx = 0.5, pmy = 0.5;
    function onMove(e: PointerEvent) {
      mx = e.clientX / window.innerWidth;
      my = 1 - e.clientY / window.innerHeight;
    }
    if (def.pointer && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let running = true;
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        running = es[0].isIntersecting;
        if (running && !reduce) raf = requestAnimationFrame(frame);
      },
      { threshold: 0.005 },
    );
    io.observe(cv);

    const t0 = performance.now();
    function frame() {
      if (!running) return;
      const t = (performance.now() - t0) / 1000;
      pmx += (mx - pmx) * 0.06;
      pmy += (my - pmy) * 0.06;
      gl!.uniform2f(uR, cv!.width, cv!.height);
      gl!.uniform1f(uT, t);
      if (uM) gl!.uniform2f(uM, pmx, pmy);
      if (uC) gl!.uniform3f(uC, C[0], C[1], C[2]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, def.frozenT);
      if (uM) gl.uniform2f(uM, 0.5, 0.5);
      if (uC) gl.uniform3f(uC, C[0], C[1], C[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      if (def.pointer) window.removeEventListener("pointermove", onMove);
    };
  }, [shader]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
