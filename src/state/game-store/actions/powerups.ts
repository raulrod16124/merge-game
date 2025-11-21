// src/state/game-store/actions/powerups.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';

export const createPowerups = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  /**
   * MVP: activar powerup. Más adelante añadiremos efectos reales.
   */
  activatePowerup: (id: string) => {
    const state = get();

    console.log('Powerup activado:', id);

    // === MVP basic behaviour ===
    // 1) Marcar el powerup como usado en este turno
    set({powerupUsed: true});

    // 2) En un MVP no se altera el tablero todavía
    // En la siguiente fase añadiremos efectos (bomba, extra tile, wand, etc.)
  },
});
