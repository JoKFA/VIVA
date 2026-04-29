/**
 * useUpcomingEvents — eagerly fetches events where is_past = false.
 * Loaded on page mount for fast above-the-fold render.
 *
 * is_past is stored as a computed column in the DB (auto-derived from date).
 * Admin can override via is_past_override.
 */
import { useEffect, useState } from 'react';
import type { Event } from '../types';
import { supabase } from '../lib/supabase';
import { events as mockEvents } from '../data/mockData';
import { dbRowToEvent } from './eventUtils';

export function useUpcomingEvents() {
  const [data, setData] = useState<Event[]>(
    mockEvents.filter(e => !e.isPast)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: rows, error: err } = await supabase
          .from('events')
          .select('*')
          .eq('published', true)
          .or(`is_past_override.eq.false,and(is_past_override.is.null,date.gte.${today})`)
          .order('date', { ascending: true });
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
  }, []);

  return { data, loading, error };
}
