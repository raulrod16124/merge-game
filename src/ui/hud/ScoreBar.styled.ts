import styled from 'styled-components';

export const ScoreAndMovesWrapper = styled.div`
  width: 100%;
  margin-top: 4;
  margin-bottom: 8;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  opacity: 0.85;
  @media (max-width: 768px) {
    align-items: center;
    gap: 30px;
    margin: 10px 20px;
  }
`;
