import {db} from '@/core/firebase';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {useUserStore} from '@/state/user-store';

export type ActivityType = 'levelCompleted' | 'achievement' | 'levelUp';

export async function logActivity(
  type: ActivityType,
  payload: Record<string, any>,
) {
  const uid = useUserStore.getState().uid;
  if (!uid) return;

  await addDoc(collection(db, 'activity'), {
    ownerUid: uid,
    type,
    payload,
    createdAt: serverTimestamp(),
  });
}
