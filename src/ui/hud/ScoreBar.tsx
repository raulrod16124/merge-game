// src/ui/hud/ScoreBar.tsx
import {useGameStore} from '@/state';
import {ScoreAndMovesWrapper} from './ScoreBar.styled';

export function ScoreBar() {
  const score = useGameStore(s => s.score);
  const moves = useGameStore(s => s.moves);

  return (
    <ScoreAndMovesWrapper>
      <div>
        Puntos: <strong>{score}</strong>
      </div>
      <div>
        Movs: <strong>{moves}</strong>
      </div>
    </ScoreAndMovesWrapper>
  );
}
