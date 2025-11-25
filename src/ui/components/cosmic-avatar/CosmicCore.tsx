import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const pulse = keyframes`
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.06); filter: brightness(1.15); }
  100% { transform: scale(1); filter: brightness(1); }
`;

const Core = styled.div`
  width: 75px;
  height: 75px;
  border-radius: 60%;
  background: linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryDark});
  box-shadow:
    0 0 20px rgba(255, 184, 68, 0.5),
    0 0 40px rgba(255, 184, 68, 0.2);
  animation: ${pulse} 4s ease-in-out infinite;
`;

export function CosmicCore({glow}: {glow: number}) {
  return (
    <Core
      style={{
        boxShadow: `
          0 0 ${25 * glow}px rgba(255,184,68,0.6),
          0 0 ${40 * glow}px rgba(255,184,68,0.3)
        `,
      }}
    />
  );
}
