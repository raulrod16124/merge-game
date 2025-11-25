// src/state/player-store/index.ts
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {PowerupType} from '@/core/types';
import {LEVEL_UNLOCKS} from '@/data/levelUnlocks';
import {ACHIEVEMENTS} from '@/data/achievements';

export type AchievementId = string;

export type AchievementDef = {
  id: AchievementId;
  title: string;
  desc: string;
  reward?: {coins?: number; powerups?: PowerupType[]; maps?: string[]};
  trigger: 'merge' | 'powerup' | 'level' | 'misc';
  subject?: string; // e.g. cosmic type or powerup id
  count?: number; // optional threshold
};

export type PlayerProgressState = {
  // basic progression
  highestLevelUnlocked: number;
  unlockedPowerups: PowerupType[];
  unlockedMaps: string[];
  achievements: Record<AchievementId, boolean>;
  coins: number;

  // helpers
  unlockLevel: (level: number) => void;
  applyLevelUnlocks: (level: number) => void;
  unlockPowerup: (p: PowerupType) => void;
  unlockMap: (mapId: string) => void;
  addCoins: (amt: number) => void;

  // achievements
  hasAchievement: (id: AchievementId) => boolean;
  grantAchievement: (id: AchievementId) => void;
  checkAchievements: (event: {
    type: string;
    subject?: string;
    value?: any;
  }) => void;

  // persistence / sync stubs for Firebase (no-op for now)
  syncToFirebase: (userId: string) => Promise<void>;
  loadFromFirebase: (userId: string) => Promise<void>;
};

export const usePlayerStore = create<PlayerProgressState>()(
  persist(
    (set, get) => ({
      highestLevelUnlocked: 1,
      unlockedPowerups: [],
      unlockedMaps: [],
      achievements: {},
      coins: 0,

      unlockLevel: (level: number) =>
        set(state => ({
          highestLevelUnlocked: Math.max(state.highestLevelUnlocked, level),
        })),

      applyLevelUnlocks: (level: number) => {
        const unlock = (LEVEL_UNLOCKS as Record<number, any>)[level];
        if (!unlock) return;

        const {powerups, maps, achievements: achs, coins} = unlock as any;

        set(state => {
          const newPowerups = Array.isArray(powerups)
            ? Array.from(new Set([...state.unlockedPowerups, ...powerups]))
            : state.unlockedPowerups;

          const newMaps = Array.isArray(maps)
            ? Array.from(new Set([...state.unlockedMaps, ...maps]))
            : state.unlockedMaps;

          const newAchievements = {...state.achievements};
          if (Array.isArray(achs)) {
            for (const a of achs) newAchievements[a] = true;
          }

          return {
            unlockedPowerups: newPowerups,
            unlockedMaps: newMaps,
            achievements: newAchievements,
            coins: state.coins + (typeof coins === 'number' ? coins : 0),
          };
        });
      },

      unlockPowerup: (p: PowerupType) =>
        set(state => ({
          unlockedPowerups: Array.from(new Set([...state.unlockedPowerups, p])),
        })),

      unlockMap: (mapId: string) =>
        set(state => ({
          unlockedMaps: Array.from(new Set([...state.unlockedMaps, mapId])),
        })),

      addCoins: amt =>
        set(state => ({
          coins: Math.max(0, (state.coins ?? 0) + amt),
        })),

      hasAchievement: id => {
        const s = get();
        return Boolean(s.achievements?.[id]);
      },

      grantAchievement: id => {
        set(state => {
          if (state.achievements?.[id]) return {};

          import('@/state/hud-store').then(mod => {
            mod.useHudStore.getState().push(`Logro desbloqueado: ${id}`);
          });

          const next = {...(state.achievements || {})};
          next[id] = true;
          // apply reward if achievement is defined
          const def = (ACHIEVEMENTS as Record<string, any>)[id];
          const reward = def?.reward;
          let coinsGain = 0;
          const pwToUnlock: PowerupType[] = [];
          const mapsToUnlock: string[] = [];
          if (reward) {
            if (typeof reward.coins === 'number') coinsGain = reward.coins;
            if (Array.isArray(reward.powerups))
              pwToUnlock.push(...reward.powerups);
            if (Array.isArray(reward.maps)) mapsToUnlock.push(...reward.maps);
          }

          return {
            achievements: next,
            coins: (state.coins ?? 0) + coinsGain,
            unlockedPowerups: Array.from(
              new Set([...state.unlockedPowerups, ...pwToUnlock]),
            ),
            unlockedMaps: Array.from(
              new Set([...state.unlockedMaps, ...mapsToUnlock]),
            ),
          };
        });
      },

      checkAchievements: event => {
        // event: {type, subject, value}
        const defs = ACHIEVEMENTS as Record<string, any>;
        for (const id of Object.keys(defs)) {
          const def = defs[id] as AchievementDef;
          if (!def) continue;
          if (get().hasAchievement(def.id)) continue;

          // quick rule matching
          if (def.trigger !== event.type) continue;
          if (def.subject && def.subject !== event.subject) continue;

          // count-based: if def.count provided, event.value must be >= count
          if (typeof def.count === 'number') {
            if (typeof event.value === 'number' && event.value >= def.count) {
              get().grantAchievement(def.id);
            }
            continue;
          }

          // otherwise simple trigger
          get().grantAchievement(def.id);
        }
      },

      syncToFirebase: async _userId => {
        // placeholder: implement later
        return Promise.resolve();
      },

      loadFromFirebase: async _userId => {
        // placeholder
        return Promise.resolve();
      },
    }),
    {
      name: 'player-progress', // localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
