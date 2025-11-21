// src/state/gameStore/actions/timer.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';

export const createTimer = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  startTimer: () => {
    const {_timerId} = get();
    if (_timerId) return;

    const id = window.setInterval(() => {
      set(s => ({timeLeft: s.timeLeft - 1}));

      const r = get().checkWinLose();

      if (r?.status === 'fail') {
        try {
          get().stopTimer();
        } catch (e) {}

        try {
          get().setLevelResult({status: 'fail', levelId: r.levelId});
        } catch (e) {
          console.warn('ERROR setting level fail result from timer', e);
        }
      }
    }, 1000);

    set({_timerId: id});
  },

  stopTimer: () => {
    const id = get()._timerId;
    id && window.clearInterval(id);
    set({_timerId: null});
  },
});
