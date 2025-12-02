// src/ui/components/cosmic-avatar/HybridShape.tsx
import styled from 'styled-components';
import {breatheAnim} from './styles';

const Glow = styled.div<{color: string}>`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${({color}) =>
    `radial-gradient(circle, ${color}29, ${color}14, transparent)`};
  filter: blur(10px);
  ${breatheAnim}
`;

const Torso = styled.div<{color: string}>`
  position: absolute;
  width: 85px;
  height: 125px;
  border-radius: 40% 40% 50% 50%;
  background: ${({color}) => `${color}20`};
  top: 18px;
  backdrop-filter: blur(4px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
  color: string;
}

export function HybridShape({detail = 0, color}: IProps) {
  return (
    <>
      <Glow
        color={color}
        style={{
          opacity: 0.85 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
      <Torso
        color={color}
        style={{
          opacity: 0.9 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
    </>
  );
}
