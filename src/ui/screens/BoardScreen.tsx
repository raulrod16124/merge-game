// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '../../data/levels';
import {useGameStore} from '../../state/game-store';

import {HUD} from '../../ui/hud/HUD';
import {GameBoard} from '../../ui/board/GameBoard';
import {AppLayout} from '../../ui/layout/AppLayout';

import {HUDColumn, BoardColumn, BoardScreenWrapper} from './BoardScreen.styled';
import {Modal} from '../../common/Modal';
import {LevelObjectiveBar} from '../components/LevelObjectiveBar';
import type {ModalButton, ModalState} from '../../core/types';
import {getNextLevelID} from '../../utils/getNextLevelID';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);
  const resetLevel = useGameStore(s => s.resetLevel);

  const levelResult = useGameStore(s => s.levelResult);
  const setLevelResult = useGameStore(s => s.setLevelResult);

  const [modalState, setModalState] = useState<null | ModalState>(null);

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

  const handleCloseModal = () => {
    setModalState(null);
    setLevelResult(null);
    resetLevel();
  };

  const generatedSuccessButtons = (ms: ModalState): ModalButton[] => {
    let buttons: ModalButton[] = [];
    if (ms.status === 'win') {
      const nextLevel = getNextLevelID(ms.levelId);
      buttons.push({
        label: 'Siguiente nivel',
        variant: 'primary',
        onClick: () => navigate(`/play/${nextLevel}`),
      });
    }
    buttons.push(
      {
        label: 'Volver a niveles',
        variant: 'secondary',
        to: '/levels',
        onClick: handleCloseModal,
      },
      {
        label: 'Cerrar',
        variant: 'tertiary',
        onClick: handleCloseModal,
      },
    );
    return buttons;
  };

  return (
    <AppLayout>
      <BoardScreenWrapper>
        <HUDColumn>
          <LevelObjectiveBar />
          <HUD />
        </HUDColumn>

        <BoardColumn>
          <GameBoard />
        </BoardColumn>
      </BoardScreenWrapper>

      {/* Celebration */}
      {modalState?.status === 'win' && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: 80,
            transform: 'translateX(-50%)',
            zIndex: 10050,
            pointerEvents: 'none',
          }}>
          🎉 ¡Nivel completado!
        </div>
      )}

      {/* Modal success */}
      {modalState?.status === 'win' && (
        <Modal
          onClose={handleCloseModal}
          open
          title="¡Nivel completado!"
          message="Has logrado el objetivo"
          buttons={generatedSuccessButtons(modalState)}
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
              onClick: handleCloseModal,
            },
            {
              label: 'Volver a niveles',
              variant: 'fail',
              to: '/levels',
              onClick: handleCloseModal,
            },
            {
              label: 'Cerrar',
              variant: 'tertiary',
              onClick: handleCloseModal,
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
