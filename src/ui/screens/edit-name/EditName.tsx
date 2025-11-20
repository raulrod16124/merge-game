import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import AppLayout from '@/ui/layout';
import {Button} from '@/common/Button';

import {InputWrapper, Input} from './styles';

export default function EditName() {
  const navigate = useNavigate();
  const {name, userId} = useUserStore();
  const setStore = useUserStore.setState;

  const [value, setValue] = useState(name ?? '');

  const save = () => {
    if (!value.trim()) return;

    // Updating store
    setStore(state => ({
      ...state,
      name: value,
    }));

    // Persistir local
    const stored = localStorage.getItem('stellar_user');
    if (stored) {
      const u = JSON.parse(stored);
      u.name = value;
      localStorage.setItem('stellar_user', JSON.stringify(u));
    }

    navigate('/profile');
  };

  return (
    <AppLayout title="Editar Nombre" showBack={true} prevRoute="/profile">
      <InputWrapper>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          maxLength={20}
          placeholder="Tu nombre..."
        />

        <Button variant="primary" fullWidth onClick={save}>
          Guardar
        </Button>
      </InputWrapper>
    </AppLayout>
  );
}
