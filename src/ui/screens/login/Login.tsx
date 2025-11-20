import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';

export const Login = () => {
  const [name, setName] = useState('');
  const authenticate = useUserStore(s => s.authenticate);
  const authenticated = useUserStore(s => s.authenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/home');
  }, [authenticated, navigate]);

  const handleLogin = () => {
    if (!name.trim()) return;
    authenticate(name);
  };

  return (
    <div style={{padding: 20}}>
      <h1>Elige un nombre</h1>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre..."
      />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};
