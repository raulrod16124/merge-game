// src/data/xpRules.ts
export function computeXPForLevelCompletion(params: {
  score: number;
  movesUsed: number;
  baseLevelIndex: number; // 1..50
}) {
  const {score, movesUsed, baseLevelIndex} = params;

  // Fórmula simple y estable:
  const base = 50 + baseLevelIndex * 5; // más nivel → más XP base
  const scoreBonus = Math.floor(score * 0.4); // 40% de la puntuación
  const efficiencyBonus = Math.max(0, 30 - movesUsed); // reward por usar pocos movimientos

  return Math.max(10, base + scoreBonus + efficiencyBonus);
}
