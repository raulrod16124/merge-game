// src/ui/components/PowerupPanel.tsx
import styled from 'styled-components';
import {useGameStore} from '@/state/game-store';

const Wrapper = styled.div`
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
`;

const CosmicButton = styled.button<{used: boolean}>`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: ${({used}) => (used ? 'default' : 'pointer')};
  background: ${({used}) =>
    used
      ? 'rgba(140, 140, 140, 0.5)'
      : 'linear-gradient(180deg, #a77bff, #6d4aff)'};
  color: ${({used}) => (used ? '#ddd' : '#f9f8ff')};
  font-weight: 700;
  font-size: 14px;
  pointer-events: ${({used}) => (used ? 'none' : 'auto')};
  transition: all 0.15s ease;
  box-shadow: ${({used}) =>
    used ? 'none' : '0 0 12px rgba(120, 70, 255, 0.35)'};

  &:hover {
    transform: ${({used}) => (used ? 'none' : 'translateY(-1px)')};
  }

  &:active {
    transform: ${({used}) => (used ? 'none' : 'scale(0.97)')};
  }
`;

export function PowerupPanel() {
  const activatePowerup = useGameStore(s => s.activatePowerup);
  const used = useGameStore(s => s.powerupUsed);

  const handleClick = () => {
    if (!used) activatePowerup();
  };

  return (
    <Wrapper>
      <CosmicButton used={used} onClick={handleClick}>
        {used ? 'Doblador Usado' : 'Doblador Espaciotemporal'}
      </CosmicButton>
    </Wrapper>
  );
}
