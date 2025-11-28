import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  padding-bottom: 120px;

  /* evitar que el scroll tape parte de la UI */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  padding: 16px;
`;

/* Fondo cartoon sólido con profundidad */
export const Card = styled.div<{$unlocked: boolean}>`
  position: relative;
  padding: 14px 10px 3.5dvh;
  border-radius: 18px;

  background: ${({$unlocked}) =>
    $unlocked
      ? 'linear-gradient(180deg,#3e1a75,#260d40)'
      : 'linear-gradient(180deg,#1d1d2e,#0f0f1a)'};

  border: 3px solid
    ${({$unlocked}) => ($unlocked ? '#9f5bff' : 'rgba(255,255,255,0.12)')};

  box-shadow:
    0 4px 0 ${({$unlocked}) => ($unlocked ? '#6622cc' : '#111')},
    0 0 10px rgba(0, 0, 0, 0.4);

  text-align: center;
  color: white;
  transition: 0.25s ease;

  /* bloqueados → estilo desaturado */
  ${({$unlocked}) =>
    !$unlocked &&
    `
      opacity: .5;
      filter: grayscale(.4);
    `}
`;

export const Icon = styled.img`
  width: 70px;
  height: 70px;
  margin: 0 auto 8px auto;
  display: block;
`;

export const Title = styled.h3`
  margin: 4px 0 2px;
  font-size: 1rem;
  font-weight: 800;
  color: #ffeeff;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.35);
`;

export const Desc = styled.p`
  opacity: 0.75;
  font-size: 0.78rem;
  min-height: 32px;
  margin: 0;
`;

/* Estrellas de dificultad */
export const Stars = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 2px;
  margin: 6px 0 1dvh;
`;

export const Reward = styled.div`
  margin-top: 8px;
  font-size: 0.7rem;
  opacity: 0.85;
`;

export const Checkmark = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  background: #44ff88;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  box-shadow: 0 0 6px #44ff88;
`;

export const LockOverlay = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  opacity: 0.7;
`;
