// src/ui/components/Header.styled.ts
import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const HeaderBar = styled.header`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  z-index: 60;

  background: linear-gradient(
    180deg,
    rgba(28, 40, 75, 0.38),
    rgba(20, 28, 50, 0.15)
  );
  backdrop-filter: blur(10px);

  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.25);
`;

export const Logo = styled.div`
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 22px;

  a {
    color: #ffffff;
    text-decoration: none;
  }

  text-shadow: 0 0 12px rgba(147, 110, 255, 0.45);
`;

export const MobileMenuBtn = styled.button`
  display: none;
  background: rgba(147, 110, 255, 0.1);
  border: 1px solid rgba(147, 110, 255, 0.25);
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 1.8rem;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background: rgba(147, 110, 255, 0.18);
  }

  @media (max-width: 720px) {
    display: block;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(6, 12, 20, 0.55);
  backdrop-filter: blur(4px);
  z-index: 58;
`;

export const SidePanel = styled.div<{open: boolean}>`
  position: fixed;
  top: 0;
  right: 0;
  width: 270px;
  height: 100vh;
  z-index: 61;
  padding: 24px 20px;

  background: linear-gradient(
    180deg,
    rgba(75, 55, 145, 0.95),
    rgba(36, 26, 85, 0.95)
  );
  backdrop-filter: blur(7px);

  border-left: 2px solid rgba(180, 160, 255, 0.28);
  box-shadow: -6px 0 25px rgba(0, 0, 0, 0.35);

  transform: translateX(${p => (p.open ? '0' : '110%')});
  transition: transform 240ms cubic-bezier(0.3, 0.7, 0.2, 1.1);

  display: flex;
  flex-direction: column;
  gap: 28px;

  /* glow interior */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      at 30% 20%,
      rgba(255, 185, 80, 0.15),
      transparent 60%
    );
  }
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 18px;

  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 700;
    padding: 12px 6px;
    display: block;
    font-size: 1.1rem;
    letter-spacing: 0.5px;

    border-radius: 10px;
    transition: background 0.15s ease-out;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const NavPill = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  text-decoration: none;
  color: #0b2340;
  background: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  margin-right: 8px;

  @media (max-width: 720px) {
    display: none;
  }
`;
