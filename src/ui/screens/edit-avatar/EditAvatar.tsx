import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';

import AppLayout from '@/ui/layout';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {VariantSelector, PreviewArea} from './styles';
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {usePlayerStore} from '@/state';

export default function EditAvatar() {
  const navigate = useNavigate();
  const {avatar, setAvatarVariant} = useUserStore();

  const [temp, setTemp] = useState(avatar?.variant ?? 'hybrid');

  const variants = [
    {key: 'abstract', label: 'Abstract'},
    {key: 'humanoid', label: 'Humanoide'},
    {key: 'hybrid', label: 'Híbrido'},
  ];

  const save = () => {
    setAvatarVariant(temp);
    usePlayerStore.setState({avatarVariant: temp});
    navigate('/profile');
  };

  return (
    <AppLayout title="Editar Avatar" prevRoute="/profile">
      <PreviewArea>
        <CosmicAvatar hideProgress={true} />
      </PreviewArea>

      <VariantSelector>
        {variants.map(v => (
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
