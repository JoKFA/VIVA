/**
 * RequireAuth — wraps protected admin routes.
 * Redirects to /admin/login if no active Supabase session.
 * Shows a loading state while the session check is in flight.
 */
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface RequireAuthProps {
  children: React.ReactNode;
}

function hasAdminClaim(session: Session | null | undefined) {
  return session?.user?.app_metadata?.user_role === 'admin';
}

export function RequireAuth({ children }: RequireAuthProps) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    // Get current session synchronously if available
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Subscribe to auth changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still checking
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Checking session…</div>
      </div>
    );
  }

  // Not authenticated — redirect preserving intended path
  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!hasAdminClaim(session)) {
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
