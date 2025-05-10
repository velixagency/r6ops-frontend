import { supabase } from './supabase';

export async function getUserSubscription(firebaseUid: string) {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  return subscription || null;
}