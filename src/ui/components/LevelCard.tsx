import type {LevelConfig} from '@/core/types';
import {useNavigate} from 'react-router-dom';
import {COSMIC_ICONS} from '@/ui/constants/cosmicData';
import {
  Card,
  Icon,
  Info,
  LevelCardHeader,
  Name,
  Pill,
  PlayBtn,
  Sub,
} from './LevelCard.styled';
import {Button} from '@/common/Button';

export function LevelCard({level}: {level: LevelConfig}) {
  const nav = useNavigate();
  const handlePlay = () => nav(`/play/${level.id}`);

  const previewType = Object.keys(
    level.spawnWeights,
  )[0] as keyof typeof COSMIC_ICONS;
  const objective = level.objective?.[0];

  const objectiveLabel = objective
    ? objective.type === 'score'
      ? `Objetivo: ${objective.target} puntos`
      : objective.type === 'create'
        ? `Crear ${objective.target} × ${objective.subject}`
        : objective.type === 'supernova'
          ? `Generar ${objective.target} supernova`
          : 'Objetivo especial'
    : 'Sin objetivo';

  return (
    <Card onClick={handlePlay}>
      <LevelCardHeader>
        <div>
          <Name>{level.name}</Name>
          <Sub>
            Tablero {level.boardSize.cols}×{level.boardSize.rows}
          </Sub>
        </div>

        <Icon
          src={COSMIC_ICONS[previewType]}
          alt={previewType}
          draggable={false}
        />
      </LevelCardHeader>

      <Info>
        <Pill>Enemigos: {level.enemyCount}</Pill>
        <Pill>{objectiveLabel}</Pill>
      </Info>

      <Button
        variant="secondary"
        styles={{
          marginTop: '14px',
          padding: '10px 14px',
        }}>
        Jugar
      </Button>
    </Card>
  );
}
