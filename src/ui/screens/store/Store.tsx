import {AppLayout} from '@/ui/layout/AppLayout';
import styled from 'styled-components';
import {COLORS} from '@/ui/constants';

const Box = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 1.1rem;
  color: ${COLORS.white};
  opacity: 0.8;
`;

export default function Store() {
  return (
    <AppLayout title="Tienda">
      <Box>La tienda estará disponible pronto.</Box>
    </AppLayout>
  );
}
