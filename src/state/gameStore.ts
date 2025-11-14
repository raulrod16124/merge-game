// src/state/gameStore.ts
import {create} from 'zustand';
import {GameEngine} from '@/core/GameEngine';
import type {GameState, Position} from '@/core/types';
import type {LevelConfig} from '@/core/typesLevel';
import {ITEM_WEIGHTS} from '@/ui/constants';

/** Floating score effect */
type FloatingScore = {
  id: string;
  x: number;
  y: number;
  points: number;
};

type WinLoseResult =
  | {status: 'win'; reason: string; levelId: string}
  | {status: 'fail'; reason: string; levelId: string}
  | null;

type GameStore = {
  engine: GameEngine;
  state: GameState;

  score: number;
  moves: number;
  floatingScores: FloatingScore[];

  nextItem: string;
  currentLevel: LevelConfig | null;

  // Actions
  addItem: (pos: Position) => boolean;
  generateNextItem: () => void;
  removeFloatingScore: (id: string) => void;
  loadLevel: (lvl: LevelConfig) => void;
  resetLevel: () => void;
  checkWinLose: () => WinLoseResult;
};

export const useGameStore = create<GameStore>((set, get) => {
  const engine = new GameEngine(6, 6);

  /** Attach engine subscription ONCE */
  engine.subscribe((newState, mergeEvents) => {
    set(prev => {
      const safePrev = {
        engine: prev?.engine ?? engine,
        state: newState,
        score: prev?.score ?? 0,
        moves: prev?.moves ?? 0,
        floatingScores: prev?.floatingScores ?? [],
        nextItem: prev?.nextItem ?? 'bush',
        currentLevel: prev?.currentLevel ?? null,
      };

      let newScore = safePrev.score;
      let newFloating = safePrev.floatingScores;

      if (mergeEvents && mergeEvents.length > 0) {
        for (const ev of mergeEvents) {
          newScore += ev.points;
          newFloating = [
            ...newFloating,
            {
              id: ev.toItem.id,
              x: ev.toItem.pos.x,
              y: ev.toItem.pos.y,
              points: ev.points,
            },
          ];
        }
      }

      return {
        ...safePrev,
        state: newState,
        score: newScore,
        floatingScores: newFloating,
      };
    });
  });

  return {
    engine,
    state: engine.getState(),

    score: 0,
    moves: 0,
    floatingScores: [],

    nextItem: 'bush',
    currentLevel: null,

    /** Add item → increments moves → engine.addItem */
    addItem: pos => {
      const type = get().nextItem;
      const ok = engine.addItem(type, pos);
      if (!ok) return false;

      set(prev => ({moves: prev.moves + 1}));
      get().generateNextItem();

      return true;
    },

    /** Remove floating score after animation */
    removeFloatingScore: id =>
      set(prev => ({
        floatingScores: prev.floatingScores.filter(fs => fs.id !== id),
      })),

    /** Weighted random next item */
    generateNextItem: () => {
      const lvl = get().currentLevel;
      if (!lvl) {
        set({nextItem: 'bush'});
        return;
      }

      const weights = lvl.itemWeights || ITEM_WEIGHTS;
      const items = Object.keys(weights);

      const total = items.reduce((sum, key) => sum + weights[key], 0);
      const r = Math.random() * total;

      let acc = 0;
      for (const it of items) {
        acc += weights[it];
        if (r <= acc) {
          set({nextItem: it});
          return;
        }
      }

      set({nextItem: 'bush'});
    },

    /** Load a level and initialize everything */
    loadLevel: lvl => {
      engine.resetBoard();
      // engine.resizeBoard(lvl.boardSize.cols, lvl.boardSize.rows);

      if (lvl.initialMap) {
        engine.placeInitialItems(lvl.initialMap);
      }

      set({
        currentLevel: lvl,
        score: 0,
        moves: 0,
        floatingScores: [],
        nextItem: 'bush',
      });

      get().generateNextItem();
      return;
    },

    resetLevel: () => {
      const lvl = get().currentLevel;
      if (!lvl) return;

      get().loadLevel(lvl);
    },

    /** WIN / FAIL conditions */
    checkWinLose: () => {
      const lvl = get().currentLevel;
      if (!lvl) return null;

      const {score, moves, state} = get();

      // WIN: score threshold reached
      if (lvl.targetScore && score >= lvl.targetScore) {
        return {status: 'win', reason: 'scoreReached', levelId: lvl.id};
      }

      // FAIL: board full
      const {cols, rows} = state.boardSize;
      if (state.items.length >= cols * rows) {
        return {status: 'fail', reason: 'boardFull', levelId: lvl.id};
      }

      // FAIL: max moves reached
      if (lvl.maxMoves && moves >= lvl.maxMoves) {
        return {status: 'fail', reason: 'maxMoves', levelId: lvl.id};
      }

      return null;
    },
  };
});
