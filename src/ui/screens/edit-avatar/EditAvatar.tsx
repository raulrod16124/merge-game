import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';

import AppLayout from '@/ui/layout';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {VariantSelector, PreviewArea} from './styles';
import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {usePlayerStore} from '@/state';
import {VARIANT_SELECTOR} from '@/ui/constants';

export default function EditAvatar() {
  const navigate = useNavigate();
  const {avatar, setAvatarVariant} = useUserStore();

  const [temp, setTemp] = useState<AvatarVariant>(
    avatar ?? AvatarVariant.HYBRID,
  );

  const save = () => {
    const avatarOptions = VARIANT_SELECTOR.map(v => v.key);
    if (avatarOptions.includes(temp)) {
      console.log({temp});
      setAvatarVariant(temp);
      usePlayerStore.setState({avatarVariant: temp});
      navigate('/profile');
    }
  };

  return (
    <AppLayout title="Editar Avatar" prevRoute="/profile">
      <PreviewArea>
        <CosmicAvatar variant={temp} hideProgress={true} />
      </PreviewArea>

      <VariantSelector>
        {VARIANT_SELECTOR.map(v => (
          <Button
            variant="tertiary"
            key={v.key}
            selected={temp === v.key}
            onClick={() => setTemp(v.key as AvatarVariant)}>
            {v.label}
          </Button>
        ))}
        <Button variant="primary" onClick={save} styles={{marginTop: '30px'}}>
          Guardar Cambios
        </Button>
      </VariantSelector>
    </AppLayout>
  );
}
