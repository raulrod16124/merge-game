// src/ui/components/cosmic-avatar/types.ts

export enum AvatarVariant {
  ABSTRACT = 'abstract',
  HUMANOID = 'humanoid',
  HYBRID = 'hybrid',
}

// Apariencia visual editable por el usuario
export type AvatarAppearance = {
  shape: AvatarVariant; // forma = el enum
  color: string; // color libre
  accessories?: string[]; // opcional
};
