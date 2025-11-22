// src/state/game-store/utils/spawnHelpers.ts
import type {ItemBase, Pos, LevelConfig, CosmicType} from '@/core/types';

export const TYPE_RANK: Record<CosmicType, number> = {
  dust: 1,
  micro_asteroid: 2,
  meteorite: 3,
  baby_planet: 4,
  mature_planet: 5,
  star: 6,
  star_system: 7,
  supernova: 7,
  nebula: 8,
  galaxy: 9,
  fragment: 10,
  black_hole: 0,
};

/**
 * Compute effective spawn weights:
 * - Disallow types that are too advanced (rank > highestCreatedRank + 1)
 * - Increase weight of types the player already created (growthFactor)
 *
 * lvlSpawn: base spawnWeights from level config
 * createdCounts: store.createdCounts
 */
export function computeSpawnWeights(
  lvlSpawn: Record<string, number> | undefined,
  createdCounts: Record<string, number>,
  growthFactor = 0.25,
) {
  const base = lvlSpawn ?? {dust: 100};
  // compute highest created rank (0 if nothing)
  const highestCreatedRank = Object.entries(createdCounts).reduce(
    (acc, [type, cnt]) => {
      const r = TYPE_RANK[type as CosmicType] ?? 0;
      return cnt > 0 && r > acc ? r : acc;
    },
    0,
  );

  const allowedMaxRank = Math.max(1, highestCreatedRank + 1);

  const effective: Record<string, number> = {};
  Object.entries(base).forEach(([type, weight]) => {
    const rank = TYPE_RANK[type as CosmicType] ?? 0;
    if (rank === 0 || rank <= allowedMaxRank) {
      // increase weight by createdCounts[type] * growthFactor
      const boost = (createdCounts[type] ?? 0) * growthFactor;
      effective[type] = Math.max(0, Math.round(weight * (1 + boost)));
    } else {
      // block types that are too advanced
      effective[type] = 0;
    }
  });

  // if everything is zero (edge-case), fallback to dust:100
  if (Object.values(effective).reduce((s, v) => s + v, 0) === 0) {
    effective['dust'] = 100;
  }

  return effective;
}

/**
 * Busca una celda vacía aleatoria dentro del tablero.
 * items: array de ItemBase con posicion x,y
 * boardCols, boardRows: dimensiones del tablero
 */
export function randomEmptyCell(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
): Pos | null {
  const occupied = new Set(items.map(it => `${it.pos.x}:${it.pos.y}`));
  const empties: Pos[] = [];

  for (let y = 0; y < boardRows; y++) {
    for (let x = 0; x < boardCols; x++) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) empties.push({x, y});
    }
  }

  if (empties.length === 0) return null;
  const idx = Math.floor(Math.random() * empties.length);
  return empties[idx];
}

/**
 * Inserta un único black hole en una celda vacía. Devuelve items copy
 */
export function spawnBlackHole(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
  idSuffix?: string,
): ItemBase[] {
  const newItems = [...items];
  const cell = randomEmptyCell(newItems, boardCols, boardRows);
  if (!cell) return newItems;

  const nowId = `blackhole_${Date.now()}${idSuffix ? `_${idSuffix}` : ''}`;

  // ItemBase es la estructura que usan los objetos del juego.
  // Aquí añadimos la propiedad `absorbed` para llevar el contador local del agujero
  newItems.push({
    id: nowId,
    type: 'black_hole' as CosmicType,
    level: 1,
    pos: {x: cell.x, y: cell.y},
    createdAt: Date.now(),
    absorbed: 0, // contador de absorciones (usado en Fase 4)
  } as unknown as ItemBase);

  return newItems;
}

/**
 * Comprueba si debemos intentar spawnear un agujero negro en este turno.
 * Aplica tu ventana inicial (turns 3..7) y probabilidades definidas.
 */
export function shouldSpawnBlackHole(
  level: LevelConfig,
  turnCounter: number,
  existingCount: number,
): boolean {
  const maxAllowed = level.maxBlackHoles ?? 0;
  if (maxAllowed <= 0) return false; // nivel no permite enemigos

  if (existingCount >= maxAllowed) return false;

  const spawnRate =
    level.blackHoleSpawnRate ??
    (level.id && parseInt(level.id.replace(/\D/g, '')) >= 11 ? 4 : 5);
  if (spawnRate <= 0) return false;

  // Debemos comprobar si "toca" según spawnRate (ej: cada 5 turnos)
  if (turnCounter % spawnRate !== 0) return false;

  // Ventana prioritaria: turnos 3..7 -> probabilidad más alta
  const earlyWindowMin = 3;
  const earlyWindowMax = 7;

  const earlyChance = 0.9; // 90% en ventana temprana
  const normalChance = 0.75; // 75% fuera de la ventana

  const configuredChance =
    typeof level.blackHoleSpawnChance === 'number'
      ? level.blackHoleSpawnChance
      : null;

  // Si estamos en la ventana temprana y el turno cae dentro:
  if (turnCounter >= earlyWindowMin && turnCounter <= earlyWindowMax) {
    const chance = configuredChance ?? earlyChance;
    return Math.random() < chance;
  }

  // Fuera de la ventana temprana:
  const chance = configuredChance ?? normalChance;
  return Math.random() < chance;
}

/**
 * Intentar spawnear uno o más agujeros negros dependiendo de level.maxBlackHoles.
 *
 * Devuelve la copia de items con los agujeros añadidos si correspondiera.
 */
export function maybeSpawnBlackHole(
  items: ItemBase[],
  boardCols: number,
  boardRows: number,
  level: LevelConfig,
  turnCounter: number,
): ItemBase[] {
  const existing = items.filter(i => i.type === 'black_hole').length;
  if ((level.maxBlackHoles ?? 0) <= existing) return items;

  if (shouldSpawnBlackHole(level, turnCounter, existing)) {
    // spawn solo 1 en cada intento para mantener sentido de sorpresa.
    return spawnBlackHole(items, boardCols, boardRows);
  }

  return items;
}
