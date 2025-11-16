// src/App.tsx
import {Routes, Route, Navigate} from 'react-router-dom';
import {Home} from '@/ui/screens/Home';
import {Levels} from '@/ui/screens/Levels';
import {BoardScreen} from '@/ui/screens/BoardScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/play/:levelId" element={<BoardScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
