// src/ui/constants/cosmicData.ts

export const HEADER_HEIGHT = 72;

export type CosmicType =
  | 'dust'
  | 'micro_asteroid'
  | 'meteorite'
  | 'baby_planet'
  | 'mature_planet'
  | 'star'
  | 'star_system'
  | 'supernova'
  | 'nebula'
  | 'galaxy'
  | 'fragment_dark'
  | 'black_hole';

export const COSMIC_ICONS: Record<CosmicType, string> = {
  dust: `${import.meta.env.BASE_URL}cosmic/dust.png`,
  micro_asteroid: `${import.meta.env.BASE_URL}cosmic/micro_asteroid.png`,
  meteorite: `${import.meta.env.BASE_URL}cosmic/meteorite.png`,
  baby_planet: `${import.meta.env.BASE_URL}cosmic/baby_planet.png`,
  mature_planet: `${import.meta.env.BASE_URL}cosmic/mature_planet.png`,
  star: `${import.meta.env.BASE_URL}cosmic/star.png`,
  star_system: `${import.meta.env.BASE_URL}cosmic/star_system.png`,
  supernova: `${import.meta.env.BASE_URL}cosmic/star.png`, // TODO: create supernova.png
  nebula: `${import.meta.env.BASE_URL}cosmic/nebula.png`,
  galaxy: `${import.meta.env.BASE_URL}cosmic/galaxy.png`,
  fragment_dark: `${import.meta.env.BASE_URL}cosmic/fragment_dark.png`,
  black_hole: `${import.meta.env.BASE_URL}cosmic/black_hole.png`,
};

export const COSMIC_TEXT: Record<CosmicType, string> = {
  dust: 'Dust',
  micro_asteroid: 'Micro Asteroid',
  meteorite: 'Meteorite',
  baby_planet: 'Baby Planet',
  mature_planet: 'Mature Planet',
  star: 'Star',
  star_system: 'Star System',
  supernova: 'Supernova',
  nebula: 'Nebula',
  galaxy: 'Galaxy',
  fragment_dark: 'Fragment',
  black_hole: 'Black Hole',
};

export const COLORS = {
  primary: '#ffb844',
  primaryDark: '#e89227',
  secondary: '#7b4dff',
  secondaryDark: '#5a2fd4',
  tertiary: '#1a1a23',
  tertiaryDark: '#2a2a35',
  success: '#4cd964',
  successDark: '#33b84b',
  fail: '#ff5c5c',
  failDark: '#db3838',
  black: '#121212',
  white: '#FFFFFF',
};
