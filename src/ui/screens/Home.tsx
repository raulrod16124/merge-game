// src/ui/screens/Home.tsx
import {Link} from 'react-router-dom';
import {AppLayout} from '@/ui/layout/AppLayout';
import {COSMIC_ICONS} from '@/ui/constants/cosmicData';
import {
  Credits,
  Hero,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  LeanText,
  OrbLabel,
  PreviewOrb,
  StartButton,
} from './Home.styled';

export function Home() {
  return (
    <AppLayout>
      <Hero>
        <HeroTitle>Stellar Merge</HeroTitle>

        <HeroSubtitle>
          Coloca partículas cósmicas. Fusiona 3 iguales para crear objetos más
          complejos y desata la cosmogénesis en una aventura neón de lógica y
          estrategia.
        </HeroSubtitle>

        <HeroBanner>
          {/* ORB */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <PreviewOrb>
              <img
                src={COSMIC_ICONS.star_system}
                alt="preview"
                style={{width: 66, height: 66}}
                draggable={false}
              />
            </PreviewOrb>
            <OrbLabel>Vista previa</OrbLabel>
          </div>

          {/* TEXT */}
          <LeanText>
            <p style={{margin: '0 0 6px', fontWeight: 800, fontSize: 16}}>
              Comienza tu viaje cósmico
            </p>

            <p style={{margin: 0}}>
              Explora combinaciones, administra recursos y domina el Agujero
              Errante. Usa power-ups estratégicos para maniobras imposibles.
            </p>

            <Link to="/levels" style={{textDecoration: 'none'}}>
              <StartButton>Comenzar →</StartButton>
            </Link>
          </LeanText>
        </HeroBanner>

        <Credits>v1.0 — Stellar Merge • Vector Cartoon UI</Credits>
      </Hero>
    </AppLayout>
  );
}
