import styled from 'styled-components';
import {COLORS} from '../constants';

export const Wrapper = styled.div<{$secondaryBg?: boolean}>`
  position: relative;
  min-height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;

  background: ${({$secondaryBg}) =>
    $secondaryBg &&
    'radial-gradient(circle at 40% 20%,rgba(255, 145, 255, 0.2),transparent 55%),radial-gradient(circle at 75% 65%,rgba(120, 0, 180, 0.18),transparent 60%), linear-gradient(180deg, #19042b 0%, #10001b 60%, #05000a 100%)'};
  background: ${({$secondaryBg}) =>
    !$secondaryBg &&
    'radial-gradient(circle at 40% 20%,rgba(255, 145, 255, 0.25) 0%,rgba(120, 0, 180, 0.18) 30%,transparent 60%),radial-gradient(circle at 70% 60%,rgba(255, 100, 180, 0.35) 0%,rgba(120, 0, 180, 0.15) 40%,transparent 70%),radial-gradient(circle at center,#0d0433 0%,#120444 35%,#15024d 60%,#08001a 100%)'};
`;

export const Header = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  margin-bottom: 8px;

  h2 {
    margin: 0;
    color: ${COLORS.primary};
    font-size: 1.4rem;
    font-weight: 800;
  }
`;

export const BackButton = styled.button`
  background: ${COLORS.tertiaryDark};
  border: none;
  padding: 10px 10px;
  border-radius: 12px;
  cursor: pointer;
  color: ${COLORS.white};
  transition: 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${COLORS.tertiary};
    transform: translateY(-2px);
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/* bottom tab bar */
export const TabBar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(12dvh + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02),
    rgba(0, 0, 0, 0.28)
  );
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  z-index: 40;
  backdrop-filter: blur(8px);
`;

export const TabItem = styled.button<{$active?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: ${({$active}) => ($active ? COLORS.secondary : 'transparent')};
  padding: 2dvh 0;
  color: ${({$active}) => ($active ? COLORS.tertiary : COLORS.white)};
  width: 100%;
  height: 100%;
  font-size: 0.85rem;
  font-weight: 600;
  border: ${({$active}) =>
    $active ? 'none' : `1px solid ${COLORS.secondary}`};

  &:nth-child(1) {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  &:nth-child(5) {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;
