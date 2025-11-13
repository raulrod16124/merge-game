// src/ui/components/modals/LevelFailModal.tsx
import {useNavigate} from 'react-router-dom';

type Props = {
  levelId: string;
  onClose: () => void;
};

export function LevelFailModal({levelId, onClose}: Props) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700 flex flex-col items-center gap-4 w-[350px]">
        <h2 className="text-3xl font-bold text-red-400">
          ¡Has fallado el nivel! 💀
        </h2>

        <p className="text-slate-300 text-center">
          No has logrado completar el nivel.
        </p>

        <div className="flex flex-col gap-3 w-full mt-4">
          <button
            onClick={() => navigate(`/play/${levelId}`)}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg">
            Reintentar nivel
          </button>

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
