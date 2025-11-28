// styles.ts
import {COLORS} from '@/ui/constants';
import styled from 'styled-components';

// Contenedor general
export const Section = styled.div`
  padding: 20px;
  color: white;
`;

/* =============================
   FILTERS
============================= */
export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
`;

export const FilterButton = styled.button<{$active: boolean}>`
  flex: 1;
  padding: 12px 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;

  background: ${({$active}) =>
    $active
      ? 'linear-gradient(145deg, #7b3bff, #5922c7)'
      : 'rgba(255,255,255,0.06)'};

  color: ${({$active}) => ($active ? 'white' : 'rgba(255,255,255,0.7)')};

  box-shadow: ${({$active}) =>
    $active
      ? '0 4px 12px rgba(120, 80, 255, 0.45)'
      : 'inset 0 0 0 transparent'};

  transition: 0.22s ease;
`;

/* =============================
   LISTA DE JUGADORES
============================= */

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
`;

/* --- Tarjeta estilo Achievements 2D --- */
export const PlayerCard = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-radius: 18px;
  position: relative;
  overflow: hidden;

  background: linear-gradient(180deg, #2b1459, #1a0835);
  border: 2px solid ${COLORS.secondary};

  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.05);

  transition: 0.25s ease;

  &:active {
    transform: scale(0.97);
  }
`;

/* Número de ranking (medalla 2D) */
export const RankBadge = styled.div`
  min-width: 48px;
  height: 48px;

  border-radius: 50%;
  background: linear-gradient(145deg, #ffd86b, #f7a900);
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${COLORS.tertiary};
  font-size: 1.2rem;
  font-weight: 900;

  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 -3px 6px rgba(0, 0, 0, 0.3);
`;

/* Info del jugador */
export const PlayerInfo = styled.div`
  flex: 1;
  margin-left: 14px;
`;

export const PlayerName = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.25);
`;

export const PlayerStats = styled.div`
  opacity: 0.8;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #e2d4ff;
`;

/* Contenedor del avatar */
export const AvatarWrapper = styled.div`
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.16),
    transparent 70%
  );
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.28);
`;

// ===============================
// Skeleton Loader
// ===============================
export const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
`;

export const SkeletonCard = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;

  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
  position: relative;
`;

export const SkeletonCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
`;

export const SkeletonBlock = styled.div`
  flex: 1;
  height: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 6px;
  max-width: 70%;
`;

export const SkeletonShimmer = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.3s infinite;

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;
