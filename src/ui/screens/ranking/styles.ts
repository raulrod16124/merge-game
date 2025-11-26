import styled from 'styled-components';

export const Section = styled.div`
  padding: 20px;
  color: white;
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
`;

export const FilterButton = styled.button<{$active: boolean}>`
  flex: 1;
  padding: 10px 8px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border: none;
  border-radius: 8px;
  cursor: pointer;

  background: ${({$active}) =>
    $active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'};

  color: ${({$active}) => ($active ? 'white' : 'rgba(255,255,255,0.7)')};

  transition: background 0.2s ease;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
`;

export const PlayerCard = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;

  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

export const AvatarCircle = styled.div<{$variant: string}>`
  min-width: 48px;
  height: 48px;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;

  background: ${({$variant}) =>
    $variant === 'humanoid'
      ? 'linear-gradient(145deg, #7aa0ff, #476bdb)'
      : $variant === 'abstract'
        ? 'linear-gradient(145deg, #ff86d5, #d74eb2)'
        : 'linear-gradient(145deg, #ffd36e, #e1a945)'};
`;

export const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

export const PlayerStats = styled.div`
  opacity: 0.7;
  margin-top: 4px;
  font-size: 0.85rem;
`;

export const LoadingText = styled.p`
  text-align: center;
  opacity: 0.6;
  margin-top: 20px;
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
