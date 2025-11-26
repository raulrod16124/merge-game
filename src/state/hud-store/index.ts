// src/state/hud-store.ts
import {create} from 'zustand';

export type HudNotification = {
  id: string;
  title: string;
};

type HudStore = {
  notifications: HudNotification[];
  push: (title: string) => void;
  remove: (id: string) => void;
};

export const useHudStore = create<HudStore>((set, get) => ({
  notifications: [],

  push: (title: string) => {
    const id = `hud_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    set(s => ({
      notifications: [...s.notifications, {id, title}],
    }));

    // auto-remove after 2.5s
    setTimeout(() => {
      get().remove(id);
    }, 2500);
  },

  remove: id =>
    set(s => ({
      notifications: s.notifications.filter(n => n.id !== id),
    })),
}));
