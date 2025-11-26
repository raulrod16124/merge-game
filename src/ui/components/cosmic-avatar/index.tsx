// src/ui/components/cosmic-avatar/index.tsx
import styled from 'styled-components';
import {CosmicAura} from './CosmicAura';
import {CosmicCore} from './CosmicCore';
import {CosmicParticles} from './CosmicParticles';

import {AbstractShape} from './AbstractShape';
import {HumanoidShape} from './HumanoidShape';
import {HybridShape} from './HybridShape';

import {usePlayerStore} from '@/state/player-store';
import {COSMIC_EVOLUTION} from '@/data/cosmicEvolution';
import {computeCosmicProgress} from '@/data/cosmicXP';
import LevelUpBurst from './LevelUpBurst';

const Wrapper = styled.div`
  position: relative;
  width: 180px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* Badge / ring styles */
const BadgeWrap = styled.div`
  position: absolute;
  right: -6px;
  top: -6px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  pointer-events: none;
`;

const Ring = styled.svg`
  transform: rotate(-90deg);
  width: 48px;
  height: 48px;
`;

const LevelNumber = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(10, 10, 12, 0.9);
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  z-index: 41;
  pointer-events: none;
`;

/* Small XP text under badge on hover is shown via title attribute (keeps it simple) */

type Props = {
  hideProgress?: boolean;
};

export function CosmicAvatar({hideProgress}: Props) {
  const progress = usePlayerStore(s => s.cosmicProgress);
  const activeVariant = usePlayerStore(s => s.avatarVariant);
  const variantProgress = progress[activeVariant];

  const xp = variantProgress?.xp ?? 0;
  const level = variantProgress?.level ?? 1;

  const profile =
    COSMIC_EVOLUTION[activeVariant]?.[level] ??
    COSMIC_EVOLUTION[activeVariant]?.[1];

  const {progressPercent, nextLevelXP} = computeCosmicProgress(level, xp);

  // circle ring params
  const R = 20;
  const C = 2 * Math.PI * R;
  const pct = Math.max(0, Math.min(100, progressPercent));
  const dash = (C * pct) / 100;

  const title = nextLevelXP
    ? `Nivel ${level} — XP ${xp} / ${nextLevelXP}`
    : `Nivel ${level} — XP ${xp} (máximo)`;

  return (
    <Wrapper>
      <LevelUpBurst trigger={level} />
      <CosmicParticles
        count={profile.particleCount}
        color={profile.auraColor}
      />

      <CosmicAura color={profile.auraColor} intensity={profile.auraIntensity}>
        <CosmicCore glow={profile.coreGlow} />
      </CosmicAura>

      {activeVariant === 'abstract' && (
        <AbstractShape detail={profile.shapeDetail} />
      )}
      {activeVariant === 'humanoid' && (
        <HumanoidShape detail={profile.shapeDetail} />
      )}
      {activeVariant === 'hybrid' && (
        <HybridShape detail={profile.shapeDetail} />
      )}

      {/* Badge + ring */}
      {!hideProgress && (
        <BadgeWrap title={title}>
          <Ring viewBox="0 0 48 48" aria-hidden>
            <defs />
            <g fill="none" strokeWidth="3" strokeLinecap="round">
              {/* background circle */}
              <circle cx="24" cy="24" r={R} stroke="rgba(255,255,255,0.06)" />
              {/* progress */}
              <circle
                cx="24"
                cy="24"
                r={R}
                stroke="url(#grad)"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset="0"
              />
              <defs>
                <linearGradient id="grad" x1="0" x2="1">
                  <stop
                    offset="0%"
                    stopColor={profile.auraColor}
                    stopOpacity="1"
                  />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </g>
          </Ring>
          <LevelNumber>{level}</LevelNumber>
        </BadgeWrap>
      )}
    </Wrapper>
  );
}
