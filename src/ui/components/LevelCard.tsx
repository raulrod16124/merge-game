// src/ui/components/LevelCard.tsx
import type {LevelConfig} from '@/core/types';
import {useNavigate} from 'react-router-dom';
import {
  CardWrap,
  Top,
  IconWrap,
  Body,
  StatPill,
  PlayButton,
  Footer,
} from './LevelCard.styled';
import {COSMIC_ICONS} from '@/ui/constants/cosmicData';

type Props = {
  level: LevelConfig & Record<string, any>;
};

export function LevelCard({level}: Props) {
  const nav = useNavigate();

  const handlePlay = () => {
    nav(`/play/${level.id}`);
  };

  const previewType =
    Object.keys(level.spawnWeights ?? level.itemWeights ?? {dust: 1})[0] ??
    'dust';
  const initialCount = (level.initialMap && level.initialMap.length) || 0;

  return (
    <CardWrap>
      <Top>
        <div>
          <h3>{level.name}</h3>
          <div className="sub">
            Tablero: {level.boardSize?.cols}×{level.boardSize?.rows}
          </div>
        </div>

        <IconWrap>
          <img
            src={COSMIC_ICONS[previewType as keyof typeof COSMIC_ICONS]}
            alt={previewType}
            draggable={false}
          />
        </IconWrap>
      </Top>

      <Body>
        <StatPill>
          Osos máximos: <strong>{level.maxBears ?? 0}</strong> · Prob. oso:{' '}
          <strong>{Math.round((level.bearSpawnRate ?? 0) * 100)}%</strong>
        </StatPill>

        <PlayButton onClick={handlePlay}>Jugar</PlayButton>
      </Body>

      <Footer>Inicial: {initialCount}</Footer>
    </CardWrap>
  );
}
