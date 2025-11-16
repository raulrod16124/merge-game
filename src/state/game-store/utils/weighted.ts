// src/state/gameStore/utils/weighted.ts
export const pickWeighted = <T extends string>(table: Record<T, number>): T => {
  const entries = Object.entries(table) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  const r = Math.random() * total;

  return entries.reduce(
    (acc, [key, weight]) =>
      acc.done
        ? acc
        : acc.accum + weight >= r
          ? {key, accum: acc.accum + weight, done: true}
          : {key: acc.key, accum: acc.accum + weight, done: false},
    {key: entries[0][0], accum: 0, done: false},
  ).key;
};
