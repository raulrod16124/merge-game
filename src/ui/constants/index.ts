// src/ui/constants.ts
export function emoji(type: string) {
  switch (type) {
    case 'bush':
      return '🌿';
    case 'tree':
      return '🌳';
    case 'house':
      return '🏠';
    case 'mansion':
      return '🏡';
    case 'castle':
      return '🏰';
    case 'bear':
      return '🐻';
    case 'tomb':
      return '🪦';
    case 'church':
      return '⛪';
    case 'cathedral':
      return '🏛️';
    case 'treasure':
      return '💎';
    case 'dragon':
      return '🐉';
    default:
      return '❓';
  }
}

// Orden de aparición / progresión
export const ITEM_ORDER = [
  'bush',
  'tree',
  'house',
  'mansion',
  'castle',
  'bear', // los osos entran en pool como "pieza que puede salir"
  'tomb',
  'church',
  'cathedral',
  'treasure',
  'dragon',
];

export const ITEM_ASSETS: Record<string, {src: string; size?: number}> = {
  bush: {src: '/assets/items/bush.png', size: 64},
  tree: {src: '/assets/items/tree.png', size: 72},
  house: {src: '/assets/items/house.png', size: 72},
  mansion: {src: '/assets/items/mansion.png', size: 80},
  bear: {src: '/assets/items/bear.png', size: 72},
  tomb: {src: '/assets/items/tomb.png', size: 64},
};

// Pesos base para spawn aleatorio (puedes ajustar)
export const ITEM_WEIGHTS: Record<string, number> = {
  bush: 60,
  tree: 25,
  house: 10,
  mansion: 3,
  castle: 1,
  bear: 6, // osos relativamente raros (ajusta)
  tomb: 0,
  church: 0,
  cathedral: 0,
  treasure: 0,
  dragon: 0,
};
