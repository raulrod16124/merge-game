// src/core/vibration.ts
import {useSettingsStore} from '@/state/settings-store';

export type VibrationPattern = number | number[];

export function vibrate(pattern: VibrationPattern): void {
  const {vibrationEnabled} = useSettingsStore.getState();
  if (!vibrationEnabled) return;

  if (!('vibrate' in navigator)) return;

  try {
    navigator.vibrate(pattern);
  } catch {
    // Silencioso por compatibilidad
  }
}
