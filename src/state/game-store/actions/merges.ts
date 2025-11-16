// src/state/gameStore/actions/merges.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, CosmicType} from '@/core/types';

import {getNextType, fusionScore, TIME_BONUS} from '@/core/fusionRules';

export const createMerges = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  spawnNextItem: () => {
    const lvl = get().currentLevel;
    lvl &&
      set({
        nextItem: (lvl
          ? lvl.spawnWeights && Object.keys(lvl.spawnWeights)[0]
          : 'dust') as CosmicType | undefined,
      });
  },

  processMergesAt: (pos: Pos) => {
    const {items} = get();

    // Agrupar items por tipo, declarativo
    const byType = items.reduce<Record<string, typeof items>>(
      (acc, it) => ({...acc, [it.type]: [...(acc[it.type] ?? []), it]}),
      {},
    );

    const candidates = Object.entries(byType).filter(
      ([, arr]) => arr.length >= 3,
    );
    if (!candidates.length) return;

    const [type, arr] = candidates[0];

    const chosen = arr
      .slice()
      .sort(
        (a, b) =>
          Math.abs(a.pos.x - pos.x) +
          Math.abs(a.pos.y - pos.y) -
          (Math.abs(b.pos.x - pos.x) + Math.abs(b.pos.y - pos.y)),
      )
      .slice(0, 3);

    const next = getNextType(type as any);
    if (!next) return;

    // Eliminar los 3
    set(s => ({
      items: s.items.filter(i => !chosen.some(c => c.id === i.id)),
    }));

    const fused = {
      id: 'f_' + crypto.randomUUID(),
      type: next,
      level: 1,
      pos,
      createdAt: Date.now(),
    };

    set(s => ({
      items: [...s.items, fused],
      score: s.score + fusionScore(next),
      createdCounts: {
        ...s.createdCounts,
        [next]: (s.createdCounts[next] ?? 0) + 1,
      },
    }));

    get().addFloatingScore(pos.x, pos.y, fusionScore(next));

    const bonus = TIME_BONUS[next] ?? 0;
    bonus > 0 && set(s => ({timeLeft: s.timeLeft + bonus}));
  },
});
