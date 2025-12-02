// src/ui/components/cosmic-avatar/AbstractShape.tsx
import styled from 'styled-components';
import {breatheAnim} from './styles';

const Shape = styled.div<{color: string}>`
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: ${({color}) =>
    `radial-gradient(circle, ${color}33, ${color}15, transparent)`};
  filter: blur(6px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
  color: string;
}

export function AbstractShape({detail = 0, color}: IProps) {
  return (
    <Shape
      color={color}
      style={{
        opacity: 0.85 + detail * 0.1,
        transform: `scale(${1 + detail * 0.03})`,
      }}
    />
  );
}
