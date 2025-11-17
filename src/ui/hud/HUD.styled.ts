// src/ui/hud/HUD.styled.ts
import styled from 'styled-components';

export const HUDWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

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
  padding: 12px;
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

export const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const PauseButton = styled.button`
  min-width: 42px;
  height: 42px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: linear-gradient(180deg, #9b7bff, #6b4fdc);
  color: white;
  font-size: 1.4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: 0.18s;
  margin: auto 0;

  &:hover {
    transform: scale(1.06);
  }
`;
