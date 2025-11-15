// src/ui/board/GameBoard.styled.ts
import styled from 'styled-components';
import greenland from '@/assets/board/greenland.png';

export const BoardScreenWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: linear-gradient(180deg, #7cc7ff 0%, #cfeeff 100%);
  padding: 1rem 1rem 3rem;
  font-family: 'Fredoka', sans-serif;
`;

export const MapContainer = styled.div`
  width: 100%;
  max-width: 780px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url(${greenland});
  background-size: cover;
  background-position: center;
  border-radius: 28px;
  box-shadow: 0px 12px 25px rgba(0, 0, 0, 0.25);

  padding: 1rem;

  @media (min-width: 480px) {
    max-width: 900px;
  }
`;

export const GridOverlay = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 0;
`;

export const CellLayer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15);
`;
