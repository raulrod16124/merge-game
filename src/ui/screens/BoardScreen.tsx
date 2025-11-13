// src/ui/screens/BoardScreen.tsx
import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {LEVELS} from '@/data/levels';

import {useGameStore} from '@/state/gameStore';
import {GameBoard} from '@/ui/board/GameBoard';
import {HUD} from '@/ui/hud/HUD';
import {ScoreBar} from '@/ui/hud/ScoreBar';

import {LevelCompleteModal} from '@/ui/components/modals/LevelCompleteModal';
import {LevelFailModal} from '@/ui/components/modals/LevelFailModal';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);
  const checkWinLose = useGameStore(s => s.checkWinLose);

  const [modalState, setModalState] = useState<null | {
    status: 'win' | 'fail';
    levelId: string;
  }>(null);

  /** Load level on mount */
  useEffect(() => {
    if (!levelId) {
      navigate('/levels');
      return;
    }

    const lvl = (LEVELS as any)[levelId];
    if (!lvl) {
      navigate('/levels');
      return;
    }

    if (!currentLevel || currentLevel.id !== lvl.id) {
      loadLevel(lvl);
      setModalState(null);
    }
  }, [levelId]);

  /** Win / Lose detection */
  const result = checkWinLose();
  useEffect(() => {
    if (result === null) return;

    setModalState({
      status: result.status,
      levelId: result.levelId,
    });
  }, [result]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <HUD />
        <ScoreBar />
      </div>

      <div className="mt-6">
        <GameBoard />
      </div>

      {/* Modales */}
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
    </div>
  );
}
