import {useGameStore} from '@/state/gameStore';
import {motion} from 'framer-motion';
import {COSMIC_ICONS} from '../constants/cosmicData';

export function NextItem() {
  const next = useGameStore(s => s.nextItem);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
      <span style={{fontSize: '0.75rem', opacity: 0.8}}>Siguiente</span>

      <motion.img
        key={next}
        src={COSMIC_ICONS[next as keyof typeof COSMIC_ICONS]}
        alt={next}
        initial={{scale: 0.6, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.2}}
        draggable={false}
        style={{
          width: 56,
          height: 56,
          objectFit: 'contain',
          padding: 6,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 12,
        }}
      />
    </div>
  );
}
