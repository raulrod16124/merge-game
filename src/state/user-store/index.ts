// src/state/user-store/index.ts
import {create} from 'zustand';
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';
import {signInAnonIfNeeded, db} from '@/core/firebase';
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

type Avatar = {
  variant: AvatarVariant;
};

type Inventory = Record<string, number>;
type Combinations = Record<string, number>;

type UserState = {
  uid: string | null;
  authenticated: boolean;
  loading: boolean;

  name: string | null;
  avatar: Avatar | null;
  coins: number;
  inventory: Inventory;
  combinations: Combinations;

  authenticate: (name: string, variant?: AvatarVariant) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => void;

  syncToFirebase: () => Promise<void>;
  loadFromFirebase: (uid: string) => Promise<void>;

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
  uid: null,
  authenticated: false,
  loading: false,

  name: null,
  avatar: null,
  coins: 0,
  inventory: {},
  combinations: {},

  // ------------------------------
  // AUTHENTICATION FLOW
  // ------------------------------
  authenticate: async (name, variant = 'hybrid') => {
    const fbUser = await signInAnonIfNeeded();

    const newUser = {
      uid: fbUser.uid,
      authenticated: true,
      name,
      avatar: {variant},
      coins: 0,
      inventory: {},
      combinations: {},
    };

    // persist locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    // persist in Firestore
    await setDoc(
      doc(db, 'users', fbUser.uid),
      {
        ...newUser,
        lastUpdated: serverTimestamp(),
      },
      {merge: true},
    );

    set(newUser);
  },

  logout: async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    set({
      uid: null,
      authenticated: false,
      name: null,
      avatar: null,
      coins: 0,
      inventory: {},
      combinations: {},
    });
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set(parsed);
    } catch (e) {
      console.warn('loadFromStorage failed', e);
    }
  },

  // ------------------------------
  // FIREBASE SYNC
  // ------------------------------
  syncToFirebase: async () => {
    const state = get();
    if (!state.uid) return;

    const payload = {
      uid: state.uid,
      authenticated: state.authenticated,
      name: state.name,
      avatar: state.avatar,
      coins: state.coins,
      inventory: state.inventory,
      combinations: state.combinations,
      lastUpdated: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'users', state.uid), payload, {merge: true});
    } catch (e) {
      console.warn('syncToFirebase failed', e);
    }
  },

  loadFromFirebase: async uid => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const data = snap.data() as any;

      // Merge remote → local
      const merged = {
        uid,
        authenticated: true,
        name: data.name ?? get().name,
        avatar: data.avatar ?? get().avatar,
        coins: data.coins ?? get().coins,
        inventory: data.inventory ?? get().inventory,
        combinations: data.combinations ?? get().combinations,
      };

      // Persist local
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

      set(merged);
    } catch (e) {
      console.warn('loadFromFirebase failed', e);
    }
  },

  // ------------------------------
  // AVATAR
  // ------------------------------
  persistAvatar: async avatar => {
    const state = get();
    if (!state.uid) return;

    await setDoc(
      doc(db, 'users', state.uid),
      {avatar, lastUpdated: serverTimestamp()},
      {merge: true},
    );

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const u = JSON.parse(raw);
      u.avatar = avatar;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    }
  },

  setAvatarVariant: async variant => {
    get();
    const newAvatar = {variant};
    await get().persistAvatar(newAvatar);
    set({avatar: newAvatar});
  },

  // ------------------------------
  // ECONOMY + INVENTORY
  // ------------------------------
  addCoins: amount => {
    const state = get();
    const newCoins = Math.max(0, state.coins + amount);

    set({coins: newCoins});

    // persist local
    const updated = {...state, coins: newCoins};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // persist firebase
    get().syncToFirebase();
  },

  addInventoryItem: (itemId, qty = 1) => {
    const state = get();
    const current = state.inventory[itemId] ?? 0;
    const nextInv = {...state.inventory, [itemId]: current + qty};

    const updated = {...state, inventory: nextInv};
    set({inventory: nextInv});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    get().syncToFirebase();
  },

  purchaseItem: (itemId, price) => {
    const state = get();
    if (state.coins < price) return false;

    const newCoins = state.coins - price;
    const nextInv = {
      ...state.inventory,
      [itemId]: (state.inventory[itemId] ?? 0) + 1,
    };

    const updated = {...state, coins: newCoins, inventory: nextInv};

    set({coins: newCoins, inventory: nextInv});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    get().syncToFirebase();

    return true;
  },

  consumeItem: (itemId, qty = 1) => {
    const state = get();
    const current = state.inventory[itemId] ?? 0;
    if (current < qty) return false;

    const nextInv = {...state.inventory, [itemId]: current - qty};
    const updated = {...state, inventory: nextInv};

    set({inventory: nextInv});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    get().syncToFirebase();

    return true;
  },

  addCombinationCounts: (itemId, qty = 1) => {
    const state = get();
    const current = state.combinations[itemId] ?? 0;
    const nextComb = {...state.combinations, [itemId]: current + qty};
    const updated = {...state, combinations: nextComb};

    set({combinations: nextComb});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    get().syncToFirebase();
  },

  getCombinationCount: itemId => {
    return get().combinations[itemId] ?? 0;
  },

  deductInventoryItem: (id, amount) =>
    set(s => {
      const inv = {...s.inventory};
      const current = inv[id] || 0;
      inv[id] = Math.max(0, current - amount);

      const newState = {...s, inventory: inv};
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      get().syncToFirebase();

      return {inventory: inv};
    }),
}));
