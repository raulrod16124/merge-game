// src/ui/components/LevelCard.tsx
import type {LevelConfig} from '@/core/typesLevel';
import {emoji} from '../constants';
import {useNavigate} from 'react-router-dom';
import {
  CardWrapper,
  CardHeader,
  CardTitle,
  BoardSizeInfo,
  IconPreview,
  InfoBlock,
  PlayButton,
  FooterInfo,
} from './LevelCard.styled';

type Props = {
  level: LevelConfig;
};

export function LevelCard({level}: Props) {
  const nav = useNavigate();

  const previewType = Object.keys(level.itemWeights)[0] ?? 'bush';
  const initialCount = level.initialMap?.length || 0;

  return (
    <CardWrapper>
      <CardHeader>
        <div>
          <CardTitle>{level.name}</CardTitle>
          <BoardSizeInfo>
            Tablero: {level.boardSize.cols}×{level.boardSize.rows}
          </BoardSizeInfo>
        </div>

        <IconPreview>{emoji(previewType)}</IconPreview>
      </CardHeader>

      <InfoBlock>
        Osos máximos: <strong>{level.maxBears}</strong> · Prob. oso:{' '}
        <strong>{Math.round(level.bearSpawnRate * 100)}%</strong>
      </InfoBlock>

      <PlayButton onClick={() => nav(`/play/${level.id}`)}>Jugar</PlayButton>

      <FooterInfo>Inicial: {initialCount}</FooterInfo>
    </CardWrapper>
  );
}
