// src/ui/screens/BoardScreen.styled.ts
import styled from 'styled-components';

export const ScreenWrapper = styled.div`
  width: 100%;
  min-height: 100dvh;
  background: linear-gradient(180deg, #84c8ff 0%, #dff3ff 100%);
  padding-bottom: 2rem;
  font-family: 'Fredoka', sans-serif;
`;

export const BoardSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const BoardLimiter = styled.div`
  width: 95%;
  max-width: 980px;
  display: flex;
  justify-content: center;
`;
