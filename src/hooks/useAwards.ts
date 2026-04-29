import { useEffect, useState } from 'react';
import type { Award } from '../types';
import { supabase } from '../lib/supabase';
import { awards as mockAwards } from '../data/mockData';

export function useAwards() {
  const [data, setData] = useState<Award[]>(mockAwards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('awards')
          .select('*')
          .eq('published', true);
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            name: r.name as string,
            years: r.years as string[],
            description: r.description as string,
            eligibility: r.eligibility as string,
            timeline: r.timeline as string,
            applicationUrl: r.application_url as string | undefined,
            pdfUrl: r.pdf_url as string | undefined,
            pastRecipients: r.past_recipients as Award['pastRecipients'],
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
