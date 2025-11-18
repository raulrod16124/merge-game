// src/state/gameStore/actions/enemies.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos} from '../../../core/types';

import {getNextType, SUPERNOVA_SCORE} from '../../../core/fusionRules';
import {emptyFragments} from '../utils/fragments';

export const createEnemies = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  stepEnemyMovement: () => {
    const {holes, items, boardSize} = get();
    if (!holes.length) return;

    const dirs: Pos[] = [
      {x: 0, y: -1},
      {x: 0, y: 1},
      {x: -1, y: 0},
      {x: 1, y: 0},
    ];

    const newHoles = holes
      .map(hole => {
        const dir = dirs
          .slice()
          .sort(() => Math.random() - 0.5)
          .find(d => {
            const nx = hole.pos.x + d.x;
            const ny = hole.pos.y + d.y;
            const inside =
              nx >= 0 && ny >= 0 && nx < boardSize.cols && ny < boardSize.rows;
            const freeOfHole = holes.every(
              h => h.id === hole.id || h.pos.x !== nx || h.pos.y !== ny,
            );
            return inside && freeOfHole;
          }) ?? {x: 0, y: 0};

        const newPos: Pos = {
          x: hole.pos.x + dir.x,
          y: hole.pos.y + dir.y,
        };

        const absorbed = items.filter(
          it => it.pos.x === newPos.x && it.pos.y === newPos.y,
        );

        // Eliminar absorbidos
        if (absorbed.length) {
          set(s => ({
            items: s.items.filter(it => !absorbed.some(a => a.id === it.id)),
          }));
        }

        // Acumulación de fragmentos
        const fragments = absorbed.reduce(
          (acc, it) => ({...acc, [it.type]: (acc[it.type] ?? 0) + 1}),
          {...hole.fragments},
        );

        // ¿Supernova?
        const collapse = Object.entries(fragments).find(([, c]) => c >= 3);
        if (collapse) {
          const pos = newPos;

          // puntos base
          set(s => ({score: s.score + SUPERNOVA_SCORE.base}));
          get().addFloatingScore(pos.x, pos.y, SUPERNOVA_SCORE.base);

          // mejorar adyacentes
          const adj: Pos[] = [
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 0, y: -1},
            {x: 0, y: 1},
            {x: -1, y: -1},
            {x: 1, y: 1},
            {x: -1, y: 1},
            {x: 1, y: -1},
          ];

          const upgraded = adj
            .map(offset => ({
              x: pos.x + offset.x,
              y: pos.y + offset.y,
            }))
            .filter(p =>
              items.some(it => it.pos.x === p.x && it.pos.y === p.y),
            );

          upgraded.forEach(p => {
            const item = get().items.find(
              it => it.pos.x === p.x && it.pos.y === p.y,
            );
            if (!item) return;

            const next = getNextType(item.type);
            next &&
              set(s => ({
                items: s.items.map(it =>
                  it.id === item.id ? {...it, type: next} : it,
                ),
              }));
          });

          upgraded.length &&
            set(s => ({
              score:
                s.score + upgraded.length * SUPERNOVA_SCORE.perUpgradedObject,
            }));

          return {...hole, active: false};
        }

        return {...hole, fragments, pos: newPos};
      })
      .filter(h => h.active);

    // after existing enemy movement logic and before set({holes: aliveHoles});
    const lvl = get().currentLevel;
    if (lvl) {
      const target = lvl.enemyCount ?? 0;
      const current = newHoles.filter(h => h.active !== false).length;
      // spawn condition: every 6 moves spawn one (until reach target)
      const moves = get().moves ?? 0;
      const shouldSpawn = current < target && moves > 0 && moves % 6 === 0;
      if (shouldSpawn) {
        // choose random free cell
        const occupied = get().items.map(i => `${i.pos.x},${i.pos.y}`);
        const holeOccupied = newHoles.map(h => `${h.pos.x},${h.pos.y}`);
        const w = get().boardSize.cols;
        const h = get().boardSize.rows;
        const freeCells: {x: number; y: number}[] = [];
        for (let x = 0; x < w; x++)
          for (let y = 0; y < h; y++) {
            const key = `${x},${y}`;
            if (!occupied.includes(key) && !holeOccupied.includes(key))
              freeCells.push({x, y});
          }
        if (freeCells.length) {
          const c = freeCells[Math.floor(Math.random() * freeCells.length)];
          newHoles.push({
            id: 'h_' + crypto.randomUUID(),
            pos: c,
            fragments: emptyFragments(),
            active: true,
          });
        }
      }
    }

    set({holes: newHoles});
  },
});
