// src/state/game-store/actions/merges.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, CosmicType, ItemBase} from '@/core/types';

import {getNextType, fusionScore, TIME_BONUS} from '@/core/fusionRules';
import {computeSpawnWeights} from '../utils/spawnHelpers';
import {pickWeighted} from '../utils/weighted';
import {applyMergeRewards} from './rewards';
import {useAchievementStore} from '@/state/achievement-store';
import {ACHIEVEMENTS} from '@/data/achievements';

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

  /**
   * processMergesAt
   * - ahora es async y devuelve cuando terminan todas las cadenas de merges
   * - NO incrementa el turno ni llama a stepEnemyMovement; eso lo gestionará addItem/incrementTurn
   */
  processMergesAt: async (pos: Pos): Promise<void> => {
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

    // Increment moves (player action) — ya se incrementó en addItem al insertar el item,
    // pero mantenemos aquí el incremento de moves si no se hacía antes.
    set(s => ({moves: s.moves + 1}));

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

    // Insert fused item and update score/createdCounts atomically
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

    // === ACHIEVEMENTS: merge ===
    const ach = useAchievementStore.getState();

    // always unlock FIRST_MERGE
    ach.unlock('FIRST_MERGE');

    // typed achievements (specific cosmic types)
    const specific = ACHIEVEMENTS.find(
      a => a.condition.type === 'merge' && a.condition.value === fused.type,
    );
    if (specific) ach.unlock(specific.id);

    // Floating score + time bonus
    if (typeof get().addFloatingScore === 'function') {
      get().addFloatingScore(pos.x, pos.y, fusionScore(nextType));
    }

    const bonus = TIME_BONUS[nextType] ?? 0;
    if (bonus > 0) {
      set(s => ({timeLeft: s.timeLeft + bonus}));
    }

    // Wait a microtask so the store is stable before checking win/lose and continuing flow
    await Promise.resolve();

    try {
      if (typeof get().checkWinLose === 'function') {
        const result = get().checkWinLose();
        if (result && result.status === 'win') {
          if (typeof get().stopTimer === 'function') {
            get().stopTimer();
          }
          if (!get().levelResult) {
            get().setLevelResult(result);
          }
          return; // do not spawn next item nor chain merges
        }
      }
    } catch (e) {
      console.warn('checkWinLose() failed:', e);
    }

    // If not won, continue normal flow: spawn next and process chain merges
    if (typeof get().spawnNextItem === 'function') {
      get().spawnNextItem();
    }

    // Allow microtask scheduling before processing chain merges
    await Promise.resolve();

    // Chain merges: process again at the fused position recursively (await)
    await get().processMergesAt(pos);

    // finished when recursion unwinds
  },
});
