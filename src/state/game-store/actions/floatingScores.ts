// src/state/gameStore/actions/floatingScores.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';

export const createFloatingScoreActions = (
  set: Parameters<StateCreator<GameStore>>[0],
  //@ts-ignore
  get: () => GameStore,
) => ({
  addFloatingScore: (x: number, y: number, points: number) =>
    set(s => ({
      floatingScores: [
        ...s.floatingScores,
        {id: 'fs_' + crypto.randomUUID(), x, y, points},
      ],
    })),

  removeFloatingScore: (id: string) =>
    set(s => ({
      floatingScores: s.floatingScores.filter(f => f.id !== id),
    })),
});
