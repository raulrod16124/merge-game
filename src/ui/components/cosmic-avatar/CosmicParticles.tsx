import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const blink = keyframes`
  0% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.2; transform: scale(0.8); }
`;

const Particle = styled.div<{delay: number; x: number; y: number}>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${COLORS.primary};
  border-radius: 50%;
  opacity: 0.7;
  box-shadow: 0 0 8px ${COLORS.primary};
  animation: ${blink} 2s linear infinite;
  animation-delay: ${({delay}) => delay}s;
  transform: translate(${({x}) => x}px, ${({y}) => y}px);
`;

export function CosmicParticles() {
  const particles = [
    {x: -40, y: -60, delay: 0},
    {x: 50, y: -20, delay: 0.5},
    {x: -10, y: 70, delay: 1},
    {x: -70, y: 10, delay: 1.5},
  ];

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </>
  );
}
