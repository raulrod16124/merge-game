import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

const Shape = styled.div`
  position: absolute;
  width: 110px;
  height: 140px;
  border-radius: 40% 40% 50% 50%;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(4px);
  top: 10px;
`;

export function CosmicSilueta() {
  return <Shape />;
}
