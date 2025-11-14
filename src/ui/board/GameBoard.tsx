// src/ui/board/GameBoard.tsx
import {useGameStore} from '@/state/gameStore';
import {Tile} from './Tile';
import {FloatingScore} from '../components/FloatingScore';
import {AnimatePresence} from 'framer-motion';
import {useEffect} from 'react';
import {LEVELS} from '@/data/levels';

import {
  BoardScreenWrapper,
  MapContainer,
  GridOverlay,
  CellLayer,
} from './GameBoard.styled';

export function GameBoard() {
  const {state, addItem, floatingScores, removeFloatingScore} = useGameStore();
  const {cols, rows} = state.boardSize;

  useEffect(() => {
    const load = () => {
      const {loadLevel} = useGameStore.getState();
      loadLevel(LEVELS.level01);
    };
    load();
  }, []);

  // Celda se adapta automáticamente al tamaño del contenedor
  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  };

  return (
    <BoardScreenWrapper>
      <MapContainer>
        <GridOverlay style={gridStyle}>
          {Array.from({length: cols * rows}).map((_, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);
            const item = state.items.find(i => i.pos.x === x && i.pos.y === y);

            return (
              <CellLayer key={`${x}-${y}`}>
                <Tile
                  x={x}
                  y={y}
                  item={item}
                  onClickEmpty={pos => addItem(pos)}
                />
              </CellLayer>
            );
          })}
        </GridOverlay>

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
      </MapContainer>
    </BoardScreenWrapper>
  );
}
