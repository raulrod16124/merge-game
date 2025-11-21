// src/state/game-store/actions/merges.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, CosmicType, ItemBase} from '@/core/types';

import {getNextType, fusionScore, TIME_BONUS} from '@/core/fusionRules';
import {computeSpawnWeights} from '../utils/spawnHelpers';
import {pickWeighted} from '../utils/weighted';
import {applyMergeRewards} from './rewards';

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
      const found = findAt(n);
      if (found && !visited.has(found.id) && found.type === type) {
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

    // Increment moves (player action)
    set(s => ({moves: s.moves + 1}));

    // Ensure enemies step once per player turn
    if (typeof get().stepEnemyMovement === 'function') {
      get().stepEnemyMovement();
    }

    // Remove cluster items immediately (atomic remove)
    set(s => ({
      items: s.items.filter(i => !removeIds.has(i.id)),
    }));

    const nextType = getNextType(placed.type);
    if (!nextType) return;

    const fused: ItemBase = {
      id:
        'f_' +
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
      type: nextType,
      level: (placed.level ?? 0) + 1,
      pos: {...pos},
      createdAt: Date.now(),
    };

    try {
      const gained = applyMergeRewards(nextType, fusionScore(nextType));
      set(s => ({levelCoins: (s.levelCoins ?? 0) + gained}));
    } catch (e) {
      console.warn('Error applying merge rewards', e);
    }

    // === ATOMIC UPDATE: insert fused item, update score and createdCounts ===
    set(s => {
      const newItems = s.items.slice();
      newItems.push(fused);

      const newScore = s.score + fusionScore(nextType);

      const cc = {...(s.createdCounts || {})};
      cc[fused.type] = (cc[fused.type] || 0) + 1;

      return {
        items: newItems,
        score: newScore,
        createdCounts: cc,
      };
    });

    // Floating score + time bonus (these can remain as immediate calls)
    if (typeof get().addFloatingScore === 'function') {
      get().addFloatingScore(pos.x, pos.y, fusionScore(nextType));
    }

    const bonus = TIME_BONUS[nextType] ?? 0;
    if (bonus > 0) {
      set(s => ({timeLeft: s.timeLeft + bonus}));
    }

    // After state is applied, check for win/lose in a microtask so checkWinLose sees stable state
    Promise.resolve().then(() => {
      try {
        if (typeof get().checkWinLose === 'function') {
          const result = get().checkWinLose();
          if (result && result.status === 'win') {
            // Stop timer and record result in store so UI can react deterministically
            if (typeof get().stopTimer === 'function') {
              get().stopTimer();
            }
            // set the global level result so UI (BoardScreen) sees it immediately
            get().setLevelResult(result);
            return; // do not spawn next item nor chain merges
          }
        }
      } catch (e) {
        // Safety: don't crash if checkWinLose throws
        // eslint-disable-next-line no-console
        console.warn('checkWinLose() failed:', e);
      }

      // If not won, continue normal flow: spawn next and process chain merges
      if (typeof get().spawnNextItem === 'function') {
        get().spawnNextItem();
      }

      // Chain merges: process again at the fused position
      Promise.resolve().then(() => {
        get().processMergesAt(pos);
      });
    });
  },
});
