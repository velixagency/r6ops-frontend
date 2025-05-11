'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;

      setUser(firebaseUser);
      console.log('🔥 Firebase UID:', firebaseUser.uid);

      const { data, error } = await supabase
        .from('users')
        .select('id, role')
        .eq('firebase_uid', firebaseUser.uid)
        .maybeSingle();

      if (error) {
        console.error('Supabase fetch error:', error.message);
        return;
      }

      if (!data) {
        const { error: insertErr } = await supabase.from('users').insert({
          email: firebaseUser.email,
          firebase_uid: firebaseUser.uid,
          role: 'user',
        });
        if (insertErr) {
          console.error('❌ Insert error:', insertErr.message);
          return;
        }
        setRole('user');
      } else {
        setRole(data.role);
      }
    };

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) checkSession();
      else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
