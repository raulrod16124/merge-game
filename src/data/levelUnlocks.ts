// src/data/levelUnlocks.ts
import type {PowerupType} from '@/core/types';

export type LevelUnlock = {
  powerups?: PowerupType[];
  maps?: string[];
  achievements?: string[]; // achievement ids
  coins?: number;
};

export const LEVEL_UNLOCKS: Record<number, LevelUnlock> = {
  4: {powerups: ['move']},
  12: {powerups: ['destroy']},
  25: {powerups: ['freeze_bh']},
  35: {powerups: ['supernova']},
};
