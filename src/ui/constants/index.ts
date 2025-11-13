export function emoji(t: string) {
  switch (t) {
    case 'bush':
      return '🌿';
    case 'tree':
      return '🌳';
    case 'house':
      return '🏠';
    case 'castle':
      return '🏰';
    case 'dragon':
      return '🐉';
    case 'star':
      return '🌟';
    default:
      return '❓';
  }
}

export const ITEM_ORDER = ['bush', 'tree', 'house', 'castle', 'dragon', 'star'];

export const ITEM_WEIGHTS = {
  bush: 60,
  tree: 30,
  house: 8,
  castle: 2,
  dragon: 0.5,
  star: 0.1,
};
