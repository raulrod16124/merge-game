import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const blink = keyframes`
  0% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.2; transform: scale(0.8); }
`;

const Particle = styled.div<{
  delay: number;
  x: number;
  y: number;
  color: string;
}>`
  position: absolute;
  width: 6px;
  height: 6px;
  background: ${({color}) => (color ? color : COLORS.primary)};
  border-radius: 50%;
  opacity: 0.7;
  box-shadow: 0 0 8px ${({color}) => (color ? color : COLORS.primary)};
  animation: ${blink} 2s linear infinite;
  animation-delay: ${({delay}) => delay}s;
  transform: translate(${({x}) => x}px, ${({y}) => y}px);
`;

interface IProps {
  count: number;
  color: string;
}

export function CosmicParticles({count, color}: IProps) {
  const particles = Array.from({length: count}).map((_, i) => ({
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 160,
    delay: Math.random() * 2,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} delay={p.delay} x={p.x} y={p.y} color={color} />
      ))}
    </>
  );
}
