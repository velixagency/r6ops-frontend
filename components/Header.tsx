'use client';
import { useAuthContext } from '@/context/AuthContext';
import { logout } from '@/lib/logout';
import Link from 'next/link';

export default function Header() {
  const { user } = useAuthContext();

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        R6Ops
      </Link>
      {user && (
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-sm px-4 py-2 rounded"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}
