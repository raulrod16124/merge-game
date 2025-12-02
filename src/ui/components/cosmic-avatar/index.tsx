// src/ui/components/cosmic-avatar/index.tsx
import styled from 'styled-components';
import {CosmicAura} from './CosmicAura';
import {CosmicCore} from './CosmicCore';
import {CosmicParticles} from './CosmicParticles';

import {AbstractShape} from './AbstractShape';
import {HumanoidShape} from './HumanoidShape';
import {HybridShape} from './HybridShape';

import {useUserStore} from '@/state/user-store';
import {usePlayerStore} from '@/state/player-store';
import {COSMIC_EVOLUTION} from '@/data/cosmicEvolution';
import LevelUpBurst from './LevelUpBurst';
import {AvatarVariant, type AvatarAppearance} from './types';

const Wrapper = styled.div<{$width?: string; $height?: string}>`
  position: relative;
  width: ${({$width}) => ($width ? `${$width}px` : '180px')};
  height: ${({$height}) => ($height ? `${$height}px` : '200px')};
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
  forceAppearance?: AvatarAppearance;
  hideProgress?: boolean;
  avatarSize?: {
    width: string;
    height: string;
  };
};

export function CosmicAvatar({
  forceAppearance,
  hideProgress,
  avatarSize,
}: Props) {
  const appearance = useUserStore(s => s.avatar);
  const appearanceReference = forceAppearance ?? appearance;
  const {level} = usePlayerStore(s => s.cosmicProgress);

  // Perfil evolutivo basado SOLO en el nivel
  const evo = COSMIC_EVOLUTION[appearanceReference.shape];
  const profile = evo[level] ?? evo[1];

  return (
    <Wrapper $width={avatarSize?.width} $height={avatarSize?.height}>
      <LevelUpBurst trigger={level} />

      <CosmicParticles
        count={profile.particleCount}
        color={appearanceReference.color}
      />

      <CosmicAura
        color={appearanceReference.color}
        intensity={profile.auraIntensity}>
        <CosmicCore glow={profile.coreGlow} />
      </CosmicAura>

      {appearanceReference.shape === AvatarVariant.ABSTRACT && (
        <AbstractShape
          detail={profile.shapeDetail}
          color={appearanceReference.color}
        />
      )}

      {appearanceReference.shape === AvatarVariant.HUMANOID && (
        <HumanoidShape
          detail={profile.shapeDetail}
          color={appearanceReference.color}
        />
      )}

      {appearanceReference.shape === AvatarVariant.HYBRID && (
        <HybridShape
          detail={profile.shapeDetail}
          color={appearanceReference.color}
        />
      )}

      {!hideProgress && (
        <BadgeWrap>
          <LevelOrb color={appearanceReference.color}>{level}</LevelOrb>
        </BadgeWrap>
      )}
    </Wrapper>
  );
}
