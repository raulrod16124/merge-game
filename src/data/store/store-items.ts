import type {PowerupType} from '@/core/types';
import {HelpCircle, Snowflake, Flame, Move} from 'lucide-react';

export type StoreItem = {
  id: PowerupType;
  type: string;
  name: string;
  description: string;
  price: number;
  icon: React.ComponentType<{size?: number; strokeWidth?: number}>;
  image: string;
};

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'move',
    type: 'powerup',
    name: 'Mover Objeto',
    description: 'Desplaza un objeto sin consumir turno.',
    price: 50,
    icon: Move,
    image: '/powerups/move.png',
  },
  {
    id: 'destroy',
    type: 'powerup',
    name: 'Destruir Objeto',
    description: 'Elimina un objeto del tablero.',
    price: 75,
    icon: Flame,
    image: '/powerups/destroy.png',
  },
  {
    id: 'freeze_bh',
    type: 'powerup',
    name: 'Congelar Agujero Negro',
    description: 'Evita que el agujero negro se mueva durante 1 turno.',
    price: 120,
    icon: Snowflake,
    image: '/powerups/freeze_bh.png',
  },
  {
    id: 'supernova',
    type: 'powerup',
    name: 'Supernova Instantánea',
    description: 'Crea una supernova en una celda vacía.',
    price: 200,
    icon: HelpCircle,
    image: '/powerups/supernova.png',
  },
];
