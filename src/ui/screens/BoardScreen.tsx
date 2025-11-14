// src/ui/screens/BoardScreen.tsx
import {useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {LEVELS} from '@/data/levels';
import {useGameStore} from '@/state/gameStore';

import {HUD} from '@/ui/hud/HUD';
import {GameBoard} from '@/ui/board/GameBoard';

import {ScreenWrapper, BoardSection, BoardLimiter} from './BoardScreen.styled';

export function BoardScreen() {
  const {levelId} = useParams();
  const nav = useNavigate();
  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);

  useEffect(() => {
    if (!levelId) {
      nav('/levels');
      return;
    }
    const lvl = (LEVELS as any)[levelId];
    if (!lvl) {
      nav('/levels');
      return;
    }
    if (!currentLevel || currentLevel.id !== lvl.id) {
      loadLevel(lvl);
    }
  }, []);

  return (
    <ScreenWrapper>
      <HUD />

      <BoardSection>
        <BoardLimiter>
          <GameBoard />
        </BoardLimiter>
      </BoardSection>
    </ScreenWrapper>
  );
}
