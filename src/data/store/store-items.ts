import {HelpCircle, Snowflake, Flame, Move} from 'lucide-react';

export type StoreItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ComponentType<{size?: number; strokeWidth?: number}>;
};

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'move',
    name: 'Mover Objeto',
    description: 'Desplaza un objeto sin consumir turno.',
    price: 50,
    icon: Move,
  },
  {
    id: 'destroy',
    name: 'Destruir Objeto',
    description: 'Elimina un objeto del tablero.',
    price: 75,
    icon: Flame,
  },
  {
    id: 'freeze_blackhole',
    name: 'Congelar Agujero Negro',
    description: 'Evita que el agujero negro se mueva durante 1 turno.',
    price: 120,
    icon: Snowflake,
  },
  {
    id: 'supernova',
    name: 'Supernova Instantánea',
    description: 'Crea una supernova en una celda vacía.',
    price: 200,
    icon: HelpCircle,
  },
];
