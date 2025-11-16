// src/ui/components/modals/LevelCompleteModal.tsx
import {useNavigate} from 'react-router-dom';
import {LEVELS} from '@/data/levels';
import styled from 'styled-components';

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
  border: 1.5px solid rgba(162, 121, 255, 0.35);
  box-shadow:
    0 0 32px rgba(135, 95, 255, 0.35),
    inset 0 0 18px rgba(115, 95, 255, 0.3);

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
  color: #d7c5ff;
  text-shadow: 0 0 12px rgba(181, 120, 255, 0.7);
  text-align: center;
`;

const Text = styled.p`
  color: #e6e0ff;
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

const Button = styled.button<{variant?: 'primary' | 'secondary' | 'ghost'}>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: 0.15s ease-out;

  ${({variant}) =>
    variant === 'primary'
      ? `
    background: linear-gradient(180deg, #8f6bff, #6238e8);
    color: white;
    box-shadow: 0 6px 18px rgba(128, 90, 255, 0.35);
    &:hover {
      filter: brightness(1.12);
    }
  `
      : variant === 'secondary'
        ? `
    background: rgba(255, 255, 255, 0.13);
    color: #cfc3ff;
    border: 1px solid rgba(169, 143, 255, 0.4);
    &:hover {
      background: rgba(255, 255, 255, 0.18);
    }
  `
        : `
    background: rgba(255,255,255,0.08);
    color: #e2d8ff;
    border: 1px solid rgba(255,255,255,0.1);
    &:hover {
      background: rgba(255,255,255,0.12);
    }
  `}
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

          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </BtnGroup>
      </ModalWrap>
    </Backdrop>
  );
}
