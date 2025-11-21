// src/ui/hud/HUD.styled.ts
import styled from 'styled-components';
import {COLORS} from '../constants';

export const HUDWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 18px;
  background-color: ${COLORS.tertiary};

  /* DESKTOP */
  .desktop {
    display: none;
  }

  @media (min-width: 768px) {
    .desktop {
      display: flex;
      flex-direction: column;
      background-color: ${COLORS.tertiaryDark};
      border-radius: 18px;
      padding: 20px;
      width: 220px;
      backdrop-filter: blur(10px);
      gap: 20px;
    }

    /* MobileStack oculto en desktop */
    > div:first-child {
      display: none;
    }
  }
`;

export const MobileStack = styled.div`
  padding: 1dvh 0;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  width: 90%;
  gap: 10px;
  align-items: center;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const RightContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
