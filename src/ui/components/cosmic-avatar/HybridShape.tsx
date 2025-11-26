import styled from 'styled-components';
import {breatheAnim} from './styles';

const Glow = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.16),
    rgba(255, 184, 68, 0.05),
    transparent
  );
  filter: blur(10px);
  ${breatheAnim}
`;

const Torso = styled.div`
  position: absolute;
  width: 85px;
  height: 125px;
  border-radius: 40% 40% 50% 50%;
  background: rgba(255, 255, 255, 0.07);
  top: 18px;
  backdrop-filter: blur(4px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
}

export function HybridShape({detail = 0}: IProps) {
  return (
    <>
      <Glow
        style={{
          opacity: 0.85 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
      <Torso
        style={{
          opacity: 0.9 + detail * 0.1,
          transform: `scale(${1 + detail * 0.03})`,
        }}
      />
    </>
  );
}
