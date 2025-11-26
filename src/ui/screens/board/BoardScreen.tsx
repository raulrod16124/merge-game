// src/ui/screens/BoardScreen.tsx
import {useEffect, useRef, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '@/data/levels';
import {useGameStore} from '@/state/game-store';

import {HUD} from '@/ui/board/HUD';
import {GameHeader} from '@/ui/board/GameHeader';
import {GameBoard} from '@/ui/board/GameBoard';

import {HUDColumn, BoardColumn, BoardScreenWrapper} from './styles';
import {Modal} from '@/common/Modal';
import type {ModalState, UnlockItem} from '@/core/types';
import AppLayout from '@/ui/layout';
import {PowerupBar} from '@/ui/board/PowerupBar';
import {LevelCompleteModal} from '@/ui/components/modals/LevelCompleteModal';
import {LEVEL_UNLOCKS} from '@/data/levelUnlocks';
import NewUnlockModal from '@/ui/components/modals/NewUnlockModal';
import {useAchievementStore, usePlayerStore} from '@/state';
import {LEVEL_XP_REWARD} from '@/data/levelXPRewards';

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

  // Selectores reactivos: obtenemos solo lo que necesitamos del store
  const addXP = usePlayerStore(s => s.addXP);
  const completedLevelUnlocks = usePlayerStore(s => s.completedLevelUnlocks);
  const markLevelUnlocksAsCompleted = usePlayerStore(
    s => s.markLevelUnlocksAsCompleted,
  );
  const newAchievements = usePlayerStore(s => s.newAchievements);
  const clearNewAchievements = usePlayerStore(s => s.clearNewAchievements);

  // Ref para evitar procesar varias veces el mismo levelResult
  const processedLevelsRef = useRef<Set<string>>(new Set());

  const [modalState, setModalState] = useState<null | ModalState>(null);
  const [paused, setPaused] = useState(false);
  const openPause = () => setPaused(true);
  const closePause = () => setPaused(false);

  const [unlockModalItems, setUnlockModalItems] = useState<UnlockItem[]>([]);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  useEffect(() => {
    setModalState(null);
  }, []);

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
  // Listen to levelResult and award XP / open unlock modal safely and idempotently
  useEffect(() => {
    if (!levelResult) return;

    // Protegemos usando levelId (si existe) para evitar doble procesamiento
    const levelIdStr = levelResult.levelId ?? 'unknown';
    if (processedLevelsRef.current.has(levelIdStr)) {
      // Ya procesado: solo actualizamos modalState si es necesario
      setModalState(levelResult as ModalState | null);
      return;
    }

    setModalState(levelResult as ModalState | null);

    const lvlNum = parseInt(levelResult.levelId.replace(/\D/g, ''), 10) || null;

    if (
      levelResult.status === 'win' &&
      !unlockModalOpen &&
      lvlNum !== null &&
      !completedLevelUnlocks?.[lvlNum + 1]
    ) {
      // Marcar como procesado inmediatamente para evitar reentradas
      processedLevelsRef.current.add(levelIdStr);

      // XP formula (igual que antes)
      const xpGained =
        Math.floor((createdCounts?.star ?? 0) * 10 + (levelCoins ?? 0) * 0.2) +
        50;

      console.log(
        'ADDXP (BoardScreen) - awarding XP:',
        xpGained + (LEVEL_XP_REWARD[lvlNum] ?? 50),
      );
      addXP(xpGained + (LEVEL_XP_REWARD[lvlNum] ?? 50));

      // === ACHIEVEMENTS: level win ===
      const ach = useAchievementStore.getState();
      if (lvlNum === 10) ach.unlock('WIN_LEVEL_10');
      if (lvlNum === 20) ach.unlock('WIN_LEVEL_20');

      // Unlock modal items (same lógica)
      if (lvlNum) {
        const unlock = LEVEL_UNLOCKS[lvlNum + 1];
        if (unlock) {
          const items: any[] = [];
          if (unlock.powerups)
            unlock.powerups.forEach((p: any) =>
              items.push({kind: 'powerup', id: p, name: p}),
            );
          if (unlock.maps)
            unlock.maps.forEach((m: any) =>
              items.push({kind: 'map', id: m, name: m}),
            );
          if (unlock.coins)
            items.push({
              kind: 'coins',
              amount: unlock.coins,
              name: `${unlock.coins} coins`,
            });
          if (unlock.achievements)
            unlock.achievements.forEach(a =>
              items.push({kind: 'achievement', id: a, name: a}),
            );

          setUnlockModalItems(items);
          setUnlockModalOpen(true);
        }
      }
      usePlayerStore.getState().markLevelCompleted(lvlNum.toString(), xpGained);
    } else {
      // Si no es win o ya desbloqueado, igual marcamos como procesado para evitar reprocesos:
      processedLevelsRef.current.add(levelIdStr);
    }
    // Dependencias intencionadas: reaccionar a cambios relevantes solamente.
    // Notar: no incluimos el objeto entero del player para evitar efectos no controlados.
  }, [
    levelResult?.levelId,
    levelResult?.status,
    unlockModalOpen,
    createdCounts?.star,
    levelCoins,
    addXP,
    completedLevelUnlocks,
  ]);

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
      {unlockModalOpen && (
        <NewUnlockModal
          open={unlockModalOpen}
          items={unlockModalItems}
          onClose={() => {
            if (levelResult !== null) {
              const lvlNum =
                parseInt(levelResult.levelId.replace(/\D/g, ''), 10) || null;
              if (lvlNum !== null) {
                markLevelUnlocksAsCompleted(lvlNum + 1);
              }
            }

            setUnlockModalOpen(false);
            setUnlockModalItems([]);
          }}
        />
      )}

      {/* Modal success */}
      {!unlockModalOpen && modalState?.status === 'win' && (
        <LevelCompleteModal
          coins={levelCoins || 0}
          fusionStats={fusionStats}
          newAchievements={newAchievements}
          onNextLevel={nextLevelId => {
            clearNewAchievements();
            handleCloseModal();
            setLevelResult(null);
            navigate(`/play/${nextLevelId}`);
          }}
          onContinue={() => {
            clearNewAchievements();
            handleCloseModal();
            setLevelResult(null);
          }}
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
