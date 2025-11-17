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
