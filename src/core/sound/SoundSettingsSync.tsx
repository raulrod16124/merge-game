// src/core/sound/SoundSettingsSync.tsx
import {useEffect} from 'react';
import {useSettingsStore} from '@/state/settings-store';
import {soundManager} from './soundManager';

export function SoundSettingsSync() {
  const soundEnabled = useSettingsStore(state => state.soundEnabled);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  return null;
}
