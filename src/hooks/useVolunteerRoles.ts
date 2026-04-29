import { useEffect, useState } from 'react';
import type { VolunteerRole } from '../types';
import { supabase } from '../lib/supabase';
import { volunteerRoles as mockRoles } from '../data/mockData';

export function useVolunteerRoles() {
  const [data, setData] = useState<VolunteerRole[]>(mockRoles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('volunteer_roles')
          .select('*')
          .eq('published', true);
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            title: r.title as string,
            program: r.program as string,
            description: r.description as string,
            commitment: r.commitment as string,
            skills: r.skills as string[],
            tags: r.tags as string[],
          })));
        }
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
