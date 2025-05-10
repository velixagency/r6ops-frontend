import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('firebase_uid', firebaseUser.uid)
          .single();

        if (!data && !error) {
          await supabase.from('users').insert({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'user',
          });
          setRole('user');
        } else if (data) {
          setRole(data.role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  return { user, role, login, logout };
}