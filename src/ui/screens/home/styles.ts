import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

export const Container = styled.div`
  padding: 24px;
  height: calc(100% - 50px);
  min-height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  color: ${COLORS.white};
  position: relative;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .coins {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 1.2rem;
    font-weight: 700;
    background-color: transparent;
    border: none;
    color: ${COLORS.primary};
    svg {
      color: ${COLORS.primary};
    }
  }
`;

export const IconButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background: ${COLORS.tertiaryDark};
    border-radius: 14px;
    padding: 10px 12px;
    border: none;
    cursor: pointer;
    color: ${COLORS.white};
    transition: 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

    svg {
      stroke-width: 2.4;
    }

    &:hover {
      background: ${COLORS.tertiary};
      transform: translateY(-2px);
    }
  }
`;

export const HeroArea = styled.div`
  margin-top: 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const GlowBackground = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  top: -40px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 184, 68, 0.18),
    rgba(255, 184, 68, 0.05),
    transparent
  );
  filter: blur(26px);
`;

export const Greeting = styled.div`
  margin-top: 18px;
  text-align: center;
  font-size: 1.2rem;

  strong {
    font-weight: 700;
    color: ${COLORS.primary};
  }

  .sub {
    display: block;
    margin-top: 4px;
    opacity: 0.75;
    font-size: 0.85rem;
  }
`;

export const PlayArea = styled.div`
  margin-top: auto;
  width: 100%;
`;
