// src/ui/components/cosmic-avatar/CosmicProfileProgress.tsx
import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {computeCosmicProgress} from '@/data/cosmicXP';

const Wrap = styled.div`
  margin-top: 18px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  color: white;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const Bar = styled.div`
  width: 85%;
  height: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
`;

const Fill = styled.div<{$pct: number}>`
  width: ${({$pct}) => $pct}%;
  height: 100%;
  background: linear-gradient(90deg, #ffb844, #ffe6b3);
  transition: width 0.35s ease;
`;

const XPLabel = styled.div`
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
`;

export default function CosmicProfileProgress() {
  const progress = usePlayerStore(s => s.cosmicProgress);
  const activeVariant = usePlayerStore(s => s.avatarVariant);

  const variantProgress = progress?.[activeVariant];

  const xp = variantProgress?.xp ?? 0;
  const level = variantProgress?.level ?? 1;

  const {progressPercent, currentLevelXP, nextLevelXP} = computeCosmicProgress(
    level,
    xp,
  );

  return (
    <Wrap>
      <Title>Nivel Cósmico {level}</Title>

      <Bar>
        <Fill $pct={progressPercent} />
      </Bar>

      <XPLabel>
        {nextLevelXP
          ? `${xp - currentLevelXP} / ${nextLevelXP - currentLevelXP} XP`
          : `${xp} XP (Nivel Máximo)`}
      </XPLabel>
    </Wrap>
  );
}
