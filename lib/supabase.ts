import { createClient } from '@supabase/supabase-js';
import { getAuth } from 'firebase/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init = {}) => {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());

      return fetch(input, {
        ...init,
        headers: {
          'Content-Type': 'application/json', // ✅ required for Supabase
          apikey: supabaseAnonKey,
          Authorization: token ? `Bearer ${token}` : '',
          ...init.headers, // put this last to allow overrides
        },
      });
    },
  },
});
