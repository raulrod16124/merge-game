// src/ui/screens/login/styles.ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  padding: 0 16px;
`;

export const TopBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 18px;
  overflow: hidden;
`;

export const BottomBlock = styled.div`
  padding-bottom: 22px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AvatarPreview = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

export const SelectorGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h3`
  color: white;
  margin-top: 16px;
  margin-bottom: 6px;
  font-size: 1rem;
  opacity: 0.9;
  text-align: center;
`;

export const ColorSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 6px;
`;

export const ColorDot = styled.button<{$color: string; $active: boolean}>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({$color}) => $color};
  border: ${({$active}) => ($active ? '3px solid white' : '2px solid #444')};
  box-shadow: 0 0 10px ${({$color}) => $color}80;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.92);
  }
`;
