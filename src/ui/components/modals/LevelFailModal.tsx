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
      <div
        className="
          w-[360px] p-8 rounded-3xl shadow-2xl border border-[#bfa57b]
          bg-[url('/textures/wood-light.png')] bg-cover bg-center
          flex flex-col items-center gap-5 text-[#3a2c16]
        ">
        <h2 className="text-3xl font-extrabold text-red-600 drop-shadow-sm">
          ¡Has fallado el nivel! 💀
        </h2>

        <p className="text-center text-lg">
          No has logrado completar el nivel.
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={() => navigate(`/play/${levelId}`)}
            className="
              w-full px-4 py-2 rounded-xl font-semibold
              bg-[#e7b2b2] hover:bg-[#efc1c1]
              border border-[#a46969] shadow-sm
            ">
            Reintentar nivel
          </button>

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
