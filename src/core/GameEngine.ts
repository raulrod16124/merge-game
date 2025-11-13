// src/core/GameEngine.ts
import {nanoid} from 'nanoid';
import type {GameState, MergeItem, Position} from '@/core/types';
import {mergeRules} from '@/core/mergeRules';

export type MergeEvent = {
  fromIds: string[]; // ids eliminados
  toItem: MergeItem; // item creado
  points: number; // puntos otorgados
};

type Subscriber = (state: GameState) => void;

export class GameEngine {
  private state: GameState;
  private subscribers: Subscriber[] = [];

  private lastMergeEvent: MergeEvent | null = null;

  constructor(cols = 6, rows = 6) {
    this.state = {
      items: [],
      boardSize: {cols, rows},
    };
  }

  // ============================
  // SUBSCRIBE / NOTIFY
  // ============================
  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    fn(this.getState());
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify() {
    const snapshot: GameState = {
      items: this.state.items.map(i => ({...i})),
      boardSize: {...this.state.boardSize},
    };
    this.subscribers.forEach(fn => fn(snapshot));
  }

  getState(): GameState {
    return {
      items: this.state.items.map(i => ({...i})),
      boardSize: {...this.state.boardSize},
    };
  }

  getLastMergeEvent() {
    return this.lastMergeEvent;
  }

  // ============================
  // UTILIDADES BÁSICAS
  // ============================
  private isInsideBoard(pos: Position) {
    const {cols, rows} = this.state.boardSize;
    return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
  }

  private getItemAt(pos: Position) {
    return this.state.items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  private isCellOccupied(pos: Position) {
    return this.state.items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  // ============================
  // ADD ITEM + CASCADE MERGE
  // ============================
  addItem(type: string, pos: Position): boolean {
    if (!this.isInsideBoard(pos)) return false;
    if (this.isCellOccupied(pos)) return false;

    this.lastMergeEvent = null;

    const newItem: MergeItem = {
      id: nanoid(),
      type,
      level: 1,
      pos: {...pos},
    };
    this.state.items.push(newItem);

    this.tryMergeCascadeAt(pos);

    this.notify();
    return true;
  }

  private tryMergeCascadeAt(pos: Position) {
    while (this.trySingleMergeAt(pos)) {
      // continua mientras haya merges encadenados
    }
  }

  private trySingleMergeAt(pos: Position): boolean {
    const target = this.getItemAt(pos);
    if (!target) {
      this.lastMergeEvent = null;
      return false;
    }

    const rule = mergeRules.find(r => r.fromType === target.type);
    if (!rule) {
      this.lastMergeEvent = null;
      return false;
    }

    const group = this.findConnectedItems(target);
    if (group.length < rule.minCount) {
      this.lastMergeEvent = null;
      return false;
    }

    // Eliminar items del grupo
    this.state.items = this.state.items.filter(
      i => !group.some(g => g.id === i.id),
    );

    // Crear nuevo item
    const newItem: MergeItem = {
      id: nanoid(),
      type: rule.toType,
      level: target.level + 1,
      pos: {...pos},
    };
    this.state.items.push(newItem);

    // Evento de merge para la UI
    this.lastMergeEvent = {
      fromIds: group.map(g => g.id),
      toItem: newItem,
      points: newItem.level * 10,
    };

    return true;
  }

  private findConnectedItems(start: MergeItem): MergeItem[] {
    const visited = new Set<string>();
    const stack: MergeItem[] = [start];
    const result: MergeItem[] = [];

    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (visited.has(curr.id)) continue;

      visited.add(curr.id);
      result.push(curr);

      const neighbors = this.state.items.filter(
        i =>
          !visited.has(i.id) &&
          i.type === start.type &&
          Math.abs(i.pos.x - curr.pos.x) + Math.abs(i.pos.y - curr.pos.y) === 1,
      );

      stack.push(...neighbors);
    }

    return result;
  }

  resetBoard() {
    this.state.items = [];
    this.lastMergeEvent = null;
    this.notify();
  }
}
