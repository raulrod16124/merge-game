// src/ui/hud/HUD.styled.ts
import styled from 'styled-components';

export const HUDContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  margin-top: 0.8rem;
  margin-bottom: 0.8rem;
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(6px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Fredoka', sans-serif;
`;

export const HUDItem = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 0.85rem;
  color: #333;
`;

export const HUDValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  margin-top: 0.2rem;
`;

export const HUDButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: #ff6b6b;
  color: white;
  font-weight: 700;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    background: #ff4c4c;
  }
`;
