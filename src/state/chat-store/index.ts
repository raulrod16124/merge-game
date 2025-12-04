import {create} from 'zustand';
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {db} from '@/core/firebase';
import {useUserStore} from '../user-store';

export type ChatMessage = {
  id: string;
  from: string;
  text: string;
  createdAt: Date | null;
};

type ChatState = {
  currentChatId: string | null;
  messages: ChatMessage[];
  subscribeToChat: (friendUid: string) => () => void;
  sendMessage: (text: string) => Promise<void>;
};

function getChatId(a: string, b: string): string {
  return [a, b].sort().join('_');
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: null,
  messages: [],

  subscribeToChat: (friendUid: string) => {
    const myUid = useUserStore.getState().uid;
    if (!myUid) return () => {};

    const chatId = getChatId(myUid, friendUid);

    // asegurar doc de chat
    (async () => {
      const chatRef = doc(db, 'chats', chatId);
      const snap = await getDoc(chatRef);
      if (!snap.exists()) {
        await setDoc(chatRef, {
          chatId,
          participants: [myUid, friendUid],
          updatedAt: serverTimestamp(),
        });
      }
    })();

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, snap => {
      const msgs: ChatMessage[] = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          from: data.from,
          text: data.text,
          createdAt: data.createdAt?.toDate?.() ?? null,
        };
      });
      set({currentChatId: chatId, messages: msgs});
    });

    return unsub;
  },

  sendMessage: async (text: string) => {
    const myUid = useUserStore.getState().uid;
    const chatId = get().currentChatId;
    if (!myUid || !chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      from: myUid,
      text,
      createdAt: serverTimestamp(),
    });

    const chatRef = doc(db, 'chats', chatId);
    await setDoc(
      chatRef,
      {
        updatedAt: serverTimestamp(),
        lastMessage: text,
      },
      {merge: true},
    );
  },
}));
