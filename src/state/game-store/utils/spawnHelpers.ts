// src/state/game-store/utils/spawnHelpers.ts
import type {CosmicType} from '../../../core/types';

export const TYPE_RANK: Record<CosmicType, number> = {
  dust: 1,
  micro_asteroid: 2,
  meteorite: 3,
  baby_planet: 4,
  mature_planet: 5,
  star: 6,
  star_system: 7,
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
