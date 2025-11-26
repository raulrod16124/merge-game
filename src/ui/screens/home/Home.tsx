import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import {Button} from '@/common/Button';
import {
  Container,
  Header,
  IconButtons,
  HeroArea,
  Greeting,
  PlayArea,
  GlowBackground,
} from './styles';

import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import {User, Settings, ShoppingBag, Coins, Award} from 'lucide-react';
import CosmicMiniProgress from '@/ui/components/cosmic-avatar/CosmicMiniProgress';

export default function Home() {
  const navigate = useNavigate();
  const {name, coins, avatar} = useUserStore();

  return (
    <Container>
      <Header>
        <button className="coins" onClick={() => navigate('/store')}>
          <Coins size={22} strokeWidth={2.4} /> {coins}
        </button>

        <IconButtons>
          <button onClick={() => navigate('/profile')}>
            <User size={22} strokeWidth={2.4} />
          </button>
          <button onClick={() => navigate('/achievements')}>
            <Award size={22} strokeWidth={2.4} />
          </button>
          <button onClick={() => navigate('/settings')}>
            <Settings size={22} strokeWidth={2.4} />
          </button>
          <button onClick={() => navigate('/store')}>
            <ShoppingBag size={22} strokeWidth={2.4} />
          </button>
        </IconButtons>
      </Header>

      <HeroArea>
        <GlowBackground />
        <CosmicAvatar variant={avatar?.variant} />
        {/* Cosmic progress mini HUD */}
        <CosmicMiniProgress />

        <Greeting>
          Hola, <strong>{name}</strong>
          <span className="sub">Tu universo te espera.</span>
        </Greeting>
      </HeroArea>

      <PlayArea>
        <Button fullWidth={true} variant="primary" to="/levels">
          Jugar
        </Button>
      </PlayArea>
    </Container>
  );
}
