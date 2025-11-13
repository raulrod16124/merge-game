// src/ui/components/Tile.tsx
import type {MergeItem} from '@/core/types';
import {motion} from 'framer-motion';
import {emoji} from '@/ui/constants';

type TileProps = {
  x: number;
  y: number;
  item?: MergeItem;
  onClickEmpty: (pos: {x: number; y: number}) => void;
};

export function Tile({x, y, item, onClickEmpty}: TileProps) {
  const handleClick = () => {
    if (!item) onClickEmpty({x, y});
  };

  return (
    <div
      onClick={handleClick}
      className={`w-20 h-20 flex items-center justify-center rounded-xl border shadow-md transition-all ${
        item
          ? 'bg-emerald-600/90 border-emerald-400'
          : 'bg-slate-700/60 hover:bg-slate-600 cursor-pointer border-slate-600'
      }`}>
      {item ? (
        <motion.div
          key={item.id}
          initial={{scale: 0.4, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.25}}
          className="text-3xl select-none">
          {emoji(item.type)}
        </motion.div>
      ) : (
        <div className="text-slate-400 text-sm select-none">+</div>
      )}
    </div>
  );
}
