'use client';
import AuthButton from '../components/AuthButton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../utils/useAuth';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  return (
    <main>
      <h1>R6ops</h1>
      <AuthButton />
    </main>
  );
}