// src/core/mergeRules.ts
import type {MergeRule} from './types';

export const mergeRules: MergeRule[] = [
  // Cadena principal
  {fromType: 'bush', toType: 'tree', minCount: 3},
  {fromType: 'tree', toType: 'house', minCount: 3},
  {fromType: 'house', toType: 'mansion', minCount: 3},
  {fromType: 'mansion', toType: 'castle', minCount: 3},

  // Cadena "oscuridad" (tumbas -> iglesia -> catedral -> tesoro)
  {fromType: 'tomb', toType: 'church', minCount: 3},
  {fromType: 'church', toType: 'cathedral', minCount: 3},
  {fromType: 'cathedral', toType: 'treasure', minCount: 3},

  // Puedes añadir más reglas later
];
