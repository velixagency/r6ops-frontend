'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [tier, setTier] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentSuccess = params.get('success') === 'true';

      if (auth.currentUser) {
        setUser(auth.currentUser);
        console.log('Firebase UID:', auth.currentUser.uid);

        const { data: userMeta, error: userError } = await supabase
          .from('users')
          .select('id, role')
          .eq('firebase_uid', auth.currentUser.uid)
          .single();

        if (userError) console.error('❌ Supabase user error:', userError);
        if (userMeta) {
          console.log('✅ User Meta:', userMeta);
          setRole(userMeta.role);

          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('tier')
            .eq('user_id', userMeta.id)
            .eq('status', 'active')
            .single();

          if (subError) console.error('❌ Subscription fetch error:', subError);
          console.log('✅ Subscription:', subscription);
          setTier(subscription?.tier || null);
        }
      }

      if (paymentSuccess) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, () => {
      checkSession();
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, tier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);