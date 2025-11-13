// src/ui/components/LevelCard.tsx
import type {LevelConfig} from '@/core/typesLevel';
import {emoji} from '../constants';
import {useNavigate} from 'react-router-dom';

type Props = {
  level: LevelConfig;
};

export function LevelCard({level}: Props) {
  const nav = useNavigate();

  const handlePlay = () => {
    nav(`/play/${level.id}`);
  };

  const previewType = Object.keys(level.itemWeights)[0] ?? 'bush';
  const initialCount = (level.initialMap && level.initialMap.length) || 0;

  return (
    <div className="bg-slate-800 rounded-lg p-4 w-80 shadow-md border border-slate-700 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold">{level.name}</h3>
          <p className="text-xs text-slate-400">
            Tablero: {level.boardSize.cols}×{level.boardSize.rows}
          </p>
        </div>

        <div className="text-3xl">{emoji(previewType)}</div>
      </div>

      <div className="text-sm text-slate-300 mb-3">
        Osos máximos: <strong>{level.maxBears}</strong> · Prob. oso:{' '}
        <strong>{Math.round(level.bearSpawnRate * 100)}%</strong>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handlePlay}
          className="px-3 py-1 bg-emerald-600 rounded hover:bg-emerald-500">
          Jugar
        </button>
        <div className="text-slate-400 text-sm ml-auto">
          Initial: {initialCount}
        </div>
      </div>
    </div>
  );
}
