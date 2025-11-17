// src/state/gameStore/actions/objectives.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Objective} from '../../../core/types';

export const createObjectiveChecker = (
  //@ts-ignore
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  checkWinLose: () => {
    const s = get();
    const lvl = s.currentLevel;
    if (!lvl) return null;

    // lose by time
    if (s.timeLeft <= 0) {
      return {status: 'fail' as const, levelId: lvl.id};
    }

    const objectives = lvl.objective ?? [];
    if (!objectives.length) return null;

    const handlers: Record<Objective['type'], (o: Objective) => boolean> = {
      score: o => s.score >= o.target,

      create: o =>
        o.subject ? (s.createdCounts[o.subject] ?? 0) >= o.target : false,

      survive: () => true,

      survive_alive: () => s.holes.length > 0,

      supernova: o => (s.createdCounts['supernova'] ?? 0) >= o.target,
    };

    const allCompleted = objectives.every(o => handlers[o.type]?.(o));

    return allCompleted ? {status: 'win' as const, levelId: lvl.id} : null;
  },
});
