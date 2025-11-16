// src/ui/screens/BoardScreen.tsx
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

import {LEVELS} from '@/data/levels';
import {useGameStore} from '@/state';

import {HUD} from '@/ui/hud/HUD';
import {GameBoard} from '@/ui/board/GameBoard';
import {AppLayout} from '@/ui/layout/AppLayout';

import {LevelCompleteModal} from '@/ui/components/modals/LevelCompleteModal';
import {LevelFailModal} from '@/ui/components/modals/LevelFailModal';

export function BoardScreen() {
  const {levelId} = useParams();
  const navigate = useNavigate();

  const loadLevel = useGameStore(s => s.loadLevel);
  const currentLevel = useGameStore(s => s.currentLevel);

  const timeLeft = useGameStore(s => s.timeLeft);
  const score = useGameStore(s => s.score);

  const checkWinLose = useGameStore(s => s.checkWinLose);

  const [modalState, setModalState] = useState<null | {
    status: 'win' | 'fail';
    levelId: string;
  }>(null);

  useEffect(() => {
    if (!levelId) {
      navigate('/levels');
      return;
    }

    const lvl = Array.isArray(LEVELS)
      ? LEVELS.find(l => l.id === levelId)
      : LEVELS[levelId];

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

  useEffect(() => {
    const result = checkWinLose?.() ?? null;
    if (result !== null) {
      setModalState(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, score]);

  return (
    <AppLayout>
      <HUD />

      <div style={{marginTop: '16px'}}>
        <GameBoard />
      </div>

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
