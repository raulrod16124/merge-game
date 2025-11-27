import {Wrapper, Header, Content, BackButton} from './styles';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
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
  const navigate = useNavigate();
  const setHandler = usePlayerStore(s => s.setEvolutionHandler);

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
      </Content>
    </Wrapper>
  );
}
