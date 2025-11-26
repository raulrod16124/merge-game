import {COLORS} from '@/ui/constants';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 48px 24px;
  text-align: center;
  min-height: 100dvh;
  background: #0b1220;
  color: ${COLORS.white};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin: 16px 0 8px;
    text-shadow: 0 0 22px rgba(255, 184, 68, 0.22);
  }

  p {
    font-size: 1.2rem;
    opacity: 0.85;
    margin-bottom: 40px;
  }
`;

export const CosmicLogo = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin-bottom: 24px;
`;
