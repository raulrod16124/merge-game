// src/core/sound/soundManager.ts
import {Howl, Howler} from 'howler';
import {useSettingsStore} from '@/state/settings-store';

/**
 * IDs de efectos de sonido (SFX) que usa el juego.
 */
export type SoundId =
  | 'ui-tap'
  | 'ui-click'
  | 'ui-back'
  | 'ui-nav'
  | 'merge'
  | 'merge-big'
  | 'store-open'
  | 'store-buy-ok'
  | 'store-buy-fail'
  | 'level-win'
  | 'level-fail'
  | 'achievement'
  | 'evolution'
  | 'powerup';

/**
 * IDs para posibles músicas de fondo.
 * No es obligatorio usarlas todavía, pero dejamos el sistema preparado.
 */
export type MusicId = 'bgm-menu' | 'bgm-board';

type SoundConfig = {
  src: string;
  volume?: number;
  loop?: boolean;
  /**
   * Tiempo mínimo entre reproducciones consecutivas del mismo sonido (ms).
   * Útil para evitar spam en merges en cadena, etc.
   */
  throttleMs?: number;
};

const SOUND_CONFIG: Record<SoundId, SoundConfig> = {
  'ui-tap': {src: '/sounds/ui-tap.wav', volume: 0.6, throttleMs: 30},
  'ui-click': {src: '/sounds/ui-click.wav', volume: 0.6, throttleMs: 30},
  'ui-back': {src: '/sounds/ui-back.wav', volume: 0.6, throttleMs: 80},
  'ui-nav': {src: '/sounds/ui-nav.wav', volume: 0.7, throttleMs: 80},
  merge: {src: '/sounds/merge.wav', volume: 0.85, throttleMs: 40},
  'merge-big': {src: '/sounds/merge-big.wav', volume: 1, throttleMs: 120},
  'store-open': {src: '/sounds/store-open.wav', volume: 0.7, throttleMs: 150},
  'store-buy-ok': {src: '/sounds/store-buy-ok.wav', volume: 1, throttleMs: 200},
  'store-buy-fail': {
    src: '/sounds/store-buy-fail.wav',
    volume: 1,
    throttleMs: 200,
  },
  'level-win': {src: '/sounds/level-win.wav', volume: 1, throttleMs: 500},
  'level-fail': {src: '/sounds/level-fail.wav', volume: 1, throttleMs: 500},
  achievement: {src: '/sounds/achievement.wav', volume: 0.9, throttleMs: 300},
  evolution: {src: '/sounds/evolution.wav', volume: 1, throttleMs: 500},
  powerup: {src: '/sounds/powerup.wav', volume: 1, throttleMs: 120},
};

/**
 * Config opcional de música de fondo.
 * Los archivos no existen aún: tendrás que añadirlos tú (p.ej. en /public/music).
 */
const MUSIC_CONFIG: Record<MusicId, SoundConfig> = {
  'bgm-menu': {
    src: '/music/menu-theme.mp3',
    volume: 0.6,
    loop: true,
  },
  'bgm-board': {
    src: '/music/board-theme.mp3',
    volume: 0.6,
    loop: true,
  },
};

class SoundManager {
  private sfx: Partial<Record<SoundId, Howl>> = {};
  private music: Partial<Record<MusicId, Howl>> = {};
  private lastPlayed: Partial<Record<SoundId, number>> = {};
  private currentMusicId?: MusicId;

  /**
   * Reproduce un efecto de sonido (SFX).
   * Respeta settings y throttling.
   */
  play(id: SoundId): void {
    const {soundEnabled} = useSettingsStore.getState();
    if (!soundEnabled) return;

    const cfg = SOUND_CONFIG[id];
    if (!cfg) return;

    const now = performance.now();
    const last = this.lastPlayed[id];

    if (cfg.throttleMs && last !== undefined && now - last < cfg.throttleMs) {
      return;
    }

    this.lastPlayed[id] = now;

    let howl = this.sfx[id];

    if (!howl) {
      howl = new Howl({
        src: [cfg.src],
        loop: cfg.loop ?? false,
        volume: cfg.volume ?? 1,
      });
      this.sfx[id] = howl;
    }

    howl.play();
  }

  /**
   * Reproduce música de fondo en loop.
   * Si ya está sonando la misma, no hace nada.
   */
  playMusic(id: MusicId): void {
    const {soundEnabled} = useSettingsStore.getState();
    if (!soundEnabled) return;

    if (this.currentMusicId === id) return;

    const cfg = MUSIC_CONFIG[id];
    if (!cfg) return;

    // Detener música actual si existe
    if (this.currentMusicId) {
      const prev = this.music[this.currentMusicId];
      if (prev) {
        prev.stop();
      }
    }

    let howl = this.music[id];

    if (!howl) {
      howl = new Howl({
        src: [cfg.src],
        loop: cfg.loop ?? true,
        volume: cfg.volume ?? 0.6,
      });
      this.music[id] = howl;
    }

    this.currentMusicId = id;
    howl.play();
  }

  /**
   * Detiene la música de fondo actual si la hay.
   */
  stopMusic(): void {
    if (!this.currentMusicId) return;
    const howl = this.music[this.currentMusicId];
    if (howl) {
      howl.stop();
    }
    this.currentMusicId = undefined;
  }

  /**
   * Mute global (SFX + música). Lo usaremos para sincronizar con el toggle.
   */
  setMuted(muted: boolean): void {
    Howler.mute(muted);
  }

  /**
   * Detiene absolutamente todo.
   */
  stopAll(): void {
    Howler.stop();
    this.currentMusicId = undefined;
  }
}

export const soundManager = new SoundManager();
