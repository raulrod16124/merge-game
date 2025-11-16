// src/ui/components/PowerupPanel.tsx
import styled from 'styled-components';
import {useGameStore} from '@/state/gameStore';

const Wrapper = styled.div`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button<{used: boolean}>`
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: ${({used}) =>
    used ? '#6b6b6b' : 'linear-gradient(180deg,#63f0ff,#00c9f7)'};
  color: ${({used}) => (used ? '#eee' : '#002b33')};
  font-weight: 700;
  font-size: 14px;
  pointer-events: ${({used}) => (used ? 'none' : 'auto')};
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  box-shadow: ${({used}) => (used ? 'none' : '0 6px 0 rgba(0,140,160,0.15)')};

  &:active {
    transform: scale(0.98);
  }
`;

export function PowerupPanel() {
  const activate = useGameStore(s => s.activatePowerup);
  const used = useGameStore(s => s.powerupUsed);

  const handleClick = () => {
    if (!used) activate();
  };

  return (
    <Wrapper>
      <Button used={used} onClick={handleClick} aria-pressed={used}>
        {used ? 'Doblador usado' : 'Doblador Espaciotemporal'}
      </Button>
    </Wrapper>
  );
}
