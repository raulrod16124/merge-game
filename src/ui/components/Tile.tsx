import {motion} from 'framer-motion';
import type {MergeItem} from '@/core/types';
import {useGameStore} from '@/state/gameStore';

type TileProps = {
  x: number;
  y: number;
  item?: MergeItem;
};

export function Tile({x, y, item}: TileProps) {
  const {addItem, tryMergeAt} = useGameStore();

  const handleClick = () => {
    if (item) {
      tryMergeAt({x, y});
    } else {
      addItem('bush', {x, y});
    }
  };

  return (
    <div
      className={`w-20 h-20 flex items-center justify-center rounded-xl cursor-pointer transition-all 
      ${item ? 'bg-emerald-600/80 hover:bg-emerald-500' : 'bg-slate-700/60 hover:bg-slate-600/80'} 
      border border-slate-600 shadow-md`}
      onClick={handleClick}>
      {item && (
        <motion.div
          key={item.id}
          initial={{scale: 0.7, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          exit={{scale: 0.5, opacity: 0}}
          transition={{duration: 0.2}}
          className="text-3xl select-none">
          {emojiForType(item.type)}
        </motion.div>
      )}
    </div>
  );
}

function emojiForType(type: string) {
  switch (type) {
    case 'bush':
      return '🌿';
    case 'tree':
      return '🌳';
    case 'house':
      return '🏠';
    case 'castle':
      return '🏰';
    default:
      return '❓';
  }
}
