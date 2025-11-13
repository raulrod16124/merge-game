// src/ui/components/GameBoard.tsx
import {useGameStore} from '@/state/gameStore';
import {Tile} from './Tile';
import {FloatingScore} from './FloatingScore';
import {AnimatePresence} from 'framer-motion';

export function GameBoard() {
  const {state, addItem, floatingScores, removeFloatingScore} = useGameStore();

  const {cols, rows} = state.boardSize;

  const gridStyle = {
    gridTemplateColumns: `repeat(${cols}, 80px)`,
    gridTemplateRows: `repeat(${rows}, 80px)`,
  };

  return (
    <div className="relative flex flex-col items-center mt-8">
      {/* GRID */}
      <div
        className="grid gap-3 bg-slate-800/80 p-4 rounded-2xl shadow-2xl border border-slate-700"
        style={gridStyle}>
        {Array.from({length: cols * rows}).map((_, index) => {
          const x = index % cols;
          const y = Math.floor(index / cols);
          const item = state.items.find(i => i.pos.x === x && i.pos.y === y);

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
      </div>

      {/* FLOATING SCORE ANIMATIONS */}
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
    </div>
  );
}
