import { useEffect, useState } from 'react';
import type { Testimonial } from '../types';
import { supabase } from '../lib/supabase';
import { testimonials as mockTestimonials } from '../data/mockData';

export function useTestimonials() {
  const [data, setData] = useState<Testimonial[]>(mockTestimonials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('testimonials')
          .select('id, quote, author, role')
          .eq('published', true);
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            quote: r.quote as string,
            author: r.author as string,
            role: r.role as string,
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
