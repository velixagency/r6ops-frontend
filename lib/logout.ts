// lib/logout.ts
import { signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const logout = async () => {
  await signOut(auth);
  // Clear any existing persistence to force re-prompt
  await setPersistence(auth, browserLocalPersistence);
};