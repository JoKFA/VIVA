/**
 * useHonours — fetches honours carousel entries.
 * The honours type lives in mockData but has no corresponding type in types/index.ts yet.
 * We define the shape inline here to match the DB schema exactly.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { honours as mockHonours } from '../data/mockData';

export interface HonourEntry {
  id: string;
  name: string;
  title: string;
  organization: string;
  tier: string;
  initials: string;
  accent: string;
  quote: string;
  imageUrl?: string;
  letterImageUrl?: string;
  year?: number;
  description?: string;
  sortOrder: number;
}

export function useHonours() {
  const [data, setData] = useState<HonourEntry[]>(
    mockHonours.map((h, i) => ({
      id: h.id,
      name: h.name,
      title: h.title,
      organization: h.organization,
      tier: h.tier,
      initials: h.initials,
      accent: h.accent,
      quote: h.quote,
      imageUrl: undefined,
      letterImageUrl: h.letterImageUrl,
      year: undefined,
      description: undefined,
      sortOrder: i,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('honours_carousel_entries')
          .select('*')
          .eq('published', true)
          .order('sort_order');
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            name: r.name as string,
            title: r.title as string,
            organization: r.organization as string,
            tier: r.tier as string,
            initials: r.initials as string,
            accent: r.accent as string,
            quote: r.quote as string,
            imageUrl: r.image_url as string | undefined,
            letterImageUrl: r.letter_image_url as string | undefined,
            year: r.year as number | undefined,
            description: r.description as string | undefined,
            sortOrder: r.sort_order as number,
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
