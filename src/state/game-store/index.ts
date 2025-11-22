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

export type AbsorbedEffects = {
  id: string;
  absorbedType: string;
  from: {x: number; y: number};
  to: {x: number; y: number};
};

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

  absorbedEffects: AbsorbedEffects[];

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

  addAbsorbedEffect: (effect: any) => void;
  removeAbsorbedEffect: (id: string) => void;
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
      absorbedEffects: [],
      absorbAnimations: [],

      // === Nivel resultado (nuevo) ===
      levelResult: null,
      setLevelResult: r => set(() => ({levelResult: r})),

      addAbsorbedEffect: effect =>
        set(state => ({absorbedEffects: [...state.absorbedEffects, effect]})),

      removeAbsorbedEffect: (id: string) =>
        set(state => ({
          absorbedEffects: state.absorbedEffects.filter(e => e.id !== id),
        })),

      // === NUEVAS ACCIONES ===
      ...createPowerups(set, get),

      incrementTurn: () => {
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

        // 2) mover enemigos (FASE 3) y obtener registros de absorciones
        const movementResult = stepEnemyMovementPure(
          get().items,
          get().boardSize.cols,
          get().boardSize.rows,
          get().currentLevel?.blockedCells,
        );

        const afterMoveItems = movementResult.items;
        const absorbedRecords = movementResult.absorbedRecords;

        // 3) Si hubo absorciones, generamos efectos visuales (absorbedEffects)
        if (absorbedRecords.length > 0) {
          // para cada registro añadimos un efecto y actualizamos store
          for (const rec of absorbedRecords) {
            // add absorbedEffect (guardamos las coordenadas en grid, GameBoard mapeará a pixel)
            get().addAbsorbedEffect({
              id: `abs_${rec.absorbedId}_${Date.now()}`,
              absorbedType: rec.absorbedType,
              from: rec.from,
              to: rec.to,
            });
          }
        }

        // 4) Actualizamos items en store con afterMoveItems
        set({items: afterMoveItems});

        // 5) Revisión: transformar black holes que tienen absorbed >= 3 en supernova
        const itemsCopy: ItemBase[] = get().items.slice();
        const toRemoveBHIds: string[] = [];

        for (const it of itemsCopy) {
          if (it.type === 'black_hole' && (it.absorbed ?? 0) >= 3) {
            // transformar: borrar black hole, añadir supernova
            const pos = {x: it.pos.x, y: it.pos.y};
            toRemoveBHIds.push(it.id);

            // crear supernova item
            const supernovaItem: ItemBase = {
              id: `supernova_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              type: 'supernova',
              level: 1,
              pos,
              createdAt: Date.now(),
            };

            // eliminamos el BH y añadimos la supernova
            set(state => ({
              items: [
                ...state.items.filter(i => i.id !== it.id),
                supernovaItem,
              ],
            }));

            // Sumar puntuación por supernova
            set(state => ({score: (state.score ?? 0) + 150}));

            // Añadir floating score visual si tenemos cellRects (center coords)
            const key = `${pos.x},${pos.y}`;
            const rect = get().cellRects?.[key];
            if (rect) {
              set(state => ({
                floatingScores: [
                  ...(state.floatingScores ?? []),
                  {
                    id: `fs_supernova_${Date.now()}`,
                    x: rect.centerX,
                    y: rect.centerY,
                    points: 150,
                  },
                ],
              }));
            }
          }
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
