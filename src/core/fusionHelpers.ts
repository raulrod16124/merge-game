// src/core/fusionHelpers.ts

import type {ItemBase, CosmicType} from './types';
import {getNextType, getFusionScore} from './fusionRules';

/** Comprueba si 3 elementos pueden fusionarse */
export function canFuse(items: ItemBase[]): boolean {
  if (items.length !== 3) return false;
  const type = items[0].type;
  return items.every(i => i.type === type);
}

/** Realiza la fusión y devuelve:
 * - el nuevo item fusionado
 * - la puntuación obtenida
 */
export function fuseItems(items: ItemBase[]) {
  if (!canFuse(items)) return null;

  const base = items[0];
  const next: CosmicType | null = getNextType(base.type);
  if (!next) return null;

  const newItem: ItemBase = {
    id: 'fusion_' + crypto.randomUUID(),
    type: next,
    level: base.level + 1,
    pos: {...base.pos},
  };

  return {
    item: newItem,
    score: getFusionScore(next),
  };
}

/** Utilidad: obtener todas las piezas compatibles para fusionar en un punto */
export function getMergeCandidates(
  all: ItemBase[],
  pos: {x: number; y: number},
): ItemBase[] {
  return all.filter(i => i.pos.x === pos.x && i.pos.y === pos.y);
}
