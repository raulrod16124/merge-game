// src/data/levelIndexMap.ts
export function levelIdToIndex(id: string): number {
  // expects id like "level01".."level50"
  const match = id.match(/level0*(\d+)/);
  if (!match) throw new Error(`Invalid level id: ${id}`);
  return Number(match[1]);
}

export function indexToLevelId(i: number): string {
  return `level${String(i).padStart(2, '0')}`;
}
