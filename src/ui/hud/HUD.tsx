// src/ui/components/HUD.tsx
import {useGameStore} from '@/state/gameStore';
// import {ITEM_ASSETS, emoji} from '../constants';
import {emoji} from '../constants';
import {motion} from 'framer-motion';

export function HUD() {
  const nextItem = useGameStore(s => s.nextItem);
  const resetLevel = useGameStore(s => s.resetLevel);
  const score = useGameStore(s => s.score);

  // const asset = ITEM_ASSETS[nextItem];

  return (
    <div className="w-full bg-transparent p-2 rounded-md flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-300">Siguiente</span>
          <motion.div
            key={nextItem}
            initial={{scale: 0.7, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.2}}
            className="p-1 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center"
            style={{width: 56, height: 56}}>
            {/* asset ? (
              <img
                src={asset.src}
                alt={nextItem}
                width={asset.size}
                height={asset.size}
                draggable={false}
              />
            ) : (
              <div className="text-2xl">{emoji(nextItem)}</div>
            )*/}
            <div className="text-2xl">{emoji(nextItem)}</div>
          </motion.div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-slate-300">Puntuación</span>
          <div className="text-lg font-semibold">{score}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={resetLevel}
          className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm">
          Reiniciar
        </button>
      </div>
    </div>
  );
}
