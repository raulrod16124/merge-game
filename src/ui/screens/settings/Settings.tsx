// src/ui/screens/settings/index.tsx

import {useUserStore} from '@/state/user-store';
import {useSettingsStore} from '@/state/settings-store';
import AppLayout from '@/ui/layout';
import {Button} from '@/common/Button';

import {
  Section,
  SectionTitle,
  CosmicDivider,
  SettingCard,
  Label,
  Toggle,
  LinkCard,
  Wrapper,
} from './styles';

import {ChevronRight} from 'lucide-react';

export default function Settings() {
  const {logout} = useUserStore();

  const sound = useSettingsStore(state => state.soundEnabled);
  const setSoundEnabled = useSettingsStore(state => state.setSoundEnabled);

  const vibration = useSettingsStore(state => state.vibrationEnabled);
  const setVibrationEnabled = useSettingsStore(
    state => state.setVibrationEnabled,
  );

  const language = useSettingsStore(state => state.language);

  return (
    <AppLayout title="Ajustes" showBack={true} prevRoute="/home">
      <Wrapper>
        {/* --- SECCIÓN GENERAL --- */}
        <Section>
          x<SectionTitle>General</SectionTitle>
          <CosmicDivider />
          {/* Idioma */}
          <SettingCard
            onClick={() => alert('Selector de idiomas próximamente')}>
            <Label>Idioma</Label>
            <div style={{opacity: 0.8}}>{language.toUpperCase()}</div>
            <ChevronRight size={20} />
          </SettingCard>
          {/* Sonido */}
          <SettingCard onClick={() => setSoundEnabled(!sound)}>
            <Label>Sonido</Label>
            <Toggle $active={sound}>{sound ? 'ON' : 'OFF'}</Toggle>
          </SettingCard>
          {/* Vibración */}
          <SettingCard onClick={() => setVibrationEnabled(!vibration)}>
            <Label>Vibración</Label>
            <Toggle $active={vibration}>{vibration ? 'ON' : 'OFF'}</Toggle>
          </SettingCard>
        </Section>

        {/* --- SECCIÓN INFORMACIÓN --- */}
        <Section>
          <SectionTitle>Información</SectionTitle>
          <CosmicDivider />

          <LinkCard onClick={() => alert('Mostrar Política de Privacidad')}>
            <Label>Política de Privacidad</Label>
            <ChevronRight size={20} />
          </LinkCard>

          <LinkCard onClick={() => alert('Acerca del juego')}>
            <Label>Acerca del juego</Label>
            <ChevronRight size={20} />
          </LinkCard>
        </Section>

        {/* --- CERRAR SESIÓN --- */}
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
      </Wrapper>
    </AppLayout>
  );
}
