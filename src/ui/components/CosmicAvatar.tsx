import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  flex-direction: column;
`;

const Aura = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.5),
    rgba(255, 184, 68, 0.1),
    transparent
  );
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${float} 4s ease-in-out infinite;
`;

const Core = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 60%;
  background: linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryDark});
  box-shadow:
    0 0 18px rgba(255, 184, 68, 0.6),
    0 0 36px rgba(255, 184, 68, 0.4);
`;

const Name = styled.p`
  text-align: center;
  margin-top: 18px;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  opacity: 0.9;
`;

type CosmicAvatarProps = {
  name: string | null;
};

export function CosmicAvatar({name}: CosmicAvatarProps) {
  return (
    <Wrapper>
      <Aura>
        <Core />
      </Aura>
      <Name>{name}</Name>
    </Wrapper>
  );
}
