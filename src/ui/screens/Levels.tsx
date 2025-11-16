// src/ui/screens/Levels.tsx
import React from 'react';
import {LEVELS} from '@/data/levels';
import {LevelCard} from '@/ui/components/LevelCard';
import {AppLayout} from '@/ui/layout/AppLayout';
import {LevelsWrapper, Grid} from './Levels.styled';

export function Levels() {
  const levels = Object.values(LEVELS);

  return (
    <AppLayout>
      <LevelsWrapper>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 4vw, 36px)',
            color: '#0b2340',
          }}>
          Selecciona un nivel
        </h2>

        <Grid>
          {levels.map((lvl: any) => (
            <LevelCard key={lvl.id} level={lvl} />
          ))}
        </Grid>
      </LevelsWrapper>
    </AppLayout>
  );
}
