// src/ui/screens/edit-avatar/styles.ts
import styled from 'styled-components';

export const PageContent = styled.div`
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const PreviewArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0;
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
  opacity: 0.9;
`;

export const ShapeSelector = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const ColorSelector = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 8px;
`;

export const ColorDot = styled.button<{$color: string; $active: boolean}>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: ${({$active}) => ($active ? '3px solid white' : '2px solid #444')};
  background: ${({$color}) => $color};
  box-shadow: 0 0 10px ${({$color}) => $color}80;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.92);
  }
`;
