import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import AppLayout from '@/ui/layout';
import {Button} from '@/common/Button';

import {InputWrapper, Input} from './styles';

export default function EditName() {
  const navigate = useNavigate();
  const {name, setName} = useUserStore();

  const [value, setValue] = useState(name ?? '');

  const save = async () => {
    if (!value.trim()) return;

    await setName(value.trim());

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

        <Button variant="primary" fullWidth={true} onClick={save}>
          Guardar
        </Button>
      </InputWrapper>
    </AppLayout>
  );
}
