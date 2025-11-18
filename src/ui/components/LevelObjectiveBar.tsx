import styled from 'styled-components';
import {useGameStore} from '../../state/game-store';
import {Trophy} from 'lucide-react';
import {COSMIC_TEXT} from '../constants';

const Bar = styled.div`
  width: 100%;
  padding: 10px 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(6px);
`;

const Icon = styled.img`
  width: 34px;
  height: 34px;
  object-fit: contain;
`;

const Text = styled.div`
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
`;

export function LevelObjectiveBar() {
  const {currentLevel, createdCounts, score} = useGameStore();

  if (!currentLevel) return null;

  const obj = currentLevel.objective;

  if (!obj) return null;

  // Detect type of objective
  let label = '';
  let icon = '';

  const subject = obj[0].subject;
  const target = obj[0].target;
  const type = obj[0].type;

  if (type === 'score') {
    label = `Alcanza ${target} puntos  (${score}/${target})`;
  } else if (type === 'create') {
    const created = createdCounts[subject!] ?? 0;
    // @ts-ignore
    label = `Crea ${target} ${COSMIC_TEXT[subject]} (${created}/${target})`;
    icon = `${import.meta.env.BASE_URL}cosmic/${subject!}.png`;
  }

  return (
    <Bar>
      {icon ? <Icon src={icon} alt="" /> : <Trophy size={20} color="#fff" />}
      <Text>{label}</Text>
    </Bar>
  );
}
