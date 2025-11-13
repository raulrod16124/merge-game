// src/ui/components/ScoreBar.tsx
import {useGameStore} from '@/state/gameStore';

export function ScoreBar() {
  const score = useGameStore(s => s.score);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 text-3xl font-bold text-yellow-300 drop-shadow-lg">
      Score: {score}
    </div>
  );
}
