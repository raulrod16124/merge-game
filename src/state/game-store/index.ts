// src/state/game-store/index.ts
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';

import type {
  GameState,
  LevelConfig,
  Pos,
  ItemBase,
  CosmicType,
  PowerupType,
} from '../../core/types';

import {createAddItem} from './actions/addItem';
import {createMerges} from './actions/merges';
import {createTimer} from './actions/timer';
import {createObjectiveChecker} from './actions/objectives';
import {createFloatingScoreActions} from './actions/floatingScores';

import {getResponsiveBoardSize} from '../../utils/getResponsiveBoardSize';
import {createPowerups} from './actions/powerups';
import {maybeSpawnBlackHole} from './utils/spawnHelpers';
import {computeEnemyMovePlans, type EnemyMovePlan} from './utils/enemyMovement';
import {usePlayerStore} from '@/state/player-store';

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
  blackHolesSpawned: number;

  floatingScores: {id: string; x: number; y: number; points: number}[];
  createdCounts: Record<string, any>;
  _timerId?: number | null;

  // positioning
  cellRects: Record<string, {size: number; centerX: number; centerY: number}>;

  // animations
  absorbAnimations: {
    id: string;
    from: {x: number; y: number};
    to: {x: number; y: number};
    size: number;
    icon: string;
  }[];

  absorbedEffects: AbsorbedEffects[];

  // powerups
  activePowerup: null | PowerupType;
  selectedCell: null | Pos;

  // powerup / direct actions
  moveItem: (from: Pos, to: Pos) => void;

  // powerups methods
  activatePowerup: (type: PowerupType) => void;
  cancelPowerup: () => void;
  selectCell: (pos: Pos) => void;

  // Visual movement plans (BH animations) - new
  visualEnemyPlans: EnemyMovePlan[];

  // level result
  levelResult: {status: 'win' | 'fail'; levelId: string} | null;
  setLevelResult: (r: {status: 'win' | 'fail'; levelId: string} | null) => void;

  // actions
  incrementTurn: () => void;

  getEffectiveNextItem(): CosmicType;

  setCellRect: (
    key: string,
    rect: {size: number; centerX: number; centerY: number},
  ) => void;

  destroyAnimations: {
    id: string;
    x: number;
    y: number;
    icon: string;
  }[];
  addDestroyAnimation: (anim: {
    id: string;
    x: number;
    y: number;
    icon: string;
  }) => void;
  removeDestroyAnimation: (id: string) => void;

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

  addVisualEnemyPlan: (plan: EnemyMovePlan) => void;
  removeVisualEnemyPlan: (bhId: string, to?: {x: number; y: number}) => void;
  confirmEnemyMove: (
    bhId: string,
    to: {x: number; y: number},
    absorbedId?: string,
  ) => void;

  // ---- Legacy actions and original API ----
  loadLevel: (lvl: LevelConfig) => void;
  resetLevel: () => void;
  addItem: (pos: Pos) => void;
  processMergesAt: (pos: Pos) => Promise<void>;
  stepEnemyMovement: () => void;
  spawnNextItem: () => void;

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
      // === initial state ===
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
      blackHolesSpawned: 0,

      // positioning
      cellRects: {},

      // animations
      absorbedEffects: [],
      absorbAnimations: [],
      destroyAnimations: [],

      // visual BH plans
      visualEnemyPlans: [],

      // powerups
      activePowerup: null,
      selectedCell: null,

      // level result
      levelResult: null,
      setLevelResult: r => {
        set(() => ({levelResult: r}));
        try {
          if (r && r.status === 'win') {
            // unlock progression
            // Note: import usePlayerStore lazily to avoid circular import at module top-level
            import('@/state/player-store')
              .then(mod => {
                const player = mod.usePlayerStore.getState();
                // unlock next level (assumes levelId is numeric-ish)
                const lvlNum =
                  parseInt(r.levelId.replace(/\D/g, ''), 10) || null;
                if (lvlNum) {
                  player.unlockLevel((lvlNum + 1).toString());
                  player.applyLevelUnlocks(lvlNum + 1);
                }
              })
              .catch(() => {});
          }
        } catch (e) {
          console.warn('apply level unlocks failed', e);
        }
      },

      // === move action + selectCell handling for powerups ===
      moveItem: (from, to) => {
        const itemsSnapshot = get().items.slice();
        // find origin item
        const idx = itemsSnapshot.findIndex(
          it => it.pos.x === from.x && it.pos.y === from.y,
        );
        if (idx === -1) return; // nothing to move

        // ensure destination empty
        const occupied = itemsSnapshot.some(
          it => it.pos.x === to.x && it.pos.y === to.y,
        );
        if (occupied) return; // cannot move to occupied cell

        // perform move immutably
        const moving = {...itemsSnapshot[idx], pos: {x: to.x, y: to.y}};
        const newItems = itemsSnapshot
          .filter((_, i) => i !== idx)
          .concat(moving);
        set(() => ({
          items: newItems,
        }));
      },

      selectCell: pos => {
        const state = get();
        const ap = state.activePowerup;
        const sel = state.selectedCell;

        // If no powerup active, behave as a normal select (store the selected cell)
        if (!ap) {
          set(() => ({selectedCell: pos}));
          return;
        }

        // Powerup: MOVE -> two-step: source then destination
        if (ap === 'move') {
          // If no source selected yet -> set this pos as source
          if (!sel) {
            set(() => ({selectedCell: pos}));
            return;
          }

          // We have a source already -> attempt to move
          const from = sel;
          const to = pos;

          const itemsSnapshot = get().items.slice();

          const originIndex = itemsSnapshot.findIndex(
            i => i.pos.x === from.x && i.pos.y === from.y,
          );
          if (originIndex === -1) {
            // origin disappeared: reset powerup
            set(() => ({activePowerup: null, selectedCell: null}));
            return;
          }

          const destOccupied = itemsSnapshot.some(
            i => i.pos.x === to.x && i.pos.y === to.y,
          );
          if (destOccupied) {
            // if destination occupied, treat click as re-selecting source (allows user to change source)
            set(() => ({selectedCell: pos}));
            return;
          }

          // Commit move and exit powerup mode
          set(state => {
            const itemsCopy = state.items.map(it => ({...it}));
            const movingIdx = itemsCopy.findIndex(
              i => i.pos.x === from.x && i.pos.y === from.y,
            );
            if (movingIdx === -1) {
              return {activePowerup: null, selectedCell: null};
            }
            itemsCopy[movingIdx] = {
              ...itemsCopy[movingIdx],
              pos: {x: to.x, y: to.y},
            };

            return {
              items: itemsCopy,
              activePowerup: null,
              selectedCell: null,
            };
          });

          // Después de aplicar el movimiento:
          setTimeout(() => {
            get().processMergesAt(to);
          }, 0);

          import('@/state/player-store').then(mod => {
            const player = mod.usePlayerStore.getState();
            try {
              player.checkAchievements({type: 'powerup', subject: 'move'});
            } catch (e) {}
          });

          return;
        }

        // === Powerup: DESTROY ===
        if (ap === 'destroy') {
          const itemsSnapshot = get().items.slice();
          const idx = itemsSnapshot.findIndex(
            i => i.pos.x === pos.x && i.pos.y === pos.y,
          );

          if (idx === -1) {
            set(() => ({activePowerup: null, selectedCell: null}));
            return;
          }

          const item = itemsSnapshot[idx];
          const newItems = itemsSnapshot.filter((_, i) => i !== idx);

          const animId = `destroy_${Date.now()}`;
          const key = `${pos.x},${pos.y}`;
          const rect = get().cellRects[key];

          if (rect) {
            get().addDestroyAnimation({
              id: animId,
              x: rect.centerX,
              y: rect.centerY,
              icon: item.type,
            });

            setTimeout(() => {
              get().removeDestroyAnimation(animId);
            }, 300);
          }

          set(() => ({
            items: newItems,
            activePowerup: null,
            selectedCell: null,
          }));

          import('@/state/player-store').then(mod => {
            const player = mod.usePlayerStore.getState();
            try {
              player.checkAchievements({type: 'powerup', subject: 'destroy'});
            } catch (e) {}
          });

          return;
        }

        // === SUPERNOVA powerup ===
        if (ap === 'supernova') {
          const items = get().items;

          // remove existing object if present
          let newItems = items.filter(
            i => !(i.pos.x === pos.x && i.pos.y === pos.y),
          );

          // add supernova
          newItems.push({
            id: `supernova_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            type: 'supernova',
            level: 1,
            pos: {x: pos.x, y: pos.y},
            createdAt: Date.now(),
          });

          // scoring
          const key = `${pos.x},${pos.y}`;
          const rect = get().cellRects[key];
          if (rect) {
            get().addFloatingScore(rect.centerX, rect.centerY, 150);
          }

          set({
            items: newItems,
            activePowerup: null,
            selectedCell: null,
          });

          setTimeout(() => {
            get().processMergesAt(pos);
          }, 0);

          import('@/state/player-store').then(mod => {
            const player = mod.usePlayerStore.getState();
            try {
              player.checkAchievements({type: 'powerup', subject: 'supernova'});
            } catch (e) {}
          });

          return;
        }

        // === Powerup: FREEZE BLACK HOLE ===
        if (ap === 'freeze_bh') {
          const itemsSnapshot = get().items.slice();

          // buscar si hay un black_hole en la celda seleccionada
          const idx = itemsSnapshot.findIndex(
            i =>
              i.pos.x === pos.x && i.pos.y === pos.y && i.type === 'black_hole',
          );

          // si no clicó un BH -> cancelar powerup sin hacer nada
          if (idx === -1) {
            set(() => ({activePowerup: null, selectedCell: null}));
            return;
          }

          const bh = {...itemsSnapshot[idx]};
          bh.freezeTurns = 3; // congelar 3 turnos

          const newItems = itemsSnapshot.map((it, i) => (i === idx ? bh : it));

          set(() => ({
            items: newItems,
            activePowerup: null,
            selectedCell: null,
          }));

          import('@/state/player-store').then(mod => {
            const player = mod.usePlayerStore.getState();
            try {
              player.checkAchievements({type: 'powerup', subject: 'freeze_bh'});
            } catch (e) {}
          });

          return;
        }

        // Other powerups: simply set selectedCell (their logic handled later)
        set(() => ({selectedCell: pos}));
      },

      addAbsorbedEffect: effect =>
        set(state => ({absorbedEffects: [...state.absorbedEffects, effect]})),

      removeAbsorbedEffect: (id: string) =>
        set(state => ({
          absorbedEffects: state.absorbedEffects.filter(e => e.id !== id),
        })),

      addDestroyAnimation: anim =>
        set(state => ({
          destroyAnimations: [...state.destroyAnimations, anim],
        })),

      removeDestroyAnimation: id =>
        set(state => ({
          destroyAnimations: state.destroyAnimations.filter(a => a.id !== id),
        })),

      // === Compose modules ===
      ...createPowerups(set, get),

      // === incrementTurn: now generates visual plans and triggers UI animation ===
      incrementTurn: () => {
        const prev = get().turnCounter ?? 0;
        const next = prev + 1;
        set({turnCounter: next});

        // Reducir freezeTurns en BH congelados
        const itemsAfterFreeze = get().items.map(it => {
          if (
            it.type === 'black_hole' &&
            it.freezeTurns &&
            it.freezeTurns > 0
          ) {
            return {
              ...it,
              freezeTurns: it.freezeTurns - 1,
            };
          }
          return it;
        });

        set({items: itemsAfterFreeze});

        // 1) spawn dynamic BH if level allows
        const level = get().currentLevel;
        if (level) {
          const maxBH = level.maxBlackHoles ?? 0;

          const inItems = get().items.filter(
            i => i.type === 'black_hole',
          ).length;
          const inVisual = new Set(get().visualEnemyPlans.map(p => p.bhId))
            .size;

          const frozenBH = get().items.filter(
            i => i.type === 'black_hole' && i.freezeTurns && i.freezeTurns > 0,
          ).length;

          // total reales incluidos congelados
          const totalBH = inItems + inVisual + frozenBH;
          const bhSpawned = get().blackHolesSpawned;

          if (bhSpawned < inItems) {
            set({blackHolesSpawned: inItems});
          }
          if (totalBH < maxBH && bhSpawned < maxBH) {
            const spawned = maybeSpawnBlackHole(
              get().items,
              get().boardSize.cols,
              get().boardSize.rows,
              level,
              next,
              totalBH,
            );

            if (spawned !== get().items) {
              set({items: spawned});
            }
          }
        }

        // 2) compute movement plans (do NOT mutate items)
        const plans = computeEnemyMovePlans(
          get().items,
          get().boardSize.cols,
          get().boardSize.rows,
          get().currentLevel?.blockedCells,
        );

        if (plans.length === 0) {
          // nothing to animate — keep legacy fallback: optionally move directly (no animation)
          return;
        }

        // 3) for each plan: create visual plan and create absorbedEffects if any
        for (const p of plans) {
          // add visual plan -> UI will pick it up and animate
          get().addVisualEnemyPlan(p);

          // if target absorbed an item -> create the absorb visual (UI uses cellRects to animate)
          if (p.absorbedId) {
            get().addAbsorbedEffect({
              id: `abs_${p.absorbedId}_${Date.now()}`,
              absorbedType: p.absorbedType!,
              from: p.from,
              to: p.to,
            });
          }
        }

        // Items remain unchanged here. The UI will call confirmEnemyMove() once the animation ends.
      },

      getEffectiveNextItem: () => {
        const state = get();
        if (state.activePowerup === 'supernova') return 'supernova';
        return state.nextItem;
      },

      // Legacy direct step (keeps previous behavior if someone calls it)
      stepEnemyMovement: () => {
        const plans = computeEnemyMovePlans(
          get().items,
          get().boardSize.cols,
          get().boardSize.rows,
          get().currentLevel?.blockedCells,
        );

        if (!plans || plans.length === 0) {
          return;
        }

        // operate on a snapshot to apply all plans deterministically
        let newItems = get().items.slice();
        const floatingToAdd: {
          id: string;
          x: number;
          y: number;
          points: number;
        }[] = [];
        let scoreDelta = 0;

        for (const p of plans) {
          const bhIndex = newItems.findIndex(it => it.id === p.bhId);

          // if BH not found, skip
          if (bhIndex === -1) continue;

          const bh = {...newItems[bhIndex]};
          bh.pos = {x: p.to.x, y: p.to.y};
          bh.absorbed =
            (typeof bh.absorbed === 'number' ? bh.absorbed : 0) +
            (p.absorbedId ? 1 : 0);

          // remove the absorbed item (if any) and remove the original BH entry; we'll re-add updated BH or supernova
          newItems = newItems.filter(
            it => it.id !== p.absorbedId && it.id !== bh.id,
          );

          // If BH reached threshold -> transform to supernova
          if ((bh.absorbed ?? 0) >= 3) {
            const supernovaItem: ItemBase = {
              id: `supernova_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              type: 'supernova',
              level: 1,
              pos: {x: p.to.x, y: p.to.y},
              createdAt: Date.now(),
            };

            // add floating score if rect exists
            const key = `${p.to.x},${p.to.y}`;
            const rect = get().cellRects?.[key];
            if (rect) {
              floatingToAdd.push({
                id: `fs_supernova_${Date.now()}`,
                x: rect.centerX,
                y: rect.centerY,
                points: 150,
              });
              scoreDelta += 150;
            }

            newItems.push(supernovaItem);
          } else {
            // re-add updated BH
            newItems.push(bh);
          }
        }

        // commit items and any floating scores / score changes
        set(state => ({
          items: newItems,
          floatingScores: [...(state.floatingScores ?? []), ...floatingToAdd],
          score: (state.score ?? 0) + scoreDelta,
        }));
      },

      // Positioning helpers
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

      // Visual plan helpers
      addVisualEnemyPlan: plan =>
        set(s => ({visualEnemyPlans: [...s.visualEnemyPlans, plan]})),

      removeVisualEnemyPlan: (bhId: string, to) =>
        set(s => ({
          visualEnemyPlans: s.visualEnemyPlans.filter(
            p =>
              !(
                p.bhId === bhId &&
                (!to || (p.to.x === to.x && p.to.y === to.y))
              ),
          ),
        })),

      /**
       * confirmEnemyMove
       * Called by UI when the animated BH finished its animation.
       * Commits the move to the store: updates BH pos, increments absorbed,
       * removes absorbed item, and transforms to supernova if absorbed >= 3.
       */
      confirmEnemyMove: (
        bhId: string,
        to: {x: number; y: number},
        absorbedId?: string,
      ) => {
        // operate on a snapshot to avoid mid-update inconsistencies
        const itemsSnapshot = get().items.slice();

        const bhIndex = itemsSnapshot.findIndex(it => it.id === bhId);

        // If BH not found, just remove any visual plan and return
        if (bhIndex === -1) {
          set(state => ({
            visualEnemyPlans: state.visualEnemyPlans.filter(
              p => p.bhId !== bhId,
            ),
          }));
          return;
        }

        const bh = {...itemsSnapshot[bhIndex]};
        bh.pos = {x: to.x, y: to.y};
        bh.absorbed =
          (typeof bh.absorbed === 'number' ? bh.absorbed : 0) +
          (absorbedId ? 1 : 0);

        // remove the absorbed item if present
        let newItems = itemsSnapshot.filter(it => it.id !== absorbedId);

        // replace BH entry
        const existingIdx = newItems.findIndex(it => it.id === bhId);
        if (existingIdx !== -1) {
          newItems[existingIdx] = bh;
        } else {
          newItems.push(bh);
        }

        // commit items
        set({items: newItems});

        // If BH reached threshold -> transform to supernova
        if ((bh.absorbed ?? 0) >= 3) {
          set(state => {
            const filtered = state.items.filter(i => i.id !== bhId);
            const supernovaItem: ItemBase = {
              id: `supernova_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              type: 'supernova',
              level: 1,
              pos: {x: to.x, y: to.y},
              createdAt: Date.now(),
            };

            // add floating score if rect exists
            const key = `${to.x},${to.y}`;
            const rect = state.cellRects?.[key];
            const floating = rect
              ? [
                  ...(state.floatingScores ?? []),
                  {
                    id: `fs_supernova_${Date.now()}`,
                    x: rect.centerX,
                    y: rect.centerY,
                    points: 150,
                  },
                ]
              : (state.floatingScores ?? []);

            return {
              items: [...filtered, supernovaItem],
              floatingScores: floating,
              score: (state.score ?? 0) + 150,
            };
          });
        }

        // cleanup visual plan for this BH
        set(state => ({
          visualEnemyPlans: state.visualEnemyPlans.filter(p => p.bhId !== bhId),
        }));
      },

      // === Load/reset ===
      loadLevel: lvl => {
        const player = usePlayerStore.getState();
        if (!player.isLevelUnlocked(lvl.id)) {
          console.warn(`Level ${lvl} is locked for current player`);
          return; // o lanzar error manejable
        }
        const size = getResponsiveBoardSize(lvl);

        const initial = lvl.initialMap.map((s, idx) => ({
          id: `init_${idx}_${Date.now()}`,
          type: s.type as CosmicType,
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
