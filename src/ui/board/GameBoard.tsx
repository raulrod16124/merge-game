// src/ui/board/GameBoard.tsx
import {motion, AnimatePresence} from 'framer-motion';
import {useGameStore} from '../../state/game-store';

import {Tile} from './Tile';
import {FloatingScore} from '../../ui/components/FloatingScore';

import {
  BoardWrapper,
  BoardContainer,
  Grid,
  FloatingLayer,
} from './GameBoard.styled';

export function GameBoard() {
  const {items, boardSize, addItem, floatingScores, removeFloatingScore} =
    useGameStore();

  const cols = boardSize?.cols ?? 6;
  const rows = boardSize?.rows ?? 6;

  const onClickEmpty = (pos: {x: number; y: number}) => {
    addItem(pos);
  };

  return (
    <BoardWrapper>
      <motion.div
        initial={{opacity: 0, y: -8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.28}}
        style={{width: '100%', height: '100%'}}>
        <BoardContainer>
          <Grid cols={cols} rows={rows}>
            {Array.from({length: cols * rows}).map((_, index) => {
              const x = index % cols;
              const y = Math.floor(index / cols);
              const item = items.find(i => i.pos.x === x && i.pos.y === y);

              return (
                <div
                  key={`${x}-${y}`}
                  ref={el => {
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const key = `${x},${y}`;
                    const prev = useGameStore.getState().cellRects[key];

                    const newRect = {
                      size: rect.width,
                      centerX: rect.left + rect.width / 2,
                      centerY: rect.top + rect.height / 2,
                    };

                    if (
                      !prev ||
                      prev.size !== newRect.size ||
                      prev.centerX !== newRect.centerX ||
                      prev.centerY !== newRect.centerY
                    ) {
                      useGameStore.getState().setCellRect(key, newRect);
                    }
                  }}
                  style={{width: '100%', height: '100%'}}>
                  <Tile x={x} y={y} item={item} onClickEmpty={onClickEmpty} />
                </div>
              );
            })}
          </Grid>

          {/* Floating scores */}
          <FloatingLayer>
            <AnimatePresence>
              {floatingScores.map(fs => (
                <FloatingScore
                  key={fs.id}
                  x={fs.x}
                  y={fs.y}
                  points={fs.points}
                  onDone={() => removeFloatingScore(fs.id)}
                />
              ))}
            </AnimatePresence>
          </FloatingLayer>
        </BoardContainer>
      </motion.div>
    </BoardWrapper>
  );
}
