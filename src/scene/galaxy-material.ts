import * as THREE from 'three';

// Each point becomes a sharp twinkling star with diffraction spikes — not a fuzzy bubble.
export function buildStarMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      attribute float aTwinkle;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;
      uniform float uPixelRatio;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float twinkle = 0.65 + 0.35 * sin(uTime * 2.0 + aTwinkle * 6.2831);
        gl_PointSize = aSize * twinkle * uPixelRatio * (50.0 / -mvPosition.z);
        vColor = aColor;
        vTwinkle = twinkle;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        float core = smoothstep(0.5, 0.0, d);
        float glow = pow(core, 3.0);
        float spike = 0.0;
        spike += smoothstep(0.45, 0.0, abs(uv.x)) * smoothstep(0.5, 0.0, abs(uv.y) * 8.0);
        spike += smoothstep(0.45, 0.0, abs(uv.y)) * smoothstep(0.5, 0.0, abs(uv.x) * 8.0);
        spike *= 0.4;
        float alpha = (glow + spike) * vTwinkle;
        if (alpha < 0.01) discard;
        gl_FragColor = vec4(vColor * 0.9, alpha * 0.85);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
