import AppLayout from '@/ui/layout';
import {ACHIEVEMENTS} from '@/data/achievements';
import {COSMIC_ACHIEVEMENTS, type CosmicType} from '@/ui/constants';
import {Check, Lock, Star} from 'lucide-react';
import {usePlayerStore} from '@/state/player-store';

import {
  Wrapper,
  Grid,
  Card,
  Icon,
  Title,
  Desc,
  Stars,
  Reward,
  Checkmark,
  LockOverlay,
} from './styles';

export default function AchievementsScreen() {
  const unlockedMap = usePlayerStore(s => s.achievements);

  return (
    <AppLayout prevRoute="/home" title="Logros">
      <Wrapper>
        <Grid>
          {ACHIEVEMENTS.map(a => {
            const unlocked = Boolean(unlockedMap[a.id]);
            const difficulty = a.difficulty ?? 1; // default 1–5

            return (
              <Card key={a.id} $unlocked={unlocked}>
                {unlocked ? (
                  <Checkmark>
                    <Check size={14} strokeWidth={3} />
                  </Checkmark>
                ) : (
                  <LockOverlay>
                    <Lock size={20} />
                  </LockOverlay>
                )}

                <Icon src={COSMIC_ACHIEVEMENTS[a.icon as CosmicType]} />

                <Title>{a.title}</Title>
                <Desc>{a.description}</Desc>

                <Stars>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      strokeWidth={2.2}
                      color={i < difficulty ? '#ffd15c' : '#444'}
                      fill={i < difficulty ? '#ffd15c' : 'none'}
                    />
                  ))}
                </Stars>

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
