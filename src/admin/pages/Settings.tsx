import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';

interface SettingsForm {
  organization_name: string;
  tagline: string;
  donation_url: string;
  volunteer_form_url: string;
  phone: string;
  email: string;
  media_email: string;
  territory_acknowledgement: string;
  // social_links
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_linkedin: string;
  social_youtube: string;
  // address
  addr_street: string;
  addr_city: string;
  addr_province: string;
  addr_postal: string;
  addr_country: string;
}

const EMPTY: SettingsForm = {
  organization_name: '', tagline: '', donation_url: '', volunteer_form_url: '',
  phone: '', email: '', media_email: '', territory_acknowledgement: '',
  social_facebook: '', social_instagram: '', social_twitter: '', social_linkedin: '', social_youtube: '',
  addr_street: '', addr_city: '', addr_province: '', addr_postal: '', addr_country: 'Canada',
};

export default function AdminSettings() {
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase.from('site_settings').select('*').maybeSingle();
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (data) {
        const r = data as Record<string, unknown>;
        const sl = (r.social_links as Record<string, string>) ?? {};
        const addr = (r.address as Record<string, string>) ?? {};
        setRowId(r.id as string);
        setForm({
          organization_name: String(r.organization_name ?? ''),
          tagline: String(r.tagline ?? ''),
          donation_url: String(r.donation_url ?? ''),
          volunteer_form_url: String(r.volunteer_form_url ?? ''),
          phone: String(r.phone ?? ''),
          email: String(r.email ?? ''),
          media_email: String(r.media_email ?? ''),
          territory_acknowledgement: String(r.territory_acknowledgement ?? ''),
          social_facebook: String(sl.facebook ?? ''),
          social_instagram: String(sl.instagram ?? ''),
          social_twitter: String(sl.twitter ?? ''),
          social_linkedin: String(sl.linkedin ?? ''),
          social_youtube: String(sl.youtube ?? ''),
          addr_street: String(addr.street ?? ''),
          addr_city: String(addr.city ?? ''),
          addr_province: String(addr.province ?? ''),
          addr_postal: String(addr.postalCode ?? ''),
          addr_country: String(addr.country ?? 'Canada'),
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function requireHttps(label: string, value: string): string | null {
    if (!value) return null;
    if (!value.startsWith('https://')) return `${label} must start with https://`;
    return null;
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const urlFields: [string, string][] = [
      ['Donation URL', form.donation_url],
      ['Volunteer Form URL', form.volunteer_form_url],
      ['Facebook URL', form.social_facebook],
      ['Instagram URL', form.social_instagram],
      ['Twitter URL', form.social_twitter],
      ['LinkedIn URL', form.social_linkedin],
      ['YouTube URL', form.social_youtube],
    ];
    for (const [label, value] of urlFields) {
      const urlErr = requireHttps(label, value);
      if (urlErr) { setError(urlErr); setSaving(false); return; }
    }

    const payload = {
      organization_name: form.organization_name,
      tagline: form.tagline,
      donation_url: form.donation_url,
      volunteer_form_url: form.volunteer_form_url,
      phone: form.phone,
      email: form.email,
      media_email: form.media_email || null,
      territory_acknowledgement: form.territory_acknowledgement,
      social_links: {
        facebook: form.social_facebook || undefined,
        instagram: form.social_instagram || undefined,
        twitter: form.social_twitter || undefined,
        linkedin: form.social_linkedin || undefined,
        youtube: form.social_youtube || undefined,
      },
      address: {
        street: form.addr_street,
        city: form.addr_city,
        province: form.addr_province,
        postalCode: form.addr_postal,
        country: form.addr_country,
      },
      updated_at: new Date().toISOString(),
    };

    let finalRowId = rowId;
    let err;

    if (finalRowId) {
      ({ error: err } = await supabase.from('site_settings').update(payload).eq('id', finalRowId));
    } else {
      const { data, error: insertError } = await supabase
        .from('site_settings').insert([payload]).select('id').single();
      if (insertError) {
        // Unique-constraint violation: another admin already created the row.
        // Fetch the existing row's id and update it instead.
        if (insertError.code === '23505') {
          const { data: existing } = await supabase.from('site_settings').select('id').maybeSingle();
          finalRowId = existing ? (existing as Record<string, unknown>).id as string : null;
          if (finalRowId) {
            setRowId(finalRowId);
            ({ error: err } = await supabase.from('site_settings').update(payload).eq('id', finalRowId));
          } else {
            err = insertError;
          }
        } else {
          err = insertError;
        }
      } else if (data) {
        finalRowId = (data as Record<string, unknown>).id as string;
        setRowId(finalRowId);
      }
    }

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-8 animate-pulse"><div className="h-40 bg-gray-100 rounded-lg" /></div>;

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";
  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="block text-xs text-gray-500 mb-1">{label}</label>{children}</div>
  );
  const s = (k: keyof SettingsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <AdminPageHeader title="Site Settings" description="Global configuration for the VIVA website" />
      <div className="p-8 max-w-2xl space-y-8">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Organization</h2>
          <div className="grid grid-cols-2 gap-4">
            <F label="Organization Name"><input value={form.organization_name} onChange={s('organization_name')} className={inp} /></F>
            <F label="Tagline"><input value={form.tagline} onChange={s('tagline')} className={inp} /></F>
            <F label="Donation URL"><input value={form.donation_url} onChange={s('donation_url')} className={inp} /></F>
            <F label="Volunteer Form URL"><input value={form.volunteer_form_url} onChange={s('volunteer_form_url')} className={inp} /></F>
          </div>
          <F label="Territory Acknowledgement">
            <textarea value={form.territory_acknowledgement} onChange={s('territory_acknowledgement')} rows={3} className={inp} />
          </F>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</h2>
          <div className="grid grid-cols-3 gap-4">
            <F label="Phone"><input value={form.phone} onChange={s('phone')} className={inp} /></F>
            <F label="Email"><input value={form.email} onChange={s('email')} className={inp} /></F>
            <F label="Media Email"><input value={form.media_email} onChange={s('media_email')} className={inp} /></F>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><F label="Street"><input value={form.addr_street} onChange={s('addr_street')} className={inp} /></F></div>
            <F label="City"><input value={form.addr_city} onChange={s('addr_city')} className={inp} /></F>
            <F label="Province"><input value={form.addr_province} onChange={s('addr_province')} className={inp} /></F>
            <F label="Postal Code"><input value={form.addr_postal} onChange={s('addr_postal')} className={inp} /></F>
            <F label="Country"><input value={form.addr_country} onChange={s('addr_country')} className={inp} /></F>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'] as const).map(net => (
              <F key={net} label={net.charAt(0).toUpperCase() + net.slice(1)}>
                <input value={form[`social_${net}` as keyof SettingsForm]} onChange={s(`social_${net}` as keyof SettingsForm)} className={inp} />
              </F>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <button onClick={save} disabled={saving} className="ml-auto btn-admin-primary flex items-center gap-1.5">
            <Check size={14} />{saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
        </div>
      </div>
    </div>
  );
}
