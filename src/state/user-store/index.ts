import {create} from 'zustand';

type UserState = {
  userId: string | null;
  name: string | null;
  avatar: string | null;
  coins: number;
  authenticated: boolean;
  setUser: (data: Partial<UserState>) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>(set => ({
  userId: null,
  name: null,
  avatar: null,
  coins: 0,
  authenticated: false,

  setUser: data => set(state => ({...state, ...data})),
  logout: () =>
    set({
      userId: null,
      name: null,
      avatar: null,
      coins: 0,
      authenticated: false,
    }),
}));
