import {Wrapper, Header, Content, BackButton} from './styles';
import {ArrowLeft} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {HudNotifications} from '../components/HudNotifications';

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

  return (
    <Wrapper>
      <Content>
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
      </Content>
    </Wrapper>
  );
}
