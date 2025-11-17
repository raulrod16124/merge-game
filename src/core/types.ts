// src/core/types.ts

export type CosmicType =
  | 'dust'
  | 'micro_asteroid'
  | 'meteorite'
  | 'baby_planet'
  | 'mature_planet'
  | 'star'
  | 'star_system'
  | 'nebula'
  | 'galaxy';

export interface Pos {
  x: number;
  y: number;
}

export interface ItemBase {
  id: string;
  type: CosmicType;
  level: number;
  pos: Pos;
  createdAt?: number;
  frozen?: boolean;
}

export interface HoleEnemy {
  id: string;
  pos: Pos;
  fragments: Record<CosmicType, number>;
  active: boolean;
}

export type ObjectiveType =
  | 'score'
  | 'create'
  | 'survive'
  | 'survive_alive'
  | 'supernova';

export interface Objective {
  type: ObjectiveType;
  subject?: CosmicType;
  target: number;
}

export type ResponsiveBoardSize = {
  mobile: {cols: number; rows: number};
  desktop: {cols: number; rows: number};
};

export type LevelConfig = {
  id: string;
  name: string;
  boardSize: ResponsiveBoardSize;
  enemyCount: number;
  spawnWeights: Record<CosmicType, number>;
  initialMap: {type: CosmicType; x: number; y: number}[];
  blockedCells?: Pos[];
  mapAsset: string;
  objective?: Objective[];
  timerSeconds?: number;
};

export interface GameState {
  items: ItemBase[];
  score: number;
  moves: number;
  nextItem?: CosmicType;
  boardSize: {cols: number; rows: number};
  currentLevel?: LevelConfig;
  timeLeft?: number;
  holes?: HoleEnemy[];
  powerupUsed?: boolean;
  floatingScores?: Array<{id: string; x: number; y: number; points: number}>;
}
