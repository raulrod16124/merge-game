export type AvatarState = {
  energy: number; // 0–100
  mood?: 'idle' | 'charging' | 'burst';
  variant: AvatarVariant;
};

export enum AvatarVariant {
  ABSTRACT = 'abstract',
  HUMANOID = 'humanoid',
  HYBRID = 'hybrid',
}
