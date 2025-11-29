// src/ui/screens/levels/styles.ts
import styled from 'styled-components';

/* ===== Carrusel horizontal de secciones ===== */
export const SectionCarouselWrapper = styled.div`
  height: calc(100dvh - 30dvh); /* altura fija para centrar verticalmente */
  display: flex;
  align-items: center; /* centra verticalmente las secciones */
  flex-direction: row;
  overflow-x: auto;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  padding: 0 20dvw; /* 🔥 añade padding lateral para permitir scroll */
  gap: 28px;
  scroll-snap-type: x mandatory;
`;

export const SectionItem = styled.div<{$unlocked: boolean}>`
  scroll-snap-align: center;
  min-width: 80dvw;
  height: 70dvh;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: ${({$unlocked}) => ($unlocked ? 'pointer' : 'not-allowed')};

  opacity: ${({$unlocked}) => ($unlocked ? 1 : 0.4)};
  transform: scale(${({$unlocked}) => ($unlocked ? 1 : 0.95)});
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;

  .label {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  }
`;

export const SectionImage = styled.img<{$dimmed: boolean}>`
  width: 100%;
  height: 90%;
  object-fit: contain;
  filter: ${({$dimmed}) =>
    $dimmed ? 'grayscale(100%) brightness(0.7)' : 'none'};
`;

/* ===== Panel de niveles ===== */
export const LevelsPanel = styled.div`
  position: absolute;
  top: 12dvh;
  width: 100%;
  max-width: 500px;
  height: 100dvh;
  margin: 0 auto;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);
  text-align: center;

  h2 {
    color: white;
    margin-bottom: 12px;
  }
`;

export const LevelsPanelScroller = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CloseIconWrapper = styled.div`
  position: absolute;
  right: 15%;
  top: 5dvh;
`;
