// src/state/player-store/index.ts
import {create} from 'zustand';
import type {PowerupType} from '@/core/types';
import {LEVEL_UNLOCKS} from '@/data/levelUnlocks';
import {ACHIEVEMENTS} from '@/data/achievements';
import {LEVEL_XP_TABLE} from '@/data/cosmicLevels';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '@/core/firebase';
import {useUserStore} from '@/state/user-store';

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
    humanoid: {xp: number; level: number};
    abstract: {xp: number; level: number};
    hybrid: {xp: number; level: number};
  };
  avatarVariant: 'humanoid' | 'abstract' | 'hybrid';
  lastEvolutionLevel: number | null;
  completedLevelUnlocks: Record<number, boolean>;

  isPowerupUnlocked: (id: PowerupType) => boolean;
  clearNewAchievements: () => void;
  markLevelCompleted: (levelId: string, score: number) => void;
  isLevelUnlocked: (levelNumber: number) => boolean;
  unlockLevel: (lvl: number) => void;
  applyLevelUnlocks: (lvl: number) => void;
  unlockPowerup: (p: PowerupType) => void;
  unlockMap: (id: string) => void;
  addCoins: (amt: number) => void;
  markLevelUnlocksAsCompleted: (lvl: number) => void;

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
    humanoid: {xp: 0, level: 1},
    abstract: {xp: 0, level: 1},
    hybrid: {xp: 0, level: 1},
  },
  avatarVariant: 'humanoid',
  lastEvolutionLevel: null,
  completedLevelUnlocks: {},
  triggerCosmicEvolution: null,

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

  isLevelUnlocked: (n: number) => {
    return n <= get().highestLevelUnlocked;
  },

  isPowerupUnlocked: (id: PowerupType) => {
    const s = get();
    return Array.isArray(s.unlockedPowerups) && s.unlockedPowerups.includes(id);
  },

  clearNewAchievements: () => set({newAchievements: []}),

  markLevelCompleted: (levelId: string, score: number) => {
    const existing = get().completedLevels[levelId];

    const improved = !existing || score > existing.score;

    set(state => ({
      completedLevels: {
        ...state.completedLevels,
        [levelId]: improved ? {score, completedAt: Date.now()} : existing,
      },
      highestLevelUnlocked: Math.max(
        state.highestLevelUnlocked,
        parseInt(levelId.replace(/\D/g, '')) + 1,
      ),
    }));

    get().syncToFirebase();
  },

  unlockLevel: lvl => {
    set(s => ({
      highestLevelUnlocked: Math.max(s.highestLevelUnlocked, lvl),
    }));
    get().saveCache();
    get().syncToFirebase();
    get().updateLeaderboardScores();
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
    const variant = get().avatarVariant;
    const prog = get().cosmicProgress[variant];
    const totalXP = prog.xp + amt;

    const levelKeys = Object.keys(LEVEL_XP_TABLE).map(n => parseInt(n, 10));
    const maxDefinedLevel = Math.max(...levelKeys);

    let newLevel = prog.level;
    for (const lvl of levelKeys) {
      if (totalXP >= LEVEL_XP_TABLE[lvl]) newLevel = lvl;
    }

    if (newLevel > maxDefinedLevel) newLevel = maxDefinedLevel;

    set({
      cosmicProgress: {
        ...get().cosmicProgress,
        [variant]: {xp: totalXP, level: newLevel},
      },
    });

    if (newLevel > prog.level) {
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
    const avatar = useUserStore.getState().avatar;

    if (!uid) return;

    const state = get();

    // Ranking 1: Global
    const rankScoreGlobal =
      state.highestLevelUnlocked * 100000 + (state.coins ?? 0);

    // Ranking 2: Mayor nivel de ser cósmico
    // Puede ser del avatar activo o el mayor de todos
    const cosmicLevels = [
      state.cosmicProgress.humanoid.level,
      state.cosmicProgress.abstract.level,
      state.cosmicProgress.hybrid.level,
    ];
    const rankCosmicLevel = Math.max(...cosmicLevels);

    // Ranking 3: XP total combinada entre variantes
    const totalXP =
      state.cosmicProgress.humanoid.xp +
      state.cosmicProgress.abstract.xp +
      state.cosmicProgress.hybrid.xp;
    const rankTotalCosmicXP = totalXP;

    try {
      await setDoc(
        doc(db, 'leaderboard', uid),
        {
          uid,
          name: name ?? 'Unknown',
          avatar: avatar ?? {variant: 'hybrid'},

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
      avatarVariant: s.avatarVariant,
      completedLevelUnlocks: s.completedLevelUnlocks,
      lastEvolutionLevel: s.lastEvolutionLevel,
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

      set({
        highestLevelUnlocked: data.highestLevelUnlocked ?? 1,
        unlockedPowerups: data.unlockedPowerups ?? [],
        unlockedMaps: data.unlockedMaps ?? [],
        achievements: data.achievements ?? {},
        coins: data.coins ?? 0,
        cosmicProgress: data.cosmicProgress ?? get().cosmicProgress,
        avatarVariant: data.avatarVariant ?? get().avatarVariant,
        completedLevelUnlocks: data.completedLevelUnlocks ?? {},
        lastEvolutionLevel: data.lastEvolutionLevel ?? null,
      });

      get().saveCache();
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
      cosmicProgress: {
        humanoid: {xp: 0, level: 1},
        abstract: {xp: 0, level: 1},
        hybrid: {xp: 0, level: 1},
      },
      avatarVariant: 'humanoid',
      lastEvolutionLevel: null,
      completedLevelUnlocks: {},
      triggerCosmicEvolution: null,
    }),
}));
