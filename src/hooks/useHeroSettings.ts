import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface HeroSettings {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  body: string;
  imageUrl: string;
  leftStatValue: string;
  leftStatLabel: string;
  rightStatValue: string;
  rightStatLabel: string;
}

export const defaultHeroSettings: HeroSettings = {
  eyebrow: 'Vancouver - Since 2018',
  titleLine1: 'EMPOWER',
  titleLine2: 'CONNECT',
  titleLine3: 'SERVE',
  body: 'VIVA brings together passionate volunteers and community members across Vancouver - from shoreline cleanups to career fairs, senior care to youth mentorship.',
  imageUrl: '',
  leftStatValue: '2,500+',
  leftStatLabel: 'Active Volunteers',
  rightStatValue: '120',
  rightStatLabel: 'Events / Year',
};

function rowToHero(row: Record<string, unknown>): HeroSettings {
  return {
    eyebrow: String(row.eyebrow ?? defaultHeroSettings.eyebrow),
    titleLine1: String(row.title_line_1 ?? defaultHeroSettings.titleLine1),
    titleLine2: String(row.title_line_2 ?? defaultHeroSettings.titleLine2),
    titleLine3: String(row.title_line_3 ?? defaultHeroSettings.titleLine3),
    body: String(row.body ?? defaultHeroSettings.body),
    imageUrl: String(row.image_url ?? ''),
    leftStatValue: String(row.left_stat_value ?? defaultHeroSettings.leftStatValue),
    leftStatLabel: String(row.left_stat_label ?? defaultHeroSettings.leftStatLabel),
    rightStatValue: String(row.right_stat_value ?? defaultHeroSettings.rightStatValue),
    rightStatLabel: String(row.right_stat_label ?? defaultHeroSettings.rightStatLabel),
  };
}

export function useHeroSettings() {
  const [data, setData] = useState<HeroSettings>(defaultHeroSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchHero() {
      try {
        const { data: row, error: err } = await supabase
          .from('homepage_hero_settings')
          .select('*')
          .eq('published', true)
          .maybeSingle();
        if (cancelled) return;
        if (err) { setError(err.message); return; }
        if (row) setData(rowToHero(row as Record<string, unknown>));
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHero();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
