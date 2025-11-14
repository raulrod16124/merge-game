// src/ui/hud/HUD.tsx
import {useGameStore} from '@/state/gameStore';
import {HUDContainer, HUDItem, HUDValue, HUDButton} from './HUD.styled';
import {emoji} from '../constants';

export function HUD() {
  const nextItem = useGameStore(s => s.nextItem);
  const score = useGameStore(s => s.score);
  const moves = useGameStore(s => s.moves);
  const resetLevel = useGameStore(s => s.resetLevel);

  return (
    <HUDContainer>
      <HUDItem>
        Siguiente
        <HUDValue>{emoji(nextItem)}</HUDValue>
      </HUDItem>

      <HUDItem>
        Puntos
        <HUDValue>{score}</HUDValue>
      </HUDItem>

      <HUDItem>
        Movs
        <HUDValue>{moves}</HUDValue>
      </HUDItem>

      <HUDButton onClick={resetLevel}>Reiniciar</HUDButton>
    </HUDContainer>
  );
}
