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
      <div
        className="
          w-[360px] p-8 rounded-3xl shadow-2xl border border-[#bfa57b]
          bg-[url('/textures/wood-light.png')] bg-cover bg-center
          flex flex-col items-center gap-5 text-[#3a2c16]
        ">
        <h2 className="text-3xl font-extrabold drop-shadow-sm">
          ¡Nivel completado! 🎉
        </h2>

        <p className="text-center text-lg">
          Has superado <strong>{level?.name}</strong>
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          {nextLevelId && (
            <button
              onClick={() => navigate(`/play/${nextLevelId}`)}
              className="
                w-full px-4 py-2 rounded-xl font-semibold text-[#3a2c16]
                bg-[#cde8a8] hover:bg-[#d6f0b2]
                border border-[#8fab6a] shadow-md transition-all
              ">
              Siguiente nivel →
            </button>
          )}

          <button
            onClick={() => navigate('/levels')}
            className="
              w-full px-4 py-2 rounded-xl font-semibold
              bg-[#e8d8b9] hover:bg-[#f0e4c6]
              border border-[#bfa57b] shadow-sm
            ">
            Volver a niveles
          </button>

          <button
            onClick={onClose}
            className="
              w-full px-4 py-2 rounded-xl font-semibold
              bg-[#d2c5ad] hover:bg-[#ded2bd]
              border border-[#bfa57b] shadow-sm
            ">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
