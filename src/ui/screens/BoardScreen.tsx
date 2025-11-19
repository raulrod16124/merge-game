// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';

import {LEVELS} from '../../data/levels';
import {useGameStore} from '../../state/game-store';

import {HUD} from '../../ui/hud/HUD';
import {GameBoard} from '../../ui/board/GameBoard';
import {AppLayout} from '../../ui/layout/AppLayout';

import {BoardScreenWrapper, HUDColumn, BoardColumn} from './BoardLayout.styled';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  // cuando levelResult cambia en el store, actualizamos modalState local
  useEffect(() => {
    if (levelResult) {
      setModalState(levelResult as any);
    }
  }, [levelResult]);

  const handleCloseModal = () => {
    setModalState(null);
    // Limpiamos el resultado global en el store y reiniciamos nivel
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

  // Compose a friendly message for the modal including the objective (if any)
  const successMessage = () => {
    if (!currentLevel) return 'Has completado el nivel.';
    const obj = currentLevel.objective;
    if (!obj) return 'Has completado el nivel.';
    if (obj[0].type === 'create') {
      return `Objetivo logrado: has creado ${obj[0].target} ${obj[0].subject}.`;
    }
    if (obj[0].type === 'score') {
      return `Objetivo logrado: has alcanzado ${obj[0].target} puntos.`;
    }
    return 'Objetivo logrado';
  };

  // small celebratory component (animated) shown when modalState.status === 'win'
  const Celebration = ({label}: {label?: string}) => (
    <motion.div
      initial={{opacity: 0, scale: 0.8, y: -10}}
      animate={{opacity: 1, scale: 1, y: 0}}
      exit={{opacity: 0, scale: 0.8, y: -10}}
      transition={{duration: 0.35}}
      style={{
        position: 'fixed',
        left: '50%',
        top: 80,
        transform: 'translateX(-50%)',
        zIndex: 10050,
        pointerEvents: 'none',
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'linear-gradient(90deg,#3a2a72,#1f1538)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
          fontWeight: 600,
        }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>
          🎉
        </div>
        <div style={{fontSize: 15}}>{label ?? '¡Nivel completado!'}</div>
      </div>
    </motion.div>
  );

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

      {/* Celebration: aparece arriba y complementa el modal */}
      {modalState?.status === 'win' && <Celebration label={successMessage()} />}

      {/* Modal success */}
      {modalState?.status === 'win' && (
        <Modal
          onClose={handleCloseModal}
          open={modalState?.status === 'win'}
          title="¡Nivel completado!"
          message={successMessage()}
          buttons={generatedSuccessButtons(modalState)}
        />
      )}

      {/* Modal fail */}
      {modalState?.status === 'fail' && (
        <Modal
          onClose={handleCloseModal}
          open={modalState?.status === 'fail'}
          title="Oh!, has perdido."
          message="No has logrado completar el nivel."
          buttons={
            [
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
            ].filter(Boolean) as any
          }
        />
      )}
    </AppLayout>
  );
}
