// src/core/GameEngine.ts
import {nanoid} from 'nanoid';
import type {GameState, MergeItem, Position} from '@/core/types';
import type {InitialItem} from '@/core/typesLevel';
import {mergeRules} from '@/core/mergeRules';

export type MergeEvent = {
  fromIds: string[];
  toItem: MergeItem;
  points: number;
};

type Subscriber = (state: GameState, mergeEvents: MergeEvent[] | null) => void;

export class GameEngine {
  private state: GameState;
  private subscribers: Subscriber[] = [];
  private pendingMergeEvents: MergeEvent[] = [];

  constructor(cols = 6, rows = 6) {
    this.state = {items: [], boardSize: {cols, rows}};
  }

  // ---------------------------
  // Subscribe / notify
  // ---------------------------
  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    fn(this.getState(), null);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify() {
    const snapshot: GameState = {
      items: this.state.items.map(i => ({...i})),
      boardSize: {...this.state.boardSize},
    };

    const events =
      this.pendingMergeEvents.length > 0 ? [...this.pendingMergeEvents] : null;

    this.subscribers.forEach(fn => fn(snapshot, events));

    // limpiar tras envío
    this.pendingMergeEvents = [];
  }

  getState(): GameState {
    return {
      items: this.state.items.map(i => ({...i})),
      boardSize: {...this.state.boardSize},
    };
  }

  // ---------------------------
  // Utilities
  // ---------------------------
  private isInside(pos: Position) {
    const {cols, rows} = this.state.boardSize;
    return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
  }

  private isOccupied(pos: Position) {
    return this.state.items.some(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  private getItemAt(pos: Position) {
    return this.state.items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  private getNeighbors(pos: Position) {
    const dirs = [
      {x: 0, y: -1},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: -1, y: 0},
    ];
    return dirs
      .map(d => ({x: pos.x + d.x, y: pos.y + d.y}))
      .filter(p => this.isInside(p));
  }

  private getEmptyNeighbors(pos: Position) {
    return this.getNeighbors(pos).filter(n => !this.isOccupied(n));
  }

  // ---------------------------
  // INITIAL MAP
  // ---------------------------
  placeInitialItems(initial: InitialItem[]) {
    for (const it of initial) {
      if (!this.isInside({x: it.x, y: it.y})) continue;
      if (this.isOccupied({x: it.x, y: it.y})) continue;

      const item: MergeItem = {
        id: nanoid(),
        type: it.type,
        level: 1,
        pos: {x: it.x, y: it.y},
      };

      this.state.items.push(item);
    }

    this.notify();
  }

  // ---------------------------
  // Add item
  // ---------------------------
  addItem(type: string, pos: Position): boolean {
    if (!this.isInside(pos)) return false;
    if (this.isOccupied(pos)) return false;

    const item: MergeItem = {
      id: nanoid(),
      type,
      level: 1,
      pos: {...pos},
    };

    this.state.items.push(item);

    this.tryMergeCascadeAt(pos);
    this.moveEnemies();

    this.notify();
    return true;
  }

  // ---------------------------
  // Merge MULTI-EVENT
  // ---------------------------
  private tryMergeCascadeAt(pos: Position) {
    let merged = true;
    while (merged) {
      merged = this.trySingleMergeAt(pos);
    }
  }

  private trySingleMergeAt(pos: Position): boolean {
    const target = this.getItemAt(pos);
    if (!target) return false;

    const rule = mergeRules.find(r => r.fromType === target.type);
    if (!rule) return false;

    const group = this.findConnectedItems(target);
    if (group.length < rule.minCount) return false;

    // eliminar items fusionados
    this.state.items = this.state.items.filter(i => !group.includes(i.id));

    // crear nuevo
    const newItem: MergeItem = {
      id: nanoid(),
      type: rule.toType,
      level: target.level + 1,
      pos: {...pos},
    };

    this.state.items.push(newItem);

    // registrar evento
    const points = newItem.level * 10;

    this.pendingMergeEvents.push({
      fromIds: [...group],
      toItem: newItem,
      points,
    });

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
          !visited.has(i.id) &&
          i.type === start.type &&
          Math.abs(i.pos.x - curr.pos.x) + Math.abs(i.pos.y - curr.pos.y) === 1,
      );

      stack.push(...neighbors);
    }

    return group.map(i => i.id);
  }

  // ---------------------------
  // Bears
  // ---------------------------
  private moveEnemies() {
    const bears = this.state.items.filter(i => i.type === 'bear');

    for (const bear of bears) {
      const empty = this.getEmptyNeighbors(bear.pos);

      if (empty.length === 0) {
        this.killBear(bear);
      } else {
        const target = empty[Math.floor(Math.random() * empty.length)];
        bear.pos = {...target};
      }
    }
  }

  private killBear(bear: MergeItem) {
    this.state.items = this.state.items.filter(i => i.id !== bear.id);

    const tomb: MergeItem = {
      id: nanoid(),
      type: 'tomb',
      level: 1,
      pos: {...bear.pos},
    };
    this.state.items.push(tomb);
  }

  // ---------------------------
  // Reset
  // ---------------------------
  resetBoard() {
    this.state.items = [];
    this.pendingMergeEvents = [];
    this.notify();
  }
}
