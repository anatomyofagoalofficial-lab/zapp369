import { Vector3 } from 'three';

export type Dimension = {
  id: string;            // route slug
  number: number;        // 3, 6, 9, ...
  title: string;
  subtitle: string;      // "PAST · 396 HZ · ROOT"
  description: string;
  position: Vector3;     // location in 3D space
  color: string;         // glow color
  icon: string;          // emoji or asset path
  route: string;         // /dimensions/tower
  scene: 'past' | 'present' | 'future'; // which 3D scene the page mounts
};

// Distribute N points evenly on a sphere — Fibonacci method, looks great at any N.
// Forward-biased so the cluster faces the camera (which sits back on +z).
function fibonacciSphere(count: number, radius = 80): Vector3[] {
  const pts: Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    pts.push(new Vector3(Math.cos(theta) * r * radius, y * radius * 0.7, Math.sin(theta) * r * radius));
  }
  return pts;
}

const DIMS = [
  { id: 'tower', number: 3, title: 'The Tower', subtitle: 'PAST · 396 HZ · ROOT',
    description: 'Tesla. 1893. The idea that should have changed everything — and will.',
    color: '#F4D27A', icon: '🏛️', route: '/dimensions/tower', scene: 'past' as const },
  { id: 'signal', number: 6, title: 'The Signal', subtitle: 'PRESENT · 639 HZ · HEART',
    description: 'Live on Solana. The frequency is transmitting right now.',
    color: '#C896FF', icon: '⚡', route: '/dimensions/signal', scene: 'present' as const },
  { id: 'network', number: 9, title: 'The Network', subtitle: 'FUTURE · 963 HZ · CROWN',
    description: 'Free energy for everyone. No banks. No borders. Forever.',
    color: '#9FE8FF', icon: '🔮', route: '/dimensions/network', scene: 'future' as const },
  // Add a 4th later — just append, the Fibonacci sphere re-distributes everything evenly:
  // { id: 'archive', number: 12, ... },
];

const positions = fibonacciSphere(DIMS.length, 78);

export const DIMENSIONS: Dimension[] = DIMS.map((d, i) => ({ ...d, position: positions[i] }));
