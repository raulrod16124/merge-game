import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import {Button} from '@/common/Button';
import {Container, Header, IconButtons, AvatarArea, PlayArea} from './styles';
import {CosmicAvatar} from '@/ui/components/CosmicAvatar';

export default function Home() {
  const navigate = useNavigate();
  const {name, coins, avatar} = useUserStore();

  return (
    <Container>
      <Header>
        <div className="coins">💰 {coins}</div>

        <IconButtons>
          <button onClick={() => navigate('/profile')}>👤</button>
          <button onClick={() => navigate('/settings')}>⚙️</button>
          <button onClick={() => navigate('/store')}>🛒</button>
        </IconButtons>
      </Header>

      <AvatarArea>
        <CosmicAvatar name={name} />
      </AvatarArea>

      <PlayArea>
        <Button variant="primary" fullWidth={true} to="/levels">
          Jugar
        </Button>
      </PlayArea>
    </Container>
  );
}
