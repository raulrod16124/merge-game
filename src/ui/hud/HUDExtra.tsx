// src/ui/components/HUDExtra.tsx
import {useGameStore} from '@/state/gameStore';

export function HUDExtra() {
  const state = useGameStore(s => s.state);
  const bears = state.items.filter(i => i.type === 'bear').length;

  return (
    <div
      className="
        text-sm px-3 py-1 rounded-lg
        bg-[rgba(255,255,255,0.25)] text-[#3a2c16]
        border border-[#bba27a] shadow-sm
      ">
      Osos: <span className="font-semibold">{bears}</span>
    </div>
  );
}
