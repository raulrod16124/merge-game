// src/state/achievement-store/index.ts
import {create} from 'zustand';
import {usePlayerStore} from '@/state/player-store';
import type {AchievementId} from '@/data/achievements';
import {soundManager} from '@/core/sound/soundManager';
import {vibrate} from '@/core/vibration';

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
      soundManager.play('evolution');
      vibrate([20, 40, 20, 40, 60]);

      ps.grantAchievement(id); // usa el sistema oficial del player-store
    }
  },
}));
