// src/ui/components/LevelCard/index.tsx
import {useNavigate} from 'react-router-dom';
import {Lock, Star} from 'lucide-react';
import {
  Planet,
  PlanetIcon,
  NodeWrapper,
  LevelName,
  ScoreBadge,
} from './LevelCard.styled';

import type {LevelConfig} from '@/core/types';

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
    if (unlocked) nav(`/play/${level.id}`);
  };

  return (
    <NodeWrapper $index={index}>
      <Planet $unlocked={unlocked} onClick={handleClick}>
        <PlanetIcon>
          {completed ? (
            <Star size={28} strokeWidth={2.2} />
          ) : unlocked ? (
            <Star size={22} strokeWidth={1.4} />
          ) : (
            <Lock size={26} strokeWidth={2.2} />
          )}
        </PlanetIcon>
      </Planet>

      <LevelName> {level.name} </LevelName>

      {completed && highScore != null && (
        <ScoreBadge>⭐ {highScore}</ScoreBadge>
      )}
    </NodeWrapper>
  );
}
