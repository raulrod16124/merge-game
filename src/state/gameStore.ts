// src/state/gameStore.ts
import {create} from 'zustand';
import {GameEngine} from '@/core/GameEngine';
import type {GameState, Position} from '@/core/types';
import {ITEM_ORDER, ITEM_WEIGHTS} from '@/ui/constants';

/**
 * Versión robusta del store:
 * - Inicializa todo el estado antes de suscribirse
 * - En la suscripción obtiene engine.getLastMergeEvent() UNA vez
 * - Actualiza score y floatingScores de forma inmutable y segura
 * - Añade logs de diagnóstico (puedes comentarlos o eliminarlos luego)
 */

type FloatingScore = {
  id: string;
  x: number;
  y: number;
  points: number;
};

type GameStore = {
  engine: GameEngine;
  state: GameState;
  score: number;
  floatingScores: FloatingScore[];
  nextItem: string;
  highestUnlocked: string;
  addItem: (pos: Position) => boolean;
  removeFloatingScore: (id: string) => void;
  resetBoard: () => void;
  generateNextItem: () => void;
  updateHighestUnlocked: (type: string) => void;
};

export const useGameStore = create<GameStore>((set, get) => {
  const engine = new GameEngine(6, 6);

  // 1) Estado inicial completo y coherente
  set({
    engine,
    state: engine.getState(),
    score: 0,
    floatingScores: [],
    nextItem: 'bush',
    highestUnlocked: 'tree',
  });

  // 2) Suscripción al engine: lectura segura del mergeEvent y actualización del store
  engine.subscribe(newState => {
    try {
      const mergeEvent = engine.getLastMergeEvent();

      // LOG para depurar (borra después si quieres)
      if (mergeEvent) {
        // eslint-disable-next-line no-console
        console.log('[GameStore] MergeEvent:', mergeEvent);
      }

      set(prev => {
        // prev ya existe porque hicimos un set inicial, pero por seguridad:
        const safePrev = prev ?? {
          score: 0,
          floatingScores: [],
          nextItem: 'bush',
          highestUnlocked: 'tree',
          engine,
          state: newState,
        };

        let newScore = safePrev.score;
        let newFloating = safePrev.floatingScores;

        if (mergeEvent) {
          // 1) sumar puntos
          newScore = safePrev.score + (mergeEvent.points ?? 0);

          // 2) crear entrada flotante (inmutable)
          newFloating = [
            ...safePrev.floatingScores,
            {
              id: mergeEvent.toItem.id,
              x: mergeEvent.toItem.pos.x,
              y: mergeEvent.toItem.pos.y,
              points: mergeEvent.points,
            },
          ];
        }

        // 3) devolver estado nuevo (state actualizado por engine)
        return {
          state: newState,
          score: newScore,
          floatingScores: newFloating,
          nextItem: safePrev.nextItem,
          highestUnlocked: safePrev.highestUnlocked,
          engine: safePrev.engine,
        };
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[GameStore] Error handling mergeEvent:', err);
    }
  });

  // 3) API pública del store
  return {
    engine,
    state: engine.getState(),
    score: 0,
    floatingScores: [],
    nextItem: 'bush',
    highestUnlocked: 'tree',

    addItem: pos => {
      const type = get().nextItem;
      const ok = engine.addItem(type, pos);
      if (!ok) return false;
      // tras añadir, generar siguiente item
      get().generateNextItem();
      return true;
    },

    removeFloatingScore: id =>
      set(prev => ({
        floatingScores: prev.floatingScores.filter(fs => fs.id !== id),
      })),

    resetBoard: () => {
      engine.resetBoard();
      // reset store state coherente con engine
      set({
        state: engine.getState(),
        score: 0,
        floatingScores: [],
        nextItem: 'bush',
        highestUnlocked: 'tree',
      });
    },

    generateNextItem: () => {
      const highest = get().highestUnlocked;

      const allowedItems = ITEM_ORDER.slice(
        0,
        ITEM_ORDER.indexOf(highest) + 1,
      ) as Array<keyof typeof ITEM_WEIGHTS>;

      const weights = allowedItems.map(t => ITEM_WEIGHTS[t]);
      const total = weights.reduce((a, b) => a + b, 0);
      const r = Math.random() * total;

      let acc = 0;
      for (let i = 0; i < allowedItems.length; i++) {
        acc += weights[i];
        if (r <= acc) {
          set({nextItem: allowedItems[i]});
          return;
        }
      }
    },

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
