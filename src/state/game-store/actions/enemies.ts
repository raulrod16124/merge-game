// src/state/gameStore/actions/enemies.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos} from '../../../core/types';

import {getNextType, SUPERNOVA_SCORE} from '../../../core/fusionRules';
import {emptyFragments} from '../utils/fragments';
import {getItemIcon} from '../../../utils/getItemIcon';

export const createEnemies = (
  set: Parameters<StateCreator<GameStore>>[0],
  get: () => GameStore,
) => ({
  stepEnemyMovement: () => {
    const {holes, items, boardSize} = get();

    if (!boardSize) return;

    const newHoles = (holes ?? []).map(h => ({...h}));
    let updatedItems = items ? [...items] : [];

    const DIRS: Pos[] = [
      {x: -1, y: 0},
      {x: 1, y: 0},
      {x: 0, y: -1},
      {x: 0, y: 1},
    ];

    for (let idx = 0; idx < newHoles.length; idx++) {
      const hole = newHoles[idx];
      if (!hole.active) continue;

      const shuffled = DIRS.slice().sort(() => Math.random() - 0.5);

      for (const d of shuffled) {
        const nx = hole.pos.x + d.x;
        const ny = hole.pos.y + d.y;

        if (nx < 0 || ny < 0 || nx >= boardSize.cols || ny >= boardSize.rows)
          continue;

        // evitar colision con otros agujeros
        const coll = newHoles.find(
          (h2, j) =>
            j !== idx && h2.active && h2.pos.x === nx && h2.pos.y === ny,
        );
        if (coll) continue;

        // mover agujero
        hole.pos = {x: nx, y: ny};

        // detectar item en esta celda
        const itemIndex = updatedItems.findIndex(
          it => it.pos.x === nx && it.pos.y === ny,
        );

        if (itemIndex >= 0) {
          const it = updatedItems[itemIndex];

          // ------------ ABSORCIÓN VISUAL ------------
          const cellFrom = get().cellRects?.[`${it.pos.x},${it.pos.y}`];
          const cellTo = get().cellRects?.[`${nx},${ny}`];

          if (cellFrom && cellTo) {
            get().addAbsorbAnimation({
              id: 'abs_' + (crypto.randomUUID?.() ?? Date.now().toString()),
              from: {x: cellFrom.centerX, y: cellFrom.centerY},
              to: {x: cellTo.centerX, y: cellTo.centerY},
              size: cellFrom.size * 0.85,
              icon: getItemIcon(it.type),
            });
          }

          // marcar item para borrado (después de animación)
          updatedItems = updatedItems.filter(i => i.id !== it.id);

          // ------------ AÑADIR FRAGMENTO ------------
          hole.fragments = {...(hole.fragments ?? {})};
          hole.fragments[it.type] = (hole.fragments[it.type] ?? 0) + 1;

          // ------------ COLAPSO A SUPERNOVA ------------
          const collapseEntry = Object.entries(hole.fragments).find(
            ([, count]) => (count as number) >= 3,
          );

          if (collapseEntry) {
            // desactivar agujero
            hole.active = false;

            const posX = cellTo?.centerX ?? 0;
            const posY = cellTo?.centerY ?? 0;

            // Añadir animación Supernova
            get().addSupernova({
              id: 'sv_' + (crypto.randomUUID?.() ?? Date.now().toString()),
              x: posX,
              y: posY,
            });

            // Mejorar piezas adyacentes
            updatedItems = updatedItems.map(itm => {
              if (
                (Math.abs(itm.pos.x - nx) === 1 && itm.pos.y === ny) ||
                (Math.abs(itm.pos.y - ny) === 1 && itm.pos.x === nx)
              ) {
                const nxt = getNextType(itm.type);
                if (nxt) {
                  return {...itm, type: nxt};
                }
              }
              return itm;
            });

            set(s => ({
              score: s.score + SUPERNOVA_SCORE.base,
            }));
          }
        }

        break; // movimiento realizado
      }

      newHoles[idx] = hole;
    }

    // --------- SPAWN DE NUEVOS AGUJEROS (si el nivel lo permite) ---------
    const lvl = get().currentLevel;
    const moves = get().moves ?? 0;

    if (lvl) {
      const target = lvl.enemyCount ?? 0;
      const activeCount = newHoles.filter(h => h.active).length;

      const shouldSpawn = activeCount < target && moves > 0 && moves % 6 === 0;

      if (shouldSpawn) {
        const occupied = new Set(
          updatedItems.map(i => `${i.pos.x},${i.pos.y}`),
        );
        newHoles.forEach(h => occupied.add(`${h.pos.x},${h.pos.y}`));

        const free: Pos[] = [];
        for (let x = 0; x < boardSize.cols; x++) {
          for (let y = 0; y < boardSize.rows; y++) {
            if (!occupied.has(`${x},${y}`)) free.push({x, y});
          }
        }

        if (free.length) {
          const cell = free[Math.floor(Math.random() * free.length)];
          newHoles.push({
            id: 'h_' + (crypto.randomUUID?.() ?? Date.now().toString()),
            pos: cell,
            fragments: emptyFragments(),
            active: true,
          });
        }
      }
    }

    // ---------- COMMIT ----------
    set({
      items: updatedItems,
      holes: newHoles,
    });
  },
});
