// src/state/game-store/utils/enemyMovement.ts
import type {ItemBase, Pos, CosmicType} from '@/core/types';

export type EnemyMovePlan = {
  items: ItemBase[];
  bhId: string;
  from: Pos;
  to: Pos;
  absorbedId?: string;
  absorbedType?: CosmicType;
};

const DIRECTIONS: Pos[] = [
  {x: 1, y: 0},
  {x: -1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: -1},
];

function withinBounds(pos: Pos, cols: number, rows: number): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
}

function randIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

function findItemAt(items: ItemBase[], pos: Pos): ItemBase | undefined {
  return items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
}

/**
 * Compute movement plans for all black holes.
 * Plans do NOT mutate items. The UI should animate them and call confirmEnemyMove()
 * when the animation finishes to commit the changes to the store.
 */
export function computeEnemyMovePlans(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
  blockedCells?: Pos[],
): EnemyMovePlan[] {
  const plans: EnemyMovePlan[] = [];

  const isBlocked = (pos: Pos) =>
    !!(blockedCells && blockedCells.some(b => b.x === pos.x && b.y === pos.y));

  const blackHoles = items.filter(i => i.type === 'black_hole');

  for (const bh of blackHoles) {
    const origin = {x: bh.pos.x, y: bh.pos.y};

    const validDirs = DIRECTIONS.map(d => ({
      x: origin.x + d.x,
      y: origin.y + d.y,
    })).filter(p => withinBounds(p, boardCols, boardRows) && !isBlocked(p));

    if (validDirs.length === 0) continue;

    const chosen = validDirs[randIndex(validDirs.length)];
    const existingAtDest = findItemAt(items, chosen);

    // avoid moving into another BH
    if (existingAtDest && existingAtDest.type === 'black_hole') continue;

    const plan: EnemyMovePlan = {
      bhId: bh.id,
      from: origin,
      to: chosen,
      items,
    };

    if (existingAtDest && existingAtDest.type !== 'black_hole') {
      plan.absorbedId = existingAtDest.id;
      plan.absorbedType = existingAtDest.type;
    }

    plans.push(plan);
  }

  return plans;
}
