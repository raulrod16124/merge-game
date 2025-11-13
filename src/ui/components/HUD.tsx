// src/ui/components/HUD.tsx
import {useGameStore} from '@/state/gameStore';
import {motion} from 'framer-motion';
import {emoji} from '../constants';

export function HUD() {
  const nextItem = useGameStore(s => s.nextItem);
  const highest = useGameStore(s => s.highestUnlocked);
  const resetBoard = useGameStore(s => s.resetBoard);

  return (
    <div className="w-full max-w-xl flex items-center justify-between mt-4 mb-2 px-3">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start">
          <span className="text-sm text-slate-300">Siguiente objeto</span>
          <motion.div
            key={nextItem}
            initial={{scale: 0.6, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.25}}
            className="text-4xl p-2 bg-slate-800 rounded-lg border border-slate-700 shadow">
            {emoji(nextItem)}
          </motion.div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm text-slate-300">Desbloqueado</span>
          <div className="text-xl p-2 bg-slate-800 rounded-lg border border-slate-700">
            {emoji(highest)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={resetBoard}
          className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white shadow">
          Reiniciar
        </button>
      </div>
    </div>
  );
}
