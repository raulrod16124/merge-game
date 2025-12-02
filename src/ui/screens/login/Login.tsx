// src/ui/screens/login/Login.tsx
import {useState, useEffect} from 'react';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';
import Input from '@/common/Input';

import {
  Wrapper,
  TopBlock,
  BottomBlock,
  AvatarPreview,
  SelectorGrid,
  SectionTitle,
  ColorSelector,
  ColorDot,
} from './styles';

import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {VARIANT_COLORS, VARIANT_SELECTOR} from '@/ui/constants';
import {useDeviceHeight} from '@/hooks/useDeviceHeight';
import styled from 'styled-components';

const Scaler = styled.div<{scale: number}>`
  transform: scale(${p => p.scale});
  transform-origin: top center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  height: 90%;
`;

export default function Login() {
  const [name, setName] = useState('');
  const [variant, setVariant] = useState<AvatarVariant>(AvatarVariant.HYBRID);
  const [color, setColor] = useState(VARIANT_COLORS[AvatarVariant.HYBRID]);

  const authenticated = useUserStore(s => s.authenticated);
  const authenticate = useUserStore(s => s.authenticate);

  const navigate = useNavigate();
  const height = useDeviceHeight();

  useEffect(() => {
    // if (authenticated) navigate('/home');
  }, [authenticated, navigate]);

  // -------------- AUTO-SCALE PERFECTO PARA CUALQUIER ALTURA --------------
  // Más pequeño el dispositivo → más reducimos la parte superior
  let scale = 1;
  if (height < 750) scale = height / 750;
  if (scale < 0.78) scale = 0.78;

  const handleEnter = async () => {
    if (!name.trim()) return;

    const appearance = {
      shape: variant,
      color,
      accessories: [],
    };

    await authenticate(name.trim(), appearance);
    navigate('/home');
  };

  return (
    <Wrapper>
      {/* ---------------- TOP AREA (escala automáticamente) ---------------- */}
      <TopBlock>
        <Scaler scale={scale}>
          <h1>Bienvenido</h1>
          <p>Elige tu avatar y tu nombre para comenzar tu viaje cósmico.</p>

          {/* PREVIEW */}
          <AvatarPreview>
            <CosmicAvatar
              forceAppearance={{shape: variant, color, accessories: []}}
              hideProgress={true}
            />
          </AvatarPreview>

          {/* SHAPE SELECTOR */}
          <SectionTitle>Forma inicial del ser cósmico</SectionTitle>
          <SelectorGrid>
            {VARIANT_SELECTOR.map(v => (
              <Button
                variant="tertiary"
                key={v.key}
                selected={variant === v.key}
                onClick={() => setVariant(v.key as AvatarVariant)}>
                {v.label}
              </Button>
            ))}
          </SelectorGrid>

          {/* COLOR SELECTOR */}
          <SectionTitle>Color energético</SectionTitle>
          <ColorSelector>
            {Object.values(VARIANT_COLORS).map(c => (
              <ColorDot
                key={c}
                $color={c}
                $active={color === c}
                onClick={() => setColor(c)}
              />
            ))}
          </ColorSelector>
        </Scaler>
      </TopBlock>

      {/* ---------------- BOTTOM AREA (siempre visible) ---------------- */}
      <BottomBlock>
        <Input
          value={name}
          placeholder="Nombre..."
          onChange={e => setName(e.target.value)}
          styles={{marginBottom: '10%'}}
        />

        <Button variant="primary" fullWidth={true} onClick={handleEnter}>
          Entrar
        </Button>
      </BottomBlock>
    </Wrapper>
  );
}
