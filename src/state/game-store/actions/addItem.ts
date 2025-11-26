// src/state/game-store/actions/addItem.ts
import type {StateCreator} from 'zustand';
import type {GameStore} from '../index';
import type {Pos, ItemBase} from '../../../core/types';

export const createAddItem =
  (set: Parameters<StateCreator<GameStore>>[0], get: () => GameStore) =>
  async (pos: Pos) => {
    const {items, boardSize, nextItem} = get();

    const inside =
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x < boardSize.cols &&
      pos.y < boardSize.rows;

    const free = !items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
    if (!inside || !free) return;

    const newItem: ItemBase = {
      id:
        'it_' +
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
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

    // 2) Procesar merges encadenados (ahora processMergesAt es async y garantiza terminar)
    if (typeof get().processMergesAt === 'function') {
      await get().processMergesAt(pos);
    }

    // 3) Terminar el turno (solo aquí, una vez por jugada)
    if (typeof get().incrementTurn === 'function') {
      get().incrementTurn();
    }
  };
