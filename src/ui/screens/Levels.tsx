// src/ui/screens/Levels.tsx
import {LEVELS} from '@/data/levels';
import {LevelCard} from '@/ui/components/LevelCard';

export function Levels() {
  // LEVELS is an object of imported JSONs — convert to array
  const levels = Object.values(LEVELS);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Selecciona un nivel</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {levels.map((lvl: any) => (
          <LevelCard key={lvl.id} level={lvl} />
        ))}
      </div>
    </div>
  );
}
