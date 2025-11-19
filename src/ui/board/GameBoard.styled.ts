// src/ui/board/GameBoard.styled.ts
import styled from 'styled-components';

export const BoardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const BoardContainer = styled.div`
  width: 100%;
  height: 100%;

  aspect-ratio: 1/1;
  max-width: 100%;
  max-height: 100%;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  background-size: cover;
  background-position: center;
  overflow: hidden;
  background-image: url(${import.meta.env.BASE_URL}boards/map1.png);
`;

export const Grid = styled.div<{cols: number; rows: number}>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-columns: repeat(${p => p.cols}, 1fr);
  grid-template-rows: repeat(${p => p.rows}, 1fr);
`;

export const FloatingLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;
