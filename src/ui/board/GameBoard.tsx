// src/ui/board/GameBoard.tsx
import {motion} from 'framer-motion';
import {useEffect} from 'react';
import {useGameStore} from '@/state/game-store';

import {Tile} from './Tile';
import {FloatingScore} from '@/ui/components/FloatingScore';
import {AnimatePresence} from 'framer-motion';
import {LEVELS} from '@/data/levels';

import {
  BoardWrapper,
  BoardContainer,
  Grid,
  FloatingLayer,
} from './GameBoard.styled';

export function GameBoard() {
  const items = useGameStore(s => s.items);
  const boardSize = useGameStore(s => s.boardSize);
  const floatingScores = useGameStore(s => s.floatingScores);
  const addItem = useGameStore(s => s.addItem);
  const removeFloatingScore = useGameStore(s => s.removeFloatingScore);

  const cols = boardSize.cols;
  const rows = boardSize.rows;

  useEffect(() => {
    const load = async () => {
      const {loadLevel, currentLevel} = useGameStore.getState();
      if (!currentLevel) {
        const lvl = LEVELS[0];
        if (lvl) loadLevel(lvl as any);
      }
    };
    load();
  }, []);

  return (
    <BoardWrapper>
      <motion.div
        initial={{opacity: 0, scale: 0.92, y: 20}}
        animate={{opacity: 1, scale: 1, y: 0}}
        transition={{
          duration: 0.45,
          ease: [0.22, 1.05, 0.32, 1],
        }}
        style={{width: '100%', height: '100%'}}>
        <BoardContainer>
          <Grid cols={cols} rows={rows}>
            {Array.from({length: cols * rows}).map((_, index) => {
              const x = index % cols;
              const y = Math.floor(index / cols);
              const item = items.find(i => i.pos.x === x && i.pos.y === y);

              return (
                <Tile
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  item={item}
                  onClickEmpty={({x: cx, y: cy}) => addItem({x: cx, y: cy})}
                />
              );
            })}
          </Grid>

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
