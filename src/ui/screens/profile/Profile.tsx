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
  RightContent,
} from './styles';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Pencil} from 'lucide-react';
import {COLORS} from '../../constants/index';
import {CosmicXPStatus} from '@/ui/components/cosmic-avatar/CosmicXPStatus';

export default function Profile() {
  const navigate = useNavigate();
  const {name, uniqueName} = useUserStore();
  const timestamp = new Date();
  console.log(`${name}#${timestamp.getTime().toString().slice(0, 4)}`);
  return (
    <AppLayout title="Perfil" showBack={true} prevRoute="/home">
      <Section>
        {/* Avatar con edit */}
        <AvatarWrapper>
          <CosmicAvatar />
          <CosmicXPStatus />
          <EditIcon onClick={() => navigate('/edit-avatar')}>
            <Pencil size={20} strokeWidth={2.4} color={COLORS.primary} />
          </EditIcon>
        </AvatarWrapper>

        {/* Unique Name */}
        <Row>
          <FieldLabel>ID</FieldLabel>
          <RightContent>
            <Value>{uniqueName}</Value>
          </RightContent>
        </Row>
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
      </Section>
    </AppLayout>
  );
}
