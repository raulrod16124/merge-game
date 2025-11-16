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
  dust: '/cosmic/dust.png',
  micro_asteroid: '/cosmic/micro_asteroid.png',
  meteorite: '/cosmic/meteorite.png',
  baby_planet: '/cosmic/baby_planet.png',
  mature_planet: '/cosmic/mature_planet.png',
  star: '/cosmic/star.png',
  star_system: '/cosmic/star_system.png',
  nebula: '/cosmic/nebula.png',
  galaxy: '/cosmic/galaxy.png',
  fragment_dark: '/cosmic/fragment_dark.png',
};
