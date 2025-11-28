// src/ui/screens/inventory/styles.ts
import {COLORS} from '@/ui/constants';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  color: white;
`;

export const Subtitle = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  color: #ffdaff;
  font-size: 1.1rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 18px;
  justify-items: center;
`;

export const ItemCard = styled.div`
  width: 150px;
  background: linear-gradient(180deg, #1b1038, #120a2a);
  border-radius: 18px;
  padding-top: 14px;
  position: relative;
  text-align: center;
  border: 2px solid ${COLORS.primaryDark};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }
`;

export const IconWrap = styled.div`
  width: 85px;
  height: 85px;
  margin: 0 auto 8px auto;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 85px;
    height: 85px;
    object-fit: contain;
  }
`;

export const ItemName = styled.div`
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

export const ItemDescription = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  min-height: 32px;
  margin-bottom: 10px;
`;

export const QuantityBanner = styled.div`
  background: ${COLORS.primary};
  width: 100%;
  padding: 6px 0;
  border-radius: 0 0 16px 16px;
  color: #3d2800;
  font-size: 1.2rem;
  font-weight: 800;
  margin-top: 10px;
`;

export const EmptyMessage = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: 0.8;
  line-height: 1.35;
`;
