// src/state/user-store/index.ts
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {create} from 'zustand';

type Avatar = {
  variant: AvatarVariant;
};

type Inventory = {
  [itemId: string]: number;
};

type Combinations = {
  [itemId: string]: number;
};

type UserState = {
  userId: string | null;
  name: string | null;
  avatar: Avatar | null;
  coins: number;
  authenticated: boolean;
  inventory: Inventory;
  combinations: Combinations;

  authenticate: (name: string, variant?: AvatarVariant) => void;
  logout: () => void;
  loadFromStorage: () => void;

  setAvatarVariant: (variant: AvatarVariant) => Promise<void>;
  persistAvatar: (avatar: Avatar) => Promise<void>;

  addCoins: (amount: number) => void;
  addInventoryItem: (itemId: string, qty?: number) => void;
  purchaseItem: (itemId: string, price: number) => boolean;

  consumeItem: (itemId: string, qty?: number) => boolean;
  addCombinationCounts: (itemId: string, qty?: number) => void;
  getCombinationCount: (itemId: string) => number;
  deductInventoryItem: (id: string, amount: number) => void;
};

const STORAGE_KEY = 'stellar_user';

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  name: null,
  avatar: null,
  coins: 0,
  authenticated: false,
  inventory: {},
  combinations: {},

  authenticate: (name, variant = 'hybrid') => {
    const user = {
      userId:
        typeof crypto !== 'undefined' && (crypto as any).randomUUID
          ? (crypto as any).randomUUID()
          : String(Date.now()),
      name,
      avatar: {variant} as Avatar,
      coins: 0,
      authenticated: true,
      inventory: {},
      combinations: {},
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user on authenticate', e);
    }

    set({
      userId: user.userId,
      name: user.name,
      avatar: user.avatar,
      coins: user.coins,
      authenticated: user.authenticated,
      inventory: user.inventory,
      combinations: user.combinations,
    });
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove user from storage', e);
    }

    set({
      userId: null,
      name: null,
      avatar: null,
      coins: 0,
      authenticated: false,
      inventory: {},
      combinations: {},
    });
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        userId: parsed.userId ?? null,
        name: parsed.name ?? null,
        avatar: parsed.avatar ?? {variant: 'hybrid'},
        coins: parsed.coins ?? 0,
        authenticated: parsed.authenticated ?? false,
        inventory: parsed.inventory ?? {},
        combinations: parsed.combinations ?? {},
      });
    } catch (e) {
      console.warn('Failed to load user from storage', e);
    }
  },

  persistAvatar: async avatar => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const u = JSON.parse(raw);
      u.avatar = avatar;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {
      console.warn('persistAvatar failed', e);
    }
  },

  setAvatarVariant: async variant => {
    const state = get();
    const newAvatar = {...(state.avatar ?? {variant}), variant};
    try {
      // persist via persistAvatar (stub for Firebase)
      await (get().persistAvatar?.(newAvatar) as Promise<void>);
    } catch {}
    // update local state and localStorage
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        u.avatar = newAvatar;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {}
    }
    set({avatar: newAvatar});
  },

  addCoins: amount => {
    const state = get();
    const newCoins = Math.max(0, state.coins + amount);
    // persist
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.coins = newCoins;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      }
    } catch {}
    set({coins: newCoins});
  },

  addInventoryItem: (itemId, qty = 1) => {
    const state = get();
    const current = state.inventory[itemId] ?? 0;
    const next = {...state.inventory, [itemId]: current + qty};

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.inventory = next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        const snapshot = {
          userId: state.userId,
          name: state.name,
          avatar: state.avatar,
          coins: state.coins,
          authenticated: state.authenticated,
          inventory: next,
          combinations: state.combinations,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      }
    } catch {}

    set({inventory: next});
  },

  purchaseItem: (itemId, price) => {
    const state = get();
    if (state.coins < price) return false;
    const newCoins = Math.max(0, state.coins - price);
    const current = state.inventory[itemId] ?? 0;
    const nextInv = {...state.inventory, [itemId]: current + 1};

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.coins = newCoins;
        u.inventory = nextInv;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        const snap = {
          userId: state.userId,
          name: state.name,
          avatar: state.avatar,
          coins: newCoins,
          authenticated: state.authenticated,
          inventory: nextInv,
          combinations: state.combinations,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      }
    } catch {}

    set({coins: newCoins, inventory: nextInv});
    return true;
  },

  consumeItem: (itemId, qty = 1) => {
    const state = get();
    const current = state.inventory[itemId] ?? 0;
    if (current < qty) return false;
    const nextInv = {...state.inventory, [itemId]: current - qty};

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.inventory = nextInv;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      }
    } catch {}

    set({inventory: nextInv});
    return true;
  },

  addCombinationCounts: (itemId, qty = 1) => {
    const state = get();
    const current = state.combinations[itemId] ?? 0;
    const nextComb = {...state.combinations, [itemId]: current + qty};

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        u.combinations = nextComb;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        const snap = {
          userId: state.userId,
          name: state.name,
          avatar: state.avatar,
          coins: state.coins,
          authenticated: state.authenticated,
          inventory: state.inventory,
          combinations: nextComb,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      }
    } catch {}

    set({combinations: nextComb});
  },

  getCombinationCount: itemId => {
    const state = get();
    return state.combinations[itemId] ?? 0;
  },

  deductInventoryItem: (id: string, amount: number) =>
    set(s => {
      const inv = {...s.inventory};
      const current = inv[id] || 0;
      inv[id] = Math.max(0, current - amount);
      return {inventory: inv};
    }),
}));
