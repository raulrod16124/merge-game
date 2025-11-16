// src/state/gameStore.ts
import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import type {
  LevelConfig,
  ItemBase,
  HoleEnemy,
  Pos,
  GameState,
  CosmicType,
} from '@/core/types';
import {getNextType, SUPERNOVA_SCORE} from '@/core/fusionRules';
import {fuseItems} from '@/core/fusionHelpers';

type FloatingScore = {id: string; x: number; y: number; points: number};

type Store = {
  items: ItemBase[];
  score: number;
  moves: number;
  nextItem: CosmicType;
  boardSize: {cols: number; rows: number};
  currentLevel?: LevelConfig | null;
  timeLeft: number;
  holes: HoleEnemy[];
  powerupUsed: boolean;
  floatingScores: FloatingScore[];
  createdCounts: Record<string, number>;

  // internals
  _timerId?: number | null;

  // Acciones
  loadLevel: (lvl: LevelConfig) => void;
  resetLevel: () => void;
  spawnNextItem: () => void;
  addItem: (pos: Pos) => void;
  removeItemById: (id: string) => void;
  processMergesAt: (pos: Pos) => void;
  checkWinLose: () => null | {status: 'win' | 'fail'; levelId: string};
  startTimer: () => void;
  stopTimer: () => void;
  activatePowerup: () => void;
  stepEnemyMovement: () => void;
  addFloatingScore: (x: number, y: number, points: number) => void;
  removeFloatingScore: (id: string) => void;
  getStateSnapshot: () => GameState;
};

function sampleWeighted<T extends string | number | symbol>(
  map: Record<T, number>,
): T {
  const entries = Object.entries(map) as [T, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const [key, w] of entries) {
    acc += w;
    if (r <= acc) return key;
  }
  // fallback
  return entries[entries.length - 1][0];
}

