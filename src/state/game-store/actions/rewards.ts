// src/state/game-store/rewards.ts
import type {CosmicType} from '@/core/types';
import {useUserStore} from '@/state/user-store';

export function coinsForMerge(objectMerged: CosmicType) {
  const map: Record<CosmicType, number> = {
    dust: 5,
    micro_asteroid: 10,
    meteorite: 25,
    baby_planet: 50,
    mature_planet: 85,
    star: 100,
    star_system: 200,
    nebula: 500,
    galaxy: 850,
    fragment: 5000,
    black_hole: 210,
  };
  return map[objectMerged] ?? 10;
}

export function applyMergeRewards(
  mergedType: CosmicType,
  extraScore = 0,
): number {
  const user = useUserStore.getState();

  let coins = coinsForMerge(mergedType);

  if (coins === 0 && extraScore > 0) {
    coins = Math.max(0, Math.ceil(extraScore / 10));
  }

  if (coins > 0) {
    try {
      user.addCoins(coins);
    } catch (e) {
      console.warn('applyMergeRewards: addCoins failed', e);
    }
  }

  try {
    user.addCombinationCounts(mergedType, 1);
  } catch (e) {
    console.warn('applyMergeRewards: addCombinationCounts failed', e);
  }

  return coins;
}
