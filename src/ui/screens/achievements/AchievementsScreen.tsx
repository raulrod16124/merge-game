// src/ui/screens/AchievementsScreen.tsx
import styled from 'styled-components';
import AppLayout from '@/ui/layout';
import {ACHIEVEMENTS} from '@/data/achievements';
import {useAchievementStore} from '@/state/achievement-store';
import {COSMIC_ICONS} from '@/ui/constants';
import {Check, Lock} from 'lucide-react';

const Wrapper = styled.div`
  width: 100vw;
  height: 100%;
  overflow-y: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 12px;
`;

const Card = styled.div<{unlocked: boolean}>`
  background: ${({unlocked}) =>
    unlocked ? 'rgba(120,255,120,0.15)' : 'rgba(255,255,255,0.05)'};
  border: 1px solid
    ${({unlocked}) =>
      unlocked ? 'rgba(120,255,120,0.4)' : 'rgba(255,255,255,0.1)'};
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  color: white;
  position: relative;
  transition: 0.25s ease;

  ${({unlocked}) =>
    !unlocked &&
    `
    opacity: 0.55;
    filter: saturate(0.3);
  `}
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin: 0 auto 8px auto;
  display: block;
`;

const CheckIcon = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  color: #8eff8e;
`;

const LockIconOverlay = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
  color: rgba(255, 255, 255, 0.6);
`;

const Reward = styled.div`
  margin-top: 6px;
  font-size: 0.7rem;
  opacity: 0.8;
`;

export default function AchievementsScreen() {
  const isUnlocked = useAchievementStore(s => s.isUnlocked);

  return (
    <AppLayout prevRoute="/home" title="Logros">
      <Wrapper>
        <Grid>
          {ACHIEVEMENTS.map(a => {
            const unlocked = isUnlocked(a.id);

            return (
              <Card key={a.id} unlocked={unlocked}>
                {unlocked ? (
                  <CheckIcon>
                    <Check size={18} />
                  </CheckIcon>
                ) : (
                  <LockIconOverlay>
                    <Lock size={18} />
                  </LockIconOverlay>
                )}
                {/* @ts-ignore */}
                <Icon src={COSMIC_ICONS[a.icon]} />

                <h3 style={{marginBottom: 4}}>{a.title}</h3>

                <p style={{opacity: 0.7, fontSize: '0.8rem', minHeight: 32}}>
                  {a.description}
                </p>

                {a.reward && (
                  <Reward>
                    {a.reward.coins ? `+${a.reward.coins} monedas ` : ''}
                    {a.reward.powerups
                      ? `• Powerups: ${a.reward.powerups.join(', ')} `
                      : ''}
                    {a.reward.maps
                      ? `• Mapas: ${a.reward.maps.join(', ')}`
                      : ''}
                  </Reward>
                )}
              </Card>
            );
          })}
        </Grid>
      </Wrapper>
    </AppLayout>
  );
}
