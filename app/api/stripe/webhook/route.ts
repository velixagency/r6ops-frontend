import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // requires service role for inserts
);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = headers().get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('🔔 Incoming Stripe webhook');

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('✅ Session completed:', session);
    const email = session.customer_email;
    console.log('👉 customer_email:', email);
    const priceId = session.metadata?.price_id || session.line_items?.[0]?.price?.id;
    console.log('👉 Price ID:', priceId);

    try {
      // 1. Get user by email
      const { data: user } = await supabase
        .from('users')
        .select('id, firebase_uid')
        .eq('email', email)
        .single();

      if (user) {
        await supabase.from('subscriptions').upsert({
          user_id: user.id,
          stripe_subscription_id: session.subscription,
          tier: priceId, // Store Stripe Price ID or map to internal tier
          status: 'active',
        });
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error('Error inserting/updating subscription:', err);
      return new NextResponse('Failed to sync subscription', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
