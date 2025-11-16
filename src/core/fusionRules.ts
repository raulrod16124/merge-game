// src/core/fusionRules.ts

import type {CosmicType} from './types';

export type FusionRule = {
  from: CosmicType;
  to: CosmicType | null;
  score: number;
};

export const FUSION_CHAIN: CosmicType[] = [
  'dust',
  'micro_asteroid',
  'meteorite',
  'baby_planet',
  'mature_planet',
  'star',
  'star_system',
  'nebula',
  'galaxy',
];

export const SCORE_MAP: Record<CosmicType, number> = {
  dust: 5,
  micro_asteroid: 10,
  meteorite: 25,
  baby_planet: 50,
  mature_planet: 80,
  star: 120,
  star_system: 200,
  nebula: 300,
  galaxy: 500,
};

export const TIME_BONUS: Record<CosmicType, number> = {
  star: 3,
  star_system: 5,
  nebula: 8,
  dust: 0,
  micro_asteroid: 0,
  meteorite: 0,
  baby_planet: 0,
  mature_planet: 0,
  galaxy: 0,
};

export const getNextType = (type: CosmicType): CosmicType | null => {
  const index = FUSION_CHAIN.indexOf(type);
  return index < 0 || index === FUSION_CHAIN.length - 1
    ? null
    : FUSION_CHAIN[index + 1];
};

export const fusionScore = (to: CosmicType | null): number =>
  to ? (SCORE_MAP[to] ?? 0) : 0;

export const SUPERNOVA_SCORE = {
  base: 150,
  perUpgradedObject: 20,
};
