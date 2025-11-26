// src/ui/components/cosmic-avatar/LevelUpBurst.tsx
import styled, {keyframes} from 'styled-components';
import {useEffect, useState} from 'react';

const burst = keyframes`
  0% { transform: scale(0.4); opacity: 0; }
  40% { transform: scale(1.2); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
`;

const Burst = styled.div`
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.6),
    rgba(255, 184, 68, 0.12),
    transparent
  );
  animation: ${burst} 0.9s ease-out forwards;
  pointer-events: none;
  z-index: 1;
`;

export default function LevelUpBurst({trigger}: {trigger: number}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger <= 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, [trigger]);

  return visible ? <Burst /> : null;
}
