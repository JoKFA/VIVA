/**
 * useEventsByYear — lazy-loads past events for a specific year.
 * Only fires when the user opens the dropdown for that year.
 * Pass enabled=false to defer until the dropdown is open.
 */
import { useEffect, useState } from 'react';
import type { Event } from '../types';
import { supabase } from '../lib/supabase';
import { events as mockEvents } from '../data/mockData';
import { dbRowToEvent } from './eventUtils';

export function useEventsByYear(year: number, enabled = false) {
  const mockFallback = mockEvents.filter(
    e => e.isPast && new Date(e.date).getFullYear() === year
  );

  const [data, setData] = useState<Event[]>(mockFallback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const today = new Date().toISOString().split('T')[0];

        const { data: rows, error: err } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .gte('date', startDate)
          .lte('date', endDate)
          .or(`is_past_override.eq.true,and(is_past_override.is.null,date.lt.${today})`)
          .order('date', { ascending: false });
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) setData(rows.map(dbRowToEvent));
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, [year, enabled]);

  return { data, loading, error };
}
