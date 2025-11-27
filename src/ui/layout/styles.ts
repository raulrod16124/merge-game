import styled from 'styled-components';
import {COLORS} from '../constants';

export const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;

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
