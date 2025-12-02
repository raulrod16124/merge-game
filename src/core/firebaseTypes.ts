// src/core/types/firebase.ts

import type {PowerupType} from '@/core/types';
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

export type CosmicProgress = {
  xp: number;
  level: number;
};

export type PlayerDoc = {
  highestLevelUnlocked: number;
  unlockedPowerups: PowerupType[];
  unlockedMaps: string[];
  achievements: Record<string, boolean>;
  coins: number;
  cosmicProgress: {
    humanoid: CosmicProgress;
    abstract: CosmicProgress;
    hybrid: CosmicProgress;
  };
  avatarVariant: AvatarVariant;
  completedLevelUnlocks: Record<number, boolean>;
  lastUpdated?: {seconds: number; nanoseconds: number} | string;
  rankScore?: number;
  id?: string;
};
