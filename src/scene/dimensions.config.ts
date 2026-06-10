import { Vector3 } from 'three';

export type Dimension = {
  id: string;            // route slug
  number: number;        // 3, 6, 9, ...
  title: string;
  subtitle: string;      // "PAST · 396 HZ · ROOT"
  description: string;
  position: Vector3;     // location in 3D space (relative to the ZAPP core at origin)
  color: string;         // glow color
  icon: string;          // emoji
  route: string;         // /dimensions/tower
  scene: 'past' | 'present' | 'future'; // which 3D scene the page mounts
};

const D = 60; // how far the cards sit from the core

export const DIMENSIONS: Dimension[] = [
  {
    id: 'tower', number: 3, title: 'The Tower', subtitle: 'PAST · 3 · THE SEED',
    description: 'He drew lightning from the sky to give it away. They buried the tower. Never the frequency.',
    position: new Vector3(-D * 0.9, D * 0.55, -D * 0.6), // top-left
    color: '#F4D27A', icon: '🏛️', route: '/dimensions/tower', scene: 'past',
  },
  {
    id: 'signal', number: 6, title: 'The Signal', subtitle: 'PRESENT · 6 · THE BLOOM',
    description: 'The frequency is transmitting. Live on Solana. Owned by no one.',
    position: new Vector3(D * 0.9, D * 0.55, -D * 0.6), // top-right — the now
    color: '#E8B85C', icon: '⚡', route: '/dimensions/signal', scene: 'present',
  },
  {
    id: 'network', number: 9, title: 'The Network', subtitle: 'FUTURE · 9 · THE COMPLETION',
    description: 'Free energy for all. No banks. No borders.',
    position: new Vector3(0, -D * 0.65, -D * 0.5), // bottom — the road ahead
    color: '#B87333', icon: '🔮', route: '/dimensions/network', scene: 'future',
  },
];
