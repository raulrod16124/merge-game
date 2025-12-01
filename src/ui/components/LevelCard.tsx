// src/ui/components/LevelCard/index.tsx
import {useNavigate} from 'react-router-dom';
import {
  LevelsWrapper,
  LevelImg,
  NodeWrapper,
  LevelName,
  ScoreBadge,
  SectionLevelWrapper,
} from './LevelCard.styled';

import type {LevelConfig} from '@/core/types';
import {Lock} from 'lucide-react';

// <-- NUEVO: importar el store del juego
import {useGameStore} from '@/state/game-store';

interface IProps {
  level: LevelConfig;
  unlocked: boolean;
  completed: boolean;
  highScore?: number | null;
  index: number;
}

export function LevelCard({
  level,
  unlocked,
  completed,
  highScore,
  index,
}: IProps) {
  const nav = useNavigate();

  const handleClick = () => {
    if (!unlocked) return;
    nav(`/play/${level.id}`);
  };

  return (
    <SectionLevelWrapper>
      <NodeWrapper $index={index}>
        <LevelsWrapper $unlocked={unlocked} onClick={handleClick}>
          {!unlocked && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Lock size={35} />
            </div>
          )}
          <LevelImg src={level.image} />
        </LevelsWrapper>

        <LevelName> {level.name} </LevelName>

        {completed && highScore != null && (
          <ScoreBadge>⭐ {highScore}</ScoreBadge>
        )}
      </NodeWrapper>
    </SectionLevelWrapper>
  );
}
