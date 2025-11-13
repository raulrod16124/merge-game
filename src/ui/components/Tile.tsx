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
      className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-600 transition"
      onClick={handleClick}>
      {item && (
        <motion.div
          key={item.id}
          initial={{scale: 0.7, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          exit={{scale: 0.5, opacity: 0}}
          transition={{duration: 0.2}}
          className="text-xl select-none">
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
