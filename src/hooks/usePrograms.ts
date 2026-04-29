import { useEffect, useState } from 'react';
import type { Program } from '../types';
import { supabase } from '../lib/supabase';
import { programs as mockPrograms } from '../data/mockData';

export function usePrograms() {
  const [data, setData] = useState<Program[]>(mockPrograms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('programs')
          .select('id, title, description, icon, link, image_url, sort_order')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            title: r.title as string,
            description: r.description as string,
            icon: r.icon as string,
            link: r.link as string,
            imageUrl: r.image_url as string | undefined,
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
