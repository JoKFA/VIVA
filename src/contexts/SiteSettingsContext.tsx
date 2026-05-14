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
  footer_description?: string;
  footer_cta_heading?: string;
  footer_cta_body?: string;
  volunteer_why_heading?: string;
  volunteer_why_body?: string;
  volunteer_why_image_url?: string;
  awards_page_visible?: boolean;
  annual_reports_page_visible?: boolean;
}

function rowToSettings(row: SiteSettingsRow): SiteSettings {
  return {
    organizationName: row.organization_name ?? mockSiteSettings.organizationName,
    tagline: row.tagline ?? mockSiteSettings.tagline,
    donationUrl: row.donation_url ?? mockSiteSettings.donationUrl,
    volunteerFormUrl: row.volunteer_form_url ?? mockSiteSettings.volunteerFormUrl,
    socialLinks: { ...mockSiteSettings.socialLinks, ...row.social_links },
    address: { ...mockSiteSettings.address, ...row.address },
    phone: row.phone ?? mockSiteSettings.phone,
    email: row.email ?? mockSiteSettings.email,
    mediaEmail: row.media_email ?? mockSiteSettings.mediaEmail,
    territoryAcknowledgement: row.territory_acknowledgement ?? mockSiteSettings.territoryAcknowledgement,
    footerDescription: row.footer_description ?? mockSiteSettings.footerDescription,
    footerCtaHeading: row.footer_cta_heading ?? mockSiteSettings.footerCtaHeading,
    footerCtaBody: row.footer_cta_body ?? mockSiteSettings.footerCtaBody,
    volunteerWhyHeading: row.volunteer_why_heading ?? mockSiteSettings.volunteerWhyHeading,
    volunteerWhyBody: row.volunteer_why_body ?? mockSiteSettings.volunteerWhyBody,
    volunteerWhyImageUrl: row.volunteer_why_image_url ?? mockSiteSettings.volunteerWhyImageUrl,
    awardsPageVisible: row.awards_page_visible ?? true,
    annualReportsPageVisible: row.annual_reports_page_visible ?? true,
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
