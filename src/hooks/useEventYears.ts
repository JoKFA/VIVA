/**
 * useEventYears — fetches distinct years that have past events.
 * Loaded after upcoming events, used to render the year dropdown headers.
 * Lazy-loads year sections; calling useEventsByYear(year) loads that year's events.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { events as mockEvents } from '../data/mockData';
import { localDateKey, parseDateOnly } from '../utils/date';

export function useEventYears() {
  // Derive years from mockData as initial state
  const mockYears = Array.from(
    new Set(
        mockEvents
        .filter(e => e.isPast)
        .map(e => parseDateOnly(e.date)?.getFullYear())
        .filter((year): year is number => typeof year === 'number')
    )
  ).sort((a, b) => b - a);

  const [data, setData] = useState<number[]>(mockYears);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const today = localDateKey();
        // Select only the date column for past events to extract years efficiently
        const { data: rows, error: err } = await supabase
          .from('events')
          .select('date')
          .eq('published', true)
          .or(`is_past_override.eq.true,and(is_past_override.is.null,date.lt.${today})`);
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          const years = Array.from(
            new Set(
              rows
                .map(r => parseDateOnly(r.date as string)?.getFullYear())
                .filter((year): year is number => typeof year === 'number')
            )
          ).sort((a, b) => b - a);
          setData(years);
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
