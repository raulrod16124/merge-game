// src/utils/getResponsiveBoardSize.ts
import type {LevelConfig} from '../core/types';

export function getResponsiveBoardSize(level: LevelConfig) {
  const w = window.innerWidth;

  if (w <= 640) {
    return level.boardSize.mobile;
  }

  return level.boardSize.desktop;
}
