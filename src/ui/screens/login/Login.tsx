import {useState, useEffect} from 'react';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {Button} from '@/common/Button';

import {Wrapper, AvatarPreview, SelectorGrid, OptionCard} from './styles';
import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

export default function Login() {
  const [name, setName] = useState('');
  const [variant, setVariant] = useState('hybrid');

  const authenticated = useUserStore(s => s.authenticated);
  const authenticate = useUserStore(s => s.authenticate);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/home');
  }, [authenticated]);

  const handleEnter = () => {
    if (!name.trim()) return;
    authenticate(name.trim(), variant as AvatarVariant);
  };

  return (
    <Wrapper>
      <h1>Bienvenido</h1>
      <p>Elige tu avatar y tu nombre para comenzar tu viaje cósmico.</p>

      {/* PREVIEW */}
      <AvatarPreview>
        <CosmicAvatar variant={variant as AvatarVariant} hideProgress={true} />
      </AvatarPreview>

      {/* SELECTOR */}
      <SelectorGrid>
        <OptionCard
          active={variant === 'abstract'}
          onClick={() => setVariant('abstract')}>
          Abstracto
        </OptionCard>

        <OptionCard
          active={variant === 'humanoid'}
          onClick={() => setVariant('humanoid')}>
          Humanoide
        </OptionCard>

        <OptionCard
          active={variant === 'hybrid'}
          onClick={() => setVariant('hybrid')}>
          Híbrido
        </OptionCard>
      </SelectorGrid>

      {/* NAME */}
      <input
        placeholder="Nombre..."
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <Button variant="primary" fullWidth onClick={handleEnter}>
        Entrar
      </Button>
    </Wrapper>
  );
}
