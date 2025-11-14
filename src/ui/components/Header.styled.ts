import styled from 'styled-components';

export const HeaderWrapper = styled.header<{isFixed: boolean}>`
  padding: 0.7rem 1rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(6px);
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Fredoka', sans-serif;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  z-index: 60;
  @media (max-width: 768px) {
    position: ${({isFixed}) => (isFixed ? 'fixed' : 'static')};
    right: 1rem;
    left: 1rem;
  }
`;

export const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: #245b9e;
  user-select: none;
`;

export const MenuButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: none;
  background: #fff;
  box-shadow: 0px 6px 14px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
`;

export const Overlay = styled.div<{open: boolean}>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  opacity: ${({open}) => (open ? 1 : 0)};
  pointer-events: ${({open}) => (open ? 'auto' : 'none')};
  transition: opacity 220ms ease;
  z-index: 90;
`;

export const SideMenu = styled.aside<{open: boolean}>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 300px;
  max-width: 92vw;
  background: linear-gradient(180deg, #ffffff, #f6f9ff);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.18);
  padding: 1.25rem;
  transform: ${({open}) => (open ? 'translateX(0%)' : 'translateX(110%)')};
  transition: transform 280ms cubic-bezier(0.2, 0.9, 0.3, 1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

/* items del menu */
export const MenuLink = styled.button`
  background: transparent;
  border: none;
  text-align: left;
  font-size: 1rem;
  padding: 0.6rem 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  color: #1f2b46;
  font-weight: 700;

  &:hover {
    background: rgba(34, 90, 160, 0.06);
  }
`;
