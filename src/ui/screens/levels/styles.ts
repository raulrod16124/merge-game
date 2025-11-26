import styled, {keyframes} from 'styled-components';
import {COLORS} from '@/ui/constants';

const drift = keyframes`
  0% { transform: translateY(0px); }
  100% { transform: translateY(-120px); }
`;

export const LevelsWrapper = styled.div`
  padding: 30px 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-x: hidden;

  background: black;

  /* Cielo estrellado animado */
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/cosmic/stars_bg.png');
    opacity: 0.35;
    animation: ${drift} 45s linear infinite;
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/cosmic/nebulosa_bg.png') center/cover no-repeat;
    opacity: 0.12;
    animation: ${drift} 90s linear infinite;
    pointer-events: none;
  }

  @keyframes floatNebula {
    0% {
      transform: translate(-40px, 20px) scale(1);
      opacity: 0.18;
    }
    50% {
      transform: translate(40px, -40px) scale(1.05);
      opacity: 0.28;
    }
    100% {
      transform: translate(-40px, 20px) scale(1);
      opacity: 0.18;
    }
  }

  .nebula {
    position: absolute;
    width: 340px;
    height: 340px;
    background: url('/cosmic/nebulosa_bg.png') center/contain no-repeat;
    opacity: 1;
    animation: floatNebula 40s ease-in-out infinite;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 36px);
  color: ${COLORS.white};
  text-align: center;
`;

export const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 18px;
  overflow-y: auto;
  padding: 12px 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
