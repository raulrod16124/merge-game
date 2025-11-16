// src/ui/components/HUD.styled.ts
import styled from 'styled-components';

export const Bar = styled.div`
  height: 68px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  padding: 0 18px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const SideText = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.85;
`;

export const CenterNext = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NextInner = styled.div`
  font-size: 34px;
  transform: translateY(2px);
`;

export const TimerWrapper = styled.div`
  width: 100%;
  padding: 8px 0;
`;
