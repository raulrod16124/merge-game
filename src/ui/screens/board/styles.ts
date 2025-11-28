// src/ui/screens/BoardScreen.styled.ts
import styled from 'styled-components';

export const BoardScreenWrapper = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;

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
  height: calc(20dvh - 2dvh);
  max-height: calc(20dvh - 2dvh);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 2dvh 18px 0 18px;
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
  height: 70dvh;
  max-height: 70dvh;
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (min-width: 900px) {
    padding-right: 24px;
  }
`;
