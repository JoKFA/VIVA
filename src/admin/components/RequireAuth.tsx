/**
 * RequireAuth — wraps protected admin routes.
 * Redirects to /admin/login if there is no verified Supabase user.
 * Shows a loading state while the user check is in flight.
 */
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface RequireAuthProps {
  children: React.ReactNode;
}

function hasAdminClaim(user: User | null | undefined) {
  return user?.app_metadata?.user_role === 'admin';
}

export function RequireAuth({ children }: RequireAuthProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      setUser(error ? null : data.user);
    }

    loadUser();

    // Subscribe to auth changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Still checking
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Checking session…</div>
      </div>
    );
  }

  // Not authenticated — redirect preserving intended path
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!hasAdminClaim(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Admin access required</h1>
          <p className="mt-2 text-sm text-gray-600">
            This account is signed in, but it does not have the admin role required to manage CMS content.
          </p>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="mt-5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
