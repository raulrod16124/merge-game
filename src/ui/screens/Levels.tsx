// src/ui/screens/Levels.tsx
import {LEVELS} from '@/data/levels';
import {LevelCard} from '@/ui/components/LevelCard';
import {LevelsWrapper, LevelsTitle, LevelsGrid} from './Levels.styled';

export function Levels() {
  const levels = Object.values(LEVELS);

  return (
    <LevelsWrapper>
      <LevelsTitle>Selecciona un nivel</LevelsTitle>

      <LevelsGrid>
        {levels.map((lvl: any) => (
          <LevelCard key={lvl.id} level={lvl} />
        ))}
      </LevelsGrid>
    </LevelsWrapper>
  );
}
