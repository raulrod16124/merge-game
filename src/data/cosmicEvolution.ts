// src/data/cosmicEvolution.ts

import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

export type EvolutionProfile = {
  auraColor: string;
  auraIntensity: number; // multiplica el brillo del aura
  coreGlow: number; // multiplica el brillo del núcleo
  particleCount: number; // número de partículas
  shapeDetail: number; // nivel de detalle de la forma (0–2)
  accessories?: string[]; // reservado para futuras skins o elementos
};

export const COSMIC_EVOLUTION: Record<
  AvatarVariant,
  Record<number, EvolutionProfile>
> = {
  humanoid: {
    1: {
      auraColor: '#FFB844',
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraColor: '#FFC766',
      auraIntensity: 1.3,
      coreGlow: 1.2,
      particleCount: 6,
      shapeDetail: 1,
    },
    3: {
      auraColor: '#FFE099',
      auraIntensity: 1.6,
      coreGlow: 1.4,
      particleCount: 8,
      shapeDetail: 2,
      accessories: ['halo'],
    },
  },

  abstract: {
    1: {
      auraColor: '#B38AFF',
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraColor: '#C9A2FF',
      auraIntensity: 1.4,
      coreGlow: 1.3,
      particleCount: 6,
      shapeDetail: 1,
    },
    3: {
      auraColor: '#E9D2FF',
      auraIntensity: 1.8,
      coreGlow: 1.5,
      particleCount: 10,
      shapeDetail: 2,
    },
  },

  hybrid: {
    1: {
      auraColor: '#98FFD0',
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraColor: '#B7FFE0',
      auraIntensity: 1.3,
      coreGlow: 1.2,
      particleCount: 7,
      shapeDetail: 1,
    },
    3: {
      auraColor: '#DBFFF0',
      auraIntensity: 1.6,
      coreGlow: 1.4,
      particleCount: 10,
      shapeDetail: 2,
      accessories: ['inner_glow'],
    },
  },
};
