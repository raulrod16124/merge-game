// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '../../data/levels';
import {useGameStore} from '../../state/game-store';

import {HUD} from '../../ui/hud/HUD';
import {GameBoard} from '../../ui/board/GameBoard';
import {AppLayout} from '../../ui/layout/AppLayout';

import {LevelCompleteModal} from '../../ui/components/modals/LevelCompleteModal';
import {LevelFailModal} from '../../ui/components/modals/LevelFailModal';

import {BoardScreenWrapper, HUDColumn, BoardColumn} from './BoardLayout.styled';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);
  const checkWinLose = useGameStore(s => s.checkWinLose);

  const [modalState, setModalState] = useState(
    null as null | {
      status: 'win' | 'fail';
      levelId: string;
    },
  );

  useEffect(() => {
    if (!levelId) {
      navigate('/levels');
      return;
    }

    const lvl = LEVELS.find((l: any) => l.id === levelId);
    if (!lvl) {
      navigate('/levels');
      return;
    }

    if (!currentLevel || currentLevel.id !== lvl.id) {
      loadLevel(lvl);
      setModalState(null);
    }
  }, [levelId]);

  const result = checkWinLose();
  useEffect(() => {
    if (result === null) return;
    setModalState(result);
  }, [result]);

  return (
    <AppLayout>
      <BoardScreenWrapper>
        <HUDColumn>
          <HUD />
        </HUDColumn>

        <BoardColumn>
          <GameBoard />
        </BoardColumn>
      </BoardScreenWrapper>

      {modalState?.status === 'win' && (
        <LevelCompleteModal
          levelId={modalState.levelId}
          onClose={() => setModalState(null)}
        />
      )}

      {modalState?.status === 'fail' && (
        <LevelFailModal
          levelId={modalState.levelId}
          onClose={() => setModalState(null)}
        />
      )}
    </AppLayout>
  );
}
