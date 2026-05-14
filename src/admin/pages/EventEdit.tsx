import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check, Eye, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { PublishToggle } from '../components/PublishToggle';
import { MediaUpload } from '../components/MediaUpload';
import { SafeImage } from '../../components/ui/SafeImage';
import { localDateKey } from '../../utils/date';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

interface EventForm {
  slug: string;
  title: string;
  description: string;
  date: string;
  end_date: string;
  time: string;
  location: string;
  address: string;
  type: string;
  tags: string;           // comma-separated for editing
  capacity: number;
  registered: number;
  status: string;
  image_url: string;
  lead_contact_name: string;
  lead_contact_email: string;
  lead_contact_phone: string;
  what_you_will_do: string;
  is_past_override: string; // 'auto' | 'true' | 'false'
  recap_summary: string;
  recap_volunteers: number;
  recap_hours: number;
  recap_beneficiaries: number;
  published: boolean;
}

const EMPTY: EventForm = {
  slug: '', title: '', description: '', date: '', end_date: '', time: '',
  location: '', address: '', type: 'workshop', tags: '', capacity: 0,
  registered: 0, status: 'open', image_url: '',
  lead_contact_name: '', lead_contact_email: '', lead_contact_phone: '',
  what_you_will_do: '',
  is_past_override: 'auto', recap_summary: '', recap_volunteers: 0,
  recap_hours: 0, recap_beneficiaries: 0, published: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminEventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState<EventForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data, error: err } = await supabase.from('events').select('*').eq('id', id!).single();
      if (err || !data) { setError(err?.message ?? 'Not found'); setLoading(false); return; }
      const r = data as Record<string, unknown>;
      const recap = r.recap as Record<string, unknown> | null;
      setLoadedAt(String(r.updated_at ?? ''));
      setForm({
        slug: String(r.slug ?? ''),
        title: String(r.title ?? ''),
        description: String(r.description ?? ''),
        date: String(r.date ?? ''),
        end_date: String(r.end_date ?? ''),
        time: String(r.time ?? ''),
        location: String(r.location ?? ''),
        address: String(r.address ?? ''),
        type: String(r.type ?? 'workshop'),
        tags: ((r.tags as string[]) ?? []).join(', '),
        capacity: Number(r.capacity ?? 0),
        registered: Number(r.registered ?? 0),
        status: String(r.status ?? 'open'),
        image_url: String(r.image_url ?? ''),
        lead_contact_name: String((r.lead_contact as Record<string, unknown>)?.name ?? ''),
        lead_contact_email: String((r.lead_contact as Record<string, unknown>)?.email ?? ''),
        lead_contact_phone: String((r.lead_contact as Record<string, unknown>)?.phone ?? ''),
        what_you_will_do: ((r.what_you_will_do as string[]) ?? []).join('\n'),
        is_past_override: r.is_past_override === null || r.is_past_override === undefined
          ? 'auto' : r.is_past_override ? 'true' : 'false',
        recap_summary: String(recap?.summary ?? ''),
        recap_volunteers: Number(recap?.volunteersCount ?? 0),
        recap_hours: Number(recap?.hoursServed ?? 0),
        recap_beneficiaries: Number(recap?.beneficiaries ?? 0),
        published: Boolean(r.published ?? true),
      });
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function set<K extends keyof EventForm>(key: K, value: EventForm[K]) {
    setForm(p => ({ ...p, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    if (!form.title.trim()) {
      setError('Title is required.');
      setSaving(false);
      return;
    }
    const resolvedSlug = form.slug || slugify(form.title);
    if (!resolvedSlug) {
      setError('Slug is required. Enter a title or a custom slug.');
      setSaving(false);
      return;
    }
    if (!form.date && form.is_past_override !== 'auto') {
      setError('A date is required before forcing an event to upcoming or past.');
      setSaving(false);
      return;
    }
    const override = form.is_past_override === 'auto' ? null
      : form.is_past_override === 'true';

    const payload: Record<string, unknown> = {
      slug: resolvedSlug,
      title: form.title,
      description: form.description,
      date: form.date || null,
      end_date: form.end_date || null,
      time: form.time,
      location: form.location,
      address: form.address,
      type: form.type,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      capacity: form.capacity,
      registered: form.registered,
      status: form.status,
      image_url: form.image_url || null,
      lead_contact: form.lead_contact_email ? {
        name: form.lead_contact_name,
        email: form.lead_contact_email,
        phone: form.lead_contact_phone || undefined,
      } : null,
      what_you_will_do: form.what_you_will_do
        ? form.what_you_will_do.split('\n').map(item => item.trim()).filter(Boolean)
        : [],
      is_past_override: override,
      recap: form.recap_summary ? {
        summary: form.recap_summary,
        volunteersCount: form.recap_volunteers,
        hoursServed: form.recap_hours,
        beneficiaries: form.recap_beneficiaries,
        gallery: [],
        quotes: [],
      } : null,
      published: form.published,
    };

    if (isNew) {
      const { error: err } = await supabase.from('events').insert([payload]);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      let query = supabase.from('events').update(payload).eq('id', id!);
      if (loadedAt) query = query.eq('updated_at', loadedAt);
      const { error: err, data: updated } = await query.select('id');
      if (err) { setError(err.message); setSaving(false); return; }
      if (!updated || updated.length === 0) {
        setError('This event was edited by another admin while you were working — reload to see the latest version.');
        setSaving(false);
        return;
      }
    }
    navigate('/admin/events');
  }

  if (loading) return <div className="p-8 animate-pulse"><div className="h-20 bg-gray-100 rounded-lg" /></div>;

  const isPast = form.is_past_override === 'true'
    || (form.is_past_override === 'auto' && Boolean(form.date) && form.date < localDateKey());

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400";

  return (
    <div>
      <AdminPageHeader
        title={isNew ? 'New Event' : 'Edit Event'}
        action={
          <button onClick={() => navigate('/admin/events')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
            <ChevronLeft size={16} />Back to Events
          </button>
        }
      />
      <div className="p-8 max-w-3xl space-y-8">
        {error && <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</div>}

        {/* Basic */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *"><input value={form.title} onChange={e => { set('title', e.target.value); if (isNew) set('slug', slugify(e.target.value)); }} className={inp} /></Field>
            <Field label="Slug *"><input value={form.slug} onChange={e => set('slug', e.target.value)} className={inp} /></Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className={inp} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Date"><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} /></Field>
            <Field label="End Date"><input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className={inp} /></Field>
            <Field label="Time"><input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 10:00 AM" className={inp} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location"><input value={form.location} onChange={e => set('location', e.target.value)} className={inp} /></Field>
            <Field label="Address"><input value={form.address} onChange={e => set('address', e.target.value)} className={inp} /></Field>
          </div>
        </section>

        {/* Classification */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Classification</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Type">
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                {['workshop', 'community-service', 'career', 'social', 'fundraiser'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>
                {['open', 'waitlist', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Past Override">
              <select value={form.is_past_override} onChange={e => set('is_past_override', e.target.value)} className={inp}>
                <option value="auto">Auto (from date)</option>
                <option value="false">Force Upcoming</option>
                <option value="true">Force Past</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Tags (comma-separated)">
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="volunteer, fundraiser" className={inp} />
            </Field>
            <Field label="Capacity"><input type="number" value={form.capacity} onChange={e => set('capacity', Number(e.target.value))} className={inp} /></Field>
            <Field label="Registered"><input type="number" value={form.registered} onChange={e => set('registered', Number(e.target.value))} className={inp} /></Field>
          </div>
          <MediaUpload label="Event Image" kind="image" folder="events" value={form.image_url} onChange={url => set('image_url', url)} previewAlt={form.title} />
        </section>

        {/* Lead Contact */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Contact</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Name"><input value={form.lead_contact_name} onChange={e => set('lead_contact_name', e.target.value)} className={inp} /></Field>
            <Field label="Email"><input value={form.lead_contact_email} onChange={e => set('lead_contact_email', e.target.value)} className={inp} /></Field>
            <Field label="Phone"><input value={form.lead_contact_phone} onChange={e => set('lead_contact_phone', e.target.value)} className={inp} /></Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Volunteer Details</h2>
          <Field label={"What You'll Do (one item per line)"}>
            <textarea value={form.what_you_will_do} onChange={e => set('what_you_will_do', e.target.value)} rows={4} className={inp} />
          </Field>
        </section>

        {/* Recap (shown when event is past) */}
        {isPast && (
          <section className="space-y-4 border border-amber-200 rounded-xl p-5 bg-amber-50">
            <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Event Recap</h2>
            <Field label="Summary">
              <textarea value={form.recap_summary} onChange={e => set('recap_summary', e.target.value)} rows={3} className={inp} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Volunteers Count"><input type="number" value={form.recap_volunteers} onChange={e => set('recap_volunteers', Number(e.target.value))} className={inp} /></Field>
              <Field label="Hours Served"><input type="number" value={form.recap_hours} onChange={e => set('recap_hours', Number(e.target.value))} className={inp} /></Field>
              <Field label="Beneficiaries"><input type="number" value={form.recap_beneficiaries} onChange={e => set('recap_beneficiaries', Number(e.target.value))} className={inp} /></Field>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
          <PublishToggle published={form.published} onToggle={v => set('published', v)} />
          <span className="text-xs text-gray-500">Published</span>
          <button type="button" onClick={() => setPreviewOpen(true)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Eye size={14} />Preview
          </button>
          <button onClick={save} disabled={saving} className="btn-admin-primary flex items-center gap-1.5">
            <Check size={14} />{saving ? 'Saving...' : isNew ? 'Create Event' : 'Save Changes'}
          </button>
          <button onClick={() => navigate('/admin/events')} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
        </div>
      </div>
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Event Preview</p>
                <h2 className="font-display text-lg font-bold text-gray-900">{form.title || 'Untitled Event'}</h2>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="bg-warm-50">
              <div className="relative h-72 overflow-hidden bg-warm-900">
                <SafeImage
                  src={form.image_url || `https://picsum.photos/1400/600?grayscale&random=${form.slug || 'event'}`}
                  fallbackSrc={`https://picsum.photos/1400/600?grayscale&random=${form.slug || 'event'}`}
                  alt={form.title || 'Event preview'}
                  className="h-full w-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-900 via-warm-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/60">{form.date || 'Date TBD'} · {form.time || 'Time TBD'}</p>
                  <h3 className="font-display text-3xl font-extrabold text-white">{form.title || 'Untitled Event'}</h3>
                </div>
              </div>
              <div className="grid gap-6 p-8 lg:grid-cols-[1fr_280px]">
                <section className="space-y-6">
                  <div className="border border-warm-200 bg-white p-6">
                    <h4 className="mb-3 font-display text-lg font-extrabold text-warm-900">About This Event</h4>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-warm-600">{form.description || 'No description yet.'}</p>
                    {form.tags && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {form.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                          <span key={tag} className="rounded-sm bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-warm-600">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {isPast && form.recap_summary && (
                    <div className="border border-warm-200 bg-white p-6">
                      <h4 className="mb-3 font-display text-lg font-extrabold text-warm-900">Event Recap</h4>
                      <p className="mb-5 whitespace-pre-wrap text-sm leading-relaxed text-warm-600">{form.recap_summary}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          ['Volunteers', form.recap_volunteers],
                          ['Hours Served', form.recap_hours],
                          ['People Helped', form.recap_beneficiaries],
                        ].map(([label, value]) => (
                          <div key={label} className="border border-warm-200 py-4 text-center">
                            <p className="font-impact text-3xl leading-none text-primary-600">{value}</p>
                            <p className="mt-1 text-xs font-medium text-warm-500">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.what_you_will_do && (
                    <div className="border border-warm-200 bg-white p-6">
                      <h4 className="mb-3 font-display text-lg font-extrabold text-warm-900">What You'll Do</h4>
                      <ul className="space-y-2">
                        {form.what_you_will_do.split('\n').map(item => item.trim()).filter(Boolean).map(item => (
                          <li key={item} className="text-sm leading-relaxed text-warm-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
                <aside className="self-start border border-warm-200 bg-white p-5">
                  <h4 className="mb-4 border-b border-warm-200 pb-3 font-display font-bold text-warm-900">Event Details</h4>
                  <dl className="space-y-3 text-sm">
                    <div><dt className="text-xs text-warm-400">Location</dt><dd className="font-medium text-warm-900">{form.location || 'TBD'}</dd></div>
                    <div><dt className="text-xs text-warm-400">Address</dt><dd className="text-warm-600">{form.address || 'TBD'}</dd></div>
                    <div><dt className="text-xs text-warm-400">Status</dt><dd className="text-warm-600">{form.status}</dd></div>
                    <div><dt className="text-xs text-warm-400">Capacity</dt><dd className="text-warm-600">{form.registered} / {form.capacity}</dd></div>
                  </dl>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
