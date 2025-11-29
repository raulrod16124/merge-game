// src/data/sectionUnlocks.ts
export type SectionDef = {
  section: number;
  startLevelIndex: number; // 1-based index (1..50)
  endLevelIndex: number;
  unlocksNext: number | null; // next section number or null if last
};

export const SECTION_UNLOCKS: Record<number, SectionDef> = {
  1: {section: 1, startLevelIndex: 1, endLevelIndex: 10, unlocksNext: 2},
  2: {section: 2, startLevelIndex: 11, endLevelIndex: 20, unlocksNext: 3},
  3: {section: 3, startLevelIndex: 21, endLevelIndex: 30, unlocksNext: 4},
  4: {section: 4, startLevelIndex: 31, endLevelIndex: 40, unlocksNext: 5},
  5: {section: 5, startLevelIndex: 41, endLevelIndex: 50, unlocksNext: null},
};
