// src/state/player-store/index.ts
import {create} from 'zustand';
import type {PowerupType} from '@/core/types';
import {LEVEL_UNLOCKS} from '@/data/levelUnlocks';
import {ACHIEVEMENTS} from '@/data/achievements';
import {LEVEL_XP_TABLE} from '@/data/cosmicLevels';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '@/core/firebase';
import {useUserStore} from '@/state/user-store';
import {levelIdToIndex} from '@/data/levelIndexMap';
import {SECTION_UNLOCKS} from '@/data/sectionUnlocks';

export type AchievementId = string;

export type AchievementDef = {
  id: AchievementId;
  title: string;
  desc: string;
  reward?: {coins?: number; powerups?: PowerupType[]; maps?: string[]};
  trigger: 'merge' | 'powerup' | 'level' | 'misc';
  subject?: string;
  count?: number;
};

const CACHE_KEY = 'player_progress_cache';

export type PlayerProgressState = {
  completedLevels: Record<
    string,
    {
      score: number;
      completedAt: number;
    }
  >;
  highestLevelUnlocked: number;
  newAchievements: AchievementId[];
  unlockedPowerups: PowerupType[];
  unlockedMaps: string[];
  achievements: Record<AchievementId, boolean>;
  coins: number;
  cosmicProgress: {
    xp: number;
    level: number;
  };
  lastEvolutionLevel: number | null;
  completedLevelUnlocks: Record<number, boolean>;
  unlockedSections: number[]; // e.g. [1]
  unlockedLevels: string[]; // e.g. ['level01']

  isPowerupUnlocked: (id: PowerupType) => boolean;
  clearNewAchievements: () => void;
  markLevelCompleted: (levelId: string, score: number) => void;
  applyLevelUnlocks: (lvl: number) => void;
  unlockPowerup: (p: PowerupType) => void;
  unlockMap: (id: string) => void;
  addCoins: (amt: number) => void;
  markLevelUnlocksAsCompleted: (lvl: number) => void;
  unlockSection: (sectionNumber: number) => void;
  unlockLevel: (levelId: string) => void;
  isLevelUnlocked: (levelId: string) => boolean;
  isSectionUnlocked: (sectionNumber: number) => boolean;
  completeLevel: (levelId: string, score?: number) => void;

  triggerCosmicEvolution: ((lvl: number) => void) | null;
  setEvolutionHandler: (fn: (lvl: number) => void) => void;
  addXP: (amt: number) => void;
  updateLeaderboardScores: () => Promise<void>;

  hasAchievement: (id: AchievementId) => boolean;
  grantAchievement: (id: AchievementId) => void;
  checkAchievements: (event: {
    type: string;
    subject?: string;
    value?: any;
  }) => void;

  syncToFirebase: () => Promise<void>;
  loadFromFirebase: () => Promise<void>;
  resetToInitialState: () => void;
  loadFromCache: () => void;
  saveCache: () => void;
};

