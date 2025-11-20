import {Wrapper, Header, Content} from './styles';
import {Button} from '@/common/Button';
import {useNavigate} from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export function AppLayout({children, title, showBack = true}: Props) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Content>
        <Header>
          <div className="back-btn">
            {showBack && (
              <Button
                variant="tertiary"
                onClick={() => navigate('/home')}
                fullWidth>
                ←
              </Button>
            )}
          </div>
          {title && <h2>{title}</h2>}

          {/* Espacio para balancear el header visualmente */}
          <div style={{width: 48}} />
        </Header>

        {children}
      </Content>
    </Wrapper>
  );
}
