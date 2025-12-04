import {db} from '@/core/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAt,
  endAt,
} from 'firebase/firestore';
import type {PublicProfile} from '@/state/profile-store';

export async function searchProfilesByName(
  term: string,
  maxResults = 20,
): Promise<PublicProfile[]> {
  const trimmed = term.trim().toLowerCase();
  if (!trimmed) return [];

  const col = collection(db, 'profiles');

  // Búsqueda por prefijo usando searchName
  const q = query(
    col,
    orderBy('searchName'),
    startAt(trimmed),
    endAt(trimmed + '\uf8ff'),
    limit(maxResults),
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as PublicProfile);
}
