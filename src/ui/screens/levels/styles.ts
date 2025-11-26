import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const LevelsWrapper = styled.div`
  padding: 30px 0;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  /* Fondo cósmico opcional */
  background: radial-gradient(circle at center, #0f0f2d, #000);
`;

export const Title = styled.h2`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 36px);
  color: ${COLORS.white};
  text-align: center;
`;

export const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 18px;
  overflow-y: auto;
  padding: 12px 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
