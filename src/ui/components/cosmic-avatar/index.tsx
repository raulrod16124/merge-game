// src/ui/components/cosmic-avatar/index.tsx
import styled from 'styled-components';
import {CosmicAura} from './CosmicAura';
import {CosmicCore} from './CosmicCore';
import {CosmicParticles} from './CosmicParticles';

import {AbstractShape} from './AbstractShape';
import {HumanoidShape} from './HumanoidShape';
import {HybridShape} from './HybridShape';

import {usePlayerStore} from '@/state/player-store';
import {useUserStore} from '@/state/user-store';
import {COSMIC_EVOLUTION} from '@/data/cosmicEvolution';
import {computeCosmicProgress} from '@/data/cosmicXP';
import LevelUpBurst from './LevelUpBurst';
import {AvatarVariant} from './types';

const Wrapper = styled.div`
  position: relative;
  width: 180px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 25px rgba(255, 200, 90, 0.4));
`;

const BadgeWrap = styled.div`
  position: absolute;
  right: -4px;
  top: -4px;
  width: 48px;
  height: 48px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const LevelOrb = styled.div<{color: string}>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({color}) =>
    `radial-gradient(circle at 50% 45%, ${color}, rgba(10,10,20,0.6))`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow:
    0 0 8px ${({color}) => color},
    0 0 8px ${({color}) => color} inset,
    0 0 3px rgba(255, 255, 255, 0.35);
  pointer-events: none;
  animation: pulseOrb 3s infinite ease-in-out;

  @keyframes pulseOrb {
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px ${({color}) => color};
    }
    50% {
      transform: scale(1.07);
      box-shadow: 0 0 16px ${({color}) => color};
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px ${({color}) => color};
    }
  }
`;

type Props = {
  variant?: AvatarVariant; // Forzar variante manualmente
  forceVariant?: AvatarVariant; // Para animaciones / transiciones
  hideProgress?: boolean;
};

export function CosmicAvatar({variant, forceVariant, hideProgress}: Props) {
  // Obtener variante oficial del avatar cósmico
  const finalVariant =
    forceVariant ?? variant ?? usePlayerStore(s => s.avatarVariant);

  // Progreso oficial del avatar
  const {xp, level} = usePlayerStore(s => s.cosmicProgress[finalVariant]);

  const evoBase =
    COSMIC_EVOLUTION[finalVariant] || COSMIC_EVOLUTION[AvatarVariant.HYBRID];

  const profile = evoBase[level] ?? evoBase[1];

  const {nextLevelXP} = computeCosmicProgress(level, xp);

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

      {finalVariant === AvatarVariant.ABSTRACT && (
        <AbstractShape detail={profile.shapeDetail} />
      )}
      {finalVariant === AvatarVariant.HUMANOID && (
        <HumanoidShape detail={profile.shapeDetail} />
      )}
      {finalVariant === AvatarVariant.HYBRID && (
        <HybridShape detail={profile.shapeDetail} />
      )}

      {!hideProgress && (
        <BadgeWrap title={title}>
          <LevelOrb color={profile.auraColor}>{level}</LevelOrb>
        </BadgeWrap>
      )}
    </Wrapper>
  );
}
