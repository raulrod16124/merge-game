import {Wrapper, Header, Content, BackButton, TabBar, TabItem} from './styles';
import {ArrowLeft, Box, Play, Settings, SquareStar, User} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';
import {HudNotifications} from '../components/HudNotifications';
import {usePlayerStore} from '@/state';
import React, {useEffect} from 'react';
import StarField from '../components/StarField';
import {soundManager} from '@/core/sound/soundManager';
import {vibrate} from '@/core/vibration';

interface Props {
  children: React.ReactNode;
  prevRoute?: string;
  title?: string;
  showBack?: boolean;
  hideHeader?: boolean;
  secondaryBg?: boolean;
  renderStarts?: boolean;
  muteMenuMusic?: boolean;
}

export default function AppLayout({
  children,
  prevRoute,
  title,
  showBack = true,
  hideHeader = false,
  secondaryBg = false,
  renderStarts = false,
  muteMenuMusic = false,
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

  useEffect(() => {
    setHandler((level: number) => {
      usePlayerStore.setState({lastEvolutionLevel: level});
    });
  }, []);

  useEffect(() => {
    if (!muteMenuMusic) {
      soundManager.playMusic('bgm-menu');
    }

    return () => {
      soundManager.stopMusic();
    };
  }, []);

  const handleBack = () => {
    soundManager.play('ui-back');
    vibrate(15);
    navigate(prevRoute || '-1');
  };

  const handleTabPress = (route: string) => {
    soundManager.play('ui-tap');
    vibrate(10);
    navigate(route);
  };

  return (
    <Wrapper $secondaryBg={secondaryBg}>
      <Content>
        {renderStarts && <StarField />}
        {!hideHeader && (
          <Header>
            {showBack ? (
              <BackButton onClick={handleBack}>
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
        {/* bottom tab bar (mobile style) */}
        {routesForTabBar.includes(pathname) && (
          <TabBar role="tablist" aria-label="Main navigation">
            <TabItem
              $active={pathname === '/store'}
              onClick={() => handleTabPress('/store')}>
              <Box size={30} strokeWidth={1.8} />
              <div>Tienda</div>
            </TabItem>

            <TabItem
              $active={pathname === '/achievements'}
              onClick={() => handleTabPress('/achievements')}>
              <SquareStar size={30} strokeWidth={1.8} />
              <div>Logros</div>
            </TabItem>

            <TabItem
              $active={pathname === '/home'}
              onClick={() => handleTabPress('/home')}>
              <Play size={30} strokeWidth={1.8} />
              <div>Play</div>
            </TabItem>

            <TabItem
              $active={pathname === '/profile'}
              onClick={() => handleTabPress('/profile')}>
              <User size={30} strokeWidth={1.8} />
              <div>Perfil</div>
            </TabItem>

            <TabItem
              $active={pathname === '/settings'}
              onClick={() => handleTabPress('/settings')}>
              <Settings size={30} strokeWidth={1.8} />
              <div>Ajustes</div>
            </TabItem>
          </TabBar>
        )}
      </Content>
    </Wrapper>
  );
}
