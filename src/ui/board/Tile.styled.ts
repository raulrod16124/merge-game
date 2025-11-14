// src/ui/board/Tile.styled.ts
import styled from 'styled-components';

export const TileBase = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.empty:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

export const TileEmoji = styled.div`
  font-size: clamp(2.4rem, 7vw, 4.2rem);
  user-select: none;
  transform: translateY(-4px);
  filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.25));
`;
