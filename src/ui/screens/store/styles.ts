import {COLORS} from '@/ui/constants';
import styled from 'styled-components';

export const Container = styled.div`
  color: white;
`;

export const SectionTitle = styled.h3`
  margin: 10px 0 12px 4px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e1d2ff;
  padding: 0 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 16px;
  gap: 14px;
`;

export const Card = styled.div<{locked: boolean}>`
  position: relative;
  background: linear-gradient(
    180deg,
    ${COLORS.tertiaryDark},
    ${COLORS.tertiary}
  );
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  opacity: ${({locked}) => (locked ? 0.45 : 1)};
`;

export const CardIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4px;
`;

export const CardInfo = styled.div`
  h4 {
    font-size: 0.95rem;
    margin: 0;
  }

  p {
    opacity: 0.8;
    font-size: 0.75rem;
    margin: 4px 0;
  }

  .stock {
    margin-top: 4px;
    font-size: 0.75rem;
    opacity: 0.8;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .price {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }
`;

export const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 12px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #ffffffaa;
  font-size: 1.5rem;
`;

export const QuantitySelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin: 10px 0;

  button {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    font-size: 1.3rem;
    color: white;
  }

  span {
    width: 40px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: 700;
  }
`;
