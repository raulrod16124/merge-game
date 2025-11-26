// src/core/types.ts

export type CosmicType =
  | 'dust'
  | 'micro_asteroid'
  | 'meteorite'
  | 'baby_planet'
  | 'mature_planet'
  | 'star'
  | 'star_system'
  | 'supernova'
  | 'nebula'
  | 'galaxy'
  | 'fragment'
  | 'black_hole';

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
  icon?: string;
  absorbed?: number;
  freezeTurns?: number;
}

export type PowerupType = 'move' | 'destroy' | 'freeze_bh' | 'supernova';

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
  maxBlackHoles?: number; // máximo simultáneo permitidos en el nivel
  blackHoleSpawnRate?: number; // cada cuántos turnos intentamos spawnear
  blackHoleSpawnChance?: number; // probabilidad por intento
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
  powerupUsed?: boolean;
  floatingScores?: Array<{id: string; x: number; y: number; points: number}>;
}
export type ModalState = {
  status: 'win' | 'fail';
  levelId: string;
};

export type ModalButton = {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'fail';
  onClick?: () => void;
  to?: string;
  fullWidth?: boolean;
};

export type UnlockItem = {
  kind: 'powerup' | 'map' | 'achievement' | 'coins';
  id?: string;
  amount?: number;
  name?: string;
};
