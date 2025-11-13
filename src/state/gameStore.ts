import {create} from 'zustand';
import {GameEngine} from '@/core/GameEngine';
import type {GameState, Position} from '@/core/types';

type GameStore = {
  engine: GameEngine;
  state: GameState;
  addItem: (type: string, pos: Position) => void;
  tryMergeAt: (pos: Position) => void;
};

export const useGameStore = create<GameStore>(set => {
  const engine = new GameEngine(6, 6);

  // suscripción al motor
  engine.subscribe(newState => set({state: newState}));

  // estado inicial
  return {
    engine,
    state: engine.getState(),
    addItem: (type, pos) => engine.addItem(type, pos),
    tryMergeAt: pos => engine.tryMergeAt(pos),
  };
});
