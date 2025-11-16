// src/core/types.ts
/**
 * Tipos centrales para Stellar Merge (Stellarbound)
 * Fase 0: tipos base y estructuras compartidas
 */

export type CosmicType =
  | 'dust' // Polvo estelar (nivel 1)
  | 'micro_asteroid' // Micro-asteroide
  | 'meteorite' // Meteorito
  | 'baby_planet' // Planeta bebé
  | 'mature_planet' // Planeta maduro
  | 'star' // Estrella
  | 'star_system' // Sistema estelar
  | 'nebula' // Nebulosa
  | 'galaxy' // Galaxia (objeto máximo)
  | 'fragment'; // Fragmento oscuro (generado por el agujero)

export interface Pos {
  x: number;
  y: number;
}

export interface ItemBase {
  id: string;
  type: CosmicType;
  level: number; // nivel numérico (1..N)
  pos: Pos;
  createdAt?: number; // timestamp (opcional)
  // flags de estado
  isFragment?: boolean; // si el objeto está convertido en fragmento
  frozen?: boolean; // si está temporalmente inmutable
}

export interface HoleEnemy {
  id: string;
  pos: Pos;
  fragments: Record<string, number>; // counts per type e.g. {'dust':2}
  active: boolean;
}

export type ObjectiveType = 'score' | 'create' | 'survive' | 'survive_alive';

export interface Objective {
  type: ObjectiveType;
  subject?: CosmicType;
  target: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  description?: string;
  boardSize: {cols: number; rows: number};
  spawnWeights: Record<string, number>;
  initialMap?: Array<{x: number; y: number; type: CosmicType}>;
  maxHoles?: number;
  objectives?: Objective[];
  blockedCells?: Pos[];
  timerSeconds?: number;
}

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