export const useGameStore = create<Store>()(
  devtools((set, get) => ({
    // Estado inicial
    items: [],
    score: 0,
    moves: 0,
    nextItem: 'dust',
    boardSize: {cols: 6, rows: 6},
    currentLevel: null,
    timeLeft: 0,
    holes: [],
    powerupUsed: false,
    floatingScores: [],
    createdCounts: {},
    _timerId: null,

    // CARGA DE NIVEL
    loadLevel: (lvl: LevelConfig) => {
      // Initialize items from lvl.initialMap if any
      const items: ItemBase[] = (lvl.initialMap ?? []).map((s, idx) => ({
        id: `init_${idx}_${Date.now()}`,
        type: s.type,
        level: Math.max(
          1,
          ((): number => {
            // map type to level index from FUSION_CHAIN? quick heuristic:
            switch (s.type) {
              case 'dust':
                return 1;
              case 'micro_asteroid':
                return 2;
              case 'meteorite':
                return 3;
              case 'baby_planet':
                return 4;
              case 'mature_planet':
                return 5;
              case 'star':
                return 6;
              case 'star_system':
                return 7;
              case 'nebula':
                return 8;
              case 'galaxy':
                return 9;
              default:
                return 1;
            }
          })(),
        ),
        pos: {x: s.x, y: s.y},
        createdAt: Date.now(),
      }));

      const spawnWeights = lvl.spawnWeights ?? {dust: 100};

      // sample first nextItem based on spawnWeights (safety)
      const initialNext = sampleWeighted(spawnWeights as any) as CosmicType;

      set({
        currentLevel: lvl,
        items,
        boardSize: {cols: lvl.boardSize.cols, rows: lvl.boardSize.rows},
        score: 0,
        moves: 0,
        nextItem: initialNext,
        timeLeft: lvl.timerSeconds ?? 120,
        holes: [],
        powerupUsed: false,
        floatingScores: [],
        createdCounts: {},
      });

      // stop any existing timer and start a new one
      get().stopTimer();
      get().startTimer();
    },

    resetLevel: () => {
      const lvl = get().currentLevel;
      if (!lvl) return;
      // reload the same level configuration
      get().loadLevel(lvl);
    },

    // Spawn next item type (sample by level spawnWeights)
    spawnNextItem: () => {
      const lvl = get().currentLevel;
      if (!lvl || !lvl.spawnWeights) {
        set({nextItem: 'dust'});
        return;
      }
      const next = sampleWeighted(lvl.spawnWeights as any) as CosmicType;
      set({nextItem: next});
    },

    // Añadir item en board (la función usada por UI)
    addItem: (pos: Pos) => {
      const state = get();
      const {items, nextItem, boardSize} = state;

      // check bounds
      if (
        pos.x < 0 ||
        pos.x >= boardSize.cols ||
        pos.y < 0 ||
        pos.y >= boardSize.rows
      )
        return;

      // check if cell occupied
      const occupied = items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
      if (occupied) {
        // can't place on occupied cell
        return;
      }

      // create new item
      const id = 'it_' + crypto.randomUUID();
      const newItem: ItemBase = {
        id,
        type: nextItem,
        level: 1,
        pos: {...pos},
        createdAt: Date.now(),
      };

      set(state => ({
        items: [...state.items, newItem],
        moves: state.moves + 1,
      }));

      // award immediate visual floating score for placement? optional
      // now handle merges
      get().processMergesAt(pos);

      // sample next item
      get().spawnNextItem();

      // after player's action, enemies move
      get().stepEnemyMovement();
    },

    removeItemById: (id: string) => {
      set(state => ({items: state.items.filter(i => i.id !== id)}));
    },

    /** Basic merge algorithm:
     *  - if there are 3 or more items of the same type anywhere on the board,
     *    pick the 3 closest to the `pos` and fuse them into the next type placed at `pos`.
     *  - award score according to fusionRules.
     */
    processMergesAt: (pos: Pos) => {
      const state = get();
      const {items} = state;
      // compute counts per type
      const byType: Record<string, ItemBase[]> = {};
      for (const it of items) {
        (byType[it.type] ??= []).push(it);
      }

      // iterate types that have >=3
      for (const [type, arr] of Object.entries(byType)) {
        if (arr.length >= 3) {
          // choose 3 closest to pos
          const sorted = arr.slice().sort((a, b) => {
            const da = Math.abs(a.pos.x - pos.x) + Math.abs(a.pos.y - pos.y);
            const db = Math.abs(b.pos.x - pos.x) + Math.abs(b.pos.y - pos.y);
            return da - db;
          });

          const three = sorted.slice(0, 3);

          // use fuseItems helper
          const result = fuseItems(three as ItemBase[]);
          if (!result) continue;

          // remove the three items
          set(state => ({
            items: state.items.filter(i => !three.find(t => t.id === i.id)),
          }));

          // create fused item at "pos" (place at the pos param)
          const fusedItem: ItemBase = {
            id: 'f_' + crypto.randomUUID(),
            type: result.item.type,
            level: result.item.level ?? 1,
            pos: {...pos},
            createdAt: Date.now(),
          };

          set(state => ({
            items: [...state.items, fusedItem],
            score: state.score + (result.score ?? 0),
            // track created counts
            createdCounts: {
              ...state.createdCounts,
              [result.item.type]:
                (state.createdCounts[result.item.type] ?? 0) + 1,
            },
          }));

          // floating score visual
          get().addFloatingScore(pos.x, pos.y, result.score ?? 0);

          // optionally grant time bonus based on result type (GDD)
          const timeBonusMap: Record<string, number> = {
            star: 3,
            star_system: 5,
            nebula: 8,
          };
          const tb = timeBonusMap[result.item.type] ?? 0;
          if (tb > 0) {
            set(state => ({timeLeft: Math.max(0, (state.timeLeft ?? 0) + tb)}));
          }

          // after performing a fusion, there might be chain reactions: check again at same pos
          // recursion guarded: call processMergesAt again (but be careful to avoid infinite)
          // We'll allow chain once more by recursion.
          setTimeout(() => {
            get().processMergesAt(pos);
          }, 50);

          // break for now to allow store to update (we process one fusion per call loop)
          break;
        }
      }
    },

    // Check win/lose conditions
    checkWinLose: () => {
      const s = get();
      const lvl = s.currentLevel;
      if (!lvl) return null;

      // Fail: time ran out
      if ((s.timeLeft ?? 0) <= 0) {
        return {status: 'fail', levelId: lvl.id};
      }

      // Win if objectives satisfied:
      // We'll check simple objective types: 'score', 'create'
      const objectives = lvl.objectives ?? [];
      let allOk = true;
      for (const obj of objectives) {
        if (obj.type === 'score') {
          if (s.score < obj.target) allOk = false;
        } else if (obj.type === 'create' && obj.subject) {
          const created = s.createdCounts[obj.subject] ?? 0;
          if (created < obj.target) allOk = false;
        } else if (obj.type === 'survive') {
          // survive not implemented fully here; skip
          allOk = allOk && true;
        } else {
          // default: require nothing
        }
      }
      if (objectives.length > 0 && allOk) {
        return {status: 'win', levelId: lvl.id};
      }

      return null;
    },

    // Timer control
    startTimer: () => {
      const cur = get();
      if (cur._timerId) return;

      const id = window.setInterval(() => {
        set(state => {
          const left = (state.timeLeft ?? 0) - 1;
          return {timeLeft: left};
        });

        // check lose condition
        const r = get().checkWinLose();
        if (r && r.status === 'fail') {
          // stop timer if failed
          get().stopTimer();
        }
      }, 1000);

      set({_timerId: id});
    },

    stopTimer: () => {
      const id = get()._timerId;
      if (id) {
        window.clearInterval(id);
        set({_timerId: null});
      }
    },

    // Power-up: Doblador Espaciotemporal (permite mover cualquier pieza sin gastar turno)
    activatePowerup: () => {
      const s = get();
      if (s.powerupUsed) return;
      // set flag — UI should open a mode to let user move pieces (handled elsewhere)
      set({powerupUsed: true});
    },

    // Enemy movement: Agujero errante
    stepEnemyMovement: () => {
      const s = get();
      if (!s.holes || s.holes.length === 0) return;

      const boardSize = s.boardSize;

      const newHoles: HoleEnemy[] = s.holes.map(h => ({...h}));

      for (const hole of newHoles) {
        // choose a random direction that is free
        const dirs = [
          {x: 0, y: -1},
          {x: 0, y: 1},
          {x: -1, y: 0},
          {x: 1, y: 0},
        ].sort(() => Math.random() - 0.5);

        let moved = false;
        for (const d of dirs) {
          const nx = hole.pos.x + d.x;
          const ny = hole.pos.y + d.y;
          if (nx < 0 || nx >= boardSize.cols || ny < 0 || ny >= boardSize.rows)
            continue;
          // check if cell is free of other holes
          const occupiedByHole = newHoles.find(
            h2 => h2.id !== hole.id && h2.pos.x === nx && h2.pos.y === ny,
          );
          if (occupiedByHole) continue;

          // cell is available for movement; move the hole
          hole.pos = {x: nx, y: ny};
          moved = true;
          break;
        }

        // After moving, check for absorption
        const itemsAtCell = get().items.filter(
          it => it.pos.x === hole.pos.x && it.pos.y === hole.pos.y,
        );
        if (itemsAtCell.length > 0) {
          // absorb: convert to fragments and remove items
          for (const it of itemsAtCell) {
            hole.fragments[it.type] = (hole.fragments[it.type] ?? 0) + 1;
            // remove item
            set(state => ({items: state.items.filter(i => i.id !== it.id)}));
          }

          // check collapse: if any type has >=3 fragments
          for (const [t, cnt] of Object.entries(hole.fragments)) {
            if (cnt >= 3) {
              // create supernova
              // award base
              set(state => ({score: state.score + SUPERNOVA_SCORE.base}));
              get().addFloatingScore(
                hole.pos.x,
                hole.pos.y,
                SUPERNOVA_SCORE.base,
              );

              // upgrade all adjacent items (1 level up)
              const adj = [
                {x: -1, y: 0},
                {x: 1, y: 0},
                {x: 0, y: -1},
                {x: 0, y: 1},
                {x: -1, y: -1},
                {x: 1, y: 1},
                {x: -1, y: 1},
                {x: 1, y: -1},
              ];
              let upgradedCount = 0;
              for (const d of adj) {
                const ax = hole.pos.x + d.x;
                const ay = hole.pos.y + d.y;
                const item = get().items.find(
                  i => i.pos.x === ax && i.pos.y === ay,
                );
                if (item) {
                  const nextType = getNextType(item.type);
                  if (nextType) {
                    // upgrade
                    set(state => ({
                      items: state.items.map(it =>
                        it.id === item.id ? {...it, type: nextType} : it,
                      ),
                    }));
                    upgradedCount++;
                  }
                }
              }

              // award per upgraded object
              const bonus =
                (SUPERNOVA_SCORE.perUpgradedObject || 0) * upgradedCount;
              if (bonus > 0) {
                set(state => ({score: state.score + bonus}));
                get().addFloatingScore(hole.pos.x, hole.pos.y, bonus);
              }

              // reset fragments of that type and remove the hole (it contracts)
              hole.fragments[t] = 0;
              hole.active = false;
            }
          }
        }
      } // end for holes

      // remove inactive holes
      const aliveHoles = newHoles.filter(h => h.active !== false);
      set({holes: aliveHoles});
    },

    // Floating scores
    addFloatingScore: (x: number, y: number, points: number) => {
      const id = 'fs_' + crypto.randomUUID();
      set(state => ({
        floatingScores: [...state.floatingScores, {id, x, y, points}],
      }));
    },
    removeFloatingScore: (id: string) => {
      set(state => ({
        floatingScores: state.floatingScores.filter(f => f.id !== id),
      }));
    },

    getStateSnapshot: () => {
      const s = get();
      return {
        items: s.items,
        score: s.score,
        moves: s.moves,
        nextItem: s.nextItem,
        boardSize: s.boardSize,
        currentLevel: s.currentLevel,
        timeLeft: s.timeLeft,
        holes: s.holes,
        powerupUsed: s.powerupUsed,
        floatingScores: s.floatingScores,
      } as GameState;
    },
  })),
);
