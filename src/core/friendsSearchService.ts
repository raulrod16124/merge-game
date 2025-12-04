import {db} from '@/core/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';

export type Profile = {
  uid: string;
  name: string;
  uniqueName: string;
  cosmicLevel: number;
  avatar: any;
};

export async function searchProfilesByName(text: string) {
  const profilesRef = collection(db, 'profiles');

  // Usamos searchName en minúsculas para búsqueda parcial
  const q = query(
    profilesRef,
    where('searchName', '>=', text.toLowerCase()),
    where('searchName', '<=', text.toLowerCase() + '\uf8ff'),
    orderBy('searchName'),
    limit(20),
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => d.data());
}

export async function loadProfiles(uids: string[]): Promise<Profile[]> {
  if (!uids || uids.length === 0) return [];

  const profilesCol = collection(db, 'profiles');
  const q = query(profilesCol, where('uid', 'in', uids.slice(0, 10)));
  // Firestore permite máximo 10 elementos por "in"

  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Profile);
}
