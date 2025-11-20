import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';

import AppLayout from '@/ui/layout';
import {
  Section,
  AvatarWrapper,
  Row,
  FieldLabel,
  Value,
  EditIcon,
  ButtonsArea,
  RightContent,
} from './styles';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Pencil} from 'lucide-react';
import {Button} from '@/common/Button';
import {COLORS} from '../../constants/index';

export default function Profile() {
  const navigate = useNavigate();
  const {name, avatar} = useUserStore();

  return (
    <AppLayout title="Perfil" showBack={true} prevRoute="/home">
      <Section>
        {/* Avatar con edit */}
        <AvatarWrapper>
          <CosmicAvatar variant={avatar?.variant} />
          <EditIcon onClick={() => navigate('/edit-avatar')}>
            <Pencil size={20} strokeWidth={2.4} color={COLORS.primary} />
          </EditIcon>
        </AvatarWrapper>

        {/* Nombre con edit */}
        <Row>
          <FieldLabel>Nombre</FieldLabel>
          <RightContent>
            <Value>{name}</Value>

            <EditIcon className="edit" onClick={() => navigate('/edit-name')}>
              <Pencil size={14} strokeWidth={2.4} color={COLORS.primary} />
            </EditIcon>
          </RightContent>
        </Row>

        {/* Inventario */}
        <ButtonsArea>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate('/inventory')}>
            Ver Inventario
          </Button>
        </ButtonsArea>
      </Section>
    </AppLayout>
  );
}
