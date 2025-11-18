// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '../../data/levels';
import {useGameStore} from '../../state/game-store';

import {HUD} from '../../ui/hud/HUD';
import {GameBoard} from '../../ui/board/GameBoard';
import {AppLayout} from '../../ui/layout/AppLayout';

import {BoardScreenWrapper, HUDColumn, BoardColumn} from './BoardLayout.styled';
import {Modal} from '../../common/Modal';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);
  const checkWinLose = useGameStore(s => s.checkWinLose);
  const score = useGameStore(s => s.score);
  const timeLeft = useGameStore(s => s.timeLeft);

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

  useEffect(() => {
    const result = checkWinLose();
    if (result) setModalState(result);
  }, [score, timeLeft]);

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
        <Modal
          open={modalState?.status === 'win'}
          title="¡Nivel completado! 🌟"
          buttons={
            [
              modalState.levelId && {
                label: 'Siguiente nivel',
                variant: 'primary',
                onClick: () => navigate(`/play/${modalState.levelId}`),
              },
              {
                label: 'Volver a niveles',
                variant: 'secondary',
                to: '/levels',
                onClick: () => setModalState(null),
              },
              {
                label: 'Cerrar',
                variant: 'tertiary',
                onClick: () => setModalState(null),
              },
            ].filter(Boolean) as any
          }
        />
      )}

      {modalState?.status === 'fail' && (
        <Modal
          open={modalState?.status === 'fail'}
          title="¡Nivel fallado! 💀"
          message="No has logrado completar el nivel."
          buttons={
            [
              {
                label: 'Reintentar',
                variant: 'secondary',
                onClick: () => navigate(`/play/${modalState.levelId}`),
              },
              {
                label: 'Volver a niveles',
                variant: 'fail',
                to: '/levels',
                onClick: () => setModalState(null),
              },
              {
                label: 'Cerrar',
                variant: 'tertiary',
                onClick: () => setModalState(null),
              },
            ].filter(Boolean) as any
          }
        />
      )}
    </AppLayout>
  );
}
