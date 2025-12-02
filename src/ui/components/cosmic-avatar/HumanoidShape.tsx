// src/ui/components/cosmic-avatar/HumanoidShape.tsx
import styled from 'styled-components';
import {breatheAnim} from './styles';

const Body = styled.div<{color: string}>`
  position: absolute;
  width: 70px;
  height: 115px;
  background: ${({color}) => `${color}22`};
  border-radius: 40px;
  top: 28px;
  backdrop-filter: blur(3px);
  ${breatheAnim}
`;

const Head = styled.div<{color: string}>`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({color}) => `${color}33`};
  top: -5px;
  left: 11px;
  backdrop-filter: blur(3px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
  color: string;
}

export function HumanoidShape({detail = 0, color}: IProps) {
  return (
    <>
      <Body
        color={color}
        style={{
          opacity: 0.85 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
      <Head
        color={color}
        style={{
          opacity: 0.9 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
    </>
  );
}
