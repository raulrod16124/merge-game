// src/data/levelUnlocks.ts
import type {PowerupType} from '@/core/types';

export type LevelUnlock = {
  powerups?: PowerupType[];
  maps?: string[];
  achievements?: string[]; // achievement ids
  coins?: number;
};

export const LEVEL_UNLOCKS: Record<number, LevelUnlock> = {
  2: {powerups: ['move']},
  3: {powerups: ['destroy']},
  5: {powerups: ['freeze_bh']},
  6: {powerups: [], maps: [], coins: 10}, // example
  8: {powerups: ['supernova'], coins: 25},
  10: {maps: ['stellar_dawn'], coins: 40},
  // Escalable: añade más niveles y múltiples unlocks por entrada
};
