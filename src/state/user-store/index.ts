import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {create} from 'zustand';

type Avatar = {
  variant: AvatarVariant;
};

type UserState = {
  userId: string | null;
  name: string | null;
  avatar: Avatar | null;
  coins: number;
  authenticated: boolean;

  authenticate: (name: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
  setAvatarVariant: (variant: AvatarVariant) => Promise<void>;
  persistAvatar: (avatar: Avatar) => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  name: null,
  avatar: null,
  coins: 0,
  authenticated: false,

  authenticate: name => {
    const user = {
      userId: crypto.randomUUID(),
      name,
      avatar: {
        variant: 'hybrid' as AvatarVariant,
      },
      coins: 0,
      authenticated: true,
    };

    // Persistencia
    localStorage.setItem('stellar_user', JSON.stringify(user));

    set(user);
  },

  logout: () => {
    localStorage.removeItem('stellar_user');
    set({
      userId: null,
      name: null,
      avatar: null,
      coins: 0,
      authenticated: false,
    });
  },

  loadFromStorage: () => {
    const data = localStorage.getItem('stellar_user');
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
}));
