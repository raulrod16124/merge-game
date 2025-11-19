// src/ui/screens/Home.tsx
import {AppLayout} from '../../ui/layout/AppLayout';
import {COSMIC_ICONS} from '../constants';
import {
  Credits,
  Hero,
  HeroBanner,
  HeroSubtitle,
  HeroTitle,
  OrbLabel,
  PreviewOrb,
} from './Home.styled';
import {Button} from '../../common/Button';
import {usePWAInstall} from '../../hooks/usePWAInstall';

export function Home() {
  const {canInstall, installApp} = usePWAInstall();
  return (
    <AppLayout>
      <Hero>
        <HeroTitle>Comienza tu viaje cósmico</HeroTitle>

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
          <Button
            to="/levels"
            variant="primary"
            styles={{
              margin: '24px auto',
              padding: '12px 24px',
              fontSize: '1.2rem',
            }}>
            Comenzar
          </Button>
        </HeroBanner>

        <Credits>v1.0 — Stellar Merge • Vector Cartoon UI</Credits>
        {canInstall && (
          <Button
            variant="secondary"
            onClick={installApp}
            styles={{
              margin: '15px auto',
              padding: '12px 24px',
              fontSize: '1.2rem',
            }}>
            Instalar Stellar Merge
          </Button>
        )}
      </Hero>
    </AppLayout>
  );
}
