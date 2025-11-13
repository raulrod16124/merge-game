// src/ui/components/modals/LevelCompleteModal.tsx
import {useNavigate} from 'react-router-dom';
import {LEVELS} from '@/data/levels';

type Props = {
  levelId: string;
  onClose: () => void;
};

export function LevelCompleteModal({levelId, onClose}: Props) {
  const navigate = useNavigate();
  const level = (LEVELS as any)[levelId];

  const nextLevelId = (() => {
    const num = Number(levelId.replace('level0', ''));
    const next = `level0${num + 1}`;
    return (LEVELS as any)[next] ? next : null;
  })();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 flex flex-col items-center gap-4 w-[350px]">
        <h2 className="text-3xl font-bold text-emerald-400">
          ¡Nivel completado! 🎉
        </h2>

        <p className="text-slate-300 text-center">
          Has superado <strong>{level?.name}</strong>
        </p>

        <div className="flex flex-col gap-3 w-full mt-4">
          {nextLevelId && (
            <button
              onClick={() => navigate(`/play/${nextLevelId}`)}
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
              Siguiente nivel →
            </button>
          )}

          <button
            onClick={() => navigate('/levels')}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
            Volver a niveles
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-500 hover:bg-slate-400 rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
