import type {CosmicType, PowerupType} from '@/core/types';

export type AchievementId =
  | 'FIRST_MERGE'
  | 'FIRST_ASTEROID'
  | 'FIRST_METEORITE'
  | 'FIRST_STAR'
  | 'FIRST_NEBULA'
  | 'FIRST_GALAXY'
  | 'USE_POWERUP'
  | 'FREEZE_BLACK_HOLE'
  | 'CREATE_SUPERNOVA'
  | 'WIN_LEVEL_10'
  | 'WIN_LEVEL_20';

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: 'merge' | 'level_win' | 'powerup' | 'supernova';
    value?: CosmicType | number | string;
  };
  reward?: {
    coins?: number;
    powerups?: PowerupType[];
    maps?: string[];
  };
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_MERGE',
    title: 'Primer Merge',
    description: 'Fusiona 3 objetos iguales por primera vez',
    icon: 'merge',
    condition: {type: 'merge'},
  },
  {
    id: 'FIRST_ASTEROID',
    title: 'Pequeño Constructor',
    description: 'Crea tu primer micro-asteroide',
    icon: 'micro_asteroid',
    condition: {type: 'merge', value: 'micro_asteroid'},
  },
  {
    id: 'FIRST_METEORITE',
    title: 'Constructor Estelar',
    description: 'Crea tu primer meteorito',
    icon: 'meteorite',
    condition: {type: 'merge', value: 'meteorite'},
  },
  {
    id: 'FIRST_STAR',
    title: 'Encendiendo el Universo',
    description: 'Crea tu primera estrella',
    icon: 'star',
    condition: {type: 'merge', value: 'star'},
  },
  {
    id: 'FIRST_NEBULA',
    title: 'El Nacimiento del Cosmos',
    description: 'Crea tu primera nebulosa',
    icon: 'nebula',
    condition: {type: 'merge', value: 'nebula'},
  },
  {
    id: 'FIRST_GALAXY',
    title: 'Arquitecto Galáctico',
    description: 'Crea tu primera galaxia',
    icon: 'galaxy',
    condition: {type: 'merge', value: 'galaxy'},
  },
  {
    id: 'CREATE_SUPERNOVA',
    title: 'Explosión Cósmica',
    description: 'Genera una supernova por primera vez',
    icon: 'supernova',
    condition: {type: 'supernova'},
  },
  {
    id: 'USE_POWERUP',
    title: 'Aprendiz de Energía',
    description: 'Usa un powerup por primera vez',
    icon: 'zap',
    condition: {type: 'powerup'},
  },
  {
    id: 'FREEZE_BLACK_HOLE',
    title: 'Maestro del Tiempo',
    description: 'Congela un agujero negro',
    icon: 'snow',
    condition: {type: 'powerup', value: 'freeze_bh'},
  },
  {
    id: 'WIN_LEVEL_10',
    title: 'Dominador del Universo I',
    description: 'Completa el nivel 10',
    icon: 'trophy',
    condition: {type: 'level_win', value: 10},
  },
  {
    id: 'WIN_LEVEL_20',
    title: 'Dominador del Universo II',
    description: 'Completa el nivel 20',
    icon: 'trophy',
    condition: {type: 'level_win', value: 20},
  },
];
