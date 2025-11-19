// src/ui/board/GameBoard.styled.ts
import styled from 'styled-components';

export const BoardWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const BoardContainer = styled.div`
  position: relative;
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
  width: var(--vw);
  height: calc(var(--vh) - 220px);
  overflow: hidden;
  display: grid;

  grid-template-columns: repeat(
    ${p => p.cols},
    calc(var(--vw) / ${p => p.cols})
  );
  grid-template-rows: repeat(
    ${p => p.rows},
    calc(var(--vh) / ${p => p.rows} - 36px)
  );
  border: 1px solid green;
`;

export const FloatingLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;
