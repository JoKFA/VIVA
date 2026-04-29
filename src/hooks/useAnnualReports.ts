import { useEffect, useState } from 'react';
import type { AnnualReport } from '../types';
import { supabase } from '../lib/supabase';
import { annualReports as mockReports } from '../data/mockData';

export function useAnnualReports() {
  const [data, setData] = useState<AnnualReport[]>(mockReports);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        const { data: rows, error: err } = await supabase
          .from('annual_reports')
          .select('*')
          .eq('published', true)
          .order('year', { ascending: false });
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (rows) {
          setData(rows.map(r => ({
            id: r.id as string,
            year: r.year as number,
            title: r.title as string,
            highlights: r.highlights as string[],
            coverImageUrl: r.cover_image_url as string,
            pdfUrl: r.pdf_url as string,
            totalVolunteers: r.total_volunteers as number | undefined,
            totalHours: r.total_hours as number | undefined,
            totalEvents: r.total_events as number | undefined,
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
