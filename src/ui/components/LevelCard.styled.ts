// src/ui/components/LevelCard/LevelCard.styled.ts
import styled from 'styled-components';

/* Contenedor individual del nodo */
export const NodeWrapper = styled.div<{$index: number}>`
  position: relative;
  width: 260px; /* más ancho para que el nodo ocupe espacio y se alternen */
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;

  /* menos espacio vertical entre nodos */
  margin-top: ${({$index}) => ($index === 0 ? '24px' : '40px')};

  /* alternate left / right visual offset */
  align-self: ${({$index}) => ($index % 2 === 0 ? 'flex-start' : 'flex-end')};
  padding-left: ${({$index}) => ($index % 2 !== 0 ? '45%' : '0')};
  padding-right: ${({$index}) => ($index % 2 === 0 ? '45%' : '0')};
`;

/* PLANETA */
export const Planet = styled.div<{$unlocked: boolean}>`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: ${({$unlocked}) =>
    $unlocked
      ? 'radial-gradient(circle, #ffdd77 0%, #ff9a3c 40%, #8c2fff 100%)'
      : 'radial-gradient(circle, #444 0%, #262626 100%)'};

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: ${({$unlocked}) =>
    $unlocked ? '0 0 26px rgba(255,200,90,0.85)' : '0 0 10px rgba(0,0,0,0.6)'};

  transform: ${({$unlocked}) => ($unlocked ? 'scale(1)' : 'scale(0.92)')};

  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
`;

/* Icono interno */
export const PlanetIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* Nombre */
export const LevelName = styled.div`
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #ffd7ff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
`;

/* Score */
export const ScoreBadge = styled.div`
  margin-top: 6px;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 10px;
  border-radius: 12px;
  color: white;
  font-size: 13px;
`;
