import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {computeCosmicProgress} from '@/data/cosmicXP';
import {formatCoins} from '@/utils/formatCoins';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Bar = styled.div`
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  overflow: hidden;
`;

const Fill = styled.div<{pct: number}>`
  height: 100%;
  width: ${p => p.pct}%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffb347, #ffea61);
  transition: width 0.3s ease-out;
`;

export function CosmicXPStatus() {
  const avatarVariant = usePlayerStore(s => s.avatarVariant);
  const progress = usePlayerStore(s => s.cosmicProgress[avatarVariant]);

  const xp = progress?.xp ?? 0;
  const level = progress?.level ?? 1;

  const {progressPercent, nextLevelXP} = computeCosmicProgress(level, xp);

  return (
    <Wrapper>
      <div>
        Nivel cósmico <strong>{level}</strong>
      </div>
      <div>
        XP: <strong>{formatCoins(xp)}</strong>
        {nextLevelXP ? ` / ${formatCoins(nextLevelXP)}` : ''}
      </div>
      <Bar>
        <Fill pct={Math.max(0, Math.min(100, progressPercent))} />
      </Bar>
    </Wrapper>
  );
}
