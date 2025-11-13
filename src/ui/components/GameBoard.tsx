import {useGameStore} from '@/state/gameStore';
import {Tile} from './Tile';

export function GameBoard() {
  const {state} = useGameStore();
  const {cols, rows} = state.boardSize;

  const gridTemplate = {
    gridTemplateColumns: `repeat(${cols}, 64px)`,
    gridTemplateRows: `repeat(${rows}, 64px)`,
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className="grid gap-1 bg-slate-800 p-3 rounded-2xl shadow-lg"
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
