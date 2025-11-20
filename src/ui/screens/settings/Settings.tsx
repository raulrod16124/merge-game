import {AppLayout} from '@/ui/layout/AppLayout';
import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

const Box = styled.div`
  padding: 24px;
  color: ${COLORS.white};

  div {
    margin-bottom: 18px;
    opacity: 0.85;
    font-size: 1.1rem;
  }
`;

export default function Settings() {
  return (
    <AppLayout title="Ajustes">
      <Box>
        <div>Idioma</div>
        <div>Sonido</div>
        <div>Política de Privacidad</div>
        <div>Términos y Condiciones</div>
      </Box>
    </AppLayout>
  );
}
