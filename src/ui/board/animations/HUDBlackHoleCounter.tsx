// src/ui/board/HUDBlackHoleCounter.tsx
import styled from 'styled-components';
import {useGameStore} from '@/state/game-store';

const Badge = styled.div`
  position: fixed;
  z-index: 80;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  padding: 6px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
`;

export function HUDBlackHoleCounter() {
  const items = useGameStore(state => state.items);
  const cellRects = useGameStore(state => state.cellRects);

  const blackHoles = items.filter(i => i.type === 'black_hole');

  return (
    <>
      {blackHoles.map(bh => {
        const key = `${bh.pos.x},${bh.pos.y}`;
        const rect = cellRects?.[key];
        if (!rect) return null;
        const left = Math.round(rect.centerX - rect.size / 2);
        const top = Math.round(rect.centerY - rect.size / 2) - 28; // just above tile
        return (
          <Badge key={`bh_counter_${bh.id}`} style={{left, top}} aria-hidden>
            🌀 {bh.absorbed ?? 0}/3
          </Badge>
        );
      })}
    </>
  );
}
