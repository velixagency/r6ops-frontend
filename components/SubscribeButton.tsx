'use client';
import { useState } from 'react';
import { STRIPE_PRICE_IDS } from '../lib/stripe';

export default function SubscribeButton({ email, tier }: { email: string; tier: keyof typeof STRIPE_PRICE_IDS }) {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            priceId: STRIPE_PRICE_IDS[tier],
            email,
        }),
        });

        if (!res.ok) {
        const errorText = await res.text();
        console.error('Stripe Checkout Error:', errorText);
        alert('There was a problem creating your subscription. Please try again later.');
        setLoading(false);
        return;
        }

        const { url } = await res.json();
        window.location.href = url;

    } catch (err) {
        console.error('Error during subscription:', err);
        alert('Unexpected error occurred. Please try again.');
        setLoading(false);
    }
    };

    return (
        <button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Redirecting...' : `Subscribe to ${tier}`}
        </button>
    );
}