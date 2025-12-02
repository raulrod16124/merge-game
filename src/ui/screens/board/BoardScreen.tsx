// src/ui/screens/BoardScreen.tsx

import {useEffect, useRef, useState, useCallback} from 'react';
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

/**
 * BoardScreen FINAL — versión SAFE, estable, sin doble carga.
 * - Usa safeLoadLevel desde game-store
 * - No llama a resetLevel() al desmontar
 * - Controla el inicio del timer de forma segura
 * - Evita estados corruptos tras reload/StrictMode
 */

export function BoardScreen() {
  const {levelId} = useParams<{levelId: string}>();
  const navigate = useNavigate();

  // Game store selectors
  const currentLevel = useGameStore(s => s.currentLevel);
  const levelResult = useGameStore(s => s.levelResult);
  const setLevelResult = useGameStore(s => s.setLevelResult);

  const createdCounts = useGameStore(s => s.createdCounts);
  const levelCoins = useGameStore(s => s.levelCoins);
  const stopTimer = useGameStore(s => s.stopTimer);

  // Player store selectors
  const addXP = usePlayerStore(s => s.addXP);
  const completedLevelUnlocks = usePlayerStore(s => s.completedLevelUnlocks);
  const markLevelUnlocksAsCompleted = usePlayerStore(
    s => s.markLevelUnlocksAsCompleted,
  );
  const newAchievements = usePlayerStore(s => s.newAchievements);
  const clearNewAchievements = usePlayerStore(s => s.clearNewAchievements);

  // UI state
  const [modalState, setModalState] = useState<null | ModalState>(null);
  const [paused, setPaused] = useState(false);
  const [unlockModalItems, setUnlockModalItems] = useState<UnlockItem[]>([]);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  // Prevent double-run of levelResult
  const processedLevelsRef = useRef<Set<string>>(new Set());

  // ------------------------------
  // LOAD LEVEL (SAFE)
  // ------------------------------
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

    try {
      // Carga segura — evita dobles cargas incluso en StrictMode
      useGameStore.getState().safeLoadLevel(lvl);
      setModalState(null);
    } catch (e) {
      console.warn('BoardScreen: safeLoadLevel failed', e);
    }
  }, [levelId, navigate]);

  // ------------------------------
  // HANDLE LEVEL RESULT
  // ------------------------------
  useEffect(() => {
    if (!levelResult) return;

    const levelIdStr = levelResult.levelId ?? 'unknown';

    // Ya procesado → solo abrir modal si corresponde
    if (processedLevelsRef.current.has(levelIdStr)) {
      setModalState(levelResult as ModalState);
      return;
    }

    processedLevelsRef.current.add(levelIdStr);
    setModalState(levelResult as ModalState);

    const lvlNum =
      parseInt((levelResult.levelId || '').replace(/\D/g, ''), 10) || null;

    if (
      levelResult.status === 'win' &&
      lvlNum !== null &&
      !completedLevelUnlocks?.[lvlNum + 1]
    ) {
      const xpGained =
        Math.floor((createdCounts?.star ?? 0) * 10 + (levelCoins ?? 0) * 0.2) +
        50;

      addXP(xpGained + (LEVEL_XP_REWARD[lvlNum] ?? 50));

      // Achievements
      const ach = useAchievementStore.getState();
      if (lvlNum === 10) ach.unlock('WIN_LEVEL_10');
      if (lvlNum === 20) ach.unlock('WIN_LEVEL_20');

      // Unlock modal
      const unlock = LEVEL_UNLOCKS[lvlNum + 1];
      if (unlock) {
        const items: UnlockItem[] = [];

        if (unlock.powerups)
          unlock.powerups.forEach(p =>
            items.push({kind: 'powerup', id: p, name: p}),
          );

        if (unlock.maps)
          unlock.maps.forEach(m => items.push({kind: 'map', id: m, name: m}));

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

      // Mark progress
      if (typeof lvlNum === 'number') {
        usePlayerStore.getState().markLevelCompleted(String(lvlNum), xpGained);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelResult]);

  // ------------------------------
  // CLEAN-UP ON UNMOUNT (SAFE)
  // ------------------------------
  useEffect(() => {
    return () => {
      try {
        setModalState(null);
      } catch {}
      try {
        setLevelResult(null);
      } catch {}
      try {
        stopTimer();
      } catch {}
      // NO resetLevel() aquí — importante
    };
  }, [setLevelResult, stopTimer]);

  // ------------------------------
  // HELPERS
  // ------------------------------
  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);

  const handleCloseModal = useCallback(() => {
    setLevelResult(null);
    setModalState(null);
  }, [setLevelResult]);

  const fusionStats = Object.entries(createdCounts || {}).map(
    ([type, qty]) => ({type, qty}),
  );

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <AppLayout prevRoute="/home" hideHeader>
      <BoardScreenWrapper>
        <HUDColumn>
          <GameHeader
            // @ts-ignore
            objective={currentLevel?.objective?.subject || 'Objetivo'}
            onPause={openPause}
          />
          <HUD />
        </HUDColumn>

        <BoardColumn>
          <GameBoard />
        </BoardColumn>

        <PowerupBar />
      </BoardScreenWrapper>

      {/* Unlock modal */}
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

      {/* Win modal */}
      {!unlockModalOpen && modalState?.status === 'win' && (
        <LevelCompleteModal
          coins={levelCoins || 0}
          fusionStats={fusionStats}
          newAchievements={newAchievements}
          onNextLevel={nextLevelId => {
            clearNewAchievements();
            handleCloseModal();
            navigate(`/play/${nextLevelId}`);
          }}
          onContinue={() => {
            clearNewAchievements();
            handleCloseModal();
          }}
        />
      )}

      {/* Fail modal */}
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
                useGameStore.getState().resetLevel();
                handleCloseModal();
              },
            },
            {
              label: 'Volver a niveles',
              variant: 'fail',
              to: '/levels',
              onClick: () => {
                handleCloseModal();
                navigate('/levels');
              },
            },
            {
              label: 'Cerrar',
              variant: 'tertiary',
              onClick: handleCloseModal,
            },
          ]}
        />
      )}

      {/* Pause modal */}
      {paused && (
        <Modal
          onClose={closePause}
          open={paused}
          title="Juego pausado"
          buttons={[
            {
              label: 'Reanudar',
              variant: 'primary',
              onClick: closePause,
            },
            {
              label: 'Reiniciar',
              variant: 'secondary',
              onClick: () => {
                useGameStore.getState().resetLevel();
                closePause();
              },
            },
            {
              label: 'Salir',
              variant: 'tertiary',
              to: '/levels',
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
