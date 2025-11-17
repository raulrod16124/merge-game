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
  dust: `${import.meta.env.BASE_URL}cosmic/dust.png`,
  micro_asteroid: `${import.meta.env.BASE_URL}cosmic/micro_asteroid.png`,
  meteorite: `${import.meta.env.BASE_URL}cosmic/meteorite.png`,
  baby_planet: `${import.meta.env.BASE_URL}cosmic/baby_planet.png`,
  mature_planet: `${import.meta.env.BASE_URL}cosmic/mature_planet.png`,
  star: `${import.meta.env.BASE_URL}cosmic/star.png`,
  star_system: `${import.meta.env.BASE_URL}cosmic/star_system.png`,
  nebula: `${import.meta.env.BASE_URL}cosmic/nebula.png`,
  galaxy: `${import.meta.env.BASE_URL}cosmic/galaxy.png`,
  fragment_dark: `${import.meta.env.BASE_URL}cosmic/fragment_dark.png`,
};
