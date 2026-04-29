import { useEffect, useState } from 'react';
import type { ContactInfo } from '../types';
import { supabase } from '../lib/supabase';
import { contactInfo as mockContactInfo } from '../data/mockData';

export function useContactInfo() {
  const [data, setData] = useState<ContactInfo[]>(mockContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('contact_info')
          .select('id, type, title, value, icon, sort_order')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            type: r.type as ContactInfo['type'],
            title: r.title as string,
            value: r.value as string,
            icon: r.icon as string | undefined,
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
