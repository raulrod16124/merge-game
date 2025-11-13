// src/ui/components/ScoreBar.tsx
import {useGameStore} from '@/state/gameStore';

export function ScoreBar() {
  const score = useGameStore(s => s.score);
  const moves = useGameStore(s => s.moves);

  return (
    <div className="w-full mt-3 mb-1 flex items-center justify-between text-sm text-slate-200">
      <div>
        Puntos: <span className="font-bold">{score}</span>
      </div>
      <div>
        Movs: <span className="font-bold">{moves}</span>
      </div>
    </div>
  );
}
