import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import {db} from './firebase';
import type {Profile} from './friendsSearchService';

export async function getFriendsLeaderboard(friends: Profile[]) {
  const friendIds = friends.map(f => f.uid);
  if (!friendIds.length) return [];

  // Firestore solo permite IN con un máximo de 10 elementos
  const chunks: string[][] = [];
  for (let i = 0; i < friendIds.length; i += 10) {
    chunks.push(friendIds.slice(i, i + 10));
  }

  const results: any[] = [];

  for (const chunk of chunks) {
    const q = query(collection(db, 'leaderboard'), where('uid', 'in', chunk));

    const snap = await getDocs(q);
    snap.forEach(doc => results.push(doc.data()));
  }

  // Puedes ordenar por cosmic level, xp, etc.
  return results.sort(
    (a, b) => (b.rankCosmicLevel ?? 0) - (a.rankCosmicLevel ?? 0),
  );
}

export async function getTopGlobal(limitCount = 50) {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('rankScoreGlobal', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function getTopCosmicLevel(limitCount = 50) {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('rankCosmicLevel', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export async function getTopTotalCosmicXP(limitCount = 50) {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('rankTotalCosmicXP', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