export const usePlayerStore = create<PlayerProgressState>((set, get) => ({
  completedLevels: {},
  highestLevelUnlocked: 1,
  newAchievements: [],
  unlockedPowerups: [],
  unlockedMaps: [],
  achievements: {},
  coins: 0,
  cosmicProgress: {
    xp: 0,
    level: 1,
  },
  lastEvolutionLevel: null,
  completedLevelUnlocks: {},
  triggerCosmicEvolution: null,
  unlockedSections: [1],
  unlockedLevels: ['level01'],

  // -----------------------------
  // OFFLINE CACHE SYSTEM
  // -----------------------------
  loadFromCache: () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      set(data);
    } catch (e) {
      console.warn('Failed loading player cache', e);
    }
  },

  saveCache: () => {
    const data = get();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  },

  // -----------------------------
  setEvolutionHandler: fn => set({triggerCosmicEvolution: fn}),

  unlockSection: (sectionNumber: number) => {
    set(state => {
      if (state.unlockedSections.includes(sectionNumber)) return state;
      return {unlockedSections: [...state.unlockedSections, sectionNumber]};
    });
    // unlock all levels in section
    const sec = SECTION_UNLOCKS[sectionNumber];
    if (sec) {
      const newLevels: string[] = [];
      for (let i = sec.startLevelIndex; i <= sec.endLevelIndex; i++) {
        newLevels.push(`level${String(i).padStart(2, '0')}`);
      }
      set(state => ({
        unlockedLevels: Array.from(
          new Set([...state.unlockedLevels, ...newLevels]),
        ),
      }));
    }
  },
  unlockLevel: (levelId: string) => {
    set(state => {
      if (state.unlockedLevels.includes(levelId)) return state;
      return {unlockedLevels: [...state.unlockedLevels, levelId]};
    });
  },
  isLevelUnlocked: (levelId: string) => {
    const state = get();
    return state.unlockedLevels.includes(levelId);
  },
  isSectionUnlocked: (sectionNumber: number) => {
    const state = get();
    return state.unlockedSections.includes(sectionNumber);
  },

  isPowerupUnlocked: (id: PowerupType) => {
    const s = get();
    return Array.isArray(s.unlockedPowerups) && s.unlockedPowerups.includes(id);
  },

  completeLevel: (levelId: string, score?: number) => {
    const fixedId = `level${String(levelId.replace(/\D/g, '')).padStart(2, '0')}`;
    set(state => {
      const now = Date.now();
      const completedLevels = {...(state.completedLevels || {})};
      completedLevels[fixedId] = {
        score: score ?? completedLevels[fixedId]?.score ?? 0,
        completedAt: now,
      };

      return {completedLevels};
    });

    // desbloquear siguiente nivel según index
    try {
      const idx = levelIdToIndex(fixedId);
      const nextIndex = idx + 1;
      if (nextIndex <= 50) {
        const nextLevelId = `level${String(nextIndex).padStart(2, '0')}`;
        get().unlockLevel(nextLevelId);
      }

      // comprobar si completamos una sección entera -> desbloquear siguiente sección
      const currentIndex = levelIdToIndex(fixedId);
      const sectionEntry = Object.values(SECTION_UNLOCKS).find(
        s =>
          currentIndex >= s.startLevelIndex && currentIndex <= s.endLevelIndex,
      );
      if (sectionEntry) {
        // comprobar si todos los niveles de esa sección están en completedLevels
        const comp = get().completedLevels || {};
        const allDone = (() => {
          for (
            let i = sectionEntry.startLevelIndex;
            i <= sectionEntry.endLevelIndex;
            i++
          ) {
            const lid = `level${String(i).padStart(2, '0')}`;
            if (!comp[lid]) return false;
          }
          return true;
        })();

        if (allDone && sectionEntry.unlocksNext) {
          get().unlockSection(sectionEntry.unlocksNext);
        }
      }

      // persistir en la función de guardado que ya uses
      if (typeof (get() as any).saveProgress === 'function') {
        (get() as any).saveProgress();
      }
    } catch (err) {
      console.warn('completeLevel: index parse error', err);
    }
  },

  clearNewAchievements: () => set({newAchievements: []}),

  markLevelCompleted: (levelId: string, score: number) => {
    const fixedId = `level${String(levelId.replace(/\D/g, '')).padStart(2, '0')}`;
    const existing = get().completedLevels[fixedId];

    const improved = !existing || score > existing.score;

    set(state => ({
      completedLevels: {
        ...state.completedLevels,
        [fixedId]: improved ? {score, completedAt: Date.now()} : existing,
      },
      highestLevelUnlocked: Math.max(
        state.highestLevelUnlocked,
        parseInt(fixedId.replace(/\D/g, '')) + 1,
      ),
    }));

    get().syncToFirebase();
  },

  applyLevelUnlocks: lvl => {
    const unlock = LEVEL_UNLOCKS[lvl];
    if (!unlock) return;

    const {powerups, maps, achievements: achs, coins} = unlock;

    set(state => {
      const newPw = Array.isArray(powerups)
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
        unlockedPowerups: newPw,
        unlockedMaps: newMaps,
        achievements: newAchievements,
        coins: state.coins + (typeof coins === 'number' ? coins : 0),
      };
    });

    get().saveCache();
    get().syncToFirebase();
    useUserStore.getState().syncToFirebase();
    get().updateLeaderboardScores();
  },

  markLevelUnlocksAsCompleted: lvl => {
    set(s => ({
      completedLevelUnlocks: {...s.completedLevelUnlocks, [lvl]: true},
    }));
    get().saveCache();
    get().syncToFirebase();
  },

  unlockPowerup: p =>
    set(s => ({
      unlockedPowerups: Array.from(new Set([...s.unlockedPowerups, p])),
    })),

  unlockMap: id =>
    set(s => ({
      unlockedMaps: Array.from(new Set([...s.unlockedMaps, id])),
    })),

  addCoins: amt => {
    set(s => ({coins: Math.max(0, s.coins + amt)}));
    get().saveCache();
    get().syncToFirebase();
    useUserStore.getState().syncToFirebase();
    get().updateLeaderboardScores();
  },

  // -----------------------------
  // COSMIC XP SYSTEM
  // -----------------------------
  addXP: amt => {
    const prog = get().cosmicProgress;
    const totalXP = prog.xp + amt;

    const levelKeys = Object.keys(LEVEL_XP_TABLE).map(n => parseInt(n, 10));
    const maxDefinedLevel = Math.max(...levelKeys);

    let newLevel = prog.level;
    for (const lvl of levelKeys) {
      if (totalXP >= LEVEL_XP_TABLE[lvl]) newLevel = lvl;
    }

    if (newLevel > maxDefinedLevel) newLevel = maxDefinedLevel;

    set({
      cosmicProgress: {xp: totalXP, level: newLevel},
    });

    // Solo disparar evolución si REALMENTE el nivel es nuevo y NO ha sido mostrado
    if (newLevel > prog.level && get().lastEvolutionLevel !== newLevel) {
      const evo = get().triggerCosmicEvolution;
      evo?.(newLevel);
    }

    get().saveCache();
    get().syncToFirebase();
    get().updateLeaderboardScores();
  },

  // -----------------------------
  // RANKING
  // -----------------------------
  updateLeaderboardScores: async () => {
    const uid = useUserStore.getState().uid;
    const name = useUserStore.getState().name;

    if (!uid) return;

    const state = get();

    const rankScoreGlobal =
      state.highestLevelUnlocked * 100000 + (state.coins ?? 0);

    const rankCosmicLevel = state.cosmicProgress.level;
    const rankTotalCosmicXP = state.cosmicProgress.xp;

    try {
      await setDoc(
        doc(db, 'leaderboard', uid),
        {
          uid,
          name: name ?? 'Unknown',

          // Valores exportados al ranking
          rankScoreGlobal,
          rankCosmicLevel,
          rankTotalCosmicXP,

          // Datos informativos
          highestLevelUnlocked: state.highestLevelUnlocked,
          coins: state.coins,

          updatedAt: serverTimestamp(),
        },
        {merge: true},
      );
    } catch (e) {
      console.warn('Leaderboard update failed', e);
    }
  },

  // -----------------------------
  // ACHIEVEMENTS
  // -----------------------------
  hasAchievement: id => {
    return Boolean(get().achievements[id]);
  },

  grantAchievement: id => {
    const list = ACHIEVEMENTS; // array
    const def = list.find(a => a.id === id); // buscar achievement por id

    if (!def) {
      console.warn('Achievement definition not found for ID:', id);
      return;
    }

    set(state => {
      if (state.achievements[id]) return {};

      // Notificación visual en HUD
      import('@/state/hud-store').then(mod => {
        mod.useHudStore.getState().push(`Logro desbloqueado: ${def.title}`);
      });

      // Marcar achievement como logrado
      const updated = {...state.achievements, [id]: true};

      // Aplicar recompensas
      const reward = def.reward ?? {};
      const coinsGain = reward.coins ?? 0;
      const powerupsGain = reward.powerups ?? [];
      const mapsGain = reward.maps ?? [];

      return {
        achievements: updated,
        coins: (state.coins ?? 0) + coinsGain,
        unlockedPowerups: Array.from(
          new Set([...state.unlockedPowerups, ...powerupsGain]),
        ),
        unlockedMaps: Array.from(new Set([...state.unlockedMaps, ...mapsGain])),
        newAchievements: [...(state.newAchievements ?? []), id],
      };
    });

    get().saveCache();
    get().syncToFirebase();
    useUserStore.getState().syncToFirebase();
    get().updateLeaderboardScores();
  },

  checkAchievements: ({type, value}) => {
    const state = get();

    for (const def of ACHIEVEMENTS) {
      // Ya desbloqueado → ignorar
      if (state.achievements[def.id]) continue;

      // Coincide el tipo
      if (def.condition.type !== type) continue;

      // Achievement sin valor → se desbloquea por tipo
      if (!('value' in def.condition) || def.condition.value === undefined) {
        get().grantAchievement(def.id);
        continue;
      }

      // Tiene valor → debe coincidir
      if (def.condition.value === value) {
        get().grantAchievement(def.id);
      }
    }
  },

  // -----------------------------
  // FIREBASE SYNC
  // -----------------------------
  syncToFirebase: async () => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const s = get();

    const payload = {
      highestLevelUnlocked: s.highestLevelUnlocked,
      completedLevels: s.completedLevels,
      unlockedPowerups: s.unlockedPowerups,
      unlockedMaps: s.unlockedMaps,
      achievements: s.achievements,
      coins: s.coins,
      cosmicProgress: s.cosmicProgress,
      completedLevelUnlocks: s.completedLevelUnlocks,
      unlockedLevels: s.unlockedLevels,
      unlockedSections: s.unlockedSections,
      lastUpdated: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'progress', uid), payload, {merge: true});
    } catch {}
  },

  loadFromFirebase: async () => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    try {
      const snap = await getDoc(doc(db, 'progress', uid));
      if (!snap.exists()) return;

      const data = snap.data();

      const fixedCompleted: Record<string, any> = {};
      if (data.completedLevels) {
        for (const key of Object.keys(data.completedLevels)) {
          const fixedKey = key.startsWith('level')
            ? key
            : `level${String(key).padStart(2, '0')}`;
          fixedCompleted[fixedKey] = data.completedLevels[key];
        }
      }

      set({
        highestLevelUnlocked: data.highestLevelUnlocked ?? 1,
        unlockedPowerups: data.unlockedPowerups ?? [],
        unlockedMaps: data.unlockedMaps ?? [],
        achievements: data.achievements ?? {},
        coins: data.coins ?? 0,
        cosmicProgress: data.cosmicProgress ?? get().cosmicProgress,
        completedLevelUnlocks: data.completedLevelUnlocks ?? {},
        completedLevels: fixedCompleted,
        unlockedLevels: data.unlockedLevels ?? ['level01'],
        unlockedSections: data.unlockedSections ?? [1],
      });

      get().saveCache();
      get().syncToFirebase();
    } catch (e) {
      console.warn('loadFromFirebase failed', e);
    }
  },

  resetToInitialState: () =>
    set({
      highestLevelUnlocked: 1,
      unlockedPowerups: [],
      unlockedMaps: [],
      achievements: {},
      coins: 0,
      cosmicProgress: {xp: 0, level: 1},
      completedLevelUnlocks: {},
      triggerCosmicEvolution: null,
    }),
}));
