import {motion, AnimatePresence} from 'framer-motion';
import {useGameStore} from '@/state/game-store';
import styled from 'styled-components';

const Bubble = styled(motion.div)`
  position: fixed;
  z-index: 40;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 180, 255, 0.9);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 6px rgba(0, 200, 255, 0.8);
`;

export function HUDFreezeCounter() {
  const items = useGameStore(s => s.items);
  const cellRects = useGameStore(s => s.cellRects);

  const frozen = items.filter(
    i => i.type === 'black_hole' && i.freezeTurns && i.freezeTurns > 0,
  );

  return (
    <AnimatePresence>
      {frozen.map(bh => {
        const key = `${bh.pos.x},${bh.pos.y}`;
        const rect = cellRects[key];
        if (!rect) return null;

        const left = rect.centerX - 13;
        const top = rect.centerY + rect.size / 2 - 15;

        return (
          <Bubble
            key={`freeze_${bh.id}`}
            initial={{scale: 0, opacity: 0}}
            animate={{scale: 1, opacity: 1, left, top}}
            exit={{scale: 0, opacity: 0}}
            transition={{duration: 0.22}}>
            {bh.freezeTurns}
          </Bubble>
        );
      })}
    </AnimatePresence>
  );
}
