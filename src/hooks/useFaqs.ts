import { useEffect, useState } from 'react';
import type { FAQ } from '../types';
import { supabase } from '../lib/supabase';
import { faqs as mockFaqs } from '../data/mockData';

export function useFaqs() {
  const [data, setData] = useState<FAQ[]>(mockFaqs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('faqs')
          .select('id, question, answer, category, sort_order')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            question: r.question as string,
            answer: r.answer as string,
            category: r.category as string | undefined,
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
