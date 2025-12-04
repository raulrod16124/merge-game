import {useEffect} from 'react';
import {onSnapshot, doc, setDoc} from 'firebase/firestore';
import {db} from '@/core/firebase';
import {useUserStore} from '@/state/user-store';
import {useFriendsStore} from '@/state/friends-store';

export function FriendsRealtimeListener() {
  const uid = useUserStore(state => state.uid);

  useEffect(() => {
    if (!uid) return;

    const ref = doc(db, 'friends', uid);

    const unsub = onSnapshot(
      ref,
      async snap => {
        if (!snap.exists()) {
          // Creamos un documento válido solo para este usuario
          await setDoc(ref, {
            list: [],
            incoming: [],
            outgoing: [],
          });
          // Tras crearlo, recargamos el estado desde el store
          try {
            await useFriendsStore.getState().loadFriends();
          } catch (e) {
            console.error(
              'FriendsRealtimeListener loadFriends (create) failed',
              e,
            );
          }
          return;
        }

        // Cada vez que cambie mi doc de friends, recargo desde el store
        try {
          await useFriendsStore.getState().loadFriends();
        } catch (e) {
          console.error('FriendsRealtimeListener loadFriends failed', e);
        }
      },
      err => {
        console.error('Friends listener error:', err);
      },
    );

    return () => unsub();
  }, [uid]);

  return null;
}
