import AppLayout from '@/ui/layout';
import {LevelCard} from '@/ui/components/LevelCard';
import {LEVELS} from '@/data/levels';
import {usePlayerStore} from '@/state/player-store';
import {LevelsWrapper} from './styles';

export function Levels() {
  const levels = LEVELS;
  const highestUnlocked = usePlayerStore(s => s.highestLevelUnlocked);
  const completed = usePlayerStore(s => s.completedLevelUnlocks);
  const scores = usePlayerStore(s => s.completedLevels);

  return (
    <AppLayout title="Mapa Cósmico" prevRoute="/home">
      <LevelsWrapper>
        <div className="nebula" style={{top: '30%', left: '-20%'}} />
        <div className="nebula" style={{top: '70%', right: '-15%'}} />
        {levels.map((lvl, i) => {
          const index = Number(lvl.id.replace('level', ''));
          const unlocked = index <= highestUnlocked;
          const isCompleted = Boolean(completed[index]);
          const highScore = scores?.[lvl.id]?.score ?? null;

          return (
            <LevelCard
              key={lvl.id}
              level={lvl}
              unlocked={unlocked}
              completed={isCompleted}
              highScore={highScore}
              index={i}
            />
          );
        })}
      </LevelsWrapper>
    </AppLayout>
  );
}
