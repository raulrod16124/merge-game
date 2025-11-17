// src/ui/hud/HUD.styled.ts
import styled from 'styled-components';
import {COLORS} from '../constants';

export const HUDWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* DESKTOP */
  .desktop {
    display: none;
  }

  @media (min-width: 768px) {
    .desktop {
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 20px;
      width: 220px;
      backdrop-filter: blur(10px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      gap: 20px;
    }

    /* MobileStack oculto en desktop */
    > div:first-child {
      display: none;
    }
  }
`;

export const MobileStack = styled.div`
  width: 100%;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const HUDPauseButton = styled.button`
  background: ${COLORS.tertiary};
  border: 2px solid ${COLORS.secondary};
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(6px);
  cursor: pointer;

  transition: all 0.2s ease;

  &:active {
    transform: scale(0.92);
  }
`;
