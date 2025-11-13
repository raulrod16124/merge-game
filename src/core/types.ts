// src/core/types.ts

export type Position = {
  x: number;
  y: number;
};

export type MergeItem = {
  id: string;
  type: string; // Ej: "tree", "bush", "rock"
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

// Regla de fusión: al combinar N items del mismo tipo/level se obtiene otro tipo/level
export type MergeRule = {
  fromType: string;
  toType: string;
  minCount: number; // normalmente 3
};
