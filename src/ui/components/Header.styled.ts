// src/ui/components/Header.styled.ts
import styled from 'styled-components';
import {Link} from 'react-router-dom';

export const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
  backdrop-filter: blur(8px);
  z-index: 60;
  box-shadow: 0 6px 18px rgba(8, 28, 42, 0.04);
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Logo = styled.div`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 20px;

  a {
    color: #ffffff;
    text-decoration: none;
  }
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

export const MobileMenuBtn = styled.button`
  display: none;
  background: rgba(20, 60, 80, 0.06);
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 1.8rem;
  color: #ffffff;
  cursor: pointer;

  @media (max-width: 720px) {
    display: block;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(6, 12, 20, 0.45);
  z-index: 58;
`;

export const SidePanel = styled.div<{open: boolean}>`
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #fff, #f7fbff);
  box-shadow: -8px 0 30px rgba(12, 30, 46, 0.12);
  transform: translateX(${p => (p.open ? '0' : '110%')});
  transition: transform 220ms ease-out;
  z-index: 61;
  padding: 18px;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 14px;

  a {
    color: #0b2340;
    text-decoration: none;
    font-weight: 700;
    padding: 10px 6px;
    display: block;
  }
`;
