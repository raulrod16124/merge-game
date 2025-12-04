// src/ui/board/LevelCompleteModal.tsx
import styled from 'styled-components';
import {Button} from '@/common/Button';
import {COLORS, COSMIC_ACHIEVEMENTS, COSMIC_ICONS} from '@/ui/constants';
import {Star, Trophy} from 'lucide-react';
import {useParams} from 'react-router-dom';
import {getNextLevelID} from '@/utils/getNextLevelID';
import {ACHIEVEMENTS} from '@/data/achievements';
import {useGameStore} from '@/state/game-store';
import {formatCoins} from '@/utils/formatCoins';

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

const AchievementsSection = styled.div`
  margin-top: 24px;
  text-align: left;

  h3 {
    color: #ffd27f;
    margin-bottom: 8px;
    font-size: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    color: white;
    font-size: 0.9rem;
  }

  img {
    width: 32px;
    height: 32px;
  }
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

export function LevelCompleteModal({
  coins,
  newAchievements,
  onNextLevel,
  onContinue,
}: {
  coins: number;
  newAchievements: string[];
  onNextLevel: (nextLevelId: string) => void;
  onContinue: () => void;
}) {
  const {levelId} = useParams();
  const nextLevel = getNextLevelID(levelId || '');

  // --- NEW: Read XP from game-store ---
  const levelResult = useGameStore(s => s.levelResult);
  const xpEarned = levelResult?.xpEarned ?? 0;

  const clearLevelResult = useGameStore(s => s.setLevelResult);

  return (
    <Overlay>
      <Box>
        <Trophy size={50} color={COLORS.primary} style={{marginBottom: 10}} />
        <Title>¡Nivel Completado!</Title>

        {newAchievements?.length > 0 && (
          <AchievementsSection>
            <h3>🎉 Logros Desbloqueados</h3>

            <ul>
              {newAchievements.map(id => {
                const a = ACHIEVEMENTS.find(x => x.id === id);
                if (!a) return null;

                return (
                  <li key={id}>
                    <img
                      src={
                        COSMIC_ACHIEVEMENTS[a.icon as keyof typeof COSMIC_ICONS]
                      }
                      alt={a.title}
                    />
                    <span>{a.title}</span>
                  </li>
                );
              })}
            </ul>
          </AchievementsSection>
        )}

        {/* Monedas obtenidas */}
        <CoinsBox>
          <Star size={20} /> +{formatCoins(coins)} monedas
        </CoinsBox>

        {/* XP obtenida — NUEVO BLOQUE */}
        {xpEarned > 0 && (
          <CoinsBox style={{color: '#6ee7ff'}}>
            <Star size={20} /> +{formatCoins(xpEarned)} XP Cósmica
          </CoinsBox>
        )}

        <ButtonContainer>
          <Button
            variant="primary"
            fullWidth={true}
            onClick={() => {
              clearLevelResult(null);
              onNextLevel(nextLevel);
            }}>
            Próximo nivel
          </Button>
          <Button
            to="/levels"
            variant="tertiary"
            fullWidth={true}
            onClick={() => {
              clearLevelResult(null);
              onContinue();
            }}>
            Salir
          </Button>
        </ButtonContainer>
      </Box>
    </Overlay>
  );
}
