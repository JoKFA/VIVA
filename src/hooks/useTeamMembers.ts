import { useEffect, useState } from 'react';
import type { TeamMember } from '../types';
import { supabase } from '../lib/supabase';
import { teamMembers as mockTeamMembers } from '../data/mockData';

export function useTeamMembers() {
  const [data, setData] = useState<TeamMember[]>(mockTeamMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('team_members')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            name: r.name as string,
            role: r.role as string,
            bio: r.bio as string,
            imageUrl: r.image_url as string,
            linkedInUrl: r.linked_in_url as string | undefined,
            isExecutive: r.is_executive as boolean,
            order: r.sort_order as number,
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
