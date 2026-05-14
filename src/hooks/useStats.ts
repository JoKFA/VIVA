import { useEffect, useState } from 'react';
import type { Stat } from '../types';
import { supabase } from '../lib/supabase';
import { stats as mockStats } from '../data/mockData';

export function useStats() {
  const [data, setData] = useState<Stat[]>(mockStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('stats')
          .select('id, label, value, suffix, prefix, sort_order')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            label: r.label as string,
            value: r.value as number,
            suffix: r.suffix as string | undefined,
            prefix: r.prefix as string | undefined,
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
