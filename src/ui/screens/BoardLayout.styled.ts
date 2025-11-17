import styled from 'styled-components';

const HEADER_HEIGHT = 72;

export const BoardScreenWrapper = styled.div`
  height: calc(100vh - ${HEADER_HEIGHT}px);
  display: flex;
  flex-direction: column;
  overflow: hidden;

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

  @media (min-width: 900px) {
    width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const BoardColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  @media (min-width: 900px) {
    padding-right: 24px;
  }
`;
