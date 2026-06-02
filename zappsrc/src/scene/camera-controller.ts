import * as THREE from 'three';

// Smooth ease-in-out flight from the camera's current spot to a target point in space.
export function flyTo(
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  onArrive: () => void,
  duration = 2200,
) {
  const startPos = camera.position.clone();
  const dir = target.clone().sub(startPos).normalize();
  const endPos = target.clone().sub(dir.multiplyScalar(7)); // stop short — arrive at it, not inside
  const startTime = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function step() {
    const t = Math.min((performance.now() - startTime) / duration, 1);
    camera.position.lerpVectors(startPos, endPos, ease(t));
    camera.lookAt(target);
    if (t < 1) requestAnimationFrame(step); else onArrive();
  }
  step();
}
