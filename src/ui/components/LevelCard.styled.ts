import styled, {keyframes, css} from 'styled-components';

const pulse = keyframes`
  0% { box-shadow: 0 0 6px rgba(255,255,255,0.4); }
  50% { box-shadow: 0 0 14px rgba(255,255,255,0.9); }
  100% { box-shadow: 0 0 6px rgba(255,255,255,0.4); }
`;

export const NodeWrapper = styled.div<{$index: number}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 60px 0;

  transform: translateX(${({$index}) => ($index % 2 === 0 ? '-20px' : '20px')});
`;

export const NodeCircle = styled.div<{
  $unlocked: boolean;
  $completed: boolean;
}>`
  width: 74px;
  height: 74px;
  border-radius: 999px;

  background: ${({$unlocked}) =>
    $unlocked
      ? 'radial-gradient(circle, #ffffff 25%, #b0d6ff 70%, #3f4e72 100%)'
      : 'radial-gradient(circle, #333 20%, #111 100%)'};

  border: ${({$completed}) =>
    $completed ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.3)'};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: ${({$unlocked}) => ($unlocked ? 'pointer' : 'default')};

  ${({$completed}) =>
    $completed &&
    css`
      animation: ${pulse} 2.2s infinite ease-in-out;
    `}
`;

export const NodeInner = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: white;
  }
`;

export const LevelName = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  width: 120px;
`;

export const ScoreBadge = styled.div`
  margin-top: 4px;
  font-size: 0.78rem;
  color: #ffd700;
`;

export const Connector = styled.svg`
  position: absolute;
  top: -80px;
  width: 140px;
  height: 90px;
  overflow: visible;

  path {
    stroke: rgba(255, 255, 255, 0.4);
    stroke-width: 2px;
    fill: none;
  }
`;
