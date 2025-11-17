// src/ui/components/modals/PauseModal.tsx
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {useGameStore} from '@/state';

type Props = {onClose: () => void};

export function PauseModal({onClose}: Props) {
  const resetLevel = useGameStore(s => s.resetLevel);
  const navigate = useNavigate();

  return (
    <Overlay>
      <ModalBox>
        <h2>Pausa</h2>

        <Btn onClick={onClose} $type="primary">
          Reanudar
        </Btn>

        <Btn onClick={resetLevel} $type="secondary">
          Reiniciar nivel
        </Btn>

        <Btn onClick={() => navigate('/levels')} $type="fail">
          Salir al menú
        </Btn>
      </ModalBox>
    </Overlay>
  );
}

// Styled
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
`;

const ModalBox = styled.div`
  background: linear-gradient(180deg, #2b2346, #1a152c);
  border-radius: 22px;
  padding: 28px;
  width: 82%;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);

  h2 {
    color: #fff;
    font-size: 1.8rem;
    margin-bottom: 18px;
    font-weight: 700;
    text-shadow: 0 0 12px #9b7bff;
  }
`;

const Btn = styled.button<{$type: 'primary' | 'secondary' | 'fail'}>`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  color: #fff;

  ${({$type}) =>
    $type === 'primary' &&
    `background: linear-gradient(180deg, #ffc653, #ff9f00);`}

  ${({$type}) =>
    $type === 'secondary' &&
    `background: linear-gradient(180deg, #9b7bff, #6b4fdc);`}

  ${({$type}) =>
    $type === 'fail' && `background: linear-gradient(180deg,#ff6b6b,#c74343);`}
`;
