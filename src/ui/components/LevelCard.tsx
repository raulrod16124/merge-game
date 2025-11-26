import type {LevelConfig} from '@/core/types';
import {useNavigate} from 'react-router-dom';
import {Lock, Star} from 'lucide-react';

import {
  NodeWrapper,
  NodeCircle,
  NodeInner,
  LevelName,
  Connector,
  ScoreBadge,
} from './LevelCard.styled';

type Props = {
  level: LevelConfig;
  unlocked: boolean;
  completed: boolean;
  highScore?: number | null;
  index: number;
};

export function LevelCard({
  level,
  unlocked,
  completed,
  highScore,
  index,
}: Props) {
  const nav = useNavigate();

  const handleClick = () => {
    if (unlocked) nav(`/play/${level.id}`);
  };

  return (
    <NodeWrapper $index={index}>
      {/* Conexión hacia el siguiente nodo */}
      <Connector viewBox="0 0 140 90">
        <path
          d={
            index % 2 === 0
              ? 'M 70 90 C 20 40, 20 10, 70 0'
              : 'M 70 90 C 120 40, 120 10, 70 0'
          }
        />
      </Connector>

      <NodeCircle
        $unlocked={unlocked}
        $completed={completed}
        onClick={handleClick}>
        <NodeInner>
          {completed ? (
            <Star size={22} strokeWidth={2.4} />
          ) : unlocked ? (
            <Star size={20} strokeWidth={1.8} />
          ) : (
            <Lock size={20} strokeWidth={2.2} />
          )}
        </NodeInner>
      </NodeCircle>

      <LevelName>{level.name}</LevelName>

      {completed && highScore != null && (
        <ScoreBadge>⭐ {highScore}</ScoreBadge>
      )}
    </NodeWrapper>
  );
}
