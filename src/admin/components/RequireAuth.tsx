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

  return <>{children}</>;
}
