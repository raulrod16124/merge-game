// src/ui/screens/Home.tsx
import React from 'react';
import {Link} from 'react-router-dom';
import {AppLayout} from '@/ui/layout/AppLayout';
import {
  Hero,
  HeroTitle,
  HeroSubtitle,
  Card,
  PreviewBoard,
  StartButton,
  Credits,
} from './Home.styled';
import {COSMIC_ICONS} from '@/ui/constants/cosmicData';

export function Home() {
  return (
    <AppLayout>
      <Hero>
        <HeroTitle>Stellar Merge</HeroTitle>
        <HeroSubtitle>
          Coloca partículas cósmicas, combina 3 iguales para crear objetos más
          complejos y desata la cosmogénesis. ¡Explora, combina y sobrevive!
        </HeroSubtitle>

        <Card>
          <PreviewBoard aria-hidden>
            <img
              src={COSMIC_ICONS.star_system}
              alt="preview star system"
              draggable={false}
            />
          </PreviewBoard>

          <div style={{padding: 16}}>
            <p style={{margin: 0, color: '#143049', fontWeight: 700}}>
              Comienza tu viaje cósmico
            </p>
            <p style={{marginTop: 8, color: '#35586b', fontSize: 14}}>
              Un juego de lógica espacial con progresión por fusiones y
              power-ups estratégicos.
            </p>

            <div style={{marginTop: 18}}>
              <Link to="/levels">
                <StartButton>Comenzar →</StartButton>
              </Link>
            </div>
          </div>
        </Card>

        <Credits>v1.0 — Stellar Merge</Credits>
      </Hero>
    </AppLayout>
  );
}
