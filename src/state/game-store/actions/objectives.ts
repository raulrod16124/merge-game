// src/state/gameStore/actions/objectives.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';

export const createObjectiveChecker = (
  //@ts-ignore
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  checkWinLose: () => {
    const {currentLevel, score, timeLeft, createdCounts} = get();

    if (!currentLevel) return null;

    // --- 1) Derrota por tiempo ---
    if (timeLeft <= 0) {
      return {status: 'fail', levelId: currentLevel.id};
    }

    // Seguridad: si objective no existe o no es array
    const objectives = Array.isArray(currentLevel.objective)
      ? currentLevel.objective
      : [];

    // --- 2) Objetivo de creación ---
    const createObj = objectives.find(o => o.type === 'create');

    if (createObj) {
      const cosmicKey = createObj.subject?.toString() ?? '';
      const targetAmount = createObj.target ?? 1;

      // Accede al conteo acumulado
      const created = createdCounts?.[cosmicKey] ?? 0;

      if (created >= targetAmount) {
        return {status: 'win', levelId: currentLevel.id};
      }
    }

    // --- 3) Objetivo de score (se mantiene igual) ---
    const scoreObj = objectives.find(o => o.type === 'score');

    if (scoreObj && score >= scoreObj.target) {
      return {status: 'win', levelId: currentLevel.id};
    }

    return null;
  },
});
