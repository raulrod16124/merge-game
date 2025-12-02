// src/ui/screens/login/Login.tsx
import {useState, useEffect} from 'react';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {Wrapper, AvatarPreview, SelectorGrid} from './styles';
import {AvatarVariant} from '@/ui/components/cosmic-avatar/types';
import {VARIANT_SELECTOR} from '@/ui/constants';

export default function Login() {
  const [name, setName] = useState('');
  const [variant, setVariant] = useState<AvatarVariant>(AvatarVariant.HYBRID);

  const authenticated = useUserStore(s => s.authenticated);
  const authenticate = useUserStore(s => s.authenticate);

  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/home');
  }, [authenticated, navigate]);

  const handleEnter = async () => {
    if (!name.trim()) return;

    try {
      await authenticate(name.trim(), variant);
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
        <CosmicAvatar variant={variant} hideProgress={true} />
      </AvatarPreview>

      {/* SELECTOR */}
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

      {/* NAME */}
      <input
        placeholder="Nombre..."
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <Button variant="primary" fullWidth={true} onClick={handleEnter}>
        Entrar
      </Button>
    </Wrapper>
  );
}
