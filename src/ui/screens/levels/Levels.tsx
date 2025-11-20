import {LevelsWrapper, Title, Grid} from './styles';
import {LEVELS} from '@/data/levels';
import {LevelCard} from '@/ui/components/LevelCard';
import AppLayout from '@/ui/layout';

export function Levels() {
  const levels = Object.values(LEVELS);

  return (
    <AppLayout title="Niveles">
      <LevelsWrapper>
        <Title>Selecciona un nivel</Title>

        <Grid>
          {levels.map((lvl: any) => (
            <LevelCard key={lvl.id} level={lvl} />
          ))}
        </Grid>
      </LevelsWrapper>
    </AppLayout>
  );
}
