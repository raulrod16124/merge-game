export type AvatarVariant = 'humanoid' | 'abstract' | 'hybrid';

export type AvatarState = {
  energy: number; // 0–100
  mood?: 'idle' | 'charging' | 'burst';
  variant: AvatarVariant;
};
