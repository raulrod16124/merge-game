import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Container = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const CoinsDisplay = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${COLORS.primary};
  text-align: center;
  margin-bottom: 6px;
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
`;

export const ItemCard = styled.div`
  background: ${COLORS.tertiaryDark};
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ItemTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: ${COLORS.white};
`;

export const ItemDesc = styled.p`
  margin: 0;
  opacity: 0.85;
  font-size: 0.95rem;
`;

export const PriceTag = styled.div`
  padding: 6px 10px;
  border-radius: 10px;
  color: ${COLORS.primary};
  width: fit-content;
  font-size: 0.9rem;
  font-weight: 600;
`;
