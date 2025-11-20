import {create} from 'zustand';

type UserState = {
  userId: string | null;
  name: string | null;
  avatar: string | null;
  coins: number;
  authenticated: boolean;

  authenticate: (name: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useUserStore = create<UserState>(set => ({
  userId: null,
  name: null,
  avatar: null,
  coins: 0,
  authenticated: false,

  authenticate: name => {
    const user = {
      userId: crypto.randomUUID(),
      name,
      avatar: 'default',
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
}));
