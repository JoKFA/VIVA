import { useEffect, useState } from 'react';
import type { Partner } from '../types';
import { supabase } from '../lib/supabase';
import { partners as mockPartners } from '../data/mockData';

export function usePartners() {
  const [data, setData] = useState<Partner[]>(mockPartners);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('partners')
          .select('id, name, logo_url, website_url, sort_order')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            name: r.name as string,
            logoUrl: r.logo_url as string,
            websiteUrl: r.website_url as string | undefined,
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
