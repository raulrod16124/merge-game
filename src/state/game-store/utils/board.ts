// src/state/gameStore/utils/board.ts
import type {Pos, ItemBase} from '../../../core/types';

export const isInside = (pos: Pos, cols: number, rows: number): boolean =>
  pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;

export const manhattan = (a: Pos, b: Pos): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const findItemsAt = (items: ItemBase[], pos: Pos) =>
  items.filter(it => it.pos.x === pos.x && it.pos.y === pos.y);

export const isCellFree = (items: ItemBase[], pos: Pos) =>
  !items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
