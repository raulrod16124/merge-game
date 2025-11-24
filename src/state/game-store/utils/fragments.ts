// src/state/gameStore/utils/fragments.ts
import type {CosmicType} from '../../../core/types';

export const emptyFragments = (): Record<CosmicType, number> =>
  ({
    dust: 0,
    micro_asteroid: 0,
    meteorite: 0,
    baby_planet: 0,
    mature_planet: 0,
    star: 0,
    star_system: 0,
    supernova: 0,
    nebula: 0,
    galaxy: 0,
  }) as Record<CosmicType, number>;

export const accumulateFragments = (
  fragments: Record<CosmicType, number>,
  absorbed: CosmicType[],
): Record<CosmicType, number> =>
  absorbed.reduce(
    (acc, type) => ({
      ...acc,
      [type]: (acc[type] ?? 0) + 1,
    }),
    {...fragments},
  );

export const hasCollapse = (fragments: Record<CosmicType, number>): boolean =>
  Object.values(fragments).some(c => c >= 3);
