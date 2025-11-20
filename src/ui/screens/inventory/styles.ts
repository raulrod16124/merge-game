// src/ui/screens/inventory/styles.ts

import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Container = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${COLORS.white};
  overflow-y: auto;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const BackButton = styled.button`
  background: ${COLORS.tertiaryDark};
  border: none;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;

export const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${COLORS.primary};
  text-align: center;
  margin: 20px 0 6px;
`;

export const Subtitle = styled.p`
  opacity: 0.8;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 24px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const ItemBox = styled.div`
  background: ${COLORS.tertiaryDark};
  border-radius: 16px;
  padding: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  svg {
    color: ${COLORS.white};
  }
`;

export const Badge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${COLORS.primary};
  color: #1a1a1a;
  font-weight: 900;
  font-size: 0.75rem;
  padding: 4px 6px;
  border-radius: 50%;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyMessage = styled.div`
  margin-top: 40px;
  text-align: center;
  opacity: 0.8;
  line-height: 1.35;
`;
