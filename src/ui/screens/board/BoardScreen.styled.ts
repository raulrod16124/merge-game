// src/ui/screens/BoardScreen.styled.ts
import styled from 'styled-components';

export const BoardScreenWrapper = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;

  background-size: cover;
  background-position: center;
  background-image: url(${import.meta.env.BASE_URL}boards/map1.png);

  overflow-x: hidden;
  overflow-y: auto;

  @media (min-width: 900px) {
    flex-direction: row;
    justify-content: center;
    gap: 32px;
  }
`;

export const HUDColumn = styled.div`
  width: 100%;
  padding: 12px 18px;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (min-width: 900px) {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const BoardColumn = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (min-width: 900px) {
    padding-right: 24px;
  }
`;
