// src/ui/board/Tile.styled.ts
import styled from 'styled-components';

export const TileBase = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;

  border-radius: 14px;
  position: relative;

  transition:
    background 0.15s ease-out,
    transform 0.15s ease-out;

  &.empty:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  & img {
    width: 80%;
    height: 90%;
    object-fit: contain;
    filter: drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.35));
    pointer-events: none;
  }

  @media (min-width: 740px) {
    & img {
      width: 82%;
      height: 82%;
    }
  }
`;

export const TilePlaceholder = styled.div`
  opacity: 0.12;
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  user-select: none;
`;
