// src/data/cosmicEvolution.ts
import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

export type EvolutionProfile = {
  auraIntensity: number; // brillo del aura
  coreGlow: number; // brillo del núcleo
  particleCount: number; // partículas alrededor del avatar
  shapeDetail: number; // nivel de detalle del shape
  accessories?: string[]; // opcional para skins futuras
};

/**
 * Ahora el perfil evolutivo depende SOLO del "shape"
 * (abstract, humanoid, hybrid),
 * no del color ni de la variante jugable.
 *
 * El color lo elige el usuario por separado.
 */
export const COSMIC_EVOLUTION: Record<
  AvatarVariant,
  Record<number, EvolutionProfile>
> = {
  [AvatarVariant.HUMANOID]: {
    1: {
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraIntensity: 1.3,
      coreGlow: 1.2,
      particleCount: 6,
      shapeDetail: 1,
    },
    3: {
      auraIntensity: 1.6,
      coreGlow: 1.4,
      particleCount: 8,
      shapeDetail: 2,
      accessories: ['halo'],
    },
  },

  [AvatarVariant.ABSTRACT]: {
    1: {
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraIntensity: 1.4,
      coreGlow: 1.3,
      particleCount: 6,
      shapeDetail: 1,
    },
    3: {
      auraIntensity: 1.8,
      coreGlow: 1.5,
      particleCount: 10,
      shapeDetail: 2,
    },
  },

  [AvatarVariant.HYBRID]: {
    1: {
      auraIntensity: 1,
      coreGlow: 1,
      particleCount: 4,
      shapeDetail: 0,
    },
    2: {
      auraIntensity: 1.3,
      coreGlow: 1.2,
      particleCount: 7,
      shapeDetail: 1,
    },
    3: {
      auraIntensity: 1.6,
      coreGlow: 1.4,
      particleCount: 10,
      shapeDetail: 2,
      accessories: ['inner_glow'],
    },
  },
};
