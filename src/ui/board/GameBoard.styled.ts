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
`;

export const ItemsLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 30;
`;

export const Grid = styled.div<{$cols: number; $rows: number}>`
  width: var(--vw);
  height: calc(var(--vh) - 20dvh);
  margin-top: 15dvh;
  overflow: hidden;
  display: grid;

  grid-template-columns: repeat(
    ${p => p.$cols},
    calc(var(--vw) / ${p => p.$cols})
  );
  grid-template-rows: repeat(
    ${p => p.$rows},
    calc(var(--vh) / ${p => p.$rows} - 6vh)
  );
`;

export const FloatingLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;
