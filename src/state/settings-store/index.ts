// src/state/settings-store/index.ts
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export type SupportedLanguage = 'es' | 'en';

type SettingsState = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: SupportedLanguage;

  setSoundEnabled: (value: boolean) => void;
  setVibrationEnabled: (value: boolean) => void;
  setLanguage: (language: SupportedLanguage) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'es',

      setSoundEnabled: soundEnabled => {
        set({soundEnabled});
        // Sincronizar el mute global del soundManager
        import('@/core/sound/soundManager').then(({soundManager}) => {
          soundManager.setMuted(!soundEnabled);
        });
      },

      setVibrationEnabled: vibrationEnabled => set({vibrationEnabled}),
      setLanguage: language => set({language}),
    }),
    {
      name: 'stellar-merge-settings',
    },
  ),
);
