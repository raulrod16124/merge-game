import {Wrapper, Header, Content, BackButton, TabBar, TabItem} from './styles';
import {ArrowLeft, Box, Play, Settings, SquareStar, User} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {HudNotifications} from '../components/HudNotifications';
import {usePlayerStore} from '@/state';
import React from 'react';
import {CosmicEvolutionModal} from '../components/modals/CosmicEvolutionModal';
import StarField from '../components/StarField';

interface Props {
  children: React.ReactNode;
  prevRoute?: string;
  title?: string;
  showBack?: boolean;
  hideHeader?: boolean;
}

export default function AppLayout({
  children,
  prevRoute,
  title,
  showBack = true,
  hideHeader = false,
}: Props) {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const setHandler = usePlayerStore(s => s.setEvolutionHandler);

  const routesForTabBar = [
    '/store',
    '/achievements',
    '/home',
    '/profile',
    '/settings',
  ];

  React.useEffect(() => {
    setHandler((level: number) => {
      usePlayerStore.setState({lastEvolutionLevel: level});
    });
  }, []);

  return (
    <Wrapper>
      <Content>
        <StarField />
        {!hideHeader && (
          <Header>
            {showBack ? (
              <BackButton onClick={() => navigate(prevRoute || '-1')}>
                <ArrowLeft size={24} strokeWidth={2.4} />
              </BackButton>
            ) : (
              <div style={{width: 48}} />
            )}

            {title && <h2>{title}</h2>}

            <div style={{width: 48}} />
          </Header>
        )}

        {children}
        <HudNotifications />
        <CosmicEvolutionModal />
        {/* bottom tab bar (mobile style) */}
        {routesForTabBar.includes(pathname) && (
          <TabBar role="tablist" aria-label="Main navigation">
            <TabItem
              $active={pathname === '/store'}
              onClick={() => navigate('/store')}>
              <Box size={30} strokeWidth={1.8} />
              <div>Tienda</div>
            </TabItem>

            <TabItem
              $active={pathname === '/achievements'}
              onClick={() => navigate('/achievements')}>
              <SquareStar size={30} strokeWidth={1.8} />
              <div>Logros</div>
            </TabItem>

            <TabItem
              $active={pathname === '/home'}
              onClick={() => navigate('/home')}>
              <Play size={30} strokeWidth={1.8} />
              <div>Play</div>
            </TabItem>

            <TabItem
              $active={pathname === '/profile'}
              onClick={() => navigate('/profile')}>
              <User size={30} strokeWidth={1.8} />
              <div>Perfil</div>
            </TabItem>

            <TabItem
              $active={pathname === '/settings'}
              onClick={() => navigate('/settings')}>
              <Settings size={30} strokeWidth={1.8} />
              <div>Ajustes</div>
            </TabItem>
          </TabBar>
        )}
      </Content>
    </Wrapper>
  );
}
