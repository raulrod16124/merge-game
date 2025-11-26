// src/ui/screens/settings/index.tsx

import {useState} from 'react';
import {useUserStore} from '@/state/user-store';
import AppLayout from '@/ui/layout';
import {Button} from '@/common/Button';
import {Section, SectionTitle, Row, Label, Toggle, LinkRow} from './styles';

import {ChevronRight} from 'lucide-react';

export default function Settings() {
  const {logout} = useUserStore();

  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [language, setLanguage] = useState('es');

  return (
    <AppLayout title="Ajustes" showBack={true} prevRoute="/home">
      <Section>
        <SectionTitle>General</SectionTitle>

        {/* Idioma */}
        <Row onClick={() => alert('Selector de idiomas próximamente')}>
          <Label>Idioma</Label>
          <div style={{opacity: 0.8}}>{language.toUpperCase()}</div>
          <ChevronRight size={20} />
        </Row>

        {/* Sonido */}
        <Row onClick={() => setSound(!sound)}>
          <Label>Sonido</Label>
          <Toggle active={sound}>{sound ? 'ON' : 'OFF'}</Toggle>
        </Row>

        {/* Vibración */}
        <Row onClick={() => setVibration(!vibration)}>
          <Label>Vibración</Label>
          <Toggle active={vibration}>{vibration ? 'ON' : 'OFF'}</Toggle>
        </Row>
      </Section>

      <Section>
        <SectionTitle>Información</SectionTitle>

        <LinkRow onClick={() => alert('Mostrar Política de Privacidad')}>
          <Label>Política de Privacidad</Label>
          <ChevronRight size={20} />
        </LinkRow>

        <LinkRow onClick={() => alert('Acerca de Stellar Merge')}>
          <Label>Acerca del juego</Label>
          <ChevronRight size={20} />
        </LinkRow>
      </Section>

      <Section>
        <Button
          variant="fail"
          fullWidth={true}
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}>
          Cerrar sesión
        </Button>
      </Section>
    </AppLayout>
  );
}
