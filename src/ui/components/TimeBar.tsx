// src/ui/components/TimerBar.tsx
import styled from 'styled-components';
import {useGameStore} from '@/state';

const BarWrapper = styled.div`
  width: 100%;
  padding: 6px 12px;
  box-sizing: border-box;
`;

const Outer = styled.div`
  height: 12px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  overflow: hidden;
`;

const Inner = styled.div<{pct: number; color: string}>`
  width: ${({pct}) => pct}%;
  height: 100%;
  background: ${({color}) => color};
  transition: width 0.35s linear;
`;

export function TimerBar() {
  const timeLeft = useGameStore(s => s.timeLeft ?? 0);
  const lvl = useGameStore(s => s.currentLevel);
  const total = lvl?.timerSeconds ?? 120;
  const pct = Math.max(0, Math.min(100, (timeLeft / Math.max(1, total)) * 100));

  let color = '#29ff9a';
  if (pct < 40) color = '#ffe65c';
  if (pct < 20) color = '#ff4d4d';

  return (
    <BarWrapper aria-hidden={false}>
      <Outer>
        <Inner pct={pct} color={color} />
      </Outer>
    </BarWrapper>
  );
}
