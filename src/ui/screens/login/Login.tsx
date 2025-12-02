// src/ui/screens/login/Login.tsx
import {useState, useEffect} from 'react';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {
  Wrapper,
  AvatarPreview,
  SelectorGrid,
  SectionTitle,
  ColorSelector,
  ColorDot,
} from './styles';
import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {VARIANT_COLORS, VARIANT_SELECTOR} from '@/ui/constants';
import Input from '@/common/Input';

export default function Login() {
  const [name, setName] = useState('');
  const [variant, setVariant] = useState<AvatarVariant>(AvatarVariant.HYBRID);
  const [color, setColor] = useState(VARIANT_COLORS[AvatarVariant.HYBRID]);

  const authenticated = useUserStore(s => s.authenticated);
  const authenticate = useUserStore(s => s.authenticate);

  const navigate = useNavigate();

  useEffect(() => {
    // if (authenticated) navigate('/home');
  }, [authenticated, navigate]);

  const handleEnter = async () => {
    if (!name.trim()) return;

    try {
      const appearance = {
        shape: variant,
        color: color,
        accessories: [],
      };

      await authenticate(name.trim(), appearance);
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Wrapper>
      <h1>Bienvenido</h1>
      <p>Elige tu avatar y tu nombre para comenzar tu viaje cósmico.</p>

      {/* PREVIEW */}
      <AvatarPreview>
        <CosmicAvatar
          forceAppearance={{
            shape: variant,
            color,
            accessories: [],
          }}
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
            onClick={() => {
              setVariant(v.key as AvatarVariant);
            }}>
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

      {/* NAME */}

      <Input
        value={name}
        placeholder="Nombre..."
        onChange={e => setName(e.target.value)}
        styles={{margin: '3dvh auto'}}
      />

      <Button variant="primary" fullWidth={true} onClick={handleEnter}>
        Entrar
      </Button>
    </Wrapper>
  );
}
