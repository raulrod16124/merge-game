import {useEffect, useState} from 'react';
import AppLayout from '@/ui/layout';

import {Users, Star, Award} from 'lucide-react';

import {
  getFriendsLeaderboard,
  getTopCosmicLevel,
  getTopTotalCosmicXP,
} from '@/core/leaderboard';

import {
  Section,
  FilterBar,
  FilterButton,
  List,
  PlayerCard,
  PlayerInfo,
  PlayerName,
  PlayerStats,
  SkeletonList,
  SkeletonCard,
  SkeletonCircle,
  SkeletonBlock,
  SkeletonShimmer,
  RankBadge,
} from './styles';

import {useFriendsStore} from '@/state/friends-store';

import type {AvatarVariant} from '@/ui/components/cosmic-avatar/types';

type LeaderboardEntry = {
  uid: string;
  name: string;
  avatar: AvatarVariant;
  rankCosmicLevel?: number;
  rankTotalCosmicXP?: number;
};

type FilterType = 'friends' | 'cosmicLevel' | 'totalXP';

export default function RankingScreen() {
  const [filter, setFilter] = useState<FilterType>('totalXP');
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const friends = useFriendsStore(s => s.friends);
  const loadFriends = useFriendsStore(s => s.loadFriends);

  async function loadRanking(mode: FilterType) {
    setLoading(true);

    let data: any[] = [];

    if (mode === 'friends') {
      await loadFriends(); // aseguramos datos frescos

      if (!friends.length) {
        setPlayers([]);
        setLoading(false);
        return;
      }
      data = await getFriendsLeaderboard(friends);
    }

    if (mode === 'cosmicLevel') data = await getTopCosmicLevel(50);
    if (mode === 'totalXP') data = await getTopTotalCosmicXP(50);

    setPlayers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRanking(filter);
  }, [filter]);

  const renderEmptyFriends =
    filter === 'friends' && !friends.length && !loading;

  return (
    <AppLayout title="Ranking" showBack={true} prevRoute="/home">
      <Section>
        {/* FILTROS */}
        <FilterBar>
          <FilterButton
            $active={filter === 'totalXP'}
            onClick={() => setFilter('totalXP')}>
            <Award size={18} /> XP Total
          </FilterButton>
          <FilterButton
            $active={filter === 'cosmicLevel'}
            onClick={() => setFilter('cosmicLevel')}>
            <Star size={18} /> Nivel Cósmico
          </FilterButton>

          <FilterButton
            $active={filter === 'friends'}
            onClick={() => setFilter('friends')}>
            <Users size={18} /> Amigos
          </FilterButton>
        </FilterBar>

        {/* LISTA O ESTADO */}
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
        ) : renderEmptyFriends ? (
          <div style={{padding: '20px', textAlign: 'center', opacity: 0.7}}>
            Todavía no tienes amigos.
            <br />
            Pronto podrás enviar y aceptar solicitudes.
          </div>
        ) : (
          <List>
            {players.map((p, idx) => (
              <PlayerCard key={p.uid}>
                <RankBadge>{idx + 1}</RankBadge>

                <PlayerInfo>
                  <PlayerName>{p.name ?? 'Jugador'}</PlayerName>

                  <PlayerStats>
                    {filter === 'cosmicLevel' &&
                      `Nivel Cósmico: ${p.rankCosmicLevel ?? 1}`}
                    {filter === 'totalXP' &&
                      `XP Total: ${p.rankTotalCosmicXP ?? 0}`}
                    {filter === 'friends' &&
                      `Nivel Cósmico: ${p.rankCosmicLevel ?? 1} | XP Total: ${p.rankTotalCosmicXP ?? 1}`}
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
