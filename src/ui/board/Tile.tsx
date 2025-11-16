// src/ui/board/Tile.tsx
import {motion} from 'framer-motion';
import type {ItemBase} from '@/core/types';
import {COSMIC_ICONS} from '@/ui/constants/cosmicData';

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
    <div
      onClick={handleClick}
      className={`tile-cell`}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: item ? 'default' : 'pointer',
      }}>
      {item ? (
        <motion.img
          key={item.id}
          src={COSMIC_ICONS[item.type as keyof typeof COSMIC_ICONS]}
          alt={item.type}
          draggable={false}
          initial={{scale: 0.4, opacity: 0}}
          animate={{scale: 1, opacity: 1}}
          transition={{duration: 0.25}}
          style={{
            width: '65%',
            height: '65%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))',
          }}
        />
      ) : (
        <div style={{opacity: 0.2, fontSize: '1.8rem'}}>+</div>
      )}
    </div>
  );
}
