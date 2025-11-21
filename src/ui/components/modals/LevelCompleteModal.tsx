// src/ui/board/LevelCompleteModal.tsx
import styled from 'styled-components';
import {Button} from '@/common/Button';
import {COLORS} from '@/ui/constants';
import {Star, Trophy} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import {getNextLevelID} from '@/utils/getNextLevelID';

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

const Box = styled.div`
  width: 90%;
  margin: 0 5%;
  max-width: 420px;
  background: linear-gradient(180deg, #2b2346, #1a152c);
  padding: 28px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 12px;
`;

const CoinsBox = styled.div`
  font-size: 1.3rem;
  margin: 14px 0;
  font-weight: 700;
  color: ${COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const FusionList = styled.div`
  margin: 18px auto 28px auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: white;
  opacity: 0.85;
`;

const FusionItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  padding: 4px 0;
`;

export function LevelCompleteModal({
  coins,
  fusionStats,
  onContinue,
}: {
  coins: number;
  fusionStats: {type: string; qty: number}[];
  onContinue: () => void;
}) {
  const {levelId} = useParams();
  const navigate = useNavigate();
  const nextLevel = getNextLevelID(levelId || '');
  return (
    <Overlay>
      <Box>
        <Trophy size={50} color={COLORS.primary} style={{marginBottom: 10}} />
        <Title>¡Nivel Completado!</Title>

        <CoinsBox>
          <Star size={20} /> +{coins} monedas
        </CoinsBox>

        {fusionStats.length > 0 && (
          <FusionList>
            {fusionStats.map(f => (
              <FusionItem key={f.type}>
                <span>{f.type}</span>
                <span>x{f.qty}</span>
              </FusionItem>
            ))}
          </FusionList>
        )}
        <ButtonContainer>
          <Button
            variant="primary"
            fullWidth={true}
            onClick={() => navigate(`/play/${nextLevel}`)}>
            Próximo nivel
          </Button>
          <Button
            to="/levels"
            variant="secondary"
            fullWidth={true}
            onClick={onContinue}>
            Volver a niveles
          </Button>
          <Button variant="tertiary" fullWidth={true} onClick={onContinue}>
            Cerrar
          </Button>
        </ButtonContainer>
      </Box>
    </Overlay>
  );
}
