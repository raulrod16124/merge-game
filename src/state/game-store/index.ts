// src/state/gameStore/index.ts

import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

import type {
  GameState,
  LevelConfig,
  Pos,
  ItemBase,
  CosmicType,
} from '../../core/types';

import {createAddItem} from './actions/addItem';
import {createMerges} from './actions/merges';
import {createTimer} from './actions/timer';
import {createObjectiveChecker} from './actions/objectives';
import {createFloatingScoreActions} from './actions/floatingScores';

import {getResponsiveBoardSize} from '../../utils/getResponsiveBoardSize';
import {createPowerups} from './actions/powerups';
import {maybeSpawnBlackHole} from './utils/spawnHelpers';
import {stepEnemyMovementPure} from './utils/enemyMovement';

export type GameStore = {
  items: ItemBase[];
  boardSize: {cols: number; rows: number};
  currentLevel: LevelConfig | null;
  score: number;
  moves: number;
  nextItem: CosmicType;
  timeLeft: number;
  powerupUsed: boolean;
  levelCoins: number;
  turnCounter: number;

  floatingScores: {id: string; x: number; y: number; points: number}[];
  createdCounts: Record<string, any>;
  _timerId?: number | null;

  // === NUEVOS ESTADOS ===
  cellRects: Record<string, {size: number; centerX: number; centerY: number}>;

  absorbAnimations: {
    id: string;
    from: {x: number; y: number};
    to: {x: number; y: number};
    size: number;
    icon: string;
  }[];

  // === Nivel resultado (nuevo) ===
  levelResult: {status: 'win' | 'fail'; levelId: string} | null;
  setLevelResult: (r: {status: 'win' | 'fail'; levelId: string} | null) => void;

  // === NUEVAS ACCIONES ===
  incrementTurn: () => void;

  setCellRect: (
    key: string,
    rect: {size: number; centerX: number; centerY: number},
  ) => void;

  addAbsorbAnimation: (anim: {
    id: string;
    from: {x: number; y: number};
    to: {x: number; y: number};
    size: number;
    icon: string;
  }) => void;

  removeAbsorbAnimation: (id: string) => void;

  // ---- Actions originales ----
  loadLevel: (lvl: LevelConfig) => void;
  resetLevel: () => void;
  addItem: (pos: Pos) => void;
  processMergesAt: (pos: Pos) => void;
  stepEnemyMovement: () => void;
  spawnNextItem: () => void;
  activatePowerup: () => void;

  addFloatingScore: (x: number, y: number, p: number) => void;
  removeFloatingScore: (id: string) => void;

  startTimer: () => void;
  stopTimer: () => void;

  checkWinLose: () => {status: 'win' | 'fail'; levelId: string} | null;
  getStateSnapshot: () => GameState;
};

