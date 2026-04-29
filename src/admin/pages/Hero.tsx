import { useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { defaultHeroSettings } from '../../hooks/useHeroSettings';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { MediaUpload } from '../components/MediaUpload';
import { SafeImage } from '../../components/ui/SafeImage';

interface HeroForm {
  eyebrow: string;
  title_line_1: string;
  title_line_2: string;
  title_line_3: string;
  body: string;
  image_url: string;
  left_stat_value: string;
  left_stat_label: string;
  right_stat_value: string;
  right_stat_label: string;
  published: boolean;
}

const FALLBACK_IMAGE = 'https://picsum.photos/640/500?grayscale&random=1';

const EMPTY: HeroForm = {
  eyebrow: defaultHeroSettings.eyebrow,
  title_line_1: defaultHeroSettings.titleLine1,
  title_line_2: defaultHeroSettings.titleLine2,
  title_line_3: defaultHeroSettings.titleLine3,
  body: defaultHeroSettings.body,
  image_url: '',
  left_stat_value: defaultHeroSettings.leftStatValue,
  left_stat_label: defaultHeroSettings.leftStatLabel,
  right_stat_value: defaultHeroSettings.rightStatValue,
  right_stat_label: defaultHeroSettings.rightStatLabel,
  published: true,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>
      {children}
    </div>
  );
}

export default function AdminHero() {
  const [form, setForm] = useState<HeroForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('homepage_hero_settings')
        .select('*')
        .eq('id', true)
        .maybeSingle();
      if (err) setError(err.message);
      if (data) {
        const row = data as Record<string, unknown>;
        setForm({
          eyebrow: String(row.eyebrow ?? EMPTY.eyebrow),
          title_line_1: String(row.title_line_1 ?? EMPTY.title_line_1),
          title_line_2: String(row.title_line_2 ?? EMPTY.title_line_2),
          title_line_3: String(row.title_line_3 ?? EMPTY.title_line_3),
          body: String(row.body ?? EMPTY.body),
          image_url: String(row.image_url ?? ''),
          left_stat_value: String(row.left_stat_value ?? EMPTY.left_stat_value),
          left_stat_label: String(row.left_stat_label ?? EMPTY.left_stat_label),
          right_stat_value: String(row.right_stat_value ?? EMPTY.right_stat_value),
          right_stat_label: String(row.right_stat_label ?? EMPTY.right_stat_label),
          published: Boolean(row.published ?? true),
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function set<K extends keyof HeroForm>(key: K, value: HeroForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    const { error: err } = await supabase.from('homepage_hero_settings').upsert({
      id: true,
      ...form,
      image_url: form.image_url || null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage('Hero settings saved.');
  }

  const input = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400';

  if (loading) return <div className="p-8 animate-pulse"><div className="h-20 rounded-lg bg-gray-100" /></div>;

  return (
    <div>
      <AdminPageHeader title="Homepage Hero" />
      <div className="grid gap-8 p-8 xl:grid-cols-[minmax(0,520px)_1fr]">
        <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {message && <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

          <Field label="Eyebrow">
            <input value={form.eyebrow} onChange={e => set('eyebrow', e.target.value)} className={input} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Title Line 1">
              <input value={form.title_line_1} onChange={e => set('title_line_1', e.target.value)} className={input} />
            </Field>
            <Field label="Accent Line">
              <input value={form.title_line_2} onChange={e => set('title_line_2', e.target.value)} className={input} />
            </Field>
            <Field label="Title Line 3">
              <input value={form.title_line_3} onChange={e => set('title_line_3', e.target.value)} className={input} />
            </Field>
          </div>
          <Field label="Body Copy">
            <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={4} className={input} />
          </Field>
          <MediaUpload label="Hero Image" kind="image" folder="hero" value={form.image_url} onChange={url => set('image_url', url)} previewAlt="Homepage hero" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Left Number">
              <input value={form.left_stat_value} onChange={e => set('left_stat_value', e.target.value)} className={input} />
            </Field>
            <Field label="Left Label">
              <input value={form.left_stat_label} onChange={e => set('left_stat_label', e.target.value)} className={input} />
            </Field>
            <Field label="Right Number">
              <input value={form.right_stat_value} onChange={e => set('right_stat_value', e.target.value)} className={input} />
            </Field>
            <Field label="Right Label">
              <input value={form.right_stat_label} onChange={e => set('right_stat_label', e.target.value)} className={input} />
            </Field>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
              Published
            </label>
            <button type="button" onClick={() => setForm(EMPTY)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">
              <RotateCcw size={14} />
              Reset
            </button>
            <button type="button" onClick={save} disabled={saving} className="btn-admin-primary inline-flex items-center gap-1.5">
              <Check size={14} />
              {saving ? 'Saving...' : 'Save Hero'}
            </button>
          </div>
        </section>

        <section className="min-h-[520px] rounded-xl bg-warm-900 p-8 text-white">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-accent-500">{form.eyebrow}</p>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="font-impact text-[clamp(3.2rem,6vw,5.2rem)] leading-[0.9] tracking-wide">
                {form.title_line_1}<br />
                <span className="text-accent-500">{form.title_line_2}</span><br />
                {form.title_line_3}
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">{form.body}</p>
            </div>
            <div className="relative">
              <div className="h-[320px] overflow-hidden rounded-2xl">
                <SafeImage src={form.image_url || FALLBACK_IMAGE} fallbackSrc={FALLBACK_IMAGE} alt="Hero preview" className="h-full w-full object-cover opacity-90" />
              </div>
              <div className="absolute -bottom-5 -left-4 min-w-[140px] rounded-xl bg-white px-4 py-3 text-warm-900 shadow-lg">
                <p className="font-impact text-3xl leading-none text-primary-600">{form.left_stat_value}</p>
                <p className="mt-1 text-xs text-warm-600">{form.left_stat_label}</p>
              </div>
              <div className="absolute -right-4 top-6 rounded-xl bg-primary-600 px-4 py-3 shadow-lg">
                <p className="font-impact text-3xl leading-none">{form.right_stat_value}</p>
                <p className="mt-1 text-xs text-white/75">{form.right_stat_label}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
