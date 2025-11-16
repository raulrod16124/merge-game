// src/ui/hud/ScoreBar.tsx
import {useGameStore} from '@/state/gameStore';

export function ScoreBar() {
  const score = useGameStore(s => s.score);
  const moves = useGameStore(s => s.moves);

  return (
    <div
      style={{
        width: '100%',
        marginTop: 4,
        marginBottom: 8,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        opacity: 0.85,
      }}>
      <div>
        Puntos: <strong>{score}</strong>
      </div>
      <div>
        Movs: <strong>{moves}</strong>
      </div>
    </div>
  );
}
