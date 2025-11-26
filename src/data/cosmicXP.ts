// src/data/cosmicXP.ts
import {LEVEL_XP_TABLE} from './cosmicLevels';

export function computeCosmicProgress(
  level: number,
  xp: number,
): {
  currentLevelXP: number;
  nextLevelXP: number | null;
  progressPercent: number;
} {
  const currentLevelXP = LEVEL_XP_TABLE[level] ?? 0;
  const nextLevelXP = LEVEL_XP_TABLE[level + 1] ?? null;

  if (nextLevelXP === null) {
    // max level
    return {currentLevelXP, nextLevelXP: null, progressPercent: 100};
  }

  const span = Math.max(1, nextLevelXP - currentLevelXP);
  const gained = Math.min(Math.max(0, xp - currentLevelXP), span);
  const gainedReference = gained > 0 ? gained : 100;
  const progressPercent = Math.round((gainedReference / span) * 100);
  return {currentLevelXP, nextLevelXP, progressPercent};
}
