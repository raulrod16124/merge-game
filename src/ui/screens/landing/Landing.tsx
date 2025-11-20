import {useUserStore} from '@/state/user-store';
import {useNavigate} from 'react-router-dom';

export const Landing = () => {
  const authenticated = useUserStore(s => s.authenticated);
  const navigate = useNavigate();

  const handleStart = () => {
    if (authenticated) navigate('/home');
    else navigate('/login');
  };

  return (
    <div style={{padding: 20}}>
      <h1>Stellar Merge</h1>
      <p>Un universo de fusiones cósmicas te espera.</p>

      <button onClick={handleStart}>Comenzar</button>
    </div>
  );
};
