// src/ui/screens/edit-avatar/EditAvatar.tsx
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';

import AppLayout from '@/ui/layout';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {
  PageContent,
  PreviewArea,
  ShapeSelector,
  ColorSelector,
  ColorDot,
  SectionTitle,
} from './styles';
import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {VARIANT_COLORS, VARIANT_SELECTOR} from '@/ui/constants';

export default function EditAvatar() {
  const navigate = useNavigate();
  const {avatar, setAvatarAppearance} = useUserStore();

  // TEMPORAL EDITING STATE
  const [tempShape, setTempShape] = useState<AvatarVariant>(
    avatar.shape ?? AvatarVariant.HYBRID,
  );

  const [tempColor, setTempColor] = useState<string>(
    avatar.color ?? VARIANT_COLORS[AvatarVariant.HYBRID],
  );

  const save = () => {
    setAvatarAppearance({
      shape: tempShape,
      color: tempColor,
      accessories: avatar.accessories ?? [],
    });
    navigate('/profile');
  };

  return (
    <AppLayout title="Editar Avatar" prevRoute="/profile">
      <PageContent>
        {/* PREVIEW */}
        <PreviewArea>
          <CosmicAvatar
            forceAppearance={{
              shape: tempShape,
              color: tempColor,
              accessories: avatar.accessories ?? [],
            }}
            hideProgress={true}
          />
        </PreviewArea>

        {/* SHAPE SELECTOR */}
        <SectionTitle>Forma del ser cósmico</SectionTitle>
        <ShapeSelector>
          {VARIANT_SELECTOR.map(v => (
            <Button
              key={v.key}
              variant="tertiary"
              selected={tempShape === v.key}
              onClick={() => setTempShape(v.key as AvatarVariant)}>
              {v.label}
            </Button>
          ))}
        </ShapeSelector>

        {/* COLOR SELECTOR */}
        <SectionTitle>Color energético</SectionTitle>
        <ColorSelector>
          {Object.values(VARIANT_COLORS).map(color => (
            <ColorDot
              key={color}
              $color={color}
              $active={tempColor === color}
              onClick={() => setTempColor(color)}
            />
          ))}
        </ColorSelector>

        <Button
          variant="primary"
          onClick={save}
          fullWidth={true}
          styles={{marginTop: '28px'}}>
          Guardar Cambios
        </Button>
      </PageContent>
    </AppLayout>
  );
}
