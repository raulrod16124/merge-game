// src/state/gameStore/index.ts

import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

import type {
  GameState,
  LevelConfig,
  Pos,
  ItemBase,
  HoleEnemy,
  CosmicType,
} from '../../core/types';

import {createAddItem} from './actions/addItem';
import {createMerges} from './actions/merges';
import {createEnemies} from './actions/enemies';
import {createTimer} from './actions/timer';
import {createObjectiveChecker} from './actions/objectives';
import {createFloatingScoreActions} from './actions/floatingScores';

import {emptyFragments} from './utils/fragments';
import {getResponsiveBoardSize} from '../../utils/getResponsiveBoardSize';

export type GameStore = {
  items: ItemBase[];
  holes: HoleEnemy[];
  boardSize: {cols: number; rows: number};
  currentLevel: LevelConfig | null;
  score: number;
  moves: number;
  nextItem: CosmicType;
  timeLeft: number;
  powerupUsed: boolean;

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

  supernovas: {id: string; x: number; y: number}[];

  // === Nivel resultado (nuevo) ===
  levelResult: {status: 'win' | 'fail'; levelId: string} | null;
  setLevelResult: (r: {status: 'win' | 'fail'; levelId: string} | null) => void;

  // === NUEVAS ACCIONES ===
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

  addSupernova: (sv: {id: string; x: number; y: number}) => void;
  removeSupernova: (id: string) => void;

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
    const enemies = createEnemies(set, get);
    const timer = createTimer(set, get);
    const objectives = createObjectiveChecker(set, get);
    const floats = createFloatingScoreActions(set, get);

    return {
      // === Estado inicial ===
      items: [],
      holes: [],
      boardSize: {cols: 6, rows: 6},
      currentLevel: null,
      score: 0,
      moves: 0,
      nextItem: 'dust',
      timeLeft: 0,
      powerupUsed: false,
      floatingScores: [],
      createdCounts: {},
      _timerId: null,

      // === Estado para posicionamiento gráfico ===
      cellRects: {},

      // === Estado para animaciones ===
      absorbAnimations: [],
      supernovas: [],

      // === Nivel resultado (nuevo) ===
      levelResult: null,
      setLevelResult: r => set(() => ({levelResult: r})),

      // === NUEVAS ACCIONES ===
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

      addSupernova: sv => set(s => ({supernovas: [...s.supernovas, sv]})),

      removeSupernova: id =>
        set(s => ({
          supernovas: s.supernovas.filter(sv => sv.id !== id),
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

        const holes = Array.from({length: lvl.enemyCount}, () => ({
          id: 'h_' + (crypto.randomUUID?.() ?? String(Date.now())),
          pos: {
            x: Math.floor(Math.random() * size.cols),
            y: Math.floor(Math.random() * size.rows),
          },
          fragments: emptyFragments(),
          active: true,
        }));

        set({
          items: initial,
          holes,
          boardSize: size,
          currentLevel: lvl,
          score: 0,
          moves: 0,
          nextItem: 'dust',
          timeLeft: lvl.timerSeconds ?? 120,
          powerupUsed: false,
          floatingScores: [],
          createdCounts: {},
          cellRects: {},
          absorbAnimations: [],
          supernovas: [],
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
      stepEnemyMovement: enemies.stepEnemyMovement,
      spawnNextItem: merges.spawnNextItem,
      activatePowerup: () => !get().powerupUsed && set({powerupUsed: true}),

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
          holes: s.holes,
          powerupUsed: s.powerupUsed,
          floatingScores: s.floatingScores,
        };
      },
    };
  }),
);
