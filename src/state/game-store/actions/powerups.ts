import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {PowerupType} from '@/core/types';

export const createPowerups = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  /**
   * Activar powerup: ahora marca el powerup activo en el store
   * (antes solo marcaba powerupUsed: true y no habilitaba el modo).
   */
  activatePowerup: (id: PowerupType) => {
    get();

    console.log('Powerup activado (createPowerups):', id);

    // 1) Marcar el powerup como usado en este turno (si necesitas)
    set({powerupUsed: true});

    // 2) Establecer el modo activo en el store para que la UI responda
    set(() => ({
      activePowerup: id,
      selectedCell: null,
    }));
  },

  // Opcional: añadir cancelPowerup aquí si quieres centralizarlo
  cancelPowerup: () =>
    set(() => ({
      activePowerup: null,
      selectedCell: null,
    })),
});
