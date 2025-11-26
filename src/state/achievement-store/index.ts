// src/state/achievement-store/index.ts
import {create} from 'zustand';
import {usePlayerStore} from '@/state/player-store';
import type {AchievementId} from '@/data/achievements';

type AchievementStore = {
  isUnlocked: (id: AchievementId) => boolean;
  unlock: (id: AchievementId) => void;
};

export const useAchievementStore = create<AchievementStore>(() => ({
  isUnlocked: (id: AchievementId) => {
    const achievements = usePlayerStore.getState().achievements;
    return Boolean(achievements?.[id]);
  },

  unlock: (id: AchievementId) => {
    const ps = usePlayerStore.getState();
    if (!ps.achievements[id]) {
      ps.grantAchievement(id); // usa el sistema oficial del player-store
    }
  },
}));
