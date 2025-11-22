// src/state/game-store/utils/enemyMovement.ts
import type {ItemBase, Pos, LevelConfig, CosmicType} from '@/core/types';

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

/**
 * Realiza el movimiento para TODOS los agujeros negros del tablero (una iteración).
 *
 * - items: lista actual de items
 * - boardCols, boardRows: dimensiones del tablero
 * - blockedCells: (opcional) array de posiciones bloqueadas
 *
 * Devuelve: { items: ItemBase[], pointsGained: number }
 *
 * Nota: esta función crea una copia de items y la devuelve; no muta el array de entrada.
 */
export function stepEnemyMovementPure(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
  blockedCells?: Pos[],
): {items: ItemBase[]; pointsGained: number} {
  const newItems = [...items.map(i => ({...i}))]; // copia superficial de items
  const pointsAcc = {total: 0};

  // helper para comprobar si una celda está bloqueada
  const isBlocked = (pos: Pos) =>
    !!(blockedCells && blockedCells.some(b => b.x === pos.x && b.y === pos.y));

  // recogemos la lista de black holes que existen al inicio de la iteración
  const blackHoles = newItems.filter(i => i.type === 'black_hole');

  // iteramos por cada agujero negro — importante: trabajamos sobre copia
  for (const bh of blackHoles) {
    // asegúrate de que el agujero negro todavía existe (no fue transformado en una iteración previa)
    const currentIndex = newItems.findIndex(it => it.id === bh.id);
    if (currentIndex === -1) continue;

    const origin = {x: bh.pos.x, y: bh.pos.y};

    // generamos lista de direcciones válidas
    const validDirs = DIRECTIONS.map(d => ({
      x: origin.x + d.x,
      y: origin.y + d.y,
    })).filter(p => withinBounds(p, boardCols, boardRows) && !isBlocked(p));

    if (validDirs.length === 0) {
      // no puede moverse
      continue;
    }

    // elegimos aleatoriamente entre las direcciones válidas
    const chosen = validDirs[randIndex(validDirs.length)];

    // si destino contiene otro agujero negro, no movemos (evitar colisión)
    const existingAtDest = findItemAt(newItems, chosen);
    if (existingAtDest && existingAtDest.type === 'black_hole') {
      // Skip move to avoid overlapping black holes
      continue;
    }

    // Si hay un objeto normal en destino -> absorberlo
    if (existingAtDest && existingAtDest.type !== 'black_hole') {
      // eliminamos el objeto absorbido
      const absorbedIndex = newItems.findIndex(
        it => it.id === existingAtDest.id,
      );
      if (absorbedIndex !== -1) {
        // sumar puntos si quieres (por ejemplo por absorción). Actualmente no sumamos puntos aquí
        // pero dejamos hook para que el caller aplique scores en caso necesario.
        newItems.splice(absorbedIndex, 1);
      }

      // actualizar la posición del agujero negro y contador 'absorbed'
      const bhIdx = newItems.findIndex(it => it.id === bh.id);
      if (bhIdx === -1) continue;

      // aseguramos que la propiedad absorbed exista
      const updatedBH = {...(newItems[bhIdx] as ItemBase)} as any;
      updatedBH.pos = {x: chosen.x, y: chosen.y};
      updatedBH.absorbed =
        (typeof updatedBH.absorbed === 'number' ? updatedBH.absorbed : 0) + 1;

      // Si llega a 3 absorciones: transformaremos en la capa superior (caller) o aquí mismo.
      // Para no acoplar excesivo comportamiento, aquí marcamos absorbed y dejar que el caller
      // revise absorbed >= 3 y lo transforme si lo desea (o lo hacemos ahora).
      newItems[bhIdx] = updatedBH as ItemBase;

      // optionally: pointsAcc.total += SOME_VALUE; // handled by caller (rewards)
    } else {
      // destino vacío: simplemente movemos el agujero negro
      const bhIdx = newItems.findIndex(it => it.id === bh.id);
      if (bhIdx === -1) continue;

      const updatedBH = {...(newItems[bhIdx] as ItemBase)} as any;
      updatedBH.pos = {x: chosen.x, y: chosen.y};
      newItems[bhIdx] = updatedBH as ItemBase;
    }
  }

  return {items: newItems, pointsGained: pointsAcc.total};
}
