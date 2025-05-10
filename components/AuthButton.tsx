'use client';
import { useAuth } from '../utils/useAuth';

export default function AuthButton() {
  const { user, login, logout } = useAuth();

  if (!user) return <button onClick={login}>Sign in with Google</button>;
  return <button onClick={logout}>Sign Out</button>;
}
