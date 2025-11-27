// src/ui/components/background/CosmicBackground.tsx
import styled, {keyframes} from 'styled-components';

const fade = keyframes`
  0% { opacity: .2; transform: scale(.95);}
  50% { opacity: .9; transform: scale(1);}
  100% { opacity: .2; transform: scale(.95);}
`;

const twinkle = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const shooting = keyframes`
  0% { transform: translateX(0) translateY(0) scale(0.8); opacity:1; }
  100% { transform: translateX(-600px) translateY(300px) scale(1); opacity:0; }
`;

export const Background = styled.div`
  position: relative;
  min-height: 100vh;
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

/* ★ Estrellas pequeñas */
export const Stars = styled.div`
  position: absolute;
  inset: 0;

  background-image:
    radial-gradient(white 1px, transparent 0),
    radial-gradient(white 1px, transparent 0),
    radial-gradient(white 1.5px, transparent 0);
  background-repeat: repeat;
  background-size:
    4px 4px,
    6px 6px,
    3px 3px;
  background-position:
    0 0,
    20px 50px,
    -10px -20px;

  animation: ${twinkle} 4s ease-in-out infinite;
  opacity: 0.6;
`;

/* ★ Estrella fugaz */
export const ShootingStar = styled.div<{top: number; delay: number}>`
  position: absolute;
  top: ${p => p.top}%;
  right: -10%;
  width: 140px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1),
    rgba(255, 180, 255, 0.2),
    rgba(255, 255, 255, 0)
  );
  border-radius: 50px;
  filter: blur(1px);

  animation: ${shooting} 2.8s ease-out infinite;
  animation-delay: ${p => p.delay}s;
`;

/* ★ Planetas estilo cartoon */
export const Planet = styled.div<{
  size: number;
  top: string;
  left: string;
  color: string;
}>`
  position: absolute;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 50%;
  top: ${p => p.top};
  left: ${p => p.left};
  background: ${p => p.color};
  box-shadow: 0 0 40px ${p => p.color}60;
  filter: blur(0.5px);

  animation: ${fade} 6s ease-in-out infinite;
`;
