import AppLayout from '@/ui/layout';
import styled from 'styled-components';
import {COLORS} from '@/ui/constants';
import {useUserStore} from '@/state/user-store';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

const VariantSelector = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Box = styled.div`
  padding: 24px;
  text-align: center;

  .avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    background: ${COLORS.tertiaryDark};
    color: ${COLORS.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    border-radius: 50%;
  }

  p {
    margin-top: 12px;
    opacity: 0.9;
    font-size: 1.2rem;
  }
`;

const variants = [
  {key: 'abstract', label: 'Abstracto'},
  {key: 'humanoid', label: 'Humanoide'},
  {key: 'hybrid', label: 'Híbrido'},
];

export default function Profile() {
  const {avatar, name, setAvatarVariant} = useUserStore();

  return (
    <AppLayout title="Perfil">
      <Box>
        <div className="avatar">
          <CosmicAvatar variant={avatar?.variant} />
        </div>

        <p>{name}</p>

        <VariantSelector>
          {variants.map(v => (
            <Button
              fullWidth
              variant={avatar?.variant === v.key ? 'primary' : 'secondary'}
              onClick={() => setAvatarVariant(v.key as AvatarVariant)}>
              {v.label}
            </Button>
          ))}
        </VariantSelector>
      </Box>
    </AppLayout>
  );
}
