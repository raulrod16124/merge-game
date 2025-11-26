// src/core/firebase.ts
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import type {User} from 'firebase/auth';

/**
 * Firebase config from Vite env vars (VITE_ prefix)
 * Make sure .env.local contains the VITE_... variables and restart dev server after changes.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
};

// init
const app = initializeApp(firebaseConfig);

// exports
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Try to sign in anonymously if there's no current user.
 * Uses browserLocalPersistence so the session survives page closes.
 */
export async function signInAnonIfNeeded(): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  // Persist the session in browser local storage for better UX
  await setPersistence(auth, browserLocalPersistence);
  const res = await signInAnonymously(auth);
  return res.user;
}

/**
 * Simple helper to observe auth state changes.
 * Returns the unsubscribe function from onAuthStateChanged.
 */
export function onAuthChanged(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
