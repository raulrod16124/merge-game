// src/state/game-store/utils/enemyMovement.ts
import type {ItemBase, Pos, CosmicType} from '@/core/types';
import {COSMIC_ICONS} from '@/ui/constants';

/**
 * Direcciones posibles para movimiento del agujero negro.
 */
const DIRECTIONS: Pos[] = [
  {x: 1, y: 0},
  {x: -1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: -1},
];

function withinBounds(pos: Pos, cols: number, rows: number): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
}

/**
 * Devuelve un índice aleatorio dentro de 0..len-1
 */
function randIndex(len: number): number {
  return Math.floor(Math.random() * len);
}

/**
 * Busca un item en items por posición. Retorna undefined si no existe.
 */
function findItemAt(items: ItemBase[], pos: Pos): ItemBase | undefined {
  return items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
}

export type EnemyMovementResult = {
  items: ItemBase[];
  absorbedRecords: Array<{
    absorbedId: string;
    absorbedType: CosmicType;
    from: Pos;
    to: Pos;
    bhId: string;
  }>;
  pointsGained: number;
};

export function stepEnemyMovementPure(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
  blockedCells?: Pos[],
): EnemyMovementResult {
  const newItems = [...items.map(i => ({...i}))]; // copia superficial de items
  const absorbedRecords: EnemyMovementResult['absorbedRecords'] = [];
  const pointsAcc = {total: 0};

  // helper para comprobar si una celda está bloqueada
  const isBlocked = (pos: Pos) =>
    !!(blockedCells && blockedCells.some(b => b.x === pos.x && b.y === pos.y));

  // recogemos la lista de black holes que existen al inicio de la iteración
  const blackHoles = newItems.filter(i => i.type === 'black_hole');

  // iteramos por cada agujero negro — importante: trabajamos sobre copia
  for (const bh of blackHoles) {
    const currentIndex = newItems.findIndex(it => it.id === bh.id);
    if (currentIndex === -1) continue;

    const origin = {x: bh.pos.x, y: bh.pos.y};

    const validDirs = DIRECTIONS.map(d => ({
      x: origin.x + d.x,
      y: origin.y + d.y,
    })).filter(p => withinBounds(p, boardCols, boardRows) && !isBlocked(p));

    if (validDirs.length === 0) continue;

    const chosen = validDirs[randIndex(validDirs.length)];

    const existingAtDest = findItemAt(newItems, chosen);
    if (existingAtDest && existingAtDest.type === 'black_hole') {
      continue;
    }

    if (existingAtDest && existingAtDest.type !== 'black_hole') {
      // Guardamos datos para el efecto visual y la posterior transformación a supernova
      absorbedRecords.push({
        absorbedId: existingAtDest.id,
        absorbedType: existingAtDest.type,
        from: {x: existingAtDest.pos.x, y: existingAtDest.pos.y},
        to: {x: chosen.x, y: chosen.y},
        bhId: bh.id,
      });

      // eliminamos el objeto absorbido
      const absorbedIndex = newItems.findIndex(
        it => it.id === existingAtDest.id,
      );
      if (absorbedIndex !== -1) {
        newItems.splice(absorbedIndex, 1);

        // actualizar índice del black hole (ya podría cambiar si index < currentIndex)
        const bhIdx = newItems.findIndex(it => it.id === bh.id);
        if (bhIdx === -1) continue;

        const updatedBH = {...(newItems[bhIdx] as ItemBase)} as ItemBase;
        updatedBH.pos = {x: chosen.x, y: chosen.y};
        updatedBH.absorbed =
          (typeof updatedBH.absorbed === 'number' ? updatedBH.absorbed : 0) + 1;
        newItems[bhIdx] = updatedBH;
      }
    } else {
      // destino vacío -> mover
      const bhIdx = newItems.findIndex(it => it.id === bh.id);
      if (bhIdx === -1) continue;
      const updatedBH = {...(newItems[bhIdx] as ItemBase)} as ItemBase;
      updatedBH.pos = {x: chosen.x, y: chosen.y};
      newItems[bhIdx] = updatedBH;
    }
  }

  return {items: newItems, pointsGained: pointsAcc.total, absorbedRecords};
}
