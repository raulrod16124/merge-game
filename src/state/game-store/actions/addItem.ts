// src/state/gameStore/actions/addItem.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, ItemBase} from '@/core/types';

export const createAddItem =
  (set: Parameters<StateCreator<GameStore>>[0], get: () => GameStore) =>
  (pos: Pos) => {
    const {items, boardSize, nextItem} = get();

    const inside =
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x < boardSize.cols &&
      pos.y < boardSize.rows;

    const free = !items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
    if (!inside || !free) return;

    const newItem: ItemBase = {
      id: 'it_' + crypto.randomUUID(),
      type: nextItem,
      level: 1,
      pos,
      createdAt: Date.now(),
    };

    // 1) Añadir item de forma atómica
    set(state => ({
      items: [...state.items, newItem],
      moves: state.moves + 1,
    }));

    get().processMergesAt(pos);
    get().spawnNextItem();
    get().stepEnemyMovement();
  };
