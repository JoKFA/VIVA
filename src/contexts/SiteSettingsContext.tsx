/**
 * SiteSettingsContext
 *
 * Fetches site_settings once at the App root and shares the result to any
 * component that needs it (Footer, Donate, Contact, etc.).
 *
 * Fallback strategy: if Supabase is unreachable or env vars are missing in
 * production, the real values from mockData are used so the site never
 * renders broken placeholder text.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SiteSettings } from '../types';
import { supabase } from '../lib/supabase';
import { siteSettings as mockSiteSettings } from '../data/mockData';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: mockSiteSettings,
  loading: true,
});

// Row shape returned from Supabase (snake_case)
interface SiteSettingsRow {
  organization_name: string;
  tagline: string;
  donation_url: string;
  volunteer_form_url: string;
  social_links: SiteSettings['socialLinks'];
  address: SiteSettings['address'];
  phone: string;
  email: string;
  media_email?: string;
  territory_acknowledgement: string;
}

function rowToSettings(row: SiteSettingsRow): SiteSettings {
  return {
    organizationName: row.organization_name,
    tagline: row.tagline,
    donationUrl: row.donation_url,
    volunteerFormUrl: row.volunteer_form_url,
    socialLinks: row.social_links,
    address: row.address,
    phone: row.phone,
    email: row.email,
    mediaEmail: row.media_email,
    territoryAcknowledgement: row.territory_acknowledgement,
  };
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single<SiteSettingsRow>();

        if (cancelled) return;

        if (error || !data) {
          // Silently fall back — mockData is real production data anyway
          console.warn('[SiteSettings] Using fallback data:', error?.message);
        } else {
          setSettings(rowToSettings(data));
        }
      } catch {
        // Network / env error — fall back to mockData
        if (!cancelled) console.warn('[SiteSettings] Network error, using fallback data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  return useContext(SiteSettingsContext);
}
