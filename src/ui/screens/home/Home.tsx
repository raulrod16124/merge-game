// src/ui/screens/home/Home.tsx
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import {Button} from '@/common/Button';
import {
  Coins,
  Archive,
  Trophy,
  User,
  Settings,
  Box,
  SquareStar,
  Play,
  ChartSpline,
  Star,
} from 'lucide-react';
import {
  Container,
  TopBar,
  TopLeft,
  AvatarWrap,
  Content,
  Greeting,
  PlayButtonWrap,
  TabBar,
  TabItem,
  FloatingButtons,
  FloatingButton,
  UserName,
} from './styles';
import {CosmicAvatar} from '@/ui/components/cosmic-avatar';
import StarField from '@/ui/components/StarField';
import {COLORS} from '@/ui/constants';
import {CosmicXPStatus} from '@/ui/components/cosmic-avatar/CosmicXPStatus';
import {usePlayerStore} from '@/state';
import {formatCoins} from '@/utils/formatCoins';

export default function Home() {
  const navigate = useNavigate();
  const {name, coins, avatar} = useUserStore();
  const avatarVariant = usePlayerStore(s => s.avatarVariant);
  const progress = usePlayerStore(s => s.cosmicProgress[avatarVariant]);

  return (
    <Container>
      {/* animated star background */}
      <StarField />

      <TopBar>
        <TopLeft>
          <button
            className="header-coin"
            onClick={() => navigate('/store')}
            aria-label="Coins">
            <Coins size={20} strokeWidth={2.2} color={COLORS.primary} />{' '}
            <span>{formatCoins(coins)}</span>
          </button>
        </TopLeft>
        <TopLeft>
          <div className="header-xp">
            <Star size={20} fill={COLORS.secondary} />
            {formatCoins(progress.xp)}
          </div>
        </TopLeft>
      </TopBar>

      <Content>
        <AvatarWrap>
          <CosmicAvatar variant={avatar} />
          <CosmicXPStatus />
        </AvatarWrap>

        <Greeting>
          <UserName>
            Hola, <strong>{name ?? 'cosmico'}</strong>
          </UserName>
          <p className="sub">Tu universo te espera</p>
        </Greeting>

        <PlayButtonWrap>
          <Button
            variant="primary"
            fullWidth={true}
            onClick={() => navigate('/levels')}
            styles={{
              padding: '1.5dvh 18px',
              fontSize: '1.2rem',
              fontWeight: '900',
              color: COLORS.tertiary,
            }}>
            Jugar
          </Button>
        </PlayButtonWrap>
      </Content>

      {/* floating quick actions (ranking & inventory) */}
      <FloatingButtons>
        <FloatingButton onClick={() => navigate('/ranking')} title="Ranking">
          <Trophy size={20} strokeWidth={2.2} />
        </FloatingButton>

        <FloatingButton
          onClick={() => navigate('/inventory')}
          title="Inventario">
          <Archive size={20} strokeWidth={2.2} />
        </FloatingButton>

        <FloatingButton onClick={() => navigate('/stats')} title="Estadísticas">
          <ChartSpline size={20} strokeWidth={2.2} />
        </FloatingButton>
      </FloatingButtons>

      {/* bottom tab bar (mobile style) */}
      <TabBar role="tablist" aria-label="Main navigation">
        <TabItem onClick={() => navigate('/store')}>
          <Box size={30} strokeWidth={1.8} />
          <div>Tienda</div>
        </TabItem>

        <TabItem onClick={() => navigate('/achievements')}>
          <SquareStar size={30} strokeWidth={1.8} />
          <div>Logros</div>
        </TabItem>

        <TabItem $active={true} onClick={() => navigate('/home')}>
          <Play size={30} strokeWidth={1.8} />
          <div>Play</div>
        </TabItem>

        <TabItem onClick={() => navigate('/profile')}>
          <User size={30} strokeWidth={1.8} />
          <div>Perfil</div>
        </TabItem>

        <TabItem onClick={() => navigate('/settings')}>
          <Settings size={30} strokeWidth={1.8} />
          <div>Ajustes</div>
        </TabItem>
      </TabBar>
    </Container>
  );
}
