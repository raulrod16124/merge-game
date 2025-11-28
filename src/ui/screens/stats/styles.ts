import styled from 'styled-components';

export const StatsSection = styled.div`
  margin-top: 24px;
  padding: 20px 16px;
  border-radius: 18px;

  background: linear-gradient(180deg, #2a1452, #180a33);
  border: 2px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);

  h3 {
    margin: 14px 0 10px;
    color: #ffdaff;
    font-weight: 800;
    text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
  }
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.12);

  &:last-child {
    border-bottom: none;
  }
`;

export const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

export const StatValue = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffdd55;
`;
