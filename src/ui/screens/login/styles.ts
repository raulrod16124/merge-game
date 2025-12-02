// src/ui/screens/login/styles.ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 2dvh 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
`;

export const AvatarPreview = styled.div`
  display: flex;
  justify-content: center;
`;

export const SelectorGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h3`
  color: white;
  margin-bottom: 1dvh;
  font-size: 1rem;
  opacity: 0.9;
  text-align: center;
`;

export const ColorSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
`;

export const ColorDot = styled.button<{$color: string; $active: boolean}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({$color}) => $color};
  border: ${({$active}) => ($active ? '3px solid white' : '2px solid #555')};
  box-shadow: 0 0 10px ${({$color}) => $color}80;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.92);
  }
`;
