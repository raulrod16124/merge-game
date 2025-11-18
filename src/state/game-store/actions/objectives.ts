// src/state/gameStore/actions/objectives.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';

export const createObjectiveChecker = (
  //@ts-ignore
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  checkWinLose: () => {
    const {currentLevel, score, timeLeft} = get();

    if (!currentLevel) return null;

    if (timeLeft <= 0) {
      return {status: 'fail', levelId: currentLevel.id};
    }

    const scoreObj = currentLevel.objective?.find(o => o.type === 'score');

    if (scoreObj && score >= scoreObj.target) {
      return {status: 'win', levelId: currentLevel.id};
    }

    return null;
  },
});
