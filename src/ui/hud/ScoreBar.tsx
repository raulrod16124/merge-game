// src/ui/components/ScoreBar.tsx
import {useGameStore} from '@/state/gameStore';

export function ScoreBar() {
  const score = useGameStore(s => s.score);
  const moves = useGameStore(s => s.moves);

  return (
    <div
      className="
        w-full mt-3 mb-1 flex items-center justify-between
        px-4 py-2 rounded-xl text-sm
        bg-[rgba(255,255,255,0.2)] text-[#3a2c16]
        border border-[#cbb893] shadow-inner
      ">
      <div>
        Puntos: <span className="font-bold">{score}</span>
      </div>
      <div>
        Movs: <span className="font-bold">{moves}</span>
      </div>
    </div>
  );
}
