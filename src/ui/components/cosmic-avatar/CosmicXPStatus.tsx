import styled from 'styled-components';
import {usePlayerStore} from '@/state/player-store';
import {computeCosmicProgress} from '@/data/cosmicXP';
import {formatCoins} from '@/utils/formatCoins';
import {COSMIC_EVOLUTION} from '@/data/cosmicEvolution';

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

const Fill = styled.div<{pct: number; firstColor: string; secondColor: string}>`
  height: 100%;
  width: ${p => p.pct}%;
  border-radius: inherit;
  background: ${p =>
    `linear-gradient(90deg, ${p.firstColor}, ${p.secondColor})`};
  transition: width 0.3s ease-out;
`;

export function CosmicXPStatus() {
  const avatarVariant = usePlayerStore(s => s.avatarVariant);
  const {xp, level} = usePlayerStore(s => s.cosmicProgress[avatarVariant]);

  const {progressPercent, nextLevelXP} = computeCosmicProgress(level, xp);

  const evoBase = COSMIC_EVOLUTION[avatarVariant];

  const profile = evoBase[level] ?? evoBase[1];

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
        <Fill
          pct={Math.max(0, Math.min(100, progressPercent))}
          firstColor={profile.auraColor}
          secondColor={profile.auraColor}
        />
      </Bar>
    </Wrapper>
  );
}
