import {create} from 'zustand';
import {db} from '@/core/firebase';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useUserStore} from '../user-store';
import {useHudStore} from '../hud-store';
import {loadProfiles, type Profile} from '@/core/friendsSearchService';
import {usePlayerStore} from '../player-store';

export type FriendsState = {
  friends: Profile[];
  incoming: Profile[];
  outgoing: Profile[];

  loadFriends: () => Promise<void>;
  sendFriendRequest: (friendID: string) => Promise<void>;
  acceptRequest: (fromUid: string) => Promise<void>;
  rejectRequest: (fromUid: string) => Promise<void>;
  cancelRequest: (toUid: string) => Promise<void>;
  removeFriend: (friendUid: string) => Promise<void>;
};

type FriendsDoc = {
  list: string[];
  incoming: string[];
  outgoing: string[];
};

async function ensureDoc(uid: string) {
  const ref = doc(db, 'friends', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      list: [],
      incoming: [],
      outgoing: [],
    } satisfies FriendsDoc);
  }

  return ref;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  incoming: [],
  outgoing: [],

  loadFriends: async () => {
    const user = useUserStore.getState();
    const player = usePlayerStore.getState();

    if (!user.uid) return;

    const myRef = await ensureDoc(user.uid);
    const snap = await getDoc(myRef);
    const data = (snap.data() as FriendsDoc) ?? {
      list: [],
      incoming: [],
      outgoing: [],
    };

    const friendsUids = data.list ?? [];
    const outgoingUids = data.outgoing ?? [];
    const incomingUids = data.incoming ?? [];

    // cargar perfiles
    const [friendsProfiles, incomingProfiles, outgoingProfiles] =
      await Promise.all([
        loadProfiles(friendsUids),
        loadProfiles(incomingUids),
        loadProfiles(outgoingUids),
      ]);

    const userMapped: Profile = {
      uid: user.uid,
      name: user.name!,
      uniqueName: user.uniqueName!,
      cosmicLevel: player.cosmicProgress.level,
      avatar: user.avatar,
    };

    set({
      friends: [...friendsProfiles, userMapped],
      incoming: incomingProfiles,
      outgoing: outgoingProfiles,
    });
  },

  sendFriendRequest: async (friendID: string) => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const targetUid = friendID.trim();
    if (!targetUid) return;
    if (uid === targetUid) {
      useHudStore.getState().push('No puedes agregarte a ti mismo');
      return;
    }

    // Aseguramos ambos docs
    const myRef = await ensureDoc(uid);
    const theirRef = await ensureDoc(targetUid);

    const mySnap = (await getDoc(myRef)).data() as FriendsDoc;
    const theirSnap = (await getDoc(theirRef)).data() as FriendsDoc;

    const myFriends = mySnap.list ?? [];
    const myOutgoing = mySnap.outgoing ?? [];
    const theirFriends = theirSnap.list ?? [];
    const theirIncoming = theirSnap.incoming ?? [];

    // ya sois amigos
    if (myFriends.includes(targetUid) || theirFriends.includes(uid)) {
      useHudStore.getState().push('Ya sois amigos');
      return;
    }

    // ya enviada
    if (myOutgoing.includes(targetUid)) {
      useHudStore.getState().push('Solicitud ya enviada');
      return;
    }

    const nextMyOutgoing = Array.from(new Set([...myOutgoing, targetUid]));
    const nextTheirIncoming = Array.from(new Set([...theirIncoming, uid]));

    await setDoc(
      myRef,
      {
        list: myFriends,
        incoming: mySnap.incoming ?? [],
        outgoing: nextMyOutgoing,
      },
      {merge: true},
    );

    await setDoc(
      theirRef,
      {
        list: theirFriends,
        incoming: nextTheirIncoming,
        outgoing: theirSnap.outgoing ?? [],
      },
      {merge: true},
    );

    useHudStore.getState().push('Solicitud enviada');
    get().loadFriends();
  },

  acceptRequest: async (fromUid: string) => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const myRef = await ensureDoc(uid);
    const theirRef = await ensureDoc(fromUid);

    const mySnap = (await getDoc(myRef)).data() as FriendsDoc;
    const theirSnap = (await getDoc(theirRef)).data() as FriendsDoc;

    const myFriends = mySnap.list ?? [];
    const myIncoming = mySnap.incoming ?? [];
    const theirFriends = theirSnap.list ?? [];
    const theirOutgoing = theirSnap.outgoing ?? [];

    const nextMyFriends = Array.from(new Set([...myFriends, fromUid]));
    const nextTheirFriends = Array.from(new Set([...theirFriends, uid]));

    const nextMyIncoming = myIncoming.filter(id => id !== fromUid);
    const nextTheirOutgoing = theirOutgoing.filter(id => id !== uid);

    await setDoc(
      myRef,
      {
        list: nextMyFriends,
        incoming: nextMyIncoming,
        outgoing: mySnap.outgoing ?? [],
      },
      {merge: true},
    );

    await setDoc(
      theirRef,
      {
        list: nextTheirFriends,
        incoming: theirSnap.incoming ?? [],
        outgoing: nextTheirOutgoing,
      },
      {merge: true},
    );

    useHudStore.getState().push('Amigo añadido');
    get().loadFriends();
  },

  rejectRequest: async (fromUid: string) => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const myRef = await ensureDoc(uid);
    const mySnap = (await getDoc(myRef)).data() as FriendsDoc;

    const myIncoming = mySnap.incoming ?? [];
    const nextMyIncoming = myIncoming.filter(id => id !== fromUid);

    await setDoc(
      myRef,
      {
        incoming: nextMyIncoming,
      },
      {merge: true},
    );

    useHudStore.getState().push('Solicitud rechazada');
    get().loadFriends();
  },

  cancelRequest: async (toUid: string) => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const myRef = await ensureDoc(uid);
    const theirRef = await ensureDoc(toUid);

    const mySnap = (await getDoc(myRef)).data() as FriendsDoc;
    const theirSnap = (await getDoc(theirRef)).data() as FriendsDoc;

    const myOutgoing = mySnap.outgoing ?? [];
    const theirIncoming = theirSnap.incoming ?? [];

    const nextMyOutgoing = myOutgoing.filter(id => id !== toUid);
    const nextTheirIncoming = theirIncoming.filter(id => id !== uid);

    await setDoc(
      myRef,
      {
        outgoing: nextMyOutgoing,
      },
      {merge: true},
    );

    await setDoc(
      theirRef,
      {
        incoming: nextTheirIncoming,
      },
      {merge: true},
    );

    useHudStore.getState().push('Solicitud cancelada');
    get().loadFriends();
  },

  removeFriend: async (friendUid: string) => {
    const uid = useUserStore.getState().uid;
    if (!uid) return;

    const myRef = await ensureDoc(uid);
    const theirRef = await ensureDoc(friendUid);

    const mySnap = (await getDoc(myRef)).data() as FriendsDoc;
    const theirSnap = (await getDoc(theirRef)).data() as FriendsDoc;

    const myFriends = mySnap.list ?? [];
    const theirFriends = theirSnap.list ?? [];

    const nextMyFriends = myFriends.filter(id => id !== friendUid);
    const nextTheirFriends = theirFriends.filter(id => id !== uid);

    await setDoc(
      myRef,
      {
        list: nextMyFriends,
      },
      {merge: true},
    );

    await setDoc(
      theirRef,
      {
        list: nextTheirFriends,
      },
      {merge: true},
    );

    useHudStore.getState().push('Amigo eliminado');
    get().loadFriends();
  },
}));
