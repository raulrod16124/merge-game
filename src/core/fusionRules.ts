// src/core/fusionRules.ts

import type {CosmicType} from './types';

/* ──────────────────────────────────────────────────────────────
   SISTEMA ÚNICO DE EVOLUCIÓN
   Ahora TODO depende de NEXT_TYPE.
   Esto permite controlar el árbol evolutivo desde un solo lugar.
   ────────────────────────────────────────────────────────────── */

export const NEXT_TYPE: Record<CosmicType, CosmicType | null> = {
  dust: 'micro_asteroid',
  micro_asteroid: 'meteorite',
  meteorite: 'baby_planet',
  baby_planet: 'mature_planet',
  mature_planet: 'star',
  star: 'star_system',
  star_system: 'supernova',
  supernova: 'nebula',
  nebula: 'galaxy',
  galaxy: 'fragment',
  fragment: null,
  black_hole: 'supernova',
};

/* ──────────────────────────────────────────────────────────────
   SCORES OFICIALES
   ────────────────────────────────────────────────────────────── */

export const SCORE_MAP: Record<CosmicType, number> = {
  dust: 5,
  micro_asteroid: 10,
  meteorite: 25,
  baby_planet: 50,
  mature_planet: 80,
  star: 120,
  star_system: 200,
  supernova: 250,
  nebula: 300,
  galaxy: 500,
  fragment: 1000,
  black_hole: 0,
};

/* ──────────────────────────────────────────────────────────────
   BONUS DE TIEMPO
   ────────────────────────────────────────────────────────────── */

export const TIME_BONUS: Record<CosmicType, number> = {
  star: 3,
  star_system: 5,
  nebula: 8,
  dust: 0,
  micro_asteroid: 0,
  supernova: 0,
  meteorite: 0,
  baby_planet: 0,
  mature_planet: 0,
  galaxy: 0,
  fragment: 0,
  black_hole: 0,
};

/* ──────────────────────────────────────────────────────────────
   FUNCIÓN OFICIAL PARA OBTENER EL SIGUIENTE TIPO
   Ahora SIEMPRE usa NEXT_TYPE.
   ────────────────────────────────────────────────────────────── */

export const getNextType = (type: CosmicType): CosmicType | null => {
  return NEXT_TYPE[type] ?? null;
};

/* ──────────────────────────────────────────────────────────────
   SCORE POR FUSIÓN
   ────────────────────────────────────────────────────────────── */

export const fusionScore = (to: CosmicType | null): number =>
  to ? (SCORE_MAP[to] ?? 0) : 0;

/* ──────────────────────────────────────────────────────────────
   SCORES ESPECIALES DE SUPERNOVA
   Para futuro: explosiones especiales, powerups, etc.
   ────────────────────────────────────────────────────────────── */

export const SUPERNOVA_SCORE = {
  base: 150,
  perUpgradedObject: 20,
};
