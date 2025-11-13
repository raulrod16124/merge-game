// src/core/GameEngine.ts
import {nanoid} from 'nanoid';
import type {GameState, MergeItem, Position} from '@/core/types';
import {mergeRules} from '@/core/mergeRules';

export type MergeEvent = {
  fromIds: string[];
  toItem: MergeItem;
  points: number;
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

  resetBoard() {
    this.state.items = [];
    this.lastMergeEvent = null;
    this.notify();
  }

  getState() {
    return {
      items: this.state.items.map(i => ({...i})),
      boardSize: {...this.state.boardSize},
    };
  }

  getLastMergeEvent() {
    return this.lastMergeEvent;
  }

  private isInside(pos: Position) {
    const {cols, rows} = this.state.boardSize;
    return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
  }

  private getItemAt(pos: Position) {
    return this.state.items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  private isOccupied(pos: Position) {
    return this.state.items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  addItem(type: string, pos: Position): boolean {
    if (!this.isInside(pos)) return false;
    if (this.isOccupied(pos)) return false;

    this.lastMergeEvent = null; // limpio evento

    const newItem: MergeItem = {
      id: nanoid(),
      type,
      level: 1,
      pos: {...pos},
    };

    this.state.items.push(newItem);

    // intenta merge en cascada
    this.tryMergeCascadeAt(pos);

    // ahora notifico
    this.notify();

    return true;
  }

  private tryMergeCascadeAt(pos: Position) {
    let merged = false;

    while (this.trySingleMergeAt(pos)) {
      merged = true;
    }

    return merged;
  }

  private trySingleMergeAt(pos: Position): boolean {
    const target = this.getItemAt(pos);
    if (!target) return false;

    const rule = mergeRules.find(r => r.fromType === target.type);
    if (!rule) return false;

    const group = this.findConnectedItems(target);

    if (group.length < rule.minCount) return false;

    // Elimino items
    this.state.items = this.state.items.filter(i => !group.includes(i.id));

    // Nuevo item
    const newItem: MergeItem = {
      id: nanoid(),
      type: rule.toType,
      level: target.level + 1,
      pos: {...pos},
    };
    this.state.items.push(newItem);

    const points = newItem.level * 10;

    // 🔥 LOG DIRECTO
    console.log('🔥 MERGE DETECTED', {
      from: group,
      to: newItem,
      points,
    });

    this.lastMergeEvent = {
      fromIds: group,
      toItem: newItem,
      points,
    };

    return true;
  }

  private findConnectedItems(start: MergeItem): string[] {
    const visited = new Set<string>();
    const stack = [start];
    const group: MergeItem[] = [];

    while (stack.length) {
      const curr = stack.pop()!;
      if (visited.has(curr.id)) continue;
      visited.add(curr.id);
      group.push(curr);

      const neighbors = this.state.items.filter(
        i =>
          i.type === start.type &&
          !visited.has(i.id) &&
          Math.abs(i.pos.x - curr.pos.x) + Math.abs(i.pos.y - curr.pos.y) === 1,
      );

      stack.push(...neighbors);
    }

    return group.map(g => g.id);
  }
}
