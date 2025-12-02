export function formatCoins(coins: number): string {
  if (Number.isNaN(coins)) return '0';

  return coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
