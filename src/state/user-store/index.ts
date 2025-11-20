import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {create} from 'zustand';

type Inventory = {
  [itemId: string]: number;
};

type Avatar = {
  variant?: AvatarVariant;
};

type UserState = {
  userId: string | null;
  name: string | null;
  avatar: Avatar | null;
  coins: number;
  authenticated: boolean;
  inventory: Inventory;

  // actions
  authenticate: (name: string, variant?: AvatarVariant) => void;
  logout: () => void;
  loadFromStorage: () => void;

  // avatar
  setAvatarVariant: (variant: AvatarVariant) => Promise<void>;
  persistAvatar: (avatar: Avatar) => Promise<void>;

  // coins & inventory
  addCoins: (amount: number) => void;
  addInventoryItem: (itemId: string, qty?: number) => void;
  purchaseItem: (itemId: string, price: number) => boolean;
};

const STORAGE_KEY = 'stellar_user';

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  name: null,
  avatar: null,
  coins: 0,
  authenticated: false,
  inventory: {},

  purchaseItem: (itemId, price) => {
    const state = get();

    if (state.coins < price) return false;

    const newCoins = state.coins - price;
    const newInventory = {
      ...state.inventory,
      [itemId]: (state.inventory[itemId] || 0) + 1,
    };

    // Guardar localStorage
    const user = {
      ...state,
      coins: newCoins,
      inventory: newInventory,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    set({coins: newCoins, inventory: newInventory});

    return true;
  },

  authenticate: (name, variant) => {
    const user = {
      userId: crypto.randomUUID(),
      name,
      avatar: {variant},
      coins: 0,
      authenticated: true,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    set(user);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      userId: null,
      name: null,
      avatar: null,
      coins: 0,
      authenticated: false,
    });
  },

  loadFromStorage: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;

    const user = JSON.parse(data);
    set(user);
  },

  setAvatarVariant: async variant => {
    const state = get();
    const newAvatar = {...state.avatar, variant};
    await state.persistAvatar?.(newAvatar);
    set({avatar: newAvatar});
  },

  persistAvatar: async (avatar: Avatar) => {
    // Aquí luego conectaremos con Firebase
    return;
  },

  // coins and inventory helpers
  addCoins: amount => {
    const state = get();
    const newCoins = Math.max(0, state.coins + amount); // never negative
    const newUser = {
      ...state,
      coins: newCoins,
    };
    // persist
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        u.coins = newCoins;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {}
    }
    set({coins: newCoins});
  },
  addInventoryItem: (itemId, qty = 1) => {
    const state = get();
    const current = state.inventory[itemId] ?? 0;
    const newInventory = {...state.inventory, [itemId]: current + qty};

    // persist
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        u.inventory = newInventory;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {}
    }

    set({inventory: newInventory});
  },
}));
