import {useGameStore} from '@/state/gameStore';
import {motion} from 'framer-motion';
import {emoji} from '../constants';

export function NextItem() {
  const next = useGameStore(s => s.nextItem);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className="text-lg text-slate-300 mb-1">Próximo objeto:</div>

      <motion.div
        key={next}
        initial={{scale: 0.3, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.3}}
        className="text-5xl p-3 bg-slate-800 rounded-xl border border-slate-600 shadow-lg">
        {emoji(next)}
      </motion.div>
    </div>
  );
}
