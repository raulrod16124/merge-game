import {GameBoard} from '@/ui/components/GameBoard';
import {HUD} from '@/ui/components/HUD';
import {ScoreBar} from '../components/ScoreBar';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-start h-screen bg-slate-900 text-white p-4">
      <h1 className="text-3xl font-bold mt-4">Merge Game 🧩</h1>
      <HUD />
      <ScoreBar />
      <GameBoard />
    </div>
  );
}
