// src/core/fusionRules.ts
/**
 * Reglas de fusión del juego Stellar Merge:
 * 3 objetos del mismo tipo → 1 objeto superior.
 */

import type {CosmicType} from './types';

// Cadena completa de evolución
export const FUSION_CHAIN: CosmicType[] = [
  'dust', // 0
  'micro_asteroid', // 1
  'meteorite', // 2
  'baby_planet', // 3
  'mature_planet', // 4
  'star', // 5
  'star_system', // 6
  'nebula', // 7
  'galaxy', // 8 (máximo)
];

// Mapeo rápido para obtener el siguiente
export const NEXT_TYPE: Record<CosmicType, CosmicType | null> = {
  dust: 'micro_asteroid',
  micro_asteroid: 'meteorite',
  meteorite: 'baby_planet',
  baby_planet: 'mature_planet',
  mature_planet: 'star',
  star: 'star_system',
  star_system: 'nebula',
  nebula: 'galaxy',
  galaxy: null, // objeto máximo, no fusiona más
  fragment: null,
};

// Puntuación otorgada por generar el RESULTADO (no por la acción previa)
export const FUSION_SCORE: Record<CosmicType, number> = {
  dust: 0,
  micro_asteroid: 10,
  meteorite: 25,
  baby_planet: 50,
  mature_planet: 80,
  star: 120,
  star_system: 200,
  nebula: 300,
  galaxy: 500,
  fragment: 0,
};

// Bonus por supernova (cuando un agujero errante acumula 3 fragmentos)
export const SUPERNOVA_SCORE = {
  base: 150,
  perUpgradedObject: 20,
};

/** Obtiene el siguiente tipo después de una fusión */
export function getNextType(current: CosmicType): CosmicType | null {
  return NEXT_TYPE[current] ?? null;
}

/** Puntaje de la pieza generada después de fusionar */
export function getFusionScore(result: CosmicType): number {
  return FUSION_SCORE[result] ?? 0;
}
