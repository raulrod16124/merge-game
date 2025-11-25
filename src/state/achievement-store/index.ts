import {create} from 'zustand';
import type {AchievementId} from '@/data/achievements';

export type AchievementState = {
  unlocked: Partial<Record<AchievementId, boolean>>;
  unlockAchievement: (id: AchievementId) => void;
  isUnlocked: (id: AchievementId) => boolean;
  reset: () => void;
};

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlocked: {},

  unlockAchievement: (id: AchievementId) => {
    const current = get().unlocked;
    if (current[id]) return; // already unlocked

    set({
      unlocked: {
        ...current,
        [id]: true,
      },
    });

    // Aquí podrás añadir Firebase más adelante:
    // firebase.saveAchievements(newUnlocked)
  },

  isUnlocked: (id: AchievementId) => {
    return !!get().unlocked[id];
  },

  reset: () => set({unlocked: {}}),
}));
