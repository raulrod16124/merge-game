// src/ui/board/Tile.tsx
import {TileBase, TileEmoji} from './Tile.styled';
import {emoji} from '../constants';
import {motion} from 'framer-motion';
import type {MergeItem} from '@/core/types';

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
    <TileBase onClick={handleClick} className={item ? 'filled' : 'empty'}>
      {item ? (
        <motion.div
          key={item.id}
          initial={{scale: 0.4, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.25}}>
          <TileEmoji>{emoji(item.type)}</TileEmoji>
        </motion.div>
      ) : null}
    </TileBase>
  );
}
