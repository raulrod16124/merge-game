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

export function AbstractShape() {
  return <Shape />;
}
