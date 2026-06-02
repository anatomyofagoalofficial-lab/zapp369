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
    id: 'tower', number: 3, title: 'The Tower', subtitle: 'PAST · 396 HZ · ROOT',
    description: 'Tesla. 1893. The idea that should have changed everything — and will.',
    position: new Vector3(-D * 0.9, D * 0.55, -D * 0.6), // top-left
    color: '#F4D27A', icon: '🏛️', route: '/dimensions/tower', scene: 'past',
  },
  {
    id: 'network', number: 9, title: 'The Network', subtitle: 'FUTURE · 963 HZ · CROWN',
    description: 'Free energy for everyone. No banks. No borders. Forever.',
    position: new Vector3(D * 0.9, D * 0.55, -D * 0.6), // top-right
    color: '#9FE8FF', icon: '🔮', route: '/dimensions/network', scene: 'future',
  },
  {
    id: 'signal', number: 6, title: 'The Signal', subtitle: 'PRESENT · 639 HZ · HEART',
    description: 'Live on Solana. The frequency is transmitting right now.',
    position: new Vector3(0, -D * 0.65, -D * 0.5), // bottom-centre, the "now"
    color: '#C896FF', icon: '⚡', route: '/dimensions/signal', scene: 'present',
  },
];
