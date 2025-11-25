export type CosmicAvatarStage = {
  level: number;
  icon: string;
  auraColor?: string;
};

export const COSMIC_AVATAR_STAGES: CosmicAvatarStage[] = [
  {
    level: 1,
    icon: '/avatars/cosmic_1.png',
  },
  {
    level: 2,
    icon: '/avatars/cosmic_2.png',
    auraColor: '#88f',
  },
  {
    level: 3,
    icon: '/avatars/cosmic_3.png',
    auraColor: '#4ff',
  },
  {
    level: 4,
    icon: '/avatars/cosmic_4.png',
    auraColor: '#f4f',
  },
  {
    level: 5,
    icon: '/avatars/cosmic_5.png',
    auraColor: '#fff',
  },
];
