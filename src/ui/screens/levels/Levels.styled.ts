// src/ui/screens/Levels.styled.ts
import styled from 'styled-components';
import {HEADER_HEIGHT} from '../../constants';

export const LevelsWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  height: calc(100dvh - ${HEADER_HEIGHT}px);
  margin: 28px auto;
  padding: 10px 18px;
  box-sizing: border-box;
`;

export const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 18px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
