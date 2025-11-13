import {useGameStore} from '@/state/gameStore';
import {Tile} from './Tile';

export function GameBoard() {
  const {state} = useGameStore();
  const {cols, rows} = state.boardSize;

  const gridTemplate = {
    gridTemplateColumns: `repeat(${cols}, 80px)`,
    gridTemplateRows: `repeat(${rows}, 80px)`,
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className="grid gap-2 bg-slate-800/80 p-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-sm"
        style={gridTemplate}>
        {Array.from({length: cols * rows}).map((_, index) => {
          const x = index % cols;
          const y = Math.floor(index / cols);
          const item = state.items.find(i => i.pos.x === x && i.pos.y === y);
          return <Tile key={`${x}-${y}`} x={x} y={y} item={item} />;
        })}
      </div>
    </div>
  );
}
