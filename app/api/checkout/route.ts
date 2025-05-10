import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export async function POST(request: Request) {
  const body = await request.json();
  const { priceId, email } = body;

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: process.env.STRIPE_SUCCESS_URL!,
    cancel_url: process.env.STRIPE_CANCEL_URL!,
  });

  return NextResponse.json({ url: session.url });
}