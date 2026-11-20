/**
 * AI TATHASTU INSIGHTS — AUTHENTIC MEDIA ASSETS REGISTRY
 * Centralized, verifiable digital asset mapping system.
 * Strictly avoids generic stock photos or unverified mockups.
 */

export interface AuthenticMediaAsset {
  id: string;
  url: string;
  fallbackUrl?: string;
  originalFilename: string;
  title: string;
  alt: string;
  caption: string;
  attribution: string;
  provenance: 'Live Product Interface' | 'Verified Architectural Prototype' | 'Official Platform Screenshot' | 'Authentic Research Asset';
  category: 'company' | 'products' | 'media' | 'research';
  productId?: 'collaborate' | 'avsar' | 'mentormaze' | 'iris' | 'connect';
  width: number;
  height: number;
  aspectRatio: string;
  mimeType: string;
  isHighPriorityHero?: boolean;
}

export const AUTHENTIC_MEDIA_REGISTRY: Record<string, AuthenticMediaAsset> = {
  // 1. AI Tathastu Platform Overview
  'platform-overview': {
    id: 'platform-overview',
    url: '/media/company/platform-overview.png',
    originalFilename: 'Screenshot 2026-11-21 at 1.31.38 AM.png',
    title: 'AI Tathastu Platform — Skill Graph & Research Copilot',
    alt: 'AI Tathastu live application hero showcasing interactive skills graph, opportunities discovery, and research paper connection nodes.',
    caption: 'Official AI Tathastu production interface: Mapping individual engineering proficiency directly into research and career trajectories.',
    attribution: 'AI Tathastu Platform (https://aitathastu.com)',
    provenance: 'Live Product Interface',
    category: 'company',
    width: 2938,
    height: 1772,
    aspectRatio: '16/9',
    mimeType: 'image/png',
    isHighPriorityHero: true,
  },

  // 2. Collaborate Platform Interface
  'collaborate-live': {
    id: 'collaborate-live',
    url: '/media/products/collaborate/collaborate-live.png',
    originalFilename: 'Screenshot 2026-11-21 at 1.38.09 AM.png',
    title: 'Collaborate — Multi-Agent Coordination & Swarm Interface',
    alt: 'Collaborate live application interface showing researcher profile, 28 GitHub repositories, EORA AI Guide chat drawer, and active projects.',
    caption: 'Collaborate live application dashboard: Distributed workspace orchestrating human engineers with EORA AI guide assistance.',
    attribution: 'AI Tathastu Collaborate (https://collaborate.aitathastu.com)',
    provenance: 'Live Product Interface',
    category: 'products',
    productId: 'collaborate',
    width: 2940,
    height: 1774,
    aspectRatio: '16/9',
    mimeType: 'image/png',
    isHighPriorityHero: true,
  },

  // 3. Avsar Opportunity & Fellowship Engine
  'avsar-live': {
    id: 'avsar-live',
    url: '/media/products/avsar/avsar-live.png',
    originalFilename: 'Screenshot 2026-11-21 at 1.38.42 AM.png',
    title: 'Avsar — Meritocratic Research Fellowships & Grants',
    alt: 'Avsar live platform landing interface featuring opportunity tracks: Internship, Fellowship, Competition, and First Job.',
    caption: 'Avsar live application interface: Eliminating legacy geographic filters by providing direct grant discovery and empirical compute vouchers.',
    attribution: 'AI Tathastu Avsar (https://avsar.aitathastu.com)',
    provenance: 'Live Product Interface',
    category: 'products',
    productId: 'avsar',
    width: 2930,
    height: 1776,
    aspectRatio: '16/9',
    mimeType: 'image/png',
    isHighPriorityHero: true,
  },

  // 4. Tathastu Meet / Connect
  'connect-live': {
    id: 'connect-live',
    url: '/media/products/connect/connect-live.png',
    originalFilename: 'Screenshot 2026-11-21 at 1.39.54 AM.png',
    title: 'Tathastu Meet / Connect — Spatial Collaboration Rooms',
    alt: 'Tathastu Meet / Connect interface showing adaptive voice, video, and collaborative federated learning research rooms.',
    caption: 'Tathastu Meet live application interface: Real-time low-latency conferencing designed specifically for distributed research and code synthesis.',
    attribution: 'AI Tathastu Connect (https://connect.aitathastu.com)',
    provenance: 'Live Product Interface',
    category: 'products',
    productId: 'connect',
    width: 2940,
    height: 1770,
    aspectRatio: '16/9',
    mimeType: 'image/png',
    isHighPriorityHero: false,
  },

  // 5. MentorMaze Architectural Blueprint & Socratic Pipeline
  'mentormaze-spec': {
    id: 'mentormaze-spec',
    url: '/media/products/mentormaze/architecture-spec.svg',
    originalFilename: 'architecture-spec.svg',
    title: 'MentorMaze — Socratic Kernel Scaffolding & Isolated Container Architecture',
    alt: 'MentorMaze architectural diagram detailing AST disassembly pipeline, anti-pattern classifier, and isolated gVisor memory profiler.',
    caption: 'MentorMaze architectural specification: Multi-turn Socratic AST parsing paired with isolated gVisor containers for CUDA kernel debugging.',
    attribution: 'AI Tathastu Research Labs (Specification Prototype)',
    provenance: 'Verified Architectural Prototype',
    category: 'products',
    productId: 'mentormaze',
    width: 1200,
    height: 675,
    aspectRatio: '16/9',
    mimeType: 'image/svg+xml',
    isHighPriorityHero: false,
  },

  // 6. Iris 3D Spatial Occupancy System Blueprint
  'iris-spec': {
    id: 'iris-spec',
    url: '/media/products/iris/architecture-spec.svg',
    originalFilename: 'architecture-spec.svg',
    title: 'Iris — 3D Spatial Occupancy & Embedded Silicon Architecture',
    alt: 'Iris architectural specification illustrating continuous egocentric 3D voxel tensor buffer and NVIDIA Jetson Orin edge robotics pipeline.',
    caption: 'Iris perception architecture: Resolving 2D frame forgetting via continuous 3D voxel tensors targeted for real-time edge robotics execution.',
    attribution: 'AI Tathastu Perception Core (Specification Prototype)',
    provenance: 'Verified Architectural Prototype',
    category: 'products',
    productId: 'iris',
    width: 1200,
    height: 675,
    aspectRatio: '16/9',
    mimeType: 'image/svg+xml',
    isHighPriorityHero: false,
  },
};

/**
 * Helper to retrieve authentic product image or verified fallback
 */
export function getProductAuthenticMedia(productId: string): AuthenticMediaAsset | null {
  const map: Record<string, string> = {
    collaborate: 'collaborate-live',
    avsar: 'avsar-live',
    mentormaze: 'mentormaze-spec',
    iris: 'iris-spec',
    connect: 'connect-live',
  };
  const key = map[productId];
  return key ? AUTHENTIC_MEDIA_REGISTRY[key] : null;
}
