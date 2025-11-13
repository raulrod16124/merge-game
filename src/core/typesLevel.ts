// src/core/typesLevel.ts

export type InitialItem = {
  type: string;
  x: number;
  y: number;
};

export type LevelConfig = {
  id: string;
  name: string;

  boardSize: {
    cols: number;
    rows: number;
  };

  // enemy rules
  maxBears: number;
  bearSpawnRate: number;
  minTurnsBeforeBearSpawn: number;

  // probabilities
  itemWeights: Record<string, number>;

  // initial map (optional)
  // If provided, place these items when loading the level
  initialMap?: InitialItem[];

  // conditions
  targetScore?: number;
  maxMoves?: number;
};
