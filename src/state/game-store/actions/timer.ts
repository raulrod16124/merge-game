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
      r?.status === 'fail' && get().stopTimer();
    }, 1000);

    set({_timerId: id});
  },

  stopTimer: () => {
    const id = get()._timerId;
    id && window.clearInterval(id);
    set({_timerId: null});
  },
});
