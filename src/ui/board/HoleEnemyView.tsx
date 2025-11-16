// src/ui/board/HoleEnemyView.tsx
import styled from 'styled-components';

const Hole = styled.div`
  width: 78%;
  height: 78%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    #0b0b0b 0%,
    #121212 45%,
    rgba(0, 0, 0, 0.95) 100%
  );
  box-shadow:
    0 0 18px rgba(0, 0, 0, 0.75),
    inset 0 0 10px rgba(255, 255, 255, 0.06);
  display: block;
  transform-origin: center;
  animation: spin 3.5s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export function HoleEnemyView() {
  return <Hole aria-hidden="true" />;
}
