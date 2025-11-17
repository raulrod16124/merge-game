// src/ui/board/GameBoard.styled.ts
import styled from 'styled-components';

export const BoardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
  }
`;

export const BoardContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100%;
  display: flex;
  position: relative;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  background-image: url(${import.meta.env.BASE_URL}boards/map1.png);

  @media (min-width: 900px) {
    border-radius: 22px;
    aspect-ratio: 1 / 1;
    height: auto;
  }
`;

export const Grid = styled.div<{cols: number; rows: number}>`
  display: grid;
  height: 100%;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 0.5fr);
  padding: 4%;
  gap: 0px;
`;

export const FloatingLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;
