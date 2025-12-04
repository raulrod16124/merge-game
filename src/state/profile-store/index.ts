import {create} from 'zustand';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '@/core/firebase';
import {useUserStore} from '../user-store';
import {usePlayerStore} from '../player-store';

export type PublicProfile = {
  uid: string;
  name: string;
  avatar: {
    shape: string;
    color: string;
  };
  cosmicLevel: number;
  totalXP: number;
  searchName: string;
};

type ProfileState = {
  profile: PublicProfile | null;
  loadMyProfile: () => Promise<void>;
  syncMyProfile: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,

  loadMyProfile: async () => {
    get();
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const ref = doc(db, 'profiles', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    set({profile: snap.data() as PublicProfile});
  },

  syncMyProfile: async () => {
    const uid = useUserStore.getState().uid;
    const name = useUserStore.getState().name ?? 'Jugador';
    const avatar = useUserStore.getState().avatar;

    if (!uid || !avatar) return;

    const cosmicProgress = usePlayerStore.getState().cosmicProgress;

    const payload: PublicProfile = {
      uid,
      name,
      avatar,
      cosmicLevel: cosmicProgress.level,
      totalXP: cosmicProgress.xp,
      searchName: name.toLowerCase(),
    };

    await setDoc(doc(db, 'profiles', uid), payload, {merge: true});
    set({profile: payload});
  },
}));
