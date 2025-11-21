// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '../../../data/levels';
import {useGameStore} from '../../../state/game-store';

import {HUD} from '../../board/HUD';
import {GameHeader} from '@/ui/board/GameHeader';
import {GameBoard} from '../../board/GameBoard';

import {HUDColumn, BoardColumn, BoardScreenWrapper} from './BoardScreen.styled';
import {Modal} from '../../../common/Modal';
import type {ModalState} from '../../../core/types';
import AppLayout from '@/ui/layout';
import {PowerupBar} from '@/ui/board/PowerupBar';
import {LevelCompleteModal} from '@/ui/components/modals/LevelCompleteModal';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);
  const resetLevel = useGameStore(s => s.resetLevel);

  const levelResult = useGameStore(s => s.levelResult);
  const setLevelResult = useGameStore(s => s.setLevelResult);
  const createdCounts = useGameStore(s => s.createdCounts);
  const levelCoins = useGameStore(s => s.levelCoins);
  const stopTimer = useGameStore(s => s.stopTimer);

  const [modalState, setModalState] = useState<null | ModalState>(null);
  const [paused, setPaused] = useState(false);
  const openPause = () => setPaused(true);
  const closePause = () => setPaused(false);

  // Load level
  useEffect(() => {
    if (!levelId) {
      navigate('/levels');
      return;
    }

    const lvl = LEVELS.find(l => l.id === levelId);
    if (!lvl) {
      navigate('/levels');
      return;
    }

    if (!currentLevel || currentLevel.id !== lvl.id) {
      loadLevel(lvl);
      setModalState(null);
    }
  }, [levelId, currentLevel, loadLevel, navigate]);

  // Listen to store
  useEffect(() => {
    if (levelResult) setModalState(levelResult as any);
  }, [levelResult]);

  useEffect(() => {
    return () => {
      try {
        setModalState(null);
      } catch (e) {}
      try {
        setLevelResult(null);
      } catch (e) {}
      try {
        stopTimer && stopTimer();
        resetLevel();
      } catch (e) {}
    };
    // empty deps so this runs only on unmount
  }, [setLevelResult, stopTimer]);

  const handleCloseModal = () => {
    setLevelResult(null);
    setModalState(null);
  };

  const fusionStats = Object.entries(createdCounts || {}).map(
    ([type, qty]) => ({
      type,
      qty,
    }),
  );

  return (
    <AppLayout prevRoute="/home" hideHeader={true}>
      <BoardScreenWrapper>
        <HUDColumn>
          <GameHeader
            // @ts-ignore
            objective={currentLevel?.objective?.subject || 'Objetivo'}
            onPause={() => openPause()}
          />
          <HUD />
        </HUDColumn>

        <BoardColumn>
          <GameBoard />
        </BoardColumn>

        <PowerupBar />
      </BoardScreenWrapper>

      {/* Modal success */}
      {modalState?.status === 'win' && (
        <LevelCompleteModal
          coins={levelCoins || 0}
          fusionStats={fusionStats}
          onContinue={handleCloseModal}
        />
      )}

      {/* Modal fail */}
      {modalState?.status === 'fail' && (
        <Modal
          onClose={handleCloseModal}
          open
          title="Oh!, has perdido."
          message="No has logrado completar el nivel."
          buttons={[
            {
              label: 'Reintentar',
              variant: 'secondary',
              onClick: () => {
                resetLevel();
                handleCloseModal();
              },
            },
            {
              label: 'Volver a niveles',
              variant: 'fail',
              to: '/levels',
              onClick: () => {
                resetLevel();
                handleCloseModal();
              },
            },
            {
              label: 'Cerrar',
              variant: 'tertiary',
              onClick: () => {
                resetLevel();
                handleCloseModal();
              },
            },
          ]}
        />
      )}
      {paused && (
        <Modal
          onClose={closePause}
          open={paused}
          title="Juego pausado"
          buttons={
            [
              {
                label: 'Reanudar',
                variant: 'primary',
                onClick: closePause,
              },
              {
                label: 'Reinicar',
                variant: 'secondary',
                onClick: () => {
                  resetLevel();
                  closePause();
                },
              },
              {
                label: 'Salir',
                variant: 'tertiary',
                to: '/levels',
              },
            ].filter(Boolean) as any
          }
        />
      )}
    </AppLayout>
  );
}
