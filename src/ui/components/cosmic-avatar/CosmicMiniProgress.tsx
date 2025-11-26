// src/ui/components/cosmic-avatar/CosmicMiniProgress.tsx
import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {computeCosmicProgress} from '@/data/cosmicXP';

const Wrap = styled.div`
  margin-top: 8px;
  text-align: center;
`;

const Label = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  margin-bottom: 4px;
`;

const Bar = styled.div`
  width: 100px;
  height: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 auto;
  overflow: hidden;
`;

const Fill = styled.div<{pct: number}>`
  width: ${({pct}) => pct}%;
  height: 100%;
  background: linear-gradient(90deg, #ffb844, #ffe6b3);
  transition: width 0.3s ease;
`;

export default function CosmicMiniProgress() {
  const progress = usePlayerStore(s => s.cosmicProgress);
  const activeVariant = usePlayerStore(s => s.avatarVariant);
  const variantProgress = progress[activeVariant];

  const xp = variantProgress?.xp ?? 0;
  const level = variantProgress?.level ?? 1;

  const {progressPercent} = computeCosmicProgress(level, xp);

  if (!variantProgress.level) {
    return null;
  }

  return (
    <Wrap>
      <Label>
        Nivel {level} • {progressPercent}%
      </Label>

      <Bar>
        <Fill pct={progressPercent} />
      </Bar>
    </Wrap>
  );
}
