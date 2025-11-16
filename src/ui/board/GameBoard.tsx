// src/ui/board/GameBoard.tsx
import {useEffect} from 'react';
import {useGameStore} from '@/state';
import {Tile} from '@/ui/board/Tile';
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
        // casteamos a any para evitar errores de tipo si LEVELS tiene shape distinto al LevelConfig TS
        const lvl = (LEVELS as any).level01 ?? Object.values(LEVELS)[0];
        if (lvl) loadLevel(lvl as any);
      }
    };
    load();
  }, []);

  return (
    <BoardWrapper>
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
    </BoardWrapper>
  );
}