export const useGameStore = create<GameStore>()(
  devtools((set, get) => {
    // Inject reusable action modules
    const addItem = createAddItem(set, get);
    const merges = createMerges(set, get);
    const timer = createTimer(set, get);
    const objectives = createObjectiveChecker(set, get);
    const floats = createFloatingScoreActions(set, get);

    return {
      // === Estado inicial ===
      items: [],
      boardSize: {cols: 6, rows: 6},
      currentLevel: null,
      score: 0,
      moves: 0,
      nextItem: 'dust',
      timeLeft: 0,
      powerupUsed: false,
      levelCoins: 0,
      floatingScores: [],
      createdCounts: {},
      _timerId: null,
      turnCounter: 0,

      // === Estado para posicionamiento gráfico ===
      cellRects: {},

      // === Estado para animaciones ===
      absorbAnimations: [],

      // === Nivel resultado (nuevo) ===
      levelResult: null,
      setLevelResult: r => set(() => ({levelResult: r})),

      // === NUEVAS ACCIONES ===
      ...createPowerups(set, get),

      incrementTurn: () => {
        // incrementamos el contador y, tras ello, intentamos spawnear y moverte enemigos
        const prev = get().turnCounter ?? 0;
        const next = prev + 1;
        set({turnCounter: next});

        // 1) intentar spawn dinámico (FASE 2)
        const level = get().currentLevel;
        if (level) {
          const spawned = maybeSpawnBlackHole(
            get().items,
            get().boardSize.cols,
            get().boardSize.rows,
            level,
            next,
          );
          if (spawned !== get().items) {
            set({items: spawned});
          }
        }

        // 2) mover enemigos (FASE 3)
        const {items: afterMove, pointsGained} = stepEnemyMovementPure(
          get().items,
          get().boardSize.cols,
          get().boardSize.rows,
          get().currentLevel?.blockedCells,
        );

        // Si hubo cambios, los actualizamos en el store
        const itemsChanged =
          afterMove.length !== get().items.length ||
          afterMove.some(
            (it, i) =>
              it.id !== get().items[i]?.id ||
              it.pos.x !== get().items[i]?.pos.x ||
              it.pos.y !== get().items[i]?.pos.y,
          );

        if (itemsChanged) {
          set({items: afterMove});
        }

        // Opcional: si pointsGained > 0, aplicar recompensa (floatingScores / score)
        if (pointsGained > 0) {
          // set state to reflect the gained points, por ejemplo:
          set(state => ({score: (state.score ?? 0) + pointsGained}));
        }
      },

      stepEnemyMovement: () => {
        const {items: afterMove} = stepEnemyMovementPure(
          get().items,
          get().boardSize.cols,
          get().boardSize.rows,
          get().currentLevel?.blockedCells,
        );
        set({items: afterMove});
      },

      setCellRect: (key, rect) =>
        set(s => ({
          cellRects: {...s.cellRects, [key]: rect},
        })),

      addAbsorbAnimation: anim =>
        set(s => ({
          absorbAnimations: [...s.absorbAnimations, anim],
        })),

      removeAbsorbAnimation: id =>
        set(s => ({
          absorbAnimations: s.absorbAnimations.filter(a => a.id !== id),
        })),

      // === Load/reset ===
      loadLevel: lvl => {
        const size = getResponsiveBoardSize(lvl);

        const initial = lvl.initialMap.map((s, idx) => ({
          id: `init_${idx}_${Date.now()}`,
          type: s.type,
          level: 1,
          pos: {x: s.x, y: s.y},
          createdAt: Date.now(),
        }));

        set({
          items: initial,
          boardSize: size,
          currentLevel: lvl,
          score: 0,
          moves: 0,
          nextItem: 'dust',
          timeLeft: lvl.timerSeconds ?? 120,
          powerupUsed: false,
          levelCoins: 0,
          floatingScores: [],
          createdCounts: {},
          cellRects: {},
          absorbAnimations: [],
          levelResult: null,
        });

        get().spawnNextItem();
        get().stopTimer();
        get().startTimer();
      },

      resetLevel: () => {
        const lvl = get().currentLevel;
        lvl && get().loadLevel(lvl);
      },

      // === Delegated actions ===
      addItem: addItem,
      processMergesAt: merges.processMergesAt,
      spawnNextItem: merges.spawnNextItem,

      addFloatingScore: floats.addFloatingScore,
      removeFloatingScore: floats.removeFloatingScore,

      startTimer: timer.startTimer,
      stopTimer: timer.stopTimer,

      checkWinLose: objectives.checkWinLose,

      // === Snapshot ===
      getStateSnapshot: () => {
        const s = get();
        return {
          items: s.items,
          score: s.score,
          moves: s.moves,
          nextItem: s.nextItem,
          boardSize: s.boardSize,
          currentLevel: s.currentLevel!,
          timeLeft: s.timeLeft,
          powerupUsed: s.powerupUsed,
          floatingScores: s.floatingScores,
        };
      },
    };
  }),
);
