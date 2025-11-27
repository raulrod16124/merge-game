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
