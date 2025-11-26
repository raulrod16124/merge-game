import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AppLayout from '@/ui/layout';

import {Trophy, Star, Award} from 'lucide-react';

import {
  getTopGlobal,
  getTopCosmicLevel,
  getTopTotalCosmicXP,
} from '@/core/leaderboard';

import {
  Section,
  FilterBar,
  FilterButton,
  List,
  PlayerCard,
  AvatarCircle,
  PlayerInfo,
  PlayerName,
  PlayerStats,
  SkeletonList,
  SkeletonCard,
  SkeletonCircle,
  SkeletonBlock,
  SkeletonShimmer,
} from './styles';

type LeaderboardEntry = {
  uid: string;
  name: string;
  avatar: {variant: string};
  rankScoreGlobal?: number;
  rankCosmicLevel?: number;
  rankTotalCosmicXP?: number;
};

type FilterType = 'global' | 'cosmicLevel' | 'totalXP';

export default function RankingScreen() {
  const [filter, setFilter] = useState<FilterType>('global');
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRanking(mode: FilterType) {
    setLoading(true);

    let data: any[] = [];

    if (mode === 'global') data = await getTopGlobal(50);
    if (mode === 'cosmicLevel') data = await getTopCosmicLevel(50);
    if (mode === 'totalXP') data = await getTopTotalCosmicXP(50);

    setPlayers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRanking(filter);
  }, [filter]);

  return (
    <AppLayout title="Ranking" showBack={true} prevRoute="/home">
      <Section>
        {/* FILTROS */}
        <FilterBar>
          <FilterButton
            $active={filter === 'global'}
            onClick={() => setFilter('global')}>
            <Trophy size={18} /> Global
          </FilterButton>

          <FilterButton
            $active={filter === 'cosmicLevel'}
            onClick={() => setFilter('cosmicLevel')}>
            <Star size={18} /> Nivel Cósmico
          </FilterButton>

          <FilterButton
            $active={filter === 'totalXP'}
            onClick={() => setFilter('totalXP')}>
            <Award size={18} /> XP Total
          </FilterButton>
        </FilterBar>

        {/* LISTA */}
        {loading ? (
          <SkeletonList>
            {Array.from({length: 5}).map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonCircle />
                <div style={{flex: 1}}>
                  <SkeletonBlock style={{width: '50%'}} />
                  <SkeletonBlock style={{width: '70%'}} />
                </div>
                <SkeletonShimmer />
              </SkeletonCard>
            ))}
          </SkeletonList>
        ) : (
          <List>
            {players.map((p, idx) => (
              <PlayerCard key={p.uid}>
                <AvatarCircle $variant={p.avatar?.variant ?? 'hybrid'}>
                  {idx + 1}
                </AvatarCircle>

                <PlayerInfo>
                  <PlayerName>{p.name ?? 'Jugador'}</PlayerName>

                  <PlayerStats>
                    {filter === 'global' &&
                      `Puntuación Global: ${p.rankScoreGlobal ?? 0}`}

                    {filter === 'cosmicLevel' &&
                      `Nivel Cósmico: ${p.rankCosmicLevel ?? 1}`}

                    {filter === 'totalXP' &&
                      `XP Total: ${p.rankTotalCosmicXP ?? 0}`}
                  </PlayerStats>
                </PlayerInfo>
              </PlayerCard>
            ))}
          </List>
        )}
      </Section>
    </AppLayout>
  );
}
