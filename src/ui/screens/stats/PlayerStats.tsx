import {StatsSection, StatItem, StatValue, StatLabel} from './styles';
import {usePlayerStore} from '@/state/player-store';
import {ACHIEVEMENTS} from '@/data/achievements';
import AppLayout from '@/ui/layout';

export default function PlayerStats() {
  const progress = usePlayerStore(s => s.cosmicProgress);
  const completedLevels = usePlayerStore(s => s.completedLevels);
  const highestLevelUnlocked = usePlayerStore(s => s.highestLevelUnlocked);
  const achievements = usePlayerStore(s => s.achievements);

  const variant = 'hybrid'; // o el que use tu avatar
  const avatar = progress[variant];
  const levelXP = avatar?.xp ?? 0;
  const level = avatar?.level ?? 1;

  // niveles
  const levelEntries = Object.values(completedLevels);
  const totalCompletedLevels = levelEntries.length;
  const bestScore = Math.max(...levelEntries.map(l => l.score), 0);
  const averageScore = totalCompletedLevels
    ? Math.round(
        levelEntries.reduce((a, b) => a + b.score, 0) / totalCompletedLevels,
      )
    : 0;

  // logros
  const unlockedAchievements =
    Object.values(achievements).filter(Boolean).length;
  const totalAchievements = ACHIEVEMENTS.length;
  const achievementsPercent = Math.round(
    (unlockedAchievements / totalAchievements) * 100,
  );

  return (
    <AppLayout title="Estadísticas" showBack={true} prevRoute="/home">
      <StatsSection>
        {/* PROGRESO CÓSMICO */}
        <h3>Progreso Cósmico</h3>
        <StatItem>
          <StatLabel>Nivel Cósmico</StatLabel>
          <StatValue>{level}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Total XP</StatLabel>
          <StatValue>{levelXP}</StatValue>
        </StatItem>

        {/* NIVELES */}
        <h3>Niveles</h3>
        <StatItem>
          <StatLabel>Último desbloqueado</StatLabel>
          <StatValue>{highestLevelUnlocked}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Niveles completados</StatLabel>
          <StatValue>{totalCompletedLevels}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Mejor puntuación</StatLabel>
          <StatValue>{bestScore}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Puntuación media</StatLabel>
          <StatValue>{averageScore}</StatValue>
        </StatItem>

        {/* LOGROS */}
        <h3>Logros</h3>
        <StatItem>
          <StatLabel>Completados</StatLabel>
          <StatValue>
            {unlockedAchievements}/{totalAchievements}
          </StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Progreso</StatLabel>
          <StatValue>{achievementsPercent}%</StatValue>
        </StatItem>
      </StatsSection>
    </AppLayout>
  );
}
