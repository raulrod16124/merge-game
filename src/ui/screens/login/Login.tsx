import styled from 'styled-components';
import {COLORS} from '@/ui/constants';
import {Button} from '@/common/Button';
import {useState, useEffect} from 'react';
import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

const Wrapper = styled.div`
  padding: 40px 24px;
  text-align: center;
  min-height: 100vh;
  background: #0b1220;
  color: ${COLORS.white};

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 28px;
  }

  input {
    padding: 14px 16px;
    width: 100%;
    max-width: 320px;
    border-radius: 12px;
    border: none;
    font-size: 1rem;
    margin-bottom: 24px;
    background: ${COLORS.tertiaryDark};
    color: ${COLORS.white};
  }
`;

export default function Login() {
  const [name, setName] = useState('');
  const authenticated = useUserStore(state => state.authenticated);
  const authenticate = useUserStore(state => state.authenticate);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/home');
  }, [authenticated]);

  const handleEnter = () => {
    if (!name.trim()) return;
    authenticate(name);
  };

  return (
    <Wrapper>
      <h1>Elige un nombre</h1>

      <input
        placeholder="Tu nombre..."
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <Button variant="primary" fullWidth onClick={handleEnter}>
        Entrar
      </Button>
    </Wrapper>
  );
}
