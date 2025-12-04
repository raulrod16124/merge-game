// src/ui/screens/home/Home.tsx
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import {Button} from '@/common/Button';
import {
  Coins,
  Trophy,
  User,
  Settings,
  Box,
  SquareStar,
  Play,
  ChartSpline,
  Star,
  Users,
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
import {soundManager} from '@/core/sound/soundManager';
import {vibrate} from '@/core/vibration';
import {useEffect} from 'react';

export default function Home() {
  const navigate = useNavigate();
  const {name, coins} = useUserStore();
  const progress = usePlayerStore(s => s.cosmicProgress);

  useEffect(() => {
    soundManager.playMusic('bgm-menu');

    return () => {
      soundManager.stopMusic();
    };
  }, []);

  const handleTabPress = (route: string) => {
    soundManager.play('ui-tap');
    vibrate(10);
    navigate(route);
  };

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
          <CosmicAvatar />
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

        <FloatingButton onClick={() => navigate('/stats')} title="Estadísticas">
          <ChartSpline size={20} strokeWidth={2.2} />
        </FloatingButton>
        <FloatingButton onClick={() => navigate('/friends')} title="Amigos∫">
          <Users size={20} strokeWidth={2.2} />
        </FloatingButton>
      </FloatingButtons>

      {/* bottom tab bar (mobile style) */}
      <TabBar role="tablist" aria-label="Main navigation">
        <TabItem onClick={() => handleTabPress('/store')}>
          <Box size={30} strokeWidth={1.8} />
          <div>Tienda</div>
        </TabItem>

        <TabItem onClick={() => handleTabPress('/achievements')}>
          <SquareStar size={30} strokeWidth={1.8} />
          <div>Logros</div>
        </TabItem>

        <TabItem $active={true} onClick={() => handleTabPress('/home')}>
          <Play size={30} strokeWidth={1.8} />
          <div>Play</div>
        </TabItem>

        <TabItem onClick={() => handleTabPress('/profile')}>
          <User size={30} strokeWidth={1.8} />
          <div>Perfil</div>
        </TabItem>

        <TabItem onClick={() => handleTabPress('/settings')}>
          <Settings size={30} strokeWidth={1.8} />
          <div>Ajustes</div>
        </TabItem>
      </TabBar>
    </Container>
  );
}
