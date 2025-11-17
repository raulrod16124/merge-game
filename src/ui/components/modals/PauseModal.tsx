// src/ui/components/modals/PauseModal.tsx
import {useGameStore} from '@/state/game-store';
import {ModalBox, Overlay} from './PauseModal.styled';
import {Button} from '@/common/Button';

type Props = {onClose: () => void};

export function PauseModal({onClose}: Props) {
  const resetLevel = useGameStore(s => s.resetLevel);

  const handleReset = () => {
    resetLevel();
    onClose();
  };

  return (
    <Overlay>
      <ModalBox>
        <h2>Pausa</h2>

        <Button fullWidth={true} onClick={onClose} variant="primary">
          Reanudar
        </Button>

        <Button fullWidth={true} onClick={handleReset} variant="secondary">
          Reiniciar nivel
        </Button>

        <Button
          fullWidth={true}
          to="/levels"
          variant="tertiary"
          styles={{width: 'auto'}}>
          Salir
        </Button>
      </ModalBox>
    </Overlay>
  );
}
