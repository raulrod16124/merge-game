// src/ui/screens/Levels.styled.ts
import styled from 'styled-components';

export const LevelsWrapper = styled.div`
  min-height: 100dvh;
  background: linear-gradient(180deg, #7cc7ff 0%, #d6efff 100%);
  padding: 2rem 1rem 4rem;
  font-family: 'Fredoka', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    padding-top: 4rem;
  }
`;

export const LevelsTitle = styled.h2`
  font-size: 2.6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  text-align: center;
  margin-bottom: 2rem;
`;

export const LevelsGrid = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  justify-content: center;
  align-items: start;
  gap: 1.5rem;
  padding: 0 1rem;
`;
