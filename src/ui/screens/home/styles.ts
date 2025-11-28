// src/ui/screens/home/styles.ts
import {COLORS} from '@/ui/constants';
import styled, {keyframes} from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  position: relative;
  min-height: 100dvh;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 40% 20%,
      rgba(255, 145, 255, 0.25) 0%,
      rgba(120, 0, 180, 0.18) 30%,
      transparent 60%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 100, 180, 0.35) 0%,
      rgba(120, 0, 180, 0.15) 40%,
      transparent 70%
    ),
    radial-gradient(
      circle at center,
      #0d0433 0%,
      #120444 35%,
      #15024d 60%,
      #08001a 100%
    );

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

/* Top header */
export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 18px 8px;
  z-index: 30;
`;

export const TopLeft = styled.div`
  display: flex;
  align-items: center;

  .header-coin {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 6px 10px;
    color: ${COLORS.primary};
    border: 1px solid rgba(255, 255, 255, 0.04);
    font-weight: 700;
    font-size: 1rem;
    backdrop-filter: blur(6px);
  }
`;

export const TopRight = styled.div`
  display: flex;
  gap: 10px;
  button {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

/* central content */
export const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10dvh 20px 96px; /* leave room for tab bar */
  gap: 18px;
`;

export const AvatarWrap = styled.div`
  width: 220px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${fadeIn} 500ms ease both;

  background: radial-gradient(
    circle,
    rgba(10, 0, 20, 0.75) 0%,
    rgba(10, 0, 20, 0.55) 60%,
    rgba(10, 0, 20, 0) 100%
  );

  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.6),
    0 0 90px rgba(60, 0, 90, 0.5);

  border-radius: 50%;
`;

/* greeting */
export const Greeting = styled.div`
  text-align: center;
  color: #fff;
  margin-top: 8px;

  .sub {
    display: block;
    opacity: 0.9;
    font-size: 0.9rem;
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.85);
  }
`;

export const UserName = styled.div`
  font-size: 1.15rem;
  margin-bottom: 4px;
`;

/* Play button area */
export const PlayButtonWrap = styled.div`
  width: 50%;
  max-width: 420px;
  margin-top: 18px;
  animation: ${fadeIn} 450ms ease 120ms both;
  border-radius: 20p;
`;

/* floating buttons to the right */
export const FloatingButtons = styled.div`
  position: fixed;
  right: 14px;
  top: 2dvh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 50;
`;

export const FloatingButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03),
    rgba(0, 0, 0, 0.12)
  );
  border: 2px solid ${COLORS.secondary};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  color: white;
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
