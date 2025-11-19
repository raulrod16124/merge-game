// src/ui/board/Tile.tsx
import {motion} from 'framer-motion';
import type {ItemBase} from '../../core/types';
import {COSMIC_ICONS} from '../constants';
import {TileBase, TilePlaceholder} from './Tile.styled';

type TileProps = {
  x: number;
  y: number;
  item?: ItemBase;
  onClickEmpty: (pos: {x: number; y: number}) => void;
};

export function Tile({x, y, item, onClickEmpty}: TileProps) {
  const handleClick = () => {
    if (!item) onClickEmpty({x, y});
  };

  return (
    <TileBase onClick={handleClick} className="aspect-square">
      {item ? (
        <motion.img
          key={item.id}
          src={COSMIC_ICONS[item.type as keyof typeof COSMIC_ICONS]}
          alt={item.type}
          draggable={false}
          initial={{scale: 0.4, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.22}}
        />
      ) : (
        <TilePlaceholder>+</TilePlaceholder>
      )}
    </TileBase>
  );
}
