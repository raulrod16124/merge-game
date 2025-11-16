// src/ui/components/modals/LevelCompleteModal.tsx
import {useNavigate} from 'react-router-dom';
import {LEVELS} from '@/data/levels';
import styled from 'styled-components';
import {Button} from '@/common/Button';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 6, 14, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 80;
`;

const ModalWrap = styled.div`
  width: 90%;
  max-width: 420px;
  padding: 28px;
  border-radius: 28px;
  background: rgba(24, 20, 36, 0.92);
  border: 1.5px solid #4cd964;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;

  animation: popIn 0.25s ease-out;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.86);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #4cd964;
  text-align: center;
`;

const Text = styled.p`
  color: #ffffff;
  text-align: center;
  font-size: 1.05rem;
`;

const BtnGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

type Props = {
  levelId: string;
  onClose: () => void;
};

export function LevelCompleteModal({levelId, onClose}: Props) {
  const navigate = useNavigate();
  const level = (LEVELS as any)[levelId];

  const nextLevelId = (() => {
    const num = Number(levelId.replace('level0', ''));
    const next = `level0${num + 1}`;
    return (LEVELS as any)[next] ? next : null;
  })();

  return (
    <Backdrop>
      <ModalWrap>
        <Title>¡Nivel completado! 🌟</Title>
        <Text>
          Has superado <strong>{level?.name}</strong>
        </Text>

        <BtnGroup>
          {nextLevelId && (
            <Button
              variant="primary"
              onClick={() => navigate(`/play/${nextLevelId}`)}>
              Siguiente nivel →
            </Button>
          )}

          <Button variant="secondary" onClick={() => navigate('/levels')}>
            Volver a niveles
          </Button>

          <Button variant="tertiary" onClick={() => navigate('/levels')}>
            Cerrar
          </Button>
        </BtnGroup>
      </ModalWrap>
    </Backdrop>
  );
}
