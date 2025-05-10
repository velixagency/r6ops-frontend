'use client';
import { useAuthContext } from '../../context/AuthContext';
import UserDashboard from '../../components/UserDashboard';
import AdminView from '../../components/AdminView';
import AuthButton from '../../components/AuthButton';
import SubscribeButton from '../../components/SubscribeButton';
import { logout } from '@/lib/logout';

export default function DashboardPage() {
  const { user, role, tier } = useAuthContext();

  if (!user) return <div><AuthButton /></div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold mb-4">User Dashboard - Welcome!</h1>
            <p className="text-lg">Welcome, {user?.email}</p>
            <p className="text-sm">Role: {role || 'None'}</p>
            <p>Subscription Tier: {tier ? tier : 'None'} {tier ? '' : '🔒 Upgrade Required'}</p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {role === 'admin' ? <AdminView /> : <UserDashboard />}
      <SubscribeButton email={user.email} tier="single_user_manual" />
    </div>
  );
}
