// src/core/types.ts

export type Position = {
  x: number;
  y: number;
};

export type MergeItem = {
  id: string;
  type: string;
  level: number;
  pos: Position;
};

export type GameBoardSize = {
  cols: number;
  rows: number;
};

export type GameState = {
  items: MergeItem[];
  boardSize: GameBoardSize;
};

export type MergeRule = {
  fromType: string;
  toType: string;
  minCount: number;
};
