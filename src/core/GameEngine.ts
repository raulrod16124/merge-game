// src/core/GameEngine.ts
import {nanoid} from 'nanoid';
import type {GameState, MergeItem, Position} from './types';
import {mergeRules} from './mergeRules';

type Subscriber = (state: GameState) => void;

export class GameEngine {
  private state: GameState;
  private subscribers: Subscriber[] = [];

  constructor(cols = 6, rows = 6) {
    this.state = {
      items: [],
      boardSize: {cols, rows},
    };
  }

  // -----------------------------
  // Subscripción a cambios
  // -----------------------------
  subscribe(fn: Subscriber) {
    this.subscribers.push(fn);
    fn(this.state);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== fn);
    };
  }

  private notify() {
    this.subscribers.forEach(fn => fn(this.state));
  }

  // -----------------------------
  // Gestión de estado
  // -----------------------------
  getState() {
    return this.state;
  }

  addItem(type: string, pos: Position) {
    if (this.isCellOccupied(pos)) return false;
    this.state.items.push({id: nanoid(), type, level: 1, pos});
    this.notify();
    return true;
  }

  moveItem(id: string, newPos: Position) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return false;
    if (!this.isInsideBoard(newPos)) return false;
    if (this.isCellOccupied(newPos, id)) return false;

    item.pos = newPos;
    this.notify();
    return true;
  }

  private isInsideBoard(pos: Position) {
    const {cols, rows} = this.state.boardSize;
    return pos.x >= 0 && pos.y >= 0 && pos.x < cols && pos.y < rows;
  }

  private isCellOccupied(pos: Position, excludeId?: string) {
    return this.state.items.some(
      i => i.pos.x === pos.x && i.pos.y === pos.y && i.id !== excludeId,
    );
  }

  // -----------------------------
  // Fusión de items
  // -----------------------------
  tryMergeAt(pos: Position) {
    const target = this.getItemAt(pos);
    if (!target) return false;

    const rule = mergeRules.find(r => r.fromType === target.type);
    if (!rule) return false;

    // Encuentra adyacentes iguales
    const group = this.findConnectedItems(target);
    if (group.length < rule.minCount) return false;

    // Elimina todos los items del grupo
    this.state.items = this.state.items.filter(i => !group.includes(i.id));

    // Añade nuevo item en la posición objetivo
    this.state.items.push({
      id: nanoid(),
      type: rule.toType,
      level: target.level + 1,
      pos,
    });

    this.notify();
    return true;
  }

  private getItemAt(pos: Position) {
    return this.state.items.find(i => i.pos.x === pos.x && i.pos.y === pos.y);
  }

  private findConnectedItems(target: MergeItem): string[] {
    const visited = new Set<string>();
    const stack = [target];
    const group: MergeItem[] = [];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current.id)) continue;
      visited.add(current.id);
      group.push(current);

      // vecinos ortogonales
      const neighbors = this.state.items.filter(
        i =>
          i.id !== current.id &&
          i.type === target.type &&
          Math.abs(i.pos.x - current.pos.x) +
            Math.abs(i.pos.y - current.pos.y) ===
            1,
      );
      stack.push(...neighbors);
    }

    return group.map(i => i.id);
  }
}
