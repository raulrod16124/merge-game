// src/state/gameStore.ts
import {create} from 'zustand';
import {GameEngine} from '@/core/GameEngine';
import type {GameState, Position} from '@/core/types';

type FloatingScore = {
  id: string;
  x: number;
  y: number;
  points: number;
};

const ITEM_ORDER = ['bush', 'tree', 'house', 'castle'];

type GameStore = {
  engine: GameEngine;
  state: GameState;

  // puntuación
  score: number;
  floatingScores: FloatingScore[];

  // nuevos campos
  nextItem: string; // objeto que toca colocar este turno
  highestUnlocked: string; // control de progresión

  addItem: (pos: Position) => boolean;
  removeFloatingScore: (id: string) => void;
  resetBoard: () => void;

  generateNextItem: () => void;
  updateHighestUnlocked: (type: string) => void;
};

export const useGameStore = create<GameStore>((set, get) => {
  const engine = new GameEngine(6, 6);

  // Estado inicial completo
  set({
    engine,
    state: engine.getState(),
    score: 0,
    floatingScores: [],
    nextItem: 'bush',
    highestUnlocked: 'tree', // al inicio puede tocar bush o tree
  });

  // SUSCRIPCIÓN DEL ENGINE
  engine.subscribe(newState => {
    const mergeEvent = engine.getLastMergeEvent();

    set(prev => {
      const safePrev = prev ?? {
        score: 0,
        floatingScores: [],
        nextItem: 'bush',
        highestUnlocked: 'tree',
      };

      let newFloating = safePrev.floatingScores;

      // si hubo merge
      if (mergeEvent) {
        // añadir puntos flotantes
        newFloating = [
          ...safePrev.floatingScores,
          {
            id: mergeEvent.toItem.id,
            x: mergeEvent.toItem.pos.x,
            y: mergeEvent.toItem.pos.y,
            points: mergeEvent.points,
          },
        ];

        // actualizar progresión
        get().updateHighestUnlocked(mergeEvent.toItem.type);
      }

      return {
        state: newState,
        score: mergeEvent ? safePrev.score + mergeEvent.points : safePrev.score,
        floatingScores: newFloating,
      };
    });
  });

  return {
    engine,
    state: engine.getState(),
    score: 0,
    floatingScores: [],
    nextItem: 'bush',
    highestUnlocked: 'tree',

    // añadir item usando nextItem
    addItem: pos => {
      const type = get().nextItem;

      const ok = engine.addItem(type, pos);
      if (!ok) return false;

      // generar siguiente item
      get().generateNextItem();

      return true;
    },

    removeFloatingScore: id =>
      set(prev => ({
        floatingScores: prev.floatingScores.filter(f => f.id !== id),
      })),

    resetBoard: () => {
      engine.resetBoard();
      set({
        score: 0,
        floatingScores: [],
        nextItem: 'bush',
        highestUnlocked: 'tree',
      });
    },

    // REGLA DE RANDOM:
    // puede tocar cualquier objeto desde bush hasta highestUnlocked
    generateNextItem: () => {
      const highest = get().highestUnlocked;

      const maxIdx = ITEM_ORDER.indexOf(highest);
      const pool = ITEM_ORDER.slice(0, maxIdx + 1);

      const next = pool[Math.floor(Math.random() * pool.length)];

      set({nextItem: next});
    },

    // aumenta progresion si se logra crear un nivel más alto
    updateHighestUnlocked: type => {
      const current = get().highestUnlocked;

      const currIdx = ITEM_ORDER.indexOf(current);
      const newIdx = ITEM_ORDER.indexOf(type);

      if (newIdx > currIdx) {
        set({highestUnlocked: type});
      }
    },
  };
});
