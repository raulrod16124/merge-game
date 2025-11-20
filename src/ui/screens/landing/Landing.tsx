import styled from 'styled-components';
import {COLORS} from '@/ui/constants';
import {Button} from '@/common/Button';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

const Wrapper = styled.div`
  padding: 48px;
  text-align: center;
  min-height: 100dvh;
  height: 100dvh;
  background: #0b1220;
  color: ${COLORS.white};

  h1 {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 12px;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 40px;
  }
`;

export default function Landing() {
  const authenticated = useUserStore(state => state.authenticated);
  const navigate = useNavigate();

  const handleStart = () => {
    if (authenticated) navigate('/home');
    else navigate('/login');
  };

  return (
    <Wrapper>
      <h1>Stellar Merge</h1>
      <p>Crea, fusiona y da forma al universo.</p>

      <Button variant="secondary" onClick={handleStart}>
        Comenzar
      </Button>
    </Wrapper>
  );
}
