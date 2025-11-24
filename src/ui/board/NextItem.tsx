import {useGameStore} from '../../state/game-store';
import {motion} from 'framer-motion';
import {COSMIC_ICONS} from '../constants';

export function NextItem() {
  const next = useGameStore(s => s.nextItem);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
      <span style={{fontSize: '0.75rem', opacity: 0.8, textAlign: 'center'}}>
        Siguiente
      </span>

      <motion.img
        key={next}
        src={COSMIC_ICONS[next as keyof typeof COSMIC_ICONS]}
        alt={next}
        initial={{scale: 1, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.2}}
        draggable={false}
        style={{
          width: 40,
          height: 40,
          objectFit: 'contain',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 12,
        }}
      />
    </div>
  );
}
