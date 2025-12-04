// src/ui/components/LevelCard/LevelCard.styled.ts
import styled from 'styled-components';
import {COLORS} from '../constants';

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
  padding-left: ${({$index}) => ($index % 2 !== 0 ? '40%' : '0')};
  padding-right: ${({$index}) => ($index % 2 === 0 ? '40%' : '0')};
`;

export const LevelsWrapper = styled.div<{$unlocked: boolean}>`
  width: 100px;
  height: 100px;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${({$unlocked}) => ($unlocked ? 1 : 0.4)};

  transform: ${({$unlocked}) => ($unlocked ? 'scale(1)' : 'scale(0.92)')};

  transition: transform 0.24s ease;
`;

export const LevelImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
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
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${COLORS.white};
`;

export const SectionLevelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
