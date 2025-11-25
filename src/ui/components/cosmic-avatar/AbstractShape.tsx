import styled from 'styled-components';
import {breatheAnim} from './styles';

const Shape = styled.div`
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.22),
    rgba(255, 184, 68, 0.07),
    transparent
  );
  filter: blur(6px);
  ${breatheAnim}
`;

interface IProps {
  detail?: number;
}

export function AbstractShape({detail = 0}: IProps) {
  return (
    <Shape
      style={{
        opacity: 0.85 + detail * 0.1,
        transform: `scale(${1 + detail * 0.03})`,
      }}
    />
  );
}
