// src/ui/board/Header.tsx
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Coins, Pause} from 'lucide-react';
import {COLORS} from '@/ui/constants';
import {useGameStore} from '@/state';
import {ScoreBar} from './ScoreBar';
import {formatCoins} from '@/utils/formatCoins';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  box-sizing: border-box;
`;

const CoinsWrapper = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${COLORS.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const HUDPauseButton = styled.button`
  background: ${COLORS.tertiary};
  border: 2px solid ${COLORS.white};
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  backdrop-filter: blur(6px);
  cursor: pointer;

  transition: all 0.2s ease;

  &:active {
    transform: scale(0.92);
  }
`;

export function GameHeader({
  onPause,
}: {
  objective: string;
  onPause: () => void;
}) {
  const levelCoins = useGameStore(s => s.levelCoins);
  const prevCoinsRef = useRef<number>(levelCoins);
  const [displayCoins, setDisplayCoins] = useState<number>(levelCoins);
  const animRef = useRef<number | null>(null);

  // Animate numeric increment when coins changes
  useEffect(() => {
    const from = prevCoinsRef.current ?? 0;
    const to = levelCoins ?? 0;
    const diff = to - from;
    prevCoinsRef.current = to;

    // If no change, nothing to animate
    if (diff === 0) {
      setDisplayCoins(to);
      return;
    }

    // animate numeric increment over 600ms
    const duration = 600;
    const start = performance.now();
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease
      const value = Math.round(from + (to - from) * eased);
      setDisplayCoins(value);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [levelCoins]);

  return (
    <Wrapper>
      <CoinsWrapper>
        <Coins size={22} strokeWidth={2.4} /> {formatCoins(displayCoins)}
      </CoinsWrapper>

      <InfoRow>
        <ScoreBar />
      </InfoRow>

      <HUDPauseButton onClick={onPause}>
        <Pause size={24} color="#ffffff" />
      </HUDPauseButton>
    </Wrapper>
  );
}
