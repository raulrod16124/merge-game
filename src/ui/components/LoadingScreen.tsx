import {useEffect, useMemo, useState} from 'react';
import styled, {keyframes, css} from 'styled-components';

// =====================
// Keyframes
// =====================
const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.98); }
`;

const twinkle = keyframes`
  0% { opacity: 0.25; transform: scale(1); }
  45% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 0.25; transform: scale(1); }
`;

// =====================
// Styled
// =====================
const Wrapper = styled.div<{$hiding: boolean}>`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  z-index: 9999;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 40% 20%,
      rgba(255, 145, 255, 0.2),
      transparent 55%
    ),
    radial-gradient(
      circle at 75% 65%,
      rgba(120, 0, 180, 0.18),
      transparent 60%
    ),
    linear-gradient(180deg, #19042b 0%, #10001b 60%, #05000a 100%);

  transition: opacity 0.3s linear;
  pointer-events: none;

  ${({$hiding}) =>
    $hiding &&
    css`
      animation: ${fadeOut} 600ms ease forwards;
    `}
`;

const Star = styled.div<{
  top: string;
  left: string;
  delay: string;
  size: number;
}>`
  position: absolute;
  top: ${({top}) => top};
  left: ${({left}) => left};
  width: ${({size}) => `${size}px`};
  height: ${({size}) => `${size}px`};
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #fff 0%,
    rgba(255, 255, 255, 0.8) 45%,
    rgba(255, 255, 255, 0.1) 100%
  );
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.12));
  opacity: 0.35;
  animation: ${twinkle} 2.6s infinite ease-in-out;
  animation-delay: ${({delay}) => delay};
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  font-size: 2.6rem;
  text-align: center;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 32px;
  text-shadow:
    0 0 12px rgba(255, 180, 255, 0.55),
    0 0 18px rgba(160, 80, 255, 0.45);
  user-select: none;

  @media (max-width: 420px) {
    font-size: 2.1rem;
  }
`;

const ProgressBar = styled.div`
  width: 70%;
  max-width: 320px;
  height: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
`;

const ProgressFill = styled.div<{progress: number}>`
  height: 100%;
  width: ${({progress}) => `${Math.round(progress * 100)}%`};
  background: linear-gradient(90deg, #ff9cff, #a56bff, #6b29ff);
  box-shadow: 0 0 8px rgba(255, 150, 255, 0.5);
  transition: width 0.25s ease-out;
`;

const LoadingText = styled.div`
  margin-top: 14px;
  color: #fff;
  font-size: 0.9rem;
  opacity: 0.8;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
`;

// =====================
// Helpers
// =====================
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function generateStars(count = 26) {
  return Array.from({length: count}).map((_, i) => ({
    id: i,
    top: `${randomBetween(6, 92).toFixed(1)}%`,
    left: `${randomBetween(4, 96).toFixed(1)}%`,
    delay: `${randomBetween(0, 2).toFixed(2)}s`,
    size: Math.round(randomBetween(2, 5)),
  }));
}

// =====================
// Component
// =====================
export function LoadingScreen({
  isReady,
  progress = 0,
}: {
  isReady: boolean;
  progress?: number; // 0..1
}) {
  const [hiding, setHiding] = useState(false);
  const [removed, setRemoved] = useState(false);

  const stars = useMemo(() => generateStars(26), []);

  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setHiding(true), 120);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  if (removed) return null;

  return (
    <Wrapper
      $hiding={hiding}
      onAnimationEnd={() => {
        if (hiding) setRemoved(true);
      }}>
      {stars.map(s => (
        <Star
          key={s.id}
          top={s.top}
          left={s.left}
          delay={s.delay}
          size={s.size}
        />
      ))}

      <Title>
        Stellar
        <br />
        Merge
      </Title>

      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <LoadingText>Cargando tu universo...</LoadingText>
    </Wrapper>
  );
}

export default LoadingScreen;
