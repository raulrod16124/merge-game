import {collection, query, orderBy, limit, getDocs} from 'firebase/firestore';
import {db} from './firebase';

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
