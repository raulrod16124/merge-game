// src/ui/screens/store/styles.ts
import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Container = styled.div`
  padding: 20px;
  padding-bottom: 120px;
`;

export const SectionTitle = styled.h3`
  margin: 24px 0 14px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${COLORS.primary};
  text-shadow: 0 0 6px rgba(255, 200, 120, 0.3);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  width: 100%;
`;

export const Card = styled.div<{$locked: boolean}>`
  background: linear-gradient(180deg, #1c0f39, #120a2b);
  border: 2.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  position: relative;
  padding: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  transition: 0.2s;

  ${({$locked}) =>
    $locked &&
    `
    opacity: 0.55;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  }
`;

export const CardIcon = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px auto;
  padding: 6px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CardInfo = styled.div`
  text-align: center;
  flex: 1;

  h4 {
    margin: 0;
    margin-bottom: 4px;
    color: #ffffff;
    font-weight: 700;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.75);
  }

  .stock {
    margin-top: 8px;
    font-size: 0.8rem;
    color: ${COLORS.primary};
    font-weight: 700;
  }
`;

export const CardFooter = styled.div`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: #ffffff;
  }
`;

export const QuantitySelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  align-items: center;

  button {
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1.3rem;
    cursor: pointer;
  }

  span {
    font-size: 1.2rem;
    font-weight: bold;
  }
`;
