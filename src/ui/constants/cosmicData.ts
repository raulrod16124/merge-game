// src/ui/constants/cosmicData.ts

export type CosmicType =
  | 'dust'
  | 'micro_asteroid'
  | 'meteorite'
  | 'baby_planet'
  | 'mature_planet'
  | 'star'
  | 'star_system'
  | 'nebula'
  | 'galaxy'
  | 'fragment_dark';

export const COSMIC_ICONS: Record<CosmicType, string> = {
  dust: '/src/assets/cosmic/dust.png',
  micro_asteroid: '/src/assets/cosmic/micro_asteroid.png',
  meteorite: '/src/assets/cosmic/meteorite.png',
  baby_planet: '/src/assets/cosmic/baby_planet.png',
  mature_planet: '/src/assets/cosmic/mature_planet.png',
  star: '/src/assets/cosmic/star.png',
  star_system: '/src/assets/cosmic/star_system.png',
  nebula: '/src/assets/cosmic/nebula.png',
  galaxy: '/src/assets/cosmic/galaxy.png',
  fragment_dark: '/src/assets/cosmic/fragment_dark.png',
};
