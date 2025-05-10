// lib/logout.ts
import { getAuth, signOut } from 'firebase/auth';

export async function logout() {
  const auth = getAuth();
  await signOut(auth);
  window.location.href = '/';
}
