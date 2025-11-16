// src/ui/board/GameBoard.styled.ts
import styled from 'styled-components';

export const BoardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

export const BoardContainer = styled.div`
  width: min(92vw, 520px);
  aspect-ratio: 1 / 1;
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 22px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  /* Fondo del tablero */
  background-image: url('/src/assets/boards/map1.png');
`;

export const Grid = styled.div<{cols: number; rows: number}>`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  padding: 4%;
  gap: 0px; /* NO GAP: seamless cosmic-map */

  /* Si quieres ver las celdas para debug:
  outline: 1px solid rgba(255, 255, 255, 0.2); 
  */
`;

export const FloatingLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;
