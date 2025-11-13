// src/ui/components/HUDExtra.tsx
import {useGameStore} from '@/state/gameStore';

export function HUDExtra() {
  const state = useGameStore(s => s.state);
  const bears = state.items.filter(i => i.type === 'bear').length;
  return <div className="text-sm text-slate-300">Osos: {bears}</div>;
}
