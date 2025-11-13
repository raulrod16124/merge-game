// src/core/mergeRules.ts

import type {MergeRule} from './types';

export const mergeRules: MergeRule[] = [
  {fromType: 'bush', toType: 'tree', minCount: 3},
  {fromType: 'tree', toType: 'house', minCount: 3},
  {fromType: 'house', toType: 'castle', minCount: 3},
];
