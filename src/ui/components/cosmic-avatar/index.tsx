import styled from 'styled-components';
import {CosmicAura} from './CosmicAura';
import {CosmicCore} from './CosmicCore';
import {CosmicParticles} from './CosmicParticles';

import {AbstractShape} from './AbstractShape';
import {HumanoidShape} from './HumanoidShape';
import {HybridShape} from './HybridShape';

import type {AvatarVariant} from './types';

const Wrapper = styled.div`
  position: relative;
  width: 180px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  variant?: AvatarVariant;
};

export function CosmicAvatar({variant}: Props) {
  return (
    <Wrapper>
      <CosmicParticles />

      <CosmicAura>
        <CosmicCore />
      </CosmicAura>

      {variant === 'abstract' && <AbstractShape />}
      {variant === 'humanoid' && <HumanoidShape />}
      {variant === 'hybrid' && <HybridShape />}
    </Wrapper>
  );
}
