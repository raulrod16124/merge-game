import {useGameStore} from '@/state/gameStore';

export function HUD() {
  const {state} = useGameStore();

  return (
    <div className="flex justify-between w-full max-w-md mt-4 px-4">
      <p className="text-sm text-slate-300">Items: {state.items.length}</p>
      <button
        className="bg-indigo-600 px-4 py-1 rounded-lg hover:bg-indigo-500 transition"
        onClick={() => window.location.reload()}>
        Reiniciar
      </button>
    </div>
  );
}
