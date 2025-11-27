// src/ui/screens/levels/styles.ts
import styled, {keyframes} from 'styled-components';

/* ==== Fondo espacial cartoon ==== */
export const LevelsWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;
  padding: 40px 0; /* menos padding top para ver más niveles */
  overflow-y: auto;
  overflow-x: hidden;

  /* Ocultar scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  padding-bottom: 90px; /* evita huecos excesivos al final */

  background:
    radial-gradient(
      circle at 40% 20%,
      rgba(255, 145, 255, 0.18) 0%,
      rgba(120, 0, 180, 0.12) 30%,
      transparent 60%
    ),
    radial-gradient(
      circle at 70% 60%,
      rgba(255, 100, 180, 0.28) 0%,
      rgba(120, 0, 180, 0.1) 40%,
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
  align-items: center;
`;

/* ==== Animación de cometas ==== */
const cometAnim = keyframes`
  0% { transform: translate(-20vw, -10vh) rotate(35deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translate(140vw, 120vh) rotate(35deg); opacity: 0; }
`;

export const Comet = styled.div`
  position: absolute;
  top: -10vh;
  left: -20vw;
  width: 6px;
  height: 110px;
  background: linear-gradient(180deg, #ff59f8, transparent);
  border-radius: 4px;
  filter: blur(2px);
  opacity: 0;
  animation: ${cometAnim} 4s linear infinite;
  animation-delay: ${() => Math.random() * 5}s;
  transform: rotate(35deg);
`;

/* ==== Línea ondulada que conecta los niveles ==== */
export const RouteLine = styled.div`
  position: absolute;
  width: 100%;
  height: 220%;
  pointer-events: none;
  z-index: 0;
  top: 0;
  left: 0;

  background-image: url('/cosmic/route_path.png');
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 90% auto;
`;
