'use client';
import { useAuth } from '../../utils/useAuth';
import { useEffect, useState } from 'react';
import { getUserSubscription } from '../../lib/withSubscription';
import AuthButton from '../../components/AuthButton';

export default function AllianceDashboard() {
  const { user } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (user) {
        const sub = await getUserSubscription(user.uid);
        if (sub && (sub.tier === 'alliance_manual' || sub.tier === 'alliance_image')) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      }
    }
    checkAccess();
  }, [user]);

  if (!user) return <AuthButton />;
  if (authorized === null) return <p>Checking access...</p>;
  if (!authorized) return <p>You need an Alliance plan to access this feature.</p>;

  return <div>Alliance Management Tools Here</div>;
}
