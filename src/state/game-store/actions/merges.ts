import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, CosmicType, ItemBase} from '../../../core/types';

import {getNextType, fusionScore, TIME_BONUS} from '../../../core/fusionRules';
import {computeSpawnWeights} from '../utils/spawnHelpers';
import {pickWeighted} from '../utils/weighted';

function getConnectedCluster(
  start: Pos,
  type: CosmicType,
  items: ItemBase[],
): ItemBase[] {
  const visited = new Set<string>();
  const queue: Pos[] = [start];
  const connected: ItemBase[] = [];

  const findAt = (p: Pos) =>
    items.find(i => i.pos.x === p.x && i.pos.y === p.y);

  while (queue.length) {
    const pos = queue.shift()!;
    const item = findAt(pos);
    if (!item) continue;
    if (item.type !== type) continue;
    if (visited.has(item.id)) continue;

    visited.add(item.id);
    connected.push(item);

    const neighbors = [
      {x: pos.x + 1, y: pos.y},
      {x: pos.x - 1, y: pos.y},
      {x: pos.x, y: pos.y + 1},
      {x: pos.x, y: pos.y - 1},
    ];

    for (const n of neighbors) {
      const ni = findAt(n);
      if (ni && !visited.has(ni.id) && ni.type === type) {
        queue.push(n);
      }
    }
  }

  return connected;
}

export const createMerges = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  spawnNextItem: () => {
    const lvl = get().currentLevel;
    const created = get().createdCounts ?? {};
    if (!lvl) {
      set({nextItem: 'dust'});
      return;
    }
    const eff = computeSpawnWeights(lvl.spawnWeights, created, 0.25);
    const nextKey = pickWeighted(eff as Record<string, number>);
    set({nextItem: (nextKey as any) ?? 'dust'});
  },

  processMergesAt: (pos: Pos) => {
    const state = get();
    const placed = state.items.find(
      i => i.pos.x === pos.x && i.pos.y === pos.y,
    );

    if (!placed) return;

    const {items} = state;

    const cluster = getConnectedCluster(pos, placed.type, items);

    if (cluster.length < 3) {
      return;
    }

    const removeIds = new Set(cluster.map(c => c.id));

    set(s => ({moves: s.moves + 1}));
    if ((get().moves + 1) % 2 === 0) {
      get().stepEnemyMovement();
    }

    set(s => ({
      items: s.items.filter(i => !removeIds.has(i.id)),
    }));

    const nextType = getNextType(placed.type);
    if (!nextType) return;

    const fused = {
      id: 'f_' + crypto.randomUUID(),
      type: nextType,
      level: placed.level + 1,
      pos: {...pos},
      createdAt: Date.now(),
    };

    set(s => ({
      items: [...s.items, fused],
      score: s.score + fusionScore(nextType),

      createdCounts: {
        ...s.createdCounts,
        [nextType]: (s.createdCounts[nextType] ?? 0) + 1,
      },
    }));

    get().addFloatingScore(pos.x, pos.y, fusionScore(nextType));

    const bonus = TIME_BONUS[nextType] ?? 0;
    if (bonus > 0) {
      set(s => ({timeLeft: s.timeLeft + bonus}));
    }

    setTimeout(() => {
      get().processMergesAt(pos);
    }, 20);
  },
});
